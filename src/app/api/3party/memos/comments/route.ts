import type { Memo } from '@/types/memos'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest): Promise<NextResponse> {
  const query = request.nextUrl.searchParams
  if (!query.get('name')) {
    return NextResponse.json(
      { message: 'Invalid request', details: [], code: 400 },
      { status: 400 },
    )
  }
  const name = query.get('name') as string
  if (!process.env.NEXT_PUBLIC_MEMOS_ENDPOINT) {
    return NextResponse.json(
      { message: 'Not set memos endpoint', details: [], code: 400 },
      { status: 400 },
    )
  }
  console.log(process.env.MEMOS_ACCESS_TOKEN)
  const apiEndpoint = process.env.NEXT_PUBLIC_MEMOS_ENDPOINT?.replace(/\/$/, '')
  const response = await fetch(`${apiEndpoint}/api/v1/${name}/comments`, {
    headers: {
      Cookie: 'memos.access-token=' + process.env.MEMOS_ACCESS_TOKEN,
    },
  })
  if (!response.ok) {
    return NextResponse.json(
      {
        message: 'Failed to get comments',
        details: [],
        code: 400,
        raw: await response.json(),
      },
      { status: 400 },
    )
  }
  const comments: Memo[] = await response.json()
  return NextResponse.json(
    { message: 'success', details: comments, code: 200 },
    { status: 200 },
  )
}
