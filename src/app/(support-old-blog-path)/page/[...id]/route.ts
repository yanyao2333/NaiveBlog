import { permanentRedirect, RedirectType } from 'next/navigation'
import type { NextRequest } from 'next/server'

export async function GET(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	return permanentRedirect(`/blog/page/${(await params).id}`, RedirectType.push)
}
