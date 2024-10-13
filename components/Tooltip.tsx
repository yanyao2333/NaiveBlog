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
            'animate-fade-in absolute -left-1/2 bottom-full z-10 mb-2 whitespace-nowrap rounded-md bg-gray-700/80 px-3 py-1 text-sm text-white opacity-0 shadow-lg transition-opacity duration-300 ease-in-out dark:bg-gray-200 dark:text-gray-800',
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
