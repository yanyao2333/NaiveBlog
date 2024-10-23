'use client'

import { ReactNode, useState } from 'react'
import { twMerge } from 'tailwind-merge'

interface TooltipProps {
  text: string
  children: ReactNode
  className?: string
}

const Tooltip = ({ text, children, className }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative inline-block">
      <div onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
        {children}
      </div>
      {isVisible && (
        <div
          className={twMerge(
            'tooltip-animate-fade-in absolute -left-1/2 bottom-full z-10 mb-2 whitespace-nowrap rounded-lg bg-gray-100 px-3 py-1 text-sm text-gray-800 opacity-0 shadow-lg ring-1 ring-gray-200/90 transition-opacity duration-300 ease-in-out dark:bg-neutral-600 dark:text-neutral-100 dark:ring-neutral-400/90',
            className
          )}
        >
          {text}
        </div>
      )}
    </div>
  )
}

export default Tooltip
