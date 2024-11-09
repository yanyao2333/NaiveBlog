import { permanentRedirect, RedirectType } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return permanentRedirect('/memory', RedirectType.push)
}
