import LightGalleryWrapper from '@/components/LightGalleryWrapper'
import { components } from '@/components/MDXComponents'
import PasswordInput from '@/components/PasswordInput'
import '@/css/prism.css'
import siteMetadata from '@/data/siteMetadata'
import PostBanner from '@/layouts/PostBanner'
import PostLayout from '@/layouts/PostLayout'
import PostSimple from '@/layouts/PostSimple'
import { sortPostsByDate } from '@/utils/contentUtils/postsUtils'
import type { Author, Post } from 'content-collections'
import { allAuthors, allPosts } from 'content-collections'
import 'katex/dist/katex.css'
import { allCoreContent, coreContent } from '@/utils/contentUtils/postsUtils'
import { MDXContent } from '@content-collections/mdx/react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

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
  const post = allPosts.find((p) => p.slug === slug)
  const authorList = post?.authors || ['default']
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    //FIXME: 给 Author 添加 coreContent 处理措施
    // return coreContent(authorResults as Author)
    return authorResults as Author
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
  return allPosts.map((p) => ({
    slug: p.slug.split('/').map((name) => decodeURI(name)),
  }))
}

export default async function Page(props: {
  params: Promise<{ slug: string[] }>
}) {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  // Filter out drafts in production
  const sortedCoreContents = allCoreContent(sortPostsByDate(allPosts))
  const postIndex = sortedCoreContents.findIndex((p) => p.slug === slug)
  if (postIndex === -1) {
    return notFound()
  }

  const prev = sortedCoreContents[postIndex + 1]
  const next = sortedCoreContents[postIndex - 1]
  const post = allPosts.find((p) => p.slug === slug) as Post
  const authorList = post?.authors || ['default']
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    //FIXME: 给 Author 添加 coreContent 处理措施
    // return coreContent(authorResults as Author)
    return authorResults as Author
  })
  const mainContent = coreContent(post)
  const jsonLd = post.structuredData
  //@ts-expect-error
  jsonLd.author = authorDetails.map((author) => {
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
          type='application/ld+json'
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Layout
          content={mainContent}
          authorDetails={authorDetails}
          next={next}
          prev={prev}
        >
          {post.password ? (
            <PasswordInput />
          ) : (
            '该文章为私密且没有设置密码，不能给你看哦~'
          )}
        </Layout>
      </>
    )
  }

  return (
    <>
      <script
        type='application/ld+json'
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout
        content={mainContent}
        authorDetails={authorDetails}
        next={next}
        prev={prev}
      >
        {/* <TOCInline toc={post.toc as unknown as Toc} />
        {post.toc.length > 0 && <hr />} */}
        <LightGalleryWrapper>
          <MDXContent
            code={post.mdx}
            mdxComponents={components}
          />
        </LightGalleryWrapper>
      </Layout>
    </>
  )
}
