import { permanentRedirect, RedirectType } from 'next/navigation'

export async function GET() {
  return permanentRedirect('/projects', RedirectType.push)
}
