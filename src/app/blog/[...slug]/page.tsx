import LightGalleryWrapper from '@/components/LightGalleryWrapper'
import { components } from '@/components/MDXComponents'
import { MdxComponentRenderer } from '@/components/MdxRenderer'
import PasswordInput from '@/components/PasswordInput'
import TOCInline from '@/components/TOCInline'
import '@/css/prism.css'
import siteMetadata from '@/data/siteMetadata'
import PostBanner from '@/layouts/PostBanner'
import PostLayout from '@/layouts/PostLayout'
import PostSimple from '@/layouts/PostSimple'
import { sortPosts } from '@/utils/postsUtils'
import type { Authors, Blog } from 'contentlayer/generated'
import { allAuthors, allBlogs } from 'contentlayer/generated'
import 'katex/dist/katex.css'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { allCoreContent, coreContent } from 'pliny/utils/contentlayer'
import { Toc } from 'src/mdx-plugins/toc'

const defaultLayout = 'PostLayout'
const layouts = {
  PostSimple,
  PostLayout,
  PostBanner,
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata | undefined> {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  const post = allBlogs.find((p) => p.slug === slug)
  const authorList = post?.authors || ['default']
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Authors)
  })
  if (!post) {
    return
  }

  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(post.lastmod || post.date).toISOString()
  const authors = authorDetails.map((author) => author.name)
  const ogImg = `${siteMetadata.siteUrl}/api/og/image/post/${slug}`

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: siteMetadata.title,
      locale: 'zh_CN',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: './',
      images: {
        url: ogImg,
        alt: `Opengraph image for ${post.title}`,
        type: 'image/png',
      },
      authors: authors.length > 0 ? authors : [siteMetadata.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: {
        url: ogImg,
        alt: `Opengraph image for ${post.title}`,
        type: 'image/png',
      },
    },
  }
}

export const generateStaticParams = async () => {
  return allBlogs.map((p) => ({
    slug: p.slug.split('/').map((name) => decodeURI(name)),
  }))
}

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  // Filter out drafts in production
  const sortedCoreContents = allCoreContent(sortPosts(allBlogs))
  const postIndex = sortedCoreContents.findIndex((p) => p.slug === slug)
  if (postIndex === -1) {
    return notFound()
  }

  const prev = sortedCoreContents[postIndex + 1]
  const next = sortedCoreContents[postIndex - 1]
  const post = allBlogs.find((p) => p.slug === slug) as Blog
  const authorList = post?.authors || ['default']
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Authors)
  })
  const mainContent = coreContent(post)
  const jsonLd = post.structuredData
  jsonLd['author'] = authorDetails.map((author) => {
    return {
      '@type': 'Person',
      name: author.name,
    }
  })

  const Layout = layouts[post.layout || defaultLayout]

  if (post.private) {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Layout content={mainContent} authorDetails={authorDetails} next={next} prev={prev}>
          {post.password ? <PasswordInput /> : '该文章为私密且没有设置密码，不能给你看哦~'}
        </Layout>
      </>
    )
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout content={mainContent} authorDetails={authorDetails} next={next} prev={prev}>
        <TOCInline toc={post.toc as unknown as Toc} />
        {post.toc.length > 0 && <hr />}
        <LightGalleryWrapper>
          <MdxComponentRenderer doc={post} mdxComponents={components} />
        </LightGalleryWrapper>
      </Layout>
    </>
  )
}
