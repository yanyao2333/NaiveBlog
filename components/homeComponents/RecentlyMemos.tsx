'use client'
import { Memo, MemoListResponse } from '@/types/memos'
import moment from 'moment'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

async function fetchMemos() {
  if (!process.env.NEXT_PUBLIC_MEMOS_ENDPOINT) {
    return []
  }
  const apiEndpoint = process.env.NEXT_PUBLIC_MEMOS_ENDPOINT?.replace(/\/$/, '')
  const filter = `filter=creator=='users/1'`
  const pageSize = 'pageSize=5'
  const apiPath = 'api/v1/memos'
  const response = await fetch(`${apiEndpoint}/${apiPath}?${filter}&${pageSize}`)
  const jsonResp: MemoListResponse = await response.json()
  return jsonResp.memos
}

export default function RecentlyMemos() {
  const [memos, setMemos] = useState<Memo[]>([])
  const [isBottom, setIsBottom] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const scrollRef = useRef(null)

  // 监听滚动事件，判断是否到达底部
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
      // 如果当前滚动位置接近底部，就设置isBottom为true
      setIsBottom(scrollTop + clientHeight >= scrollHeight - 20)
    }
  }

  useEffect(() => {
    const ref = scrollRef.current
    if (ref) {
      // @ts-ignore
      ref.addEventListener('scroll', handleScroll)
    }
    return () => {
      if (ref) {
        // @ts-ignore
        ref.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  useEffect(() => {
    moment.locale(navigator.language)
    setIsLoading(true)
    fetchMemos().then((data) => {
      setMemos(data)
      setIsLoading(false)
    })
  }, [])

  return (
    <div className="relative flex flex-col">
      <h2 className="mb-4 text-lg font-medium">💡 最近想法</h2>
      <div
        className="no-scrollbar relative max-h-[17.5rem] list-none overflow-scroll"
        ref={scrollRef}
      >
        {!isLoading ? (
          <ol className="relative ml-4 border-s-[2px] border-primary-300 dark:border-primary-500">
            <li className="h-2"></li>
            {memos.map((memo) => (
              <li key={memo.uid} className="mb-10 ms-6">
                {/* 偏移 7px（半径加 border-s） */}
                <div className="absolute -start-[7px] mt-2 flex h-3 w-3 items-center justify-center rounded-full border-2 border-primary-300 bg-white dark:border-primary-500 dark:bg-neutral-300"></div>
                <div className="mr-2 flex flex-col justify-between rounded-lg bg-gray-100 p-4 text-gray-800 shadow-sm ring-1 ring-gray-200 dark:bg-neutral-600 dark:text-neutral-100 dark:ring-neutral-500">
                  <time className="mb-2 self-start text-xs font-normal text-gray-500 dark:text-neutral-400">
                    {moment(memo.createTime).fromNow()}
                  </time>
                  <article className="whitespace-pre-wrap text-sm font-normal text-neutral-900 dark:text-neutral-100">
                    {memo.content}
                  </article>
                </div>
              </li>
            ))}
            <li className="ms-6 flex min-w-max justify-between">
              <div></div>
              <Link
                href="/memory"
                className="min-w-max text-sm text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
              >
                查看更多 &rarr;
              </Link>
            </li>
          </ol>
        ) : (
          <div className="flex min-h-[17.5rem] flex-col justify-center">
            <div className="relative mx-auto flex size-6 justify-center self-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex size-6 rounded-full bg-primary-500"></span>
            </div>
            <span className="pt-6 text-center text-neutral-600 dark:text-neutral-400">
              加载中...
            </span>
          </div>
        )}
      </div>
      {/* 向下箭头，接近底部时隐藏 */}
      {!isBottom && !isLoading && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 transform">
          <div className="animate-bounce text-sm text-neutral-600 dark:text-neutral-200">
            &darr;
          </div>
        </div>
      )}
    </div>
  )
}
