# Blog

我的博客

技术栈：Next.js + Tailwind CSS + MDX + Contentlayer2

主题基于 [timlrx/tailwind-nextjs-starter-blog](https://github.com/timlrx/tailwind-nextjs-starter-blog) 修改

## 一些自以为是的特性（都是相比起原版的改动）
1. 采用MiSans字体
2. 如果没有在 `siteMetadata` 中配置 `description` 字段，则默认采用一言 API 每次访问时随机获取一句话作为站点描述
3. 分类机制，具体分类无法设置，只能通过文件系统目录结构决定（eg. `blog/category1/post1.mdx` 属于 `category1` 分类）。另可以在 `category-mapping.ts` 中自定义分类名称。
4. 文章页侧边栏增加显示分类
5. TOC 显示在文章开头，不支持关闭
6. 增加文章加密和隐藏功能
7. 一些细碎优化