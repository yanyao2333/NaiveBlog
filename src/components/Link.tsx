/* eslint-disable jsx-a11y/anchor-has-content */
import type { LinkProps } from 'next/link'
import Link from 'next/link'
import { AnchorHTMLAttributes } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

// 给博文内的链接封装的 a 标签，增加 tooltip 显示目标网页
const LinkWithTooltip = ({
  href,
  ...rest
}: LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const isInternalLink = href && href.startsWith('/')
  const isAnchorLink = href && href.startsWith('#')

  if (isAnchorLink) {
    return <a className="break-words underline-offset-2" href={href} {...rest} />
  }

  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          className="underline-offset-2 break-words"
          target={isInternalLink ? '_self' : '_blank'}
          rel={'noopener noreferrer'}
          href={href}
          {...rest}
        >
          {rest.children}
          <span className=" text-xs align-middle">&#8599;</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent className="TooltipContent mt-2 dark:bg-slatedark-3 ring-1 dark:text-slatedark-12 dark:ring-slatedark-7 bg-slate-3 text-slate-12 ring-slate-7">
        {href}
      </TooltipContent>
    </Tooltip>
  )
}

export default LinkWithTooltip
