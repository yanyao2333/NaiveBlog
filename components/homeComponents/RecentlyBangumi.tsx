'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { BangumiUserCollection, Item } from '../../types/bangumi'

function AnimeComponent({ item }: { item: Item }) {
  return (
    <div className="flex max-w-24 flex-col xl:max-w-36">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="mx-auto max-w-24 rounded-lg xl:max-w-36"
        alt={item.subject.name}
        src={item.subject.images.medium}
      />
      <span className={'mx-auto max-w-36 text-base font-bold '}>{item.subject.name_cn}</span>
      <span className="mx-auto mt-auto flex flex-row text-sm font-light">{`${item.ep_status} / ${item.subject.eps}`}</span>
    </div>
  )
}

export default function RecentlyBangumi() {
  const [data, setData] = useState<BangumiUserCollection>()

  useEffect(() => {
    fetch(
      `https://api.bgm.tv/v0/users/${process.env.NEXT_PUBLIC_BANGUMI_ID}/collections?subject_type=2&type=3&limit=30&offset=0`
    ).then((response) => {
      if (!response.ok) {
        toast.error('请求 Bangumi 时失败：' + response.status)
        return
      }
      response.json().then((data) => {
        setData(data)
      })
    })
  }, [])

  return (
    <Link
      className="flex cursor-pointer flex-col rounded-lg bg-emerald-100 shadow-lg transition-shadow hover:shadow-xl dark:bg-gray-500 sm:col-span-2"
      href={`https://bangumi.tv/user/${process.env.NEXT_PUBLIC_BANGUMI_ID}`}
    >
      <span className="ml-3 mt-2">
        📺 最近在看<span className="align-bottom text-xs font-light">&nbsp;(Bangumi)</span>
      </span>
      <div className="mx-auto mt-5 grid grid-cols-3 gap-5 pb-3 sm:gap-8 xl:gap-12">
        {data
          ? data.data.map((item) => <AnimeComponent key={item.subject_id} item={item} />)
          : null}
      </div>
    </Link>
  )
}
