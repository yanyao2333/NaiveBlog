import {
  type Author,
  type Post,
  allAuthors,
  allPosts,
} from 'content-collections'

// 在这里集中导出所有的文章和作者数据，方便后期替换数据源
export { allPosts, allAuthors }
export type { Post, Author }
