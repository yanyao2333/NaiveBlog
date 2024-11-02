/* eslint-disable jsx-a11y/anchor-is-valid */
'use client'

import CategoryTreeView from '@/components/categoryTreeView'
import PageTitle from '@/components/PageTitle'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import categoryData from '@/temp/category-data.json'
import tagData from '@/temp/tag-data.json'
import { formatDate } from '@/utils/time'
import type { Blog } from 'contentlayer/generated'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CoreContent } from 'pliny/utils/contentlayer'

interface PaginationProps {
  totalPages: number
  currentPage: number
}

interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title?: string
  subtitle?: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const basePath = pathname.split('/')[1]
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <div className="space-y-2 pb-8 pt-6 md:space-y-5">
      <nav className="flex justify-between">
        {!prevPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!prevPage}>
            上一页
          </button>
        )}
        {prevPage && (
          <Link
            href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
            rel="prev"
          >
            上一页
          </Link>
        )}
        <span>
          {currentPage} / {totalPages}
        </span>
        {!nextPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!nextPage}>
            下一页
          </button>
        )}
        {nextPage && (
          <Link href={`/${basePath}/page/${currentPage + 1}`} rel="next">
            下一页
          </Link>
        )}
      </nav>
    </div>
  )
}

// 判断是否在某个 分类/标签 页面上
function isOnThisPage(url: string, category?: string, tag?: string) {
  if (url == '/blog' && category == 'blog') return true
  if (url.startsWith('/categories') && category) {
    url = '/blog/categories/blog/test'
    const lastNode = url.slice(1, url.length).split('/').pop()
    return lastNode == category
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
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])

  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <div className="min-h-full w-full">
      <PageTitle
        title={title ? title : 'Posts'}
        subtitle={subtitle ? subtitle : '思考、发癫与记录'}
      />
      <div className="flex sm:space-x-24">
        {/* 大屏端侧边栏 */}
        <div className="lg:flex hidden h-full max-h-screen min-w-[280px] max-w-[280px] flex-wrap overflow-auto rounded bg-gray-50 pt-5 shadow-md dark:bg-neutral-700 dark:shadow-neutral-700/40">
          <div className="flex flex-col px-6 py-4 w-full">
            <span className="px-3 text-xl font-bold uppercase text-gray-900 dark:text-neutral-100">
              分类
            </span>
            {/* 分类列表 */}
            <CategoryTreeView root={categoryData} pathname={pathname} />
            {/* <ul className="mx-auto min-w-full pl-7 pt-3">
              <TreeNodeComponent pathname={pathname} node={categoryData} />
            </ul> */}
          </div>
        </div>
        <div>
          <ul>
            {displayPosts.map((post) => {
              const { path, date, title, summary, tags } = post
              return (
                <li key={path} className="mx-auto py-5">
                  <article className="flex flex-col space-y-2 xl:space-y-0">
                    <dl>
                      <dt className="sr-only">Published on</dt>
                      <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                        <time dateTime={date} suppressHydrationWarning>
                          {formatDate(date, siteMetadata.locale)}
                        </time>
                      </dd>
                    </dl>
                    <div className="space-y-3">
                      <div>
                        <h2 className="break-words text-2xl font-bold leading-8 tracking-tight">
                          <Link
                            href={`/${path}`}
                            className="break-words overflow-hidden text-gray-900 dark:text-gray-100"
                          >
                            {title}
                          </Link>
                        </h2>
                        <div className="flex flex-wrap">
                          {tags?.map((tag) => <Tag key={tag} text={tag} />)}
                        </div>
                      </div>
                      <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                        {summary}
                        <br />
                        <div className="mt-3 flex items-center text-[12px]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-[18px]"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                          </svg>
                          <span>
                            &nbsp; 预计阅读时长：
                            {Math.ceil(post.readingTime.minutes)}
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
            <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
          )}
        </div>
      </div>
    </div>
  )
}
