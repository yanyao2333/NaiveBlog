'use client'
import moment from 'moment'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Memo, MemoListResponse } from '../../types/memos'
import { TimelineSection } from '../TimelineSection'

async function fetchMemos() {
  if (!process.env.NEXT_PUBLIC_MEMOS_ENDPOINT) {
    return []
  }
  const apiEndpoint = process.env.NEXT_PUBLIC_MEMOS_ENDPOINT?.replace(/\/$/, '')
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
    <TimelineSection title="💡 最近想法">
      {memos.map((memo) => (
        <div key={memo.uid} className="relative pl-8">
          <div className="absolute left-0 top-2 h-4 w-4 rounded-full border-2 border-primary-300/80 bg-white dark:border-primary-400/60 dark:bg-neutral-800"></div>
          <div className="rounded-lg bg-gray-50 p-4 shadow-sm transition-all hover:shadow-md dark:bg-neutral-700/50">
            <div className="text-neutral-900 dark:text-neutral-100">{memo.content}</div>
            <div className="mt-2 text-sm text-gray-500 dark:text-neutral-400">
              {moment(memo.createTime).fromNow()}
            </div>
          </div>
        </div>
      ))}
      <Link
        href="/memory"
        className="ml-8 mt-4 inline-block text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
      >
        查看更多 →
      </Link>
    </TimelineSection>
  )
}
