/* eslint-disable jsx-a11y/anchor-has-content */

import Link from 'next/link'
import type { LinkProps } from 'next/link'
import type { AnchorHTMLAttributes } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

// 给博文内的链接封装的 a 标签，增加 tooltip 显示目标网页
const LinkWithTooltip = ({
  href,
  ...rest
}: LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const isInternalLink = href?.startsWith('/')
  const isAnchorLink = href?.startsWith('#')

  if (isAnchorLink) {
    return (
      <a
        className='break-words underline-offset-2'
        href={href}
        {...rest}
      />
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          className="break-words underline-offset-2 after:content-['_↗']"
          target={isInternalLink ? '_self' : '_blank'}
          rel={'noopener noreferrer'}
          href={href}
          {...rest}
        >
          {rest.children}
        </Link>
      </TooltipTrigger>
      <TooltipContent className='TooltipContent mt-2 bg-slate-3 text-slate-12 ring-1 ring-slate-7 dark:bg-slatedark-3 dark:text-slatedark-12 dark:ring-slatedark-7'>
        {href}
      </TooltipContent>
    </Tooltip>
  )
}

export default LinkWithTooltip
