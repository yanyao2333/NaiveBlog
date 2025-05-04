import { permanentRedirect, RedirectType } from 'next/navigation'

export async function GET({ params }: { params: Promise<{ id: string }> }) {
  return permanentRedirect(`/blog/page/${(await params).id}`, RedirectType.push)
}
