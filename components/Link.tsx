/* eslint-disable jsx-a11y/anchor-has-content */
import type { LinkProps } from 'next/link'
import Link from 'next/link'
import { AnchorHTMLAttributes } from 'react'
import Tooltip from './Tooltip'

const CustomLink = ({ href, ...rest }: LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const isInternalLink = href && href.startsWith('/')
  const isAnchorLink = href && href.startsWith('#')

  if (isAnchorLink) {
    return <a className="break-words underline-offset-2" href={href} {...rest} />
  }

  return (
    <Tooltip text={href}>
      <Link
        className="underline-offset-2 break-words  "
        target={isInternalLink ? '_self' : '_blank'}
        rel="noopener noreferrer"
        href={href}
        {...rest}
      >
        {rest.children}
        <span className=" text-xs align-middle">&#8599;</span>
      </Link>
    </Tooltip>
  )
}

export default CustomLink
