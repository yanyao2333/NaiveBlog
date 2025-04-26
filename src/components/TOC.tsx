'use client'
import { useEffect, useRef, useState } from 'react'
import type { Toc, TocItem } from '@/mdx-plugins/toc'

export interface TOCInlineProps {
  toc?: Toc
  fromHeading?: number
  toHeading?: number
  asDisclosure?: boolean
  exclude?: string | string[]
  collapse?: boolean
}

export interface NestedTocItem extends TocItem {
  children?: NestedTocItem[]
}

export const createNestedList = (items: TocItem[]): NestedTocItem[] => {
  const nestedList: NestedTocItem[] = []
  const stack: NestedTocItem[] = []

  for (const item of items) {
    const newItem: NestedTocItem = { ...item, children: [] }

    while (stack.length > 0 && stack[stack.length - 1].depth >= newItem.depth) {
      stack.pop()
    }

    const parent = stack.length > 0 ? stack[stack.length - 1] : null

    if (parent) {
      parent.children = parent.children || []
      parent.children.push(newItem)
    } else {
      nestedList.push(newItem)
    }

    stack.push(newItem)
  }

  return nestedList
}

/**
 * Generates an inline table of contents
 * Exclude titles matching this string (new RegExp('^(' + string + ')$', 'i')).
 * If an array is passed the array gets joined with a pipe (new RegExp('^(' + array.join('|') + ')$', 'i')).
 *
 * `asDisclosure` will wrap the TOC in a `details` element with a `summary` element.
 * `collapse` will collapse the TOC when `AsDisclosure` is true.
 *
 * If you are using tailwind css and want to revert to the default HTML list style, set `ulClassName="[&_ul]:list-[revert]"`
 * @param {TOCInlineProps} {
 *   toc,
 *   fromHeading = 1,
 *   toHeading = 6,
 *   asDisclosure = false,
 *   exclude = '',
 *   collapse = false,
 *   ulClassName = '',
 *   liClassName = '',
 * }
 *
 */
const TOCInline = ({
  toc,
  fromHeading = 1,
  toHeading = 6,
  asDisclosure = false,
  exclude = '',
  collapse = false,
}: TOCInlineProps) => {
  if (!toc) {
    return null
  }
  const re = Array.isArray(exclude)
    ? new RegExp(`^(${exclude.join('|')})$`, 'i')
    : new RegExp(`^(${exclude})$`, 'i')

  const filteredToc = toc.filter((heading) => {
    const isExcluded = re.test(heading.value)
    const isWithinRange =
      heading.depth >= fromHeading && heading.depth <= toHeading

    if (isExcluded) {
      return false
    }

    return isWithinRange
  })

  const [activeId, setActiveId] = useState<string | null>(null)
  const observer = useRef<IntersectionObserver | null>(null)
  const lastIntersectingId = useRef<string | null>(null)
  const clickedId = useRef<string | null>(null)

  useEffect(() => {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')

    observer.current = new IntersectionObserver(
      (entries) => {
        const intersectingHeadings: { id: string; ratio: number }[] = []
        for (const entry of entries) {
          if (entry.isIntersecting) {
            intersectingHeadings.push({
              id: entry.target.id,
              ratio: entry.intersectionRatio,
            })
          }
        }

        if (intersectingHeadings.length > 0) {
          intersectingHeadings.sort((a, b) => b.ratio - a.ratio)
          lastIntersectingId.current = intersectingHeadings[0].id
          if (!clickedId.current) setActiveId(lastIntersectingId.current)
        }
      },
      {
        rootMargin: '-80px 0px 0px 0px',
        threshold: 0.9,
      },
    )

    for (const heading of headings) {
      observer.current?.observe(heading)
    }

    return () => {
      observer.current?.disconnect()
    }
  }, [])

  const handleItemClick = (id: string) => {
    clickedId.current = id
    setActiveId(id)
    window.location.hash = `#${id}`

    const targetElement = document.getElementById(id)
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
      })
    }
    setTimeout(() => {
      clickedId.current = null
    }, 500)
  }

  const createList = (items: NestedTocItem[] | undefined) => {
    if (!items || items.length === 0) {
      return null
    }

    return (
      <ul className={''}>
        {items.map((item, index) => (
          <li key={`${item.value}_${index}`}>
            <a
              className={`underline-offset-2 ${
                activeId === item.url.slice(1)
                  ? 'font-semibold text-blue-11 dark:text-skydark-11'
                  : 'text-slate-11 hover:text-blue-11 dark:text-slatedark-11 dark:hover:text-skydark-11'
              }`}
              href={item.url}
              onClick={(e) => {
                e.preventDefault() // Prevent default anchor behavior
                handleItemClick(item.url.slice(1))
              }}
            >
              {item.value}
            </a>
            {createList(item.children)}
          </li>
        ))}
      </ul>
    )
  }

  const nestedList = createNestedList(filteredToc)

  return (
    <>
      {asDisclosure ? (
        <details
          open={!collapse}
          className='h-min'
        >
          <summary className='ml-6 pt-2 pb-2 font-bold text-xl'>目录</summary>
          <div className='ml-6'>{createList(nestedList)}</div>
        </details>
      ) : (
        createList(nestedList)
      )}
    </>
  )
}

export default TOCInline
