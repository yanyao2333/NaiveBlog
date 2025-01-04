// 为文章生成一些元数据的辅助函数

import { writeFileSync } from 'node:fs'
import categoryMapping from '@/data/category-mapping'
import type { Post } from 'content-collections'
import { slug } from 'github-slugger'
import { filterVisiablePosts, sortPostsByDate } from './postsUtils'

const isProduction = process.env.NODE_ENV === 'production'

export type CategoryTreeNode = {
  name: string
  count: number
  children: Record<string, CategoryTreeNode>
  showName: string
  desc?: string
  fullPath: string
}

export function createCategoryTree(allBlogs: Post[]) {
  const root: CategoryTreeNode = {
    name: 'blog',
    count: 0,
    children: {},
    desc: '博客所有文章',
    showName: categoryMapping.blog ? categoryMapping.blog.show : 'Blog',
    fullPath: 'blog',
  }

  for (const file of allBlogs) {
    if (file._meta.directory && (!isProduction || file.draft !== true)) {
      if (file._meta.directory === 'blog') {
        root.count += 1
        continue
      }
      const relativePath: string = file._meta.directory.replace(/^blog\//, '')
      const pathParts = relativePath.split('/')
      let currentNode = root

      for (const part of pathParts) {
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
      }
    }
  }
  for (const node of Object.values(root.children)) {
    root.count += node.count
  }
  console.log('✅ Category tree generated successfully!')
  writeFileSync('./temp/category-data.json', JSON.stringify(root, null, 2))
}

export function createTagCount(allBlogs: Post[]) {
  const tagCount: Record<string, number> = {}
  for (const file of allBlogs) {
    if (file.tags && (!isProduction || file.draft !== true)) {
      for (const tag of file.tags) {
        const formattedTag = slug(tag)
        if (formattedTag in tagCount) {
          tagCount[formattedTag] += 1
        } else {
          tagCount[formattedTag] = 1
        }
      }
    }
  }
  console.log('✅ Tag counts generated successfully!')
  writeFileSync('./temp/tag-data.json', JSON.stringify(tagCount))
}

export function createSearchIndex(allBlogs: Post[]) {
  const blogs = sortPostsByDate(filterVisiablePosts(allBlogs))
  for (const blog of blogs) {
    blog.content = ''
  }
  writeFileSync('public/search.json', JSON.stringify(blogs))
  console.log('✅ Search index generated successfully')
}
