'use client'

import { KBarAnimator, KBarPortal, KBarPositioner, KBarProvider, KBarSearch } from 'kbar'
import { ReactNode } from 'react'

export default function KBarSearchProvider({ children }: { children: ReactNode }) {
  return (
    <KBarProvider>
      <KBarPortal>
        <KBarPositioner>
          <KBarAnimator>
            <KBarSearch />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </KBarProvider>
  )
}
