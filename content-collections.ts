import { existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMDX } from '@content-collections/mdx'
import remarkMediaCard from '@zhouhua-dev/remark-media-card'
import { slug } from 'github-slugger'
import { fromHtmlIsomorphic } from 'hast-util-from-html-isomorphic'
import readingTime from 'reading-time'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeCitation from 'rehype-citation'
import rehypeKatex from 'rehype-katex'
import rehypePresetMinify from 'rehype-preset-minify'
import rehypePrismPlus from 'rehype-prism-plus'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { remarkAlert } from 'remark-github-blockquote-alert'
import remarkMath from 'remark-math'
import { remarkCodeTitles } from '@/mdx-plugins/remark-code-titles'
import {
  createCategoryTree,
  createSearchIndex,
  createTagCount,
  generateRssFeed,
} from '@/services/content/metaGen'
import siteMetadata from './data/siteMetadata'
import { remarkImgToJsx } from './src/mdx-plugins/remark-img-to-jsx'
import { extractTocHeadings } from './src/mdx-plugins/toc'
import { suppressDeprecatedWarnings } from '@content-collections/core'
import { z } from 'zod'

suppressDeprecatedWarnings('legacySchema')

const root = process.cwd()

const icon = fromHtmlIsomorphic(
  `
    <span class="content-header-link-icon">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="linkicon">
    <path d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z" />
    <path d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z" />
    </svg>
    </span>
  `,
  { fragment: true },
)

const Authors = defineCollection({
  name: 'authors',
  directory: 'data/authors',
  include: '**/*.mdx',
  schema: (z) => ({
    name: z.string(),
    avatar: z.string().optional(),
    occupation: z.string().optional(),
    company: z.string().optional(),
    email: z.string().optional(),
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
    layout: z.string().optional(),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document)
    return { ...document, mdx, slug: slug(document._meta.path) }
  },
})

const Posts = defineCollection({
  name: 'posts',
  directory: 'data',
  include: 'blog/**/*.mdx',
  schema: z.object({
    title: z.string(),
    date: z.string().transform((str) => new Date(str)),
    tags: z.array(z.string()).optional(),
    lastmod: z
      .string()
      .transform((str) => (str ? new Date(str) : undefined))
      .optional(),
    draft: z.boolean().optional(),
    summary: z.string().optional(),
    images: z.array(z.string()).optional(),
    authors: z.array(z.string()).optional(),
    layout: z.string().optional(),
    bibliography: z.string().optional(),
    canonicalUrl: z.string().optional(),
    private: z.boolean().optional(),
    password: z.nullable(z.string()).optional(),
    pinned: z.boolean().optional(),
  }),
  transform: async (doc, context) => {
    const mdx = await compileMDX(context, doc, {
      remarkPlugins: [
        remarkGfm,
        remarkCodeTitles,
        remarkMath,
        remarkImgToJsx,
        remarkAlert,
        remarkMediaCard,
      ],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'prepend',
            headingProperties: {
              className: ['content-header'],
            },
            content: icon,
          },
        ],
        rehypeKatex,
        [rehypeCitation, { path: path.join(root, 'data') }],
        [rehypePrismPlus, { defaultLanguage: 'js', ignoreMissing: true }],
        rehypePresetMinify,
      ],
    })

    const toc = await extractTocHeadings(doc.content)

    return {
      ...doc,
      _id: doc._meta.filePath,
      _meta: {
        ...doc._meta,
        // sourceFilePath: doc._meta.filePath,
        // sourceFileName: doc._meta.fileName,
        // sourceFileDir: doc._meta.directory,
        // flattenedPath: doc._meta.path,
        // contentType: 'mdx',
      },
      readingTime: readingTime(doc.content).minutes,
      // 这里的 slug 清洗后是 foo/bar 的格式，不能直接使用 github-slugger 生成
      slug: doc._meta.path.replace(/^.+?(\/)/, ''),
      path: doc._meta.path,
      // filePath: doc._meta.filePath,
      toc,
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: doc.title,
        datePublished: doc.date,
        dateModified: doc.lastmod || doc.date,
        description: doc.summary,
        image: siteMetadata.socialBanner,
        url: `${siteMetadata.siteUrl}/blog/${doc._meta.path}`,
      },
      mdx,
      // code: mdx,
    }
  },

  onSuccess: async (docs) => {
    if (!existsSync('temp')) {
      mkdirSync('temp')
    }
    await generateRssFeed(docs)
    createTagCount(docs)
    createSearchIndex(docs)
    createCategoryTree(docs)
  },
})

export default defineConfig({
  collections: [Authors, Posts],
})
