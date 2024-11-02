'use client'
import clsx from 'clsx'

import { ReactNode, useEffect, useState } from 'react'

interface TooltipProps {
  text: string
  children: ReactNode
  className?: string
  as?: 'div' | 'span'
}

const Tooltip = ({ text, children, className, as }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    let timer
    if (isVisible) {
      setShowTooltip(true)
    } else {
      timer = setTimeout(() => setShowTooltip(false), 300)
    }
    return () => clearTimeout(timer)
  }, [isVisible])

  if (as === 'div' || !as)
    return (
      <div className="relative inline-block">
        <div onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
          {children}
        </div>
        {showTooltip && (
          <div
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            role="tooltip"
            className={clsx(
              'absolute z-10 max-w-3xl lg:max-w-5xl mb-2 px-3 py-1 text-sm shadow-lg transition-opacity duration-200 ease-in-out',
              'tooltip-animate-fade-in bottom-full transform break-words rounded-lg ring-1',
              'dark:bg-neutral-600 dark:text-neutral-100 dark:ring-neutral-500 bg-gray-100 text-gray-800 ring-gray-200',
              !isVisible && 'tooltip-animate-fade-out',
              className
            )}
          >
            {text}
          </div>
        )}
      </div>
    )

  return (
    <span className="relative">
      <span onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
        {children}
      </span>
      {showTooltip && (
        <span
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
          role="tooltip"
          className={clsx(
            'absolute z-10 block -left-0 max-w-3xl lg:max-w-5xl mb-2 px-3 py-1 text-sm shadow-lg transition-opacity duration-200 ease-in-out',
            'tooltip-animate-fade-in bottom-full transform break-words rounded-lg ring-1',
            'dark:bg-neutral-600 dark:text-neutral-100 dark:ring-neutral-500 bg-gray-100 text-gray-800 ring-gray-200',
            !isVisible && 'tooltip-animate-fade-out',
            className
          )}
        >
          {text}
        </span>
      )}
    </span>
  )
}

export default Tooltip
