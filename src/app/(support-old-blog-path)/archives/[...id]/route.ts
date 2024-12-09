import { permanentRedirect, RedirectType } from 'next/navigation'
import { NextRequest } from 'next/server'
import postMappingData from './old-blog-posts-mapping.json'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const currentId = (await params).id
  try {
    parseInt(currentId)
  } catch (e) {
    return permanentRedirect('/not-found', RedirectType.push)
  }
  for (const [path, id] of Object.entries(postMappingData)) {
    if (parseInt(currentId) === id) {
      return permanentRedirect('/blog/' + path, RedirectType.push)
    }
  }
  return permanentRedirect('/not-found', RedirectType.push)
}
