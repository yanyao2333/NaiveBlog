/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: 'Roitiumの自留地',
  author: 'Roitium',
  headerTitle: 'Roitiumの自留地',
  description: 'Be young & simple, even sometimes naive. ',
  language: 'zh-cn',
  theme: 'light', // system, dark or light
  siteUrl: 'https://www.yanyaolab.xyz',
  siteRepo: 'https://github.com/yanyao2333/blog-main',
  siteContentRepo: 'https://github.com/yanyao2333/blog-content',
  email: 'me@yanyaolab.xyz',
  github: 'https://github.com/yanyao2333',
  locale: 'zh-CN',
  stickyNav: false,
  analytics: {},
  comments: {
    provider: 'giscus',
    giscusConfig: {
      repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
      repositoryId: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID,
      categories: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
      categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
      mapping: 'pathname',
      reactions: '1',
      metadata: '0',
      theme: 'light',
      darkTheme: 'transparent_dark',
      themeURL: '',
      lang: 'zh-CN',
    },
  },
  search: {
    provider: 'kbar', // kbar or algolia
    kbarConfig: {
      searchDocumentsPath: `${process.env.BASE_PATH || ''}/search.json`, // path to load documents to search
    },
  },
}

siteMetadata.siteLogo = `${siteMetadata.siteUrl}/static/images/logo.png`
siteMetadata.socialBanner = `${siteMetadata.siteUrl}/static/images/og.jpg`

module.exports = siteMetadata
