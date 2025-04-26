import ClientReady from '@/components/ClientReady'
import Footer from '@/components/Footer'
import { KBarSearchProvider } from '@/components/kbar/KbarSearch'
import FloatNavBar from '@/components/navBar/main'
import SectionContainer from '@/components/SectionContainer'
import { TooltipProvider } from '@/components/ui/tooltip'
import '@/css/LXGWWenKai-Regular/result.css'
import '@/css/tailwind.css'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import NextTopLoader from 'nextjs-toploader'
import type { ReactNode } from 'react'
import { Toaster } from 'sonner'
import siteMetadata from '@/data/siteMetadata'
import 'remark-github-blockquote-alert/alert.css'
import Script from 'next/script'
import { unstable_ViewTransition as ViewTransition } from 'react'
import { ThemeProviders } from './theme-providers'

// const misansFont = localFont({
//   src: [
//     {
//       path: './fonts/MiSans-Regular.woff2',
//       weight: '400',
//       style: 'normal',
//     },
//     {
//       path: './fonts/MiSans-Medium.woff2',
//       weight: '500',
//       style: 'normal',
//     },
//     {
//       path: './fonts/MiSans-Demibold.woff2',
//       weight: '600',
//       style: 'normal',
//     },
//     {
//       path: './fonts/MiSans-Bold.woff2',
//       weight: '700',
//       style: 'normal',
//     },
//     {
//       path: './fonts/MiSans-Heavy.woff2',
//       weight: '800',
//       style: 'normal',
//     },
//   ],
// })

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: './',
    siteName: siteMetadata.title,
    // images: [
    //   {
    //     url: siteMetadata.socialBanner,
    //     width: 1200,
    //     height: 630,
    //     alt: siteMetadata.title,
    //   },
    // ],
    locale: 'zh_CN',
    type: 'website',
  },
  alternates: {
    canonical: './',
    types: {
      'application/rss+xml': `${siteMetadata.siteUrl}/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: siteMetadata.title,
    card: 'summary_large_image',
    description: siteMetadata.description,
    // images: {
    //   url: siteMetadata.socialBanner,
    //   alt: siteMetadata.title,
    // },
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const basePath = process.env.BASE_PATH || ''

  return (
    <html
      lang={siteMetadata.language}
      className={'h-full w-full scroll-smooth'}
      suppressHydrationWarning
    >
      <head>
        {process.env.NODE_ENV === 'development' && (
          <Script
            crossOrigin='anonymous'
            src='https://unpkg.com/react-scan/dist/auto.global.js'
          />
        )}
        <link
          rel='apple-touch-icon'
          sizes='76x76'
          href={`${basePath}/static/favicons/apple-touch-icon.png`}
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href={`${basePath}/static/favicons/favicon-32x32.png`}
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href={`${basePath}/static/favicons/favicon-16x16.png`}
        />
        <link
          rel='manifest'
          href={`${basePath}/static/favicons/site.webmanifest`}
        />
        <meta
          name='msapplication-TileColor'
          content='#000000'
        />
        <meta
          name='theme-color'
          media='(prefers-color-scheme: light)'
          content='#fff'
        />
        <meta
          name='theme-color'
          media='(prefers-color-scheme: dark)'
          content='#000'
        />
        <link
          rel='alternate'
          type='application/rss+xml'
          href={`${basePath}/feed.xml`}
        />
        <title>{siteMetadata.title}</title>
      </head>
      <body className='h-full min-h-screen w-full bg-slate-2 text-slate-12 antialiased accent-blue-5 dark:bg-slatedark-2/60 dark:text-slatedark-12 dark:accent-bluedark-5'>
        <ClientReady />
        <NextTopLoader showSpinner={false} />
        <Toaster />
        <SpeedInsights />
        <Analytics />
        <TooltipProvider delayDuration={0}>
          <ThemeProviders>
            <KBarSearchProvider>
              <div className='h-full w-full'>
                {/* 定义了一个container，规范内容页面宽高 */}
                <FloatNavBar />
                <SectionContainer>
                  <main className='mx-auto min-h-screen w-full pt-20'>
                    <ViewTransition name='page'>{children}</ViewTransition>
                  </main>
                  {/* 只是觉得不太好看 */}
                  {/* <SettingsPanel /> */}
                </SectionContainer>
                <Footer />
              </div>
            </KBarSearchProvider>
          </ThemeProviders>
        </TooltipProvider>
      </body>
    </html>
  )
}
