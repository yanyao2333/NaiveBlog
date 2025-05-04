import { permanentRedirect, RedirectType } from 'next/navigation'

export async function GET() {
  return permanentRedirect('/blog', RedirectType.push)
}
