import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { slug } from 'github-slugger'
import { sortPosts } from 'pliny/utils/contentlayer.js'
import { escape as escaper } from 'pliny/utils/htmlescaper.js'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { allBlogs } from '../../.contentlayer/generated/index.mjs'
import siteMetadata from '../../data/siteMetadata.js'
import categoryData from '../../temp/category-data.json' assert { type: 'json' }
import tagData from '../../temp/tag-data.json' assert { type: 'json' }

const generateRssItemDescription = async (config, post) => {
  const body = post.body.raw
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

const generateRssItem = async (config, post) => {
  const description = await generateRssItemDescription(config, post)
  return `
    <item>
      <guid>${config.siteUrl}/blog/${post.slug}</guid>
      <title>${escaper(post.title)}</title>
      <link>${config.siteUrl}/blog/${post.slug}</link>
      ${`<description><![CDATA[${description}]]></description>`}
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <author>${config.email} (${config.author})</author>
      ${post.tags?.map((t) => `<category>${t}</category>`).join('')}
    </item>
  `
}

// RSS template
const generateRss = async (config, posts, page = 'feed.xml') => {
  const items = await Promise.all(
    posts.map((post) => generateRssItem(config, post)),
  )
  return `
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>${escaper(config.title)}</title>
        <link>${config.siteUrl}/blog</link>
        <follow_challenge>
          <feedId>88493428931156992</feedId>
          <userId>62129560289424384</userId>
        </follow_challenge>
        <description>${escaper(config.description)}</description>
        <language>${config.language}</language>
        <managingEditor>${config.email} (${config.author})</managingEditor>
        <webMaster>${config.email} (${config.author})</webMaster>
        <lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>
        <atom:link href="${config.siteUrl}/${page}" rel="self" type="application/rss+xml"/>
        ${items.join('')}
      </channel>
    </rss>
  `
}

// 用于 Category 的文章过滤函数
export function filterPosts(categoryFullName, allPosts) {
  function findNodeByFullPath(root, fullPath) {
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

  function deeplyFilterPosts(node, allPosts) {
    let filteredPosts = []
    if (node.fullPath === categoryFullName) {
      filteredPosts = filteredPosts.concat(
        sortPosts(
          allBlogs.filter((post) => post._raw.sourceFileDir === node.fullPath),
        ),
      )
    }
    for (const key in node.children) {
      filteredPosts = filteredPosts.concat(
        sortPosts(
          allBlogs.filter(
            (post) => post._raw.sourceFileDir === node.children[key].fullPath,
          ),
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

async function generateRSS(config, allBlogs, page = 'feed.xml') {
  const publishPosts = allBlogs.filter(
    (post) => post.draft !== true && post.private !== true,
  )
  if (!(publishPosts.length > 0)) {
    console.log('No posts to generate RSS feed.')
    return
  }
  console.log(publishPosts)

  // 生成全站 RSS
  const rss = await generateRss(config, sortPosts(publishPosts))
  writeFileSync(`./public/${page}`, rss)
  console.log('✅ RSS for blog generated...')

  // 生成每个标签 RSS
  for (const tag of Object.keys(tagData)) {
    const filteredPosts = allBlogs.filter(
      (post) =>
        post.tags.map((t) => slug(t)).includes(tag) &&
        post.draft !== true &&
        post.private !== true,
    )
    if (!(filteredPosts.length > 0)) {
      console.log('No posts to generate RSS feed on this tag, continue.')
      continue
    }
    const rss = await generateRss(config, filteredPosts, `tags/${tag}/${page}`)
    const rssPath = path.join('public', 'tags', tag)
    mkdirSync(rssPath, { recursive: true })
    writeFileSync(path.join(rssPath, page), rss)
  }
  console.log('✅ RSS for tags generated...')

  // 生成每个分类 RSS
  function getAllCategoriesFullPath(node, fullPath) {
    const result = []
    result.push(node.fullPath)
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

  const categories = getAllCategoriesFullPath(
    categoryData,
    categoryData.fullPath,
  )
  for (const category of categories) {
    const filteredPosts = filterPosts(category, publishPosts)
    const rss = await generateRss(
      config,
      filteredPosts,
      `categories/${category}/${page}`,
    )
    const rssPath = path.join('public', 'categories', category)
    mkdirSync(rssPath, { recursive: true })
    writeFileSync(path.join(rssPath, page), rss)
  }
  console.log('✅ RSS for categories generated...')
  console.log('✅ RSS feed generated successfully.')
}

const rss = async () => {
  await generateRSS(siteMetadata, allBlogs)
  console.log('RSS feed generated...')
}

export default rss
