'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { PlayList } from '../../types/neteasePlayList'
import { isTimeDifferenceGreaterThan } from '../../utils/time'

const defaultTTL = 3 * 60 * 60 * 1000

export default function RecentlyMusic() {
  const router = useRouter()
  const [music, setMusic] = useState<PlayList | undefined>()
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_NETEASE_PLAYLIST_ID) return
    const localCache = localStorage.getItem('netease-playlist')
    if (localCache) {
      const jsonCache: PlayList = JSON.parse(localCache)
      if (!isTimeDifferenceGreaterThan(jsonCache.refreshTimestamp, defaultTTL)) {
        setMusic(jsonCache)
        return
      }
    }
    fetch('/api/3party/netease/playlist?id=' + process.env.NEXT_PUBLIC_NETEASE_PLAYLIST_ID).then(
      (response) => {
        response.json().then((data) => {
          if (!response.ok) {
            console.error(
              `获取网易云歌单信息失败：${data.message}。fallback 到 localStorage 缓存数据(如果有)`
            )
            localCache ? setMusic(JSON.parse(localCache)) : null
            return
          }
          localStorage.setItem('netease-playlist', JSON.stringify(data.data))
          setMusic(data.data)
        })
      }
    )
  }, [])

  return (
    <Link
      className="flex cursor-pointer flex-col rounded-lg bg-pink-200 shadow-lg transition-shadow hover:shadow-xl dark:bg-zinc-500"
      href={'https://music.163.com/playlist?id=' + process.env.NEXT_PUBLIC_NETEASE_PLAYLIST_ID}
    >
      <span className="ml-3 mt-2">🎵 最近在听</span>
      {music ? (
        <div className="m-auto flex flex-col">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={music.result.tracks[0].album.picUrl}
            alt={music.result.tracks[0].name}
            className="cover mx-auto size-32 rounded-full pl-3 pt-3"
          />
          <span className="mx-auto px-3 pt-3 text-sm font-bold">{music.result.tracks[0].name}</span>
          <span className="mx-auto px-3 pt-3 text-sm font-light">
            {music.result.tracks[0].artists[0].name}
          </span>
        </div>
      ) : null}
      <button className="mb-2 ml-auto mr-4 mt-auto">我也要听 &rarr;</button>
    </Link>
  )
}