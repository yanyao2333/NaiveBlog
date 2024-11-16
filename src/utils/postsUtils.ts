import { Blog } from 'contentlayer/generated'

const isProduction = process.env.NODE_ENV === 'production'

// 在生产环境下，过滤掉草稿和隐私文章
export function filterVisiablePosts(allBlogs: Blog[]) {
  if (isProduction) return allBlogs.filter((blog) => !(blog.draft || blog.private))
  return allBlogs
}

export function dateSortDesc(a: string, b: string) {
  if (a > b) return -1
  if (a < b) return 1
  return 0
}

export function sortPosts(allBlogs: Blog[], dateKey: string = 'date') {
  return allBlogs.sort((a, b) => dateSortDesc(a[dateKey], b[dateKey]))
}
