'use client'
import clsx from 'clsx'
import PageTitle from '@/components/PageTitle'
import type { Memo } from '@/types/memos'
import 'lightgallery/css/lg-thumbnail.css'
import 'lightgallery/css/lg-zoom.css'
import 'lightgallery/css/lg-thumbnail.css'
import 'lightgallery/css/lg-zoom.css'
import 'lightgallery/css/lightgallery.css'
import { ArrowUpRightFromCircle } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useRef } from 'react' // Removed useState, toast is still used for errors from useMemos
import { toast } from 'sonner'
import { useMemos } from './fetchFunctions' // Updated import
import { MemoRowComponent } from './singleMemoRow'

/**
 * Memos页面
 * @returns Memos页面
 */
export default function MemosPage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useMemos()

  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isError && error) {
      toast.error(`加载 Memos 失败: ${error.message}`)
    }
  }, [isError, error])

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_MEMOS_ENDPOINT && !isLoading && !isError) {
      toast.error('你还没设置 memos endpoint！ (NEXT_PUBLIC_MEMOS_ENDPOINT)')
    }
  }, [isLoading, isError])


  // IntersectionObserver for infinite scrolling
  useEffect(() => {
    const currentRef = loadMoreRef.current
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 1.0 } // Trigger when element is fully visible
    )

    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [hasNextPage, fetchNextPage, isFetchingNextPage])

  const memos = data?.pages.flatMap((page) => page.memos) || []

  const subtitle = useMemo(
    () => (
      <>
        <p>人生三大乐事：梗图、发癫与暴论</p>
        <Link
          className='text-slate-11 text-sm hover:text-blue-11 dark:text-slatedark-11'
          href={
            process.env.NEXT_PUBLIC_MEMOS_ENDPOINT
              ? process.env.NEXT_PUBLIC_MEMOS_ENDPOINT
              : '#'
          }
        >
          访问 Memos 网页 &nbsp;
          <ArrowUpRightFromCircle className='inline size-3' />
        </Link>
      </>
    ),
    [],
  )

  const memoizedPageTitle = useMemo(
    () => (
      <PageTitle
        title='Memories'
        subtitle={subtitle}
      />
    ),
    [subtitle],
  )

  return (
    <div className='flex w-full flex-col lg:mx-auto lg:max-w-(--breakpoint-lg)'>
      {memoizedPageTitle}
      <div className={clsx('flex w-full flex-col', !isLoading && 'appear-animate')}>
        {isLoading && (
          <div className='mx-auto mt-10 flex justify-center'>
            <span className='relative flex size-8'>
              <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-9 opacity-75' />
              <span className='relative inline-flex size-8 rounded-full bg-blue-8' />
            </span>
          </div>
        )}

        {isError && (
          <div className='my-4 rounded-md bg-red-100 p-4 text-center text-red-700 dark:bg-red-900/30 dark:text-red-300'>
            获取 Memos 失败. <br />
            {error?.message && <span className='text-sm'>{error.message}</span>}
            <br />
            请检查 Memos 服务端点是否正确配置或稍后再试.
          </div>
        )}

        {!isLoading && !isError && memos.length === 0 && (
          <div className='my-10 text-center text-slate-11 dark:text-slatedark-11'>
            这里还没有 Memos 哦.
          </div>
        )}

        {memos.map((memo) => (
          <MemoRowComponent
            memo={memo}
            key={memo.name}
          />
        ))}
      </div>

      {/* Load More Trigger (for IntersectionObserver) and Button */}
      <div className='mt-6 flex flex-col items-center justify-center'>
        <div
          ref={loadMoreRef}
          className={clsx('h-1 w-full', { 'invisible': !hasNextPage })}
        />
        
        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage || !hasNextPage}
            className='mt-4 rounded-md bg-blue-9 px-4 py-2 text-sm font-medium text-white hover:bg-blue-10 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-bluedark-9 dark:hover:bg-bluedark-10'
          >
            {isFetchingNextPage ? (
              <span className='flex items-center'>
                <span className='relative mr-2 flex size-4'>
                  <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-300 opacity-75' />
                  <span className='relative inline-flex size-4 rounded-full bg-sky-200' />
                </span>
                加载中...
              </span>
            ) : (
              '加载更多 👇'
            )}
          </button>
        )}

        {!isFetchingNextPage && !hasNextPage && memos.length > 0 && (
           <p className='mt-4 text-sm text-slate-11 dark:text-slatedark-11'>没有更多了哦.</p>
        )}
      </div>
    </div>
  )
}
