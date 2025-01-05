import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
// Remark packages
import remarkMediaCard from '@zhouhua-dev/remark-media-card'
import {
  type ComputedFields,
  defineDocumentType,
  makeSource,
} from 'contentlayer2/source-files'
import { slug } from 'github-slugger'
import { fromHtmlIsomorphic } from 'hast-util-from-html-isomorphic'
import {
  remarkCodeTitles,
  remarkExtractFrontmatter,
} from 'pliny/mdx-plugins/index.js'
import readingTime from 'reading-time'
// Rehype packages
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeCitation from 'rehype-citation'
import rehypeKatex from 'rehype-katex'
import rehypePresetMinify from 'rehype-preset-minify'
import rehypePrismPlus from 'rehype-prism-plus'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { remarkAlert } from 'remark-github-blockquote-alert'
import remarkMath from 'remark-math'
import categoryMapping from './data/category-mapping'
import siteMetadata from './data/siteMetadata'
import { remarkImgToJsx } from './src/mdx-plugins/remark-img-to-jsx'
import { extractTocHeadings } from './src/mdx-plugins/toc'
import {
  filterVisiablePosts,
  sortPosts,
} from './src/utils/contentUtils/postsUtils'

const root = process.cwd()
const isProduction = process.env.NODE_ENV === 'production'

// heroicon mini link
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

const computedFields: ComputedFields = {
  readingTime: { type: 'json', resolve: (doc) => readingTime(doc.body.raw) },
  slug: {
    type: 'string',
    resolve: (doc) => doc._raw.flattenedPath.replace(/^.+?(\/)/, ''),
  },
  path: {
    type: 'string',
    resolve: (doc) => doc._raw.flattenedPath,
  },
  filePath: {
    type: 'string',
    resolve: (doc) => doc._raw.sourceFilePath,
  },
  toc: { type: 'string', resolve: (doc) => extractTocHeadings(doc.body.raw) },
}

export type TreeNode = {
  name: string
  count: number
  children: Record<string, TreeNode>
  showName: string
  desc?: string
  fullPath: string
}

function createCategoryTree(allBlogs) {
  const root: TreeNode = {
    name: 'blog',
    count: 0,
    children: {},
    desc: '博客所有文章',
    showName: categoryMapping.blog ? categoryMapping.blog.show : 'Blog',
    fullPath: 'blog',
  }

  allBlogs.forEach((file) => {
    if (file._raw.sourceFileDir && (!isProduction || file.draft !== true)) {
      if (file._raw.sourceFileDir === 'blog') {
        root.count += 1
        return
      }
      const relativePath: string = file._raw.sourceFileDir.replace(
        /^blog\//,
        '',
      )
      const pathParts = relativePath.split('/')
      let currentNode = root

      pathParts.forEach((part) => {
        if (!currentNode.children[part]) {
          currentNode.children[part] = {
            name: part,
            count: 0,
            children: {},
            desc: categoryMapping[part] ? categoryMapping[part].desc : '',
            showName: categoryMapping[part] ? categoryMapping[part].show : part,
            fullPath: [currentNode.fullPath, part].join('/'),
          }
        }

        currentNode = currentNode.children[part]
        currentNode.count += 1
      })
    }
  })
  Object.values(root.children).forEach((node) => {
    root.count += node.count
  })
  console.log('✅ Category tree generated successfully!')
  writeFileSync('./temp/category-data.json', JSON.stringify(root, null, 2))
}

/**
 * Count the occurrences of all tags across blog posts and write to json file
 */
function createTagCount(allBlogs) {
  const tagCount: Record<string, number> = {}
  allBlogs.forEach((file) => {
    if (file.tags && (!isProduction || file.draft !== true)) {
      file.tags.forEach((tag) => {
        const formattedTag = slug(tag)
        if (formattedTag in tagCount) {
          tagCount[formattedTag] += 1
        } else {
          tagCount[formattedTag] = 1
        }
      })
    }
  })
  console.log('✅ Tag counts generated successfully!')
  writeFileSync('./temp/tag-data.json', JSON.stringify(tagCount))
}

function createSearchIndex(allBlogs) {
  const blogs = sortPosts(filterVisiablePosts(allBlogs))
  for (const blog of blogs) {
    blog.body.code = ''
  }
  writeFileSync('public/search.json', JSON.stringify(blogs))
  console.log('✅ Search index generated successfully')
}

export const Blog = defineDocumentType(() => ({
  name: 'Blog',
  filePathPattern: 'blog/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    tags: { type: 'list', of: { type: 'string' }, default: [] },
    lastmod: { type: 'date' },
    draft: { type: 'boolean' },
    summary: { type: 'string' },
    images: { type: 'json' },
    authors: { type: 'list', of: { type: 'string' } },
    layout: { type: 'string' },
    bibliography: { type: 'string' },
    canonicalUrl: { type: 'string' },
    private: { type: 'boolean', default: false },
    password: { type: 'string' },
    pinned: { type: 'boolean', default: false },
  },
  computedFields: {
    ...computedFields,
    structuredData: {
      type: 'json',
      resolve: (doc) => ({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: doc.title,
        datePublished: doc.date,
        dateModified: doc.lastmod || doc.date,
        description: doc.summary,
        image: doc.images ? doc.images[0] : siteMetadata.socialBanner,
        url: `${siteMetadata.siteUrl}/${doc._raw.flattenedPath}`,
      }),
    },
  },
}))

export const Authors = defineDocumentType(() => ({
  name: 'Authors',
  filePathPattern: 'authors/**/*.mdx',
  contentType: 'mdx',
  fields: {
    name: { type: 'string', required: true },
    avatar: { type: 'string' },
    occupation: { type: 'string' },
    company: { type: 'string' },
    email: { type: 'string' },
    twitter: { type: 'string' },
    linkedin: { type: 'string' },
    github: { type: 'string' },
    layout: { type: 'string' },
  },
  computedFields,
}))

export default makeSource({
  contentDirPath: 'data',
  documentTypes: [Blog, Authors],
  mdx: {
    cwd: process.cwd(),
    remarkPlugins: [
      remarkExtractFrontmatter,
      remarkGfm,
      remarkCodeTitles,
      remarkMath,
      remarkImgToJsx,
      remarkAlert,
      remarkMediaCard,
      // remarkPangu,
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
  },
  onSuccess: async (importData) => {
    const { allBlogs } = await importData()
    if (!existsSync('temp')) {
      mkdirSync('temp')
    }
    createTagCount(allBlogs)
    createSearchIndex(allBlogs)
    createCategoryTree(allBlogs)
  },
})
