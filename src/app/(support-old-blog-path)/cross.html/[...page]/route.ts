import { permanentRedirect, RedirectType } from 'next/navigation'

export async function GET() {
  return permanentRedirect('/memory', RedirectType.push)
}
