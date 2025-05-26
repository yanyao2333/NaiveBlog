interface CoreConfig {
  title: string
  author: string
  headerTitle: string
  description: string
  language: string
  /** light and dark */
  theme: 'system' | 'dark' | 'light'
  siteUrl: string
  siteRepo: string
  siteLogo: string
  image: string
  socialBanner: string
  email: string
  github: string
  twitter?: string
  facebook?: string
  youtube?: string
  linkedin?: string
  locale: string
}
// biome-ignore lint/suspicious/noExplicitAny: This is a configuration type, so it can be any type.
type PlinyConfig = Record<string, any> &
  CoreConfig & {
    comments?: {
      provider: 'giscus'
      giscusConfig?: {
        repo: string
        repositoryId: string
        categories: string
        categoryId: string
        mapping: 'pathname' | 'url' | 'title'
        reactions: '1' | '0'
        metadata: '1' | '0'
        theme: 'light' | 'dark' | 'preferred_color_scheme'
        darkTheme: string
        themeURL?: string
        lang: string
      }
    }
    search?: {
      provider: 'kbar'
      kbarConfig: {
        searchDocumentsPath: string
      }
    }
  }

export type { CoreConfig, PlinyConfig }
