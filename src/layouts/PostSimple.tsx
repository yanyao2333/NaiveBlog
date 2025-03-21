import ScrollTopAndComment from '@/components/ArticlePageButtonGroup'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import '@/css/markdown.css'
import siteMetadata from '@/data/siteMetadata'
import type { Post } from '@/services/content/core'
import type { CoreContent } from '@/services/content/utils'
import { formatDate } from '@/utils/time'
import Link from 'next/link'
import { Comments as CommentsComponent } from 'pliny/comments'
import type { ReactNode } from 'react'

interface LayoutProps {
  content: CoreContent<Post>
  children: ReactNode
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
}

export default function PostLayout({
  content,
  next,
  prev,
  children,
}: LayoutProps) {
  const { slug, date, title } = content

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        <div>
          <header>
            <div className='space-y-1 border-gray-200 border-b pb-10 text-center dark:border-gray-700'>
              <dl>
                <div>
                  <dt className='sr-only'>Published on</dt>
                  <dd className='font-medium text-base text-gray-500 leading-6 dark:text-gray-400'>
                    <time dateTime={date.toISOString()}>
                      {formatDate(date, siteMetadata.locale)}
                    </time>
                  </dd>
                </div>
              </dl>
              <div>
                <PageTitle title={title} />
                <div className='mt-3 flex justify-center text-[12px]'>
                  <svg
                    role='img'
                    aria-label='clock'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-[18px]'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                    />
                  </svg>
                  预计阅读时长：
                  {Math.ceil(content.readingTime)}
                  分钟
                </div>
              </div>
            </div>
          </header>
          <div className='grid-rows-[auto_1fr] divide-y divide-gray-200 pb-8 xl:divide-y-0 dark:divide-gray-700'>
            <div className='divide-y divide-gray-200 xl:col-span-3 xl:row-span-2 xl:pb-0 dark:divide-gray-700'>
              <div className='prose prose-slate dark:prose-invert max-w-none pt-10 pb-8'>
                {children}
              </div>
            </div>
            {siteMetadata.comments && (
              <div
                className='pt-6 pb-6 text-center text-gray-700 dark:text-gray-300'
                id='comment'
              >
                <CommentsComponent
                  commentsConfig={siteMetadata.comments}
                  slug={slug}
                />
              </div>
            )}
            <footer>
              <div className='flex flex-col font-medium text-sm sm:flex-row sm:justify-between sm:text-base'>
                {prev?.path && (
                  <div className='pt-4 xl:pt-8'>
                    <Link
                      href={`/${prev.path}`}
                      className='text-primary-500 hover:text-primary-600 dark:hover:text-primary-400'
                      aria-label={`Previous post: ${prev.title}`}
                    >
                      &larr; {prev.title}
                    </Link>
                  </div>
                )}
                {next?.path && (
                  <div className='pt-4 xl:pt-8'>
                    <Link
                      href={`/${next.path}`}
                      className='text-primary-500 hover:text-primary-600 dark:hover:text-primary-400'
                      aria-label={`Next post: ${next.title}`}
                    >
                      {next.title} &rarr;
                    </Link>
                  </div>
                )}
              </div>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
