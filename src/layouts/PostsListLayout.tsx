/* eslint-disable jsx-a11y/anchor-is-valid */
'use client'

import PageTitle from '@/components/PageTitle'
import Tag from '@/components/Tag'
import CategoryTreeView from '@/components/categoryTreeView'
import siteMetadata from '@/data/siteMetadata'
import categoryData from '@/temp/category-data.json'
import type { CoreContent } from '@/utils/contentUtils/postsUtils'
import { formatDate } from '@/utils/time'
import type { Post } from 'content-collections'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { memo } from 'react'

interface PaginationProps {
  totalPages: number
  currentPage: number
}

interface ListLayoutProps {
  posts: CoreContent<Post>[]
  title?: string
  subtitle?: string
  initialDisplayPosts?: CoreContent<Post>[]
  pagination?: PaginationProps
}

const MemoizedPagination = memo(function Pagination({
  totalPages,
  currentPage,
}: PaginationProps) {
  const pathname = usePathname()
  const basePath = pathname.split('/')[1]
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <div className='space-y-2 pt-6 pb-8 md:space-y-5'>
      <nav className='flex justify-between'>
        {!prevPage && (
          <button
            type='button'
            className='cursor-auto disabled:opacity-50'
            disabled={!prevPage}
          >
            上一页
          </button>
        )}
        {prevPage && (
          <Link
            href={
              currentPage - 1 === 1
                ? `/${basePath}/`
                : `/${basePath}/page/${currentPage - 1}`
            }
            rel='prev'
          >
            上一页
          </Link>
        )}
        <span>
          {currentPage} / {totalPages}
        </span>
        {!nextPage && (
          <button
            type='button'
            className='cursor-auto disabled:opacity-50'
            disabled={!nextPage}
          >
            下一页
          </button>
        )}
        {nextPage && (
          <Link
            href={`/${basePath}/page/${currentPage + 1}`}
            rel='next'
          >
            下一页
          </Link>
        )}
      </nav>
    </div>
  )
})

// 判断是否在某个 分类/标签 页面上
function isOnThisPage(url: string, category?: string, tag?: string) {
  if (url === '/Post' && category === 'Post') return true
  if (url.startsWith('/categories') && category) {
    const lastNode = url.slice(1, url.length).split('/').pop()
    return lastNode === category
  }
  if (url.startsWith('/tags') && tag) {
    return url.includes(tag)
  }
  return false
}

export default function PostsListLayout({
  posts,
  title,
  subtitle,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const pathname = usePathname()
  const displayPosts =
    initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <div className='min-h-full w-full'>
      <PageTitle
        title={title ? title : '博文'}
        subtitle={subtitle ? subtitle : '思考、发癫与记录'}
      />
      <div className='flex sm:space-x-24'>
        {/* 大屏端侧边栏 */}
        <div className='hidden h-full max-h-screen min-w-[280px] max-w-[280px] flex-wrap overflow-auto rounded bg-slate-3 pt-5 shadow-md lg:flex dark:bg-slatedark-3'>
          <div className='flex w-full flex-col px-6 py-4'>
            <span className='px-3 font-bold text-slate-11 text-xl uppercase dark:text-slatedark-11'>
              分类
            </span>
            {/* 分类列表 */}
            <CategoryTreeView
              root={categoryData}
              pathname={pathname}
            />
            {/* <ul className="mx-auto min-w-full pl-7 pt-3">
              <TreeNodeComponent pathname={pathname} node={categoryData} />
            </ul> */}
          </div>
        </div>
        <div>
          <ul>
            {displayPosts.map((post) => {
              const { path, date, title, summary, tags, pinned } = post
              return (
                <li
                  key={path}
                  className='mx-auto py-5'
                >
                  <article className='flex flex-col space-y-2 xl:space-y-0'>
                    <dl>
                      <dt className='sr-only'>Published on</dt>
                      <dd className='font-medium text-base text-slate-11 leading-6 dark:text-slatedark-11'>
                        <time
                          dateTime={date.toISOString()}
                          suppressHydrationWarning
                        >
                          {formatDate(date, siteMetadata.locale)}{' '}
                          {pinned ? '(置顶博文)' : ''}
                        </time>
                      </dd>
                    </dl>
                    <div className='space-y-3'>
                      <div>
                        <h2 className='break-words font-bold text-2xl leading-8 tracking-tight'>
                          <Link
                            href={`/${path}`}
                            className='overflow-hidden break-words text-slate-12 dark:text-slatedark-12'
                          >
                            {title}
                          </Link>
                        </h2>
                        <div className='flex flex-wrap'>
                          {tags?.map((tag) => (
                            <Tag
                              key={tag}
                              text={tag}
                            />
                          ))}
                        </div>
                      </div>
                      <div className=' prose-slate max-w-none text-slate-11 dark:text-slatedark-11'>
                        {summary}
                        <br />
                        <div className='mt-3 flex items-center text-[12px]'>
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
                          <span>
                            &nbsp; 预计阅读时长：
                            {Math.ceil(post.readingTime)}
                            分钟
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
          {pagination && pagination.totalPages > 1 && (
            <MemoizedPagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
            />
          )}
        </div>
      </div>
    </div>
  )
}
