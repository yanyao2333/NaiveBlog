import { permanentRedirect, RedirectType } from 'next/navigation'
import type { NextRequest } from 'next/server'

export async function GET(_req: NextRequest, _param) {
	return permanentRedirect('/about', RedirectType.push)
}
