import { type Post, allPosts } from 'content-collections'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest): Promise<NextResponse> {
  const query = request.nextUrl.searchParams
  if (!query.get('path') || !query.get('password')) {
    return NextResponse.json(
      { message: 'Invalid request', ok: false },
      { status: 400 },
    )
  }
  const blogPath = (query.get('path') as string).replace('/blog', 'blog')
  const blog: Post | undefined = allPosts.find(
    (blog: Post) => blog.path === blogPath,
  )
  if (blog && blog.password === query.get('password')) {
    return NextResponse.json({ ok: true, blog: JSON.stringify(blog) })
  }
  return NextResponse.json(
    { message: 'Invalid password', ok: false },
    { status: 401 },
  )
}
