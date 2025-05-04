import ArticalWithPassword from '@/components/ArticalWithPassword'
import LightGalleryWrapper from '@/components/LightGalleryWrapper'
import { components } from '@/components/MDXComponents'
import '@/css/prism.css'
import siteMetadata from '@/data/siteMetadata'
import PostLayout from '@/layouts/PostLayout'
import type { Author, Post } from '@/services/content/core'
import { allAuthors, allPosts } from '@/services/content/core'
import { sortPostsByDate } from '@/services/content/utils'
import 'katex/dist/katex.css'
import { MDXContent } from '@content-collections/mdx/react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { allCoreContent, coreContent } from '@/services/content/utils'

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
  //@ts-expect-error 111
  jsonLd.author = authorDetails.map((author) => {
    return {
      '@type': 'Person',
      name: author.name,
    }
  })

  if (post.private) {
    return (
      <>
        <script
          type='application/ld+json'
          // biome-ignore lint/security/noDangerouslySetInnerHtml: ignore it
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {post.password ? (
          <ArticalWithPassword
            corePostContent={mainContent}
            prev={prev}
            next={next}
            authorDetails={authorDetails}
          />
        ) : (
          '该文章为私密且没有设置密码，不能给你看哦~'
        )}
      </>
    )
  }

  return (
    <>
      <script
        type='application/ld+json'
        // biome-ignore lint/security/noDangerouslySetInnerHtml: ignore it
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PostLayout
        content={mainContent}
        authorDetails={authorDetails}
        next={next}
        prev={prev}
        toc={post.toc}
      >
        {/* <TOCInline toc={post.toc as unknown as Toc} />
        {post.toc.length > 0 && <hr />} */}
        <LightGalleryWrapper>
          <MDXContent
            code={post.mdx}
            components={components}
          />
        </LightGalleryWrapper>
      </PostLayout>
    </>
  )
}
