import { type Blog, allBlogs } from 'content-collections'
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
  const blog: Blog | undefined = allBlogs.find(
    (blog: Blog) => blog.path === blogPath,
  )
  if (blog && blog.password === query.get('password')) {
    return NextResponse.json({ ok: true, blog: JSON.stringify(blog) })
  }
  return NextResponse.json(
    { message: 'Invalid passwrd', ok: false },
    { status: 401 },
  )
}
