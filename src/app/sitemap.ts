import type { MetadataRoute } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { allPosts } from '@/services/content/core'
import type { CategoryTreeNode } from '@/services/content/metaGen'
import categoryData from '@/temp/category-data.json'
import tagData from '@/temp/tag-data.json'

export default function sitemap(): MetadataRoute.Sitemap {
	const siteUrl = siteMetadata.siteUrl

	// 生成每篇博文的路由
	const blogRoutes = allPosts
		.filter((post) => !post.draft)
		.map((post) => ({
			url: `${siteUrl}/${post.path}`,
			lastModified: post.lastmod || post.date,
		}))

	// 生成每个标签的路由
	const tagCounts = tagData as Record<string, number>
	const tagRoutes = Object.keys(tagCounts).map((tag) => ({
		url: `${siteUrl}/tags/${tag}`,
	}))

	// 生成每个分类的路由
	function getAllCategoriesFullPath(
		node: CategoryTreeNode,
		fullPath: string,
	): string[][] {
		const result: string[][] = []
		result.push(node.fullPath.split('/'))

		for (const key in node.children) {
			const child = node.children[key]
			const getChildren = getAllCategoriesFullPath(
				child,
				`${fullPath + node.fullPath}/`,
			)
			result.push(...getChildren)
		}
		return result
	}

	const categoryRoutes = (
		getAllCategoriesFullPath(categoryData, categoryData.fullPath) as string[][]
	).map((item) => ({
		url: `${siteUrl}/categories/${item.join('/')}`,
	}))

	// 静态路由
	const routes = [
		'',
		'blog',
		'projects',
		'tags',
		'categories',
		'memory',
		'about',
	].map((route) => ({
		url: `${siteUrl}/${route}`,
	}))

	return [...routes, ...blogRoutes, ...tagRoutes, ...categoryRoutes]
}
