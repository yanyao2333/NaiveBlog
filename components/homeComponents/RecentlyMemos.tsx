'use client'
import moment from 'moment/min/moment-with-locales'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Memo, MemoListResponse } from '../../types/memos'

async function fetchMemos() {
  if (!process.env.NEXT_PUBLIC_MEMOS_ENDPOINT) {
    return []
  }
  const apiEndpoint = process.env.NEXT_PUBLIC_MEMOS_ENDPOINT?.replace(/\/$/, '')
  // 逆天参数，给我整不会了
  const filter = `filter=creator=='users/1'`
  const pageSize = 'pageSize=3'
  const apiPath = 'api/v1/memos'
  const response = await fetch(`${apiEndpoint}/${apiPath}?${filter}&${pageSize}`)
  const jsonResp: MemoListResponse = await response.json()
  return jsonResp.memos
}

export default function RecentlyMemos() {
  const [memos, setMemos] = useState<Memo[]>([])
  useEffect(() => {
    moment.locale(navigator.language)
    fetchMemos().then((data) => setMemos(data))
  }, [])

  return (
    <Link
      className="flex min-h-60 cursor-pointer flex-col rounded-lg bg-gray-200 dark:bg-neutral-600 sm:col-span-2"
      href={'/memory'}
    >
      <span className="ml-3 mt-2">💡 最近想法</span>
      <div className="m-3 flex min-w-fit flex-col divide-y divide-dashed divide-neutral-500 rounded-md bg-gray-50 px-3 font-medium shadow transition-shadow hover:shadow-xl dark:bg-neutral-200 dark:text-neutral-800 dark:shadow-neutral-500/90">
        {memos
          ? memos.map((memo) => {
              return (
                <div className="py-3" key={memo.uid}>
                  {memo.snippet
                    ? memo.snippet.length > 30
                      ? memo.snippet.substring(0, 50) + '...'
                      : memo.snippet
                    : memo.content.length > 30
                      ? memo.content.substring(0, 50) + '...'
                      : memo.content}
                  <div className=" mt-1 text-sm text-gray-500 dark:text-neutral-600/90">
                    {moment(memo.createTime).fromNow()}
                  </div>
                </div>
              )
            })
          : null}
      </div>
      <button className="mb-2 ml-auto mr-4 mt-auto">查看更多 &rarr;</button>
    </Link>
  )
}
