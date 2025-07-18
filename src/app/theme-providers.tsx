'use client'

import { ThemeProvider } from 'next-themes'
import type { ReactNode } from 'react'
import siteMetadata from '@/data/siteMetadata'

export function ThemeProviders({ children }: { children: ReactNode }) {
	return (
		<ThemeProvider
			attribute='class'
			defaultTheme={siteMetadata.theme}
			enableSystem
		>
			{children}
		</ThemeProvider>
	)
}
