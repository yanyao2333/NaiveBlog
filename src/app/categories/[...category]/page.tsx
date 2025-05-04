import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { genPageMetadata } from '@/app/seo'
import categoryMapping from '@/data/category-mapping'
import siteMetadata from '@/data/siteMetadata'
import PostsListLayout from '@/layouts/PostsListLayout'
import { allPosts, type Post } from '@/services/content/core'
import type { CategoryTreeNode } from '@/services/content/metaGen'
import {
  allCoreContent,
  type CoreContent,
  sortPostsByDate,
} from '@/services/content/utils'
import categoryData from '@/temp/category-data.json'

export async function generateMetadata(props: {
  params: Promise<{ category: string[] }>
}): Promise<Metadata> {
  const params = await props.params
  const category = decodeURI(params.category.join('/'))
  return genPageMetadata({
    title: `Posts in ${category}`,
    description: `${siteMetadata.title} - ${category} category`,
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}/categories/${category}/feed.xml`,
      },
    },
  })
}

// 过滤文章：根据分类全路径查找节点，递归查找所有子节点下的文章
function filterPosts(
  categoryFullName: string,
  allPosts: CoreContent<Post>[],
): CoreContent<Post>[] {
  // 递归查找节点
  function findNodeByFullPath(
    root: CategoryTreeNode,
    fullPath: string,
  ): CategoryTreeNode | null {
    if (root.fullPath === fullPath) {
      return root
    }

    for (const key in root.children) {
      const child = root.children[key]
      const result = findNodeByFullPath(child, fullPath)
      if (result) {
        return result
      }
    }

    return null
  }

  // 搜索当前分类及其子分类下的所有文章
  function deeplyFilterPosts(
    node: CategoryTreeNode,
    allPosts: CoreContent<Post>[],
  ): CoreContent<Post>[] {
    let filteredPosts: CoreContent<Post>[] = []
    if (node.fullPath === categoryFullName) {
      filteredPosts = filteredPosts.concat(
        sortPostsByDate(
          allPosts.filter((post) => {
            return post._meta.directory === node.fullPath
          }),
        ),
      )
    }
    for (const key in node.children) {
      filteredPosts = filteredPosts.concat(
        sortPostsByDate(
          allPosts.filter((post) => {
            return post._meta.directory === node.children[key].fullPath
          }),
        ),
      )
      filteredPosts = filteredPosts.concat(
        deeplyFilterPosts(node.children[key], allPosts),
      )
    }
    return filteredPosts
  }

  const nowNode = findNodeByFullPath(categoryData, categoryFullName)
  if (!nowNode) {
    return []
  }
  return deeplyFilterPosts(nowNode, allPosts)
}

export const generateStaticParams = async () => {
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

  const result: string[][] = getAllCategoriesFullPath(
    categoryData,
    categoryData.fullPath,
  )
  return result.map((item) => ({ category: item }))
}

export default async function CategoryPage(props: {
  params: Promise<{ category: string[] }>
}) {
  const params = await props.params
  const categoryFullName = params.category.join('/')
  const filteredPosts = sortPostsByDate(
    filterPosts(categoryFullName, allCoreContent(allPosts)),
  )
  if (filteredPosts.length === 0) {
    return notFound()
  }
  return (
    <PostsListLayout
      posts={filteredPosts}
      title={
        categoryFullName === 'Post'
          ? '所有博文'
          : categoryFullName
              .split('/')
              .slice(1)
              .map((item) =>
                categoryMapping[item] ? categoryMapping[item].show : item,
              )
              .join('/')
      }
      subtitle={
        categoryMapping[params.category[params.category.length - 1]]
          ? categoryMapping[params.category[params.category.length - 1]].desc
          : ''
      }
    />
  )
}
