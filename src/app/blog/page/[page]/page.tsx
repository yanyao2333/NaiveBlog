import PostsListLayout from '@/layouts/PostsListLayout'
import { sortPosts } from '@/utils/postsUtils'
import { allBlogs } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import { allCoreContent } from 'pliny/utils/contentlayer'

const POSTS_PER_PAGE = 5

export const generateStaticParams = async () => {
  const totalPages = Math.ceil(allBlogs.length / POSTS_PER_PAGE)
  return Array.from({ length: totalPages }, (_, i) => ({
    page: (i + 1).toString(),
  }))
}

export default async function Page(props: {
  params: Promise<{ page: string }>
}) {
  const params = await props.params
  const posts = allCoreContent(sortPosts(allBlogs))
  const pageNumber = Number.parseInt(params.page as string)
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber,
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }

  if (pageNumber > pagination.totalPages) {
    return notFound()
  }

  return (
    <PostsListLayout
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title='博文'
    />
  )
}
