# Naive Blog
> Too young, too simple, sometimes naïve!
> —— 🐸

技术栈：Next.js 15 + Tailwind CSS + MDX + Content-Collections

基于 [timlrx/tailwind-nextjs-starter-blog](https://github.com/timlrx/tailwind-nextjs-starter-blog) 修改

~~其实现在和原博客框架已经没什么关系了，改了太多东西~~

## 一些自以为是的特性（都是相比起原版的改动）

1. 使用「霞鹜文楷」作为阅读字体
2. 如果没有在 `siteMetadata` 中配置 `description` 字段，则默认采用一言 API 每次访问时随机获取一句话作为站点描述
3. 基于文件系统的分类机制（eg. `blog/category1/post1.mdx` 属于 `category1` 分类）。另可以在 `category-mapping.ts` 中自定义分类显示名称与简介。
4. 文章页侧边栏增加显示分类
5. 响应式分类、标签展示，移动端是抽屉样式，桌面端是模态框
6. 响应式 TOC
7. 文章加密和隐藏功能
8. 增加 memos 页面，通过 memos api 获取数据
9. 常驻导航栏
10. 完全重新设计主页
11. 采用 Radix UI 的色彩系统，好看说不上，但足够统一
12. 为博文动态生成 OpenGraph Image
13. 其他小改动

## 部署方式

推荐 Vercel 部署

.env.example 里是这个项目新增的环境变量，其他环境变量请参考原版项目

## 借鉴（~~抄袭~~）博客

自从开始着手写这个博客，就特别关注别人的 ui，学到了不少好设计，就姑且列一下我（可能）参考了的博客：

1. <https://www.haydenbleasel.com/>
2. <https://innei.in/>
3. Typecho Handsome 主题
4. Sakura 主题
5. ...
