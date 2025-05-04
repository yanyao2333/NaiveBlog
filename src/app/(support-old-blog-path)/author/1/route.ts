import { permanentRedirect, RedirectType } from 'next/navigation'

export async function GET() {
  return permanentRedirect('/about', RedirectType.push)
}
