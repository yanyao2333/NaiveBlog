import { genPageMetadata } from '@/app/seo'
import siteMetadata from '@/data/siteMetadata'
import PostsListLayout from '@/layouts/PostsListLayout'
import tagData from '@/temp/tag-data.json'
import { sortPosts } from '@/utils/postsUtils'
import { allBlogs } from 'contentlayer/generated'
import { slug } from 'github-slugger'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { allCoreContent } from 'pliny/utils/contentlayer'

export async function generateMetadata(props: {
  params: Promise<{ tag: string }>
}): Promise<Metadata> {
  const params = await props.params
  const tag = decodeURI(params.tag)
  return genPageMetadata({
    title: `Posts tagged with ${tag}`,
    description: `${siteMetadata.title} ${tag} tagged content`,
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}/tags/${tag}/feed.xml`,
      },
    },
  })
}

export const generateStaticParams = async () => {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  return tagKeys.map((tag) => ({
    tag: tag,
  }))
}

export default async function TagPage(props: {
  params: Promise<{ tag: string }>
}) {
  const params = await props.params
  const tag = decodeURI(params.tag)

  // Capitalize first letter and convert space to dash
  const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1)
  const filteredPosts = allCoreContent(
    sortPosts(
      allBlogs.filter((post) => post.tags?.map((t) => slug(t)).includes(tag)),
    ),
  )
  if (filteredPosts.length === 0) {
    return notFound()
  }
  return (
    <PostsListLayout
      posts={filteredPosts}
      title={title}
      subtitle={`${title} 标签下的所有文章`}
    />
  )
}
