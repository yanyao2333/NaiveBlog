import { genPageMetadata } from '@/app/seo'
import PostsListLayout from '@/layouts/PostsListLayout'
import { allPosts } from '@/services/content/core'
import { allCoreContent, sortPostsByDate } from '@/services/content/utils'

const POSTS_PER_PAGE = 5

export const metadata = genPageMetadata({ title: 'Blog' })

export default function BlogPage() {
	const posts = allCoreContent(sortPostsByDate(allPosts))
	const pageNumber = 1
	const initialDisplayPosts = posts.slice(
		POSTS_PER_PAGE * (pageNumber - 1),
		POSTS_PER_PAGE * pageNumber,
	)
	const pagination = {
		currentPage: pageNumber,
		totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
	}

	return (
		<PostsListLayout
			posts={posts}
			initialDisplayPosts={initialDisplayPosts}
			pagination={pagination}
		/>
	)
}
