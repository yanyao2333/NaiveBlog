import { type NextRequest, NextResponse } from 'next/server'
import type { PlayList } from '@/types/neteasePlayList'
import { isTimeDifferenceGreaterThan } from '@/utils/time'

const playListCache: { [id: string]: PlayList } = {}

// 默认缓存过期时间 3h
const defaultTTL = 3 * 60 * 60 * 1000

// vercel 的函数似乎是直接部署在边缘服务器的，所以直接用字典存 cache 并没有什么用，我又不太想加 Redis，只能在客户端再加个缓存...
export async function GET(request: NextRequest): Promise<NextResponse> {
  const query = request.nextUrl.searchParams
  if (!query.get('id')) {
    return NextResponse.json(
      { message: 'Invalid request', data: null },
      { status: 400 },
    )
  }
  const id = query.get('id') as string
  const cacheData: PlayList | undefined = playListCache[id]
  if (
    cacheData &&
    !isTimeDifferenceGreaterThan(cacheData.refreshTimestamp, defaultTTL)
  ) {
    return NextResponse.json(
      { data: cacheData, message: 'success(from cache)' },
      { status: 200 },
    )
  }
  const response = await fetch(
    `https://music.163.com/api/playlist/detail?id=${process.env.NEXT_PUBLIC_NETEASE_PLAYLIST_ID}`,
    { credentials: 'omit' },
  )
  const jsonData: PlayList = await response.json()
  if (jsonData.code !== 200) {
    return NextResponse.json(
      { message: jsonData.message, data: jsonData },
      { status: 400 },
    )
  }
  jsonData.refreshTimestamp = Date.now()
  playListCache[id] = jsonData
  return NextResponse.json(
    { message: 'success', data: jsonData },
    { status: 200 },
  )
}
