// 为文章生成一些元数据的辅助函数

import { writeFileSync } from 'node:fs'
import { slug } from 'github-slugger'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import RSS from 'rss'
import { unified } from 'unified'
import categoryMapping from '@/data/category-mapping'
import config from '@/data/siteMetadata'
import type { Post } from '@/services/content/core'
import { filterVisiablePosts, sortPostsByDate } from '@/services/content/utils'

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
  const newBlogs = blogs.map((blog) => {
    return {
      content: blog.content,
      date: blog.date,
      path: blog.path,
      title: blog.title,
    }
  })
  writeFileSync('public/search.json', JSON.stringify(newBlogs))
  console.log('✅ Search index generated successfully')
}

async function generateRssItemDescription(post: Post) {
  const body = post.content
  const tip = `> rss 内容与网站采用的渲染流程不同，可能导致排版错乱或效果欠佳，建议到博客：<a href="${config.siteUrl}/blog/${post.slug}">${config.siteUrl}/blog/${post.slug}</a> 查看\n\n`

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(tip + body)

  return file.toString()
}

export async function generateRssFeed(allBlogs: Post[]) {
  const feed = new RSS({
    title: config.title,
    site_url: config.siteUrl,
    feed_url: `${config.siteUrl}/feed.xml`,
    description: 'feedId:142953123219007488+userId:62129560289424384',
    custom_elements: [
      {
        follow_challenge: [
          { feed_id: '142953123219007488' },
          { user_id: '62129560289424384' },
        ],
      },
    ],
  })

  const visiablePosts = filterVisiablePosts(allBlogs)

  for (const post of visiablePosts) {
    feed.item({
      title: post.title,
      guid: post.slug,
      url: `${config.siteUrl}/blog/${post.slug}`,
      date: post.date,
      description: await generateRssItemDescription(post),
    })
  }

  const rss = feed.xml({ indent: true })
  writeFileSync('public/feed.xml', rss)
  console.log('✅ RSS feed generated successfully!')

  return true
}
