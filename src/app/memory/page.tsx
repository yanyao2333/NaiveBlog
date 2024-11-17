'use client'
import PageTitle from '@/components/PageTitle'
import { Memo } from '@/types/memos'
import clsx from 'clsx'
import 'lightgallery/css/lg-thumbnail.css'
import 'lightgallery/css/lg-zoom.css'
import 'lightgallery/css/lightgallery.css'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { clearNextPageToken, fetchMemos } from './fetchFunctions'
import { MemoRowComponent } from './singleMemoRow'

/**
 * Memos页面
 * @returns Memos页面
 */
export default function MemosPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  // 是否是初次加载
  const [hasLoaded, setHasLoaded] = useState(false)
  const [memos, setMemos] = useState<Memo[]>([])
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // 初始化Memos列表
  useEffect(() => {
    setIsLoading(true)
    if (!process.env.NEXT_PUBLIC_MEMOS_ENDPOINT) {
      toast.error('你还没设置 memos endpoint！')
      return
    }
    fetchMemos().then((data) => {
      setMemos(data)
      setIsLoading(false)
      setHasLoaded(true)
    })
    return () => {}
  }, [])

  // 使用 IntersectionObserver 自动加载更多
  useEffect(() => {
    const current = loadMoreRef.current
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isLoading) {
        setTimeout(() => {
          setIsLoading(true)
          fetchMemos().then((data) => {
            setMemos(memos.concat(data))
            setIsLoading(false)
          })
        }, 500)
      }
    })
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }
    return () => {
      if (current) {
        observer.unobserve(current)
      }
    }
  }, [isLoading, memos])

  // 加载更多Memos
  function onClickFetchMore() {
    setIsLoading(true)
    fetchMemos().then((data) => {
      setMemos(memos.concat(data))
      setIsLoading(false)
    })
  }

  // 清除nextPageToken
  useEffect(() => {
    return () => {
      clearNextPageToken()
    }
  }, [])

  return (
    <div className="flex flex-col">
      <PageTitle title="Memories" subtitle="人生三大乐事：梗图、发癫与暴论" />
      <div className={clsx('mx-auto flex flex-col', hasLoaded && ' appear-animate')}>
        {memos ? memos.map((memo) => <MemoRowComponent memo={memo} key={memo.uid} />) : null}
      </div>
      <div ref={loadMoreRef} className={'h-[1px]'}></div>
      <button
        onClick={onClickFetchMore}
        disabled={isLoading}
        className="mt-3 justify-center text-blue-11 dark:text-skydark-11"
      >
        {isLoading ? (
          <div className="mx-auto mt-3 w-6">
            {/*<LoadSpinner />*/}
            <span className="relative flex size-6">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-9 opacity-75"></span>
              <span className="relative inline-flex size-6 rounded-full bg-blue-8"></span>
            </span>
          </div>
        ) : (
          <>加载更多 &darr;</>
        )}
      </button>
    </div>
  )
}
