import { permanentRedirect, RedirectType } from 'next/navigation'
import type { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return permanentRedirect('/about', RedirectType.push)
}
