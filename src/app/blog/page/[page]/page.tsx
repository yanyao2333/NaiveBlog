import PostsListLayout from '@/layouts/PostsListLayout'
import { sortPostsByDate } from '@/utils/contentUtils/postsUtils'
import { allCoreContent } from '@/utils/contentUtils/postsUtils'
import { allPosts } from 'content-collections'
import { notFound } from 'next/navigation'

const POSTS_PER_PAGE = 5

export const generateStaticParams = async () => {
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE)
  return Array.from({ length: totalPages }, (_, i) => ({
    page: (i + 1).toString(),
  }))
}

export default async function Page(props: {
  params: Promise<{ page: string }>
}) {
  const params = await props.params
  const posts = allCoreContent(sortPostsByDate(allPosts))
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
