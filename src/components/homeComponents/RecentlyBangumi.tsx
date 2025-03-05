'use client'

import type { BangumiUserCollection, Item } from '@/types/bangumi'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

function AnimeComponent({ item }: { item: Item }) {
  const [showTooltip, setShowTooltip] = useState(false)
  return (
    <Link
      className='relative flex max-w-24 flex-col xl:max-w-36'
      href={`https://bangumi.tv/subject/${item.subject.id}`}
      target={'_blank'}
      // onMouseEnter={() => setShowTooltip(true)}
      // onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Tooltip 显示的内容 */}
      {showTooltip && (
        <div className='absolute bottom-full z-80 mb-2 w-max rounded-sm bg-gray-800 px-2 py-1 text-sm text-white'>
          yeppppp
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className='mx-auto max-w-24 rounded-lg shadow-lg transition-shadow hover:shadow-xl xl:max-w-36'
        alt={item.subject.name}
        src={item.subject.images.medium}
      />
      <span className={'mx-auto max-w-36 font-bold text-base '}>
        {item.subject.name_cn}
      </span>
      <span className='mx-auto mt-auto flex flex-row font-light text-sm'>{`${item.ep_status} / ${item.subject.eps}`}</span>
    </Link>
  )
}

export default function RecentlyBangumi() {
  const [data, setData] = useState<BangumiUserCollection>()

  useEffect(() => {
    fetch(
      `https://api.bgm.tv/v0/users/${process.env.NEXT_PUBLIC_BANGUMI_ID}/collections?subject_type=2&type=3&limit=30&offset=0`,
    ).then((response) => {
      if (!response.ok) {
        toast.error(`请求 Bangumi 时失败：${response.status}`)
        return
      }
      response.json().then((data) => {
        setData(data)
      })
    })
  }, [])

  return (
    <div className='flex min-h-60 flex-col rounded-lg bg-zinc-200/70 shadow-lg sm:col-span-2 dark:bg-zinc-500'>
      <span className='mt-2 ml-3'>📺 最近在看</span>
      <div className='mx-auto mt-5 grid grid-cols-3 gap-5 pb-3 sm:gap-8 xl:gap-12'>
        {data
          ? data.data.map((item) => (
              <AnimeComponent
                key={item.subject_id}
                item={item}
              />
            ))
          : null}
      </div>
    </div>
  )
}
