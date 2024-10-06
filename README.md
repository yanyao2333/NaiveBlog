# Naive Blog

我的博客，名字叫 `Naive Blog`，第一层含义不言自明，第二层含义就是希望我和这个博客一样，永远天真、永远幼稚。

技术栈：Next.js + Tailwind CSS + MDX + ContentLayer2

基于 [timlrx/tailwind-nextjs-starter-blog](https://github.com/timlrx/tailwind-nextjs-starter-blog) 修改而来

## 一些自以为是的特性（都是相比起原版的改动）

1. ~~采用MiSans字体~~ （加载起来太重了，就去掉吧）
2. 如果没有在 `siteMetadata` 中配置 `description` 字段，则默认采用一言 API 每次访问时随机获取一句话作为站点描述
3. 分类机制，具体分类无法设置，只能通过文件系统目录结构决定（eg. `blog/category1/post1.mdx` 属于 `category1` 分类）。另可以在 `category-mapping.ts` 中自定义分类名称。
4. 文章页侧边栏增加显示分类
5. TOC 显示在文章开头，不支持关闭
6. 增加文章加密和隐藏功能
7. 增加 memos 页面，通过 memos api 获取数据

## 部署方式（待完善，或许永远也不会）

.env.example 里是这个项目新增的环境变量，其他环境变量请参考原版项目

只是单纯开源出来了，但里面硬编码的东西太多，估计你部署也很难跑得起来。

## 借鉴（~~抄袭~~）博客

自从开始着手写这个博客，就特别关注别人的 ui，学到了不少好设计，就姑且列一下我（可能）参考了的博客：

1. https://www.haydenbleasel.com/
2. https://innei.in/
3. Typecho Handsome 主题
4. Sakura 主题
5. ...

但 ui 依旧很难看就是了（（（
