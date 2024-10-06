import { NextRequest, NextResponse } from 'next/server'
import { PlayList } from '../../../../../types/neteasePlayList'

const playListCache: { [id: string]: PlayList } = {}

// 默认缓存过期时间 3h
const defaultTTL = 3 * 60 * 60 * 1000

function isTimeDifferenceGreaterThan(targetTimestamp, diffMilliseconds) {
  const currentTimestamp = Date.now()
  const timeDifference = Math.abs(currentTimestamp - targetTimestamp)
  return timeDifference >= diffMilliseconds
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const query = request.nextUrl.searchParams
  if (!query.get('id')) {
    return NextResponse.json({ message: 'Invalid request', data: null }, { status: 400 })
  }
  const id = query.get('id') as string
  if (
    playListCache[id] &&
    !isTimeDifferenceGreaterThan(playListCache[id].refreshTimestamp, defaultTTL)
  ) {
    return NextResponse.json(
      { data: playListCache[id], message: 'success(use cache)' },
      { status: 200 }
    )
  }
  const response = await fetch(
    'https://music.163.com/api/playlist/detail?id=' + process.env.NEXT_PUBLIC_NETEASE_PLAYLIST_ID,
    { credentials: 'omit' }
  )
  const jsonData: PlayList = await response.json()
  if (jsonData.code != 200) {
    return NextResponse.json({ message: jsonData.message, data: jsonData }, { status: 400 })
  }
  jsonData.refreshTimestamp = Date.now()
  playListCache[id] = jsonData
  return NextResponse.json({ message: 'success', data: jsonData }, { status: 200 })
}
