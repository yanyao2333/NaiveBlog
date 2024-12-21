'use client'
import clsx from 'clsx'

import { type ReactNode, useEffect, useState } from 'react'

interface TooltipProps {
  text: string
  children: ReactNode
  className?: string
  as?: 'div' | 'span'
}

const DeprecatedTooltip = ({ text, children, className, as }: TooltipProps) => {
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
      <div className='relative inline-block'>
        <div
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
        >
          {children}
        </div>
        {showTooltip && (
          <div
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            role='tooltip'
            className={clsx(
              'absolute z-10 mb-2 max-w-3xl px-3 py-1 text-sm shadow-lg transition-opacity duration-200 ease-in-out lg:max-w-5xl',
              'tooltip-animate-fade-in bottom-full transform break-words rounded-lg ring-1',
              'bg-gray-100 text-gray-800 ring-gray-200 dark:bg-neutral-600 dark:text-neutral-100 dark:ring-neutral-500',
              !isVisible && 'tooltip-animate-fade-out',
              className,
            )}
          >
            {text}
          </div>
        )}
      </div>
    )

  return (
    <span className='relative'>
      <span
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </span>
      {showTooltip && (
        <span
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
          role='tooltip'
          className={clsx(
            '-left-0 absolute z-10 mb-2 block max-w-3xl px-3 py-1 text-sm shadow-lg transition-opacity duration-200 ease-in-out lg:max-w-5xl',
            'tooltip-animate-fade-in bottom-full transform break-words rounded-lg ring-1',
            'bg-gray-100 text-gray-800 ring-gray-200 dark:bg-neutral-600 dark:text-neutral-100 dark:ring-neutral-500',
            !isVisible && 'tooltip-animate-fade-out',
            className,
          )}
        >
          {text}
        </span>
      )}
    </span>
  )
}

export default DeprecatedTooltip
