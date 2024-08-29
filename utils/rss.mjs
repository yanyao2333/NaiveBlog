import { mkdirSync, writeFileSync } from "fs";
import { slug } from "github-slugger";
import path from "path";
import { allCoreContent, sortPosts } from "pliny/utils/contentlayer.js";
import { escape } from "pliny/utils/htmlEscaper.js";
import { allBlogs } from "../.contentlayer/generated/index.mjs";
import tagData from "../app/tag-data.json" assert { type: "json" };
import siteMetadata from "../data/siteMetadata.js";
import categoryData from "../app/category-data.json" assert { type: "json" };

const generateRssItem = (config, post) => `
  <item>
    <guid>${config.siteUrl}/blog/${post.slug}</guid>
    <title>${escape(post.title)}</title>
    <link>${config.siteUrl}/blog/${post.slug}</link>
    ${post.summary && `<description>${escape(post.summary)}</description>`}
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <author>${config.email} (${config.author})</author>
    ${post.tags && post.tags.map((t) => `<category>${t}</category>`).join('')}
  </item>
`

// rss模板
const generateRss = (config, posts, page = 'feed.xml') => `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${escape(config.title)}</title>
      <link>${config.siteUrl}/blog</link>
      <description>${escape(config.description)}</description>
      <language>${config.language}</language>
      <managingEditor>${config.email} (${config.author})</managingEditor>
      <webMaster>${config.email} (${config.author})</webMaster>
      <lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>
      <atom:link href="${config.siteUrl}/${page}" rel="self" type="application/rss+xml"/>
      ${posts.map((post) => generateRssItem(config, post)).join('')}
    </channel>
  </rss>
`

// 过滤文章：根据分类全路径查找节点，递归查找所有子节点下的文章
export function filterPosts(
  categoryFullName,
  allPosts
){
  // 递归查找节点
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

  // 搜索当前分类及其子分类下的所有文章
  function deeplyFilterPosts(node, allPosts) {
    let filteredPosts = []
    if (node.fullPath === categoryFullName) {
      filteredPosts = filteredPosts.concat(
        allCoreContent(
          sortPosts(
            allBlogs.filter((post) => {
              return post._raw.sourceFileDir === node.fullPath ? post : null
            })
          )
        )
      )
    }
    for (const key in node.children) {
      filteredPosts = filteredPosts.concat(
        allCoreContent(
          sortPosts(
            allBlogs.filter((post) => {
              return post._raw.sourceFileDir === node.children[key].fullPath ? post : null
            })
          )
        )
      )
      filteredPosts = filteredPosts.concat(deeplyFilterPosts(node.children[key], allPosts))
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
  const publishPosts = allBlogs.filter((post) => post.draft !== true)
  if (!(publishPosts.length > 0)) {
    console.log('No posts to generate RSS feed.')
    return
  }
  // RSS for blog post
  const rss = generateRss(config, sortPosts(publishPosts))
  writeFileSync(`./public/${page}`, rss)
  console.log('✅ RSS for blog generated...')

  // RSS for each tag posts
  for (const tag of Object.keys(tagData)) {
    const filteredPosts = allBlogs.filter((post) => post.tags.map((t) => slug(t)).includes(tag))
    const rss = generateRss(config, filteredPosts, `tags/${tag}/${page}`)
    const rssPath = path.join('public', 'tags', tag)
    mkdirSync(rssPath, { recursive: true })
    writeFileSync(path.join(rssPath, page), rss)
  }
  console.log('✅ RSS for tags generated...')

  // RSS for each category posts
  function getAllCategoriesFullPath(node, fullPath) {
    const result = []
    result.push(node.fullPath)

    for (const key in node.children) {
      const child = node.children[key]
      const getChildren = getAllCategoriesFullPath(child, fullPath + node.fullPath + '/')
      result.push(...getChildren)
    }
    return result
  }

  const categories = getAllCategoriesFullPath(categoryData, categoryData.fullPath)
  for (const category of categories) {
    const filteredPosts = filterPosts(category, publishPosts)
    const rss = generateRss(config, filteredPosts, `categories/${category}/${page}`)
    const rssPath = path.join('public', 'categories', category)
    mkdirSync(rssPath, { recursive: true })
    writeFileSync(path.join(rssPath, page), rss)
  }
  console.log('✅ RSS for categories generated...')
  console.log('✅ RSS feed generated successfully.')
}

const rss = () => {
  generateRSS(siteMetadata, allBlogs)
  console.log('RSS feed generated...')
}
export default rss
