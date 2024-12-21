/** From https://github.com/timlrx/pliny */
import type { Toc, TocItem } from '@/mdx-plugins/toc'

export interface TOCInlineProps {
  toc: Toc
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

  items.forEach((item) => {
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
  })

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
  const re = Array.isArray(exclude)
    ? new RegExp('^(' + exclude.join('|') + ')$', 'i')
    : new RegExp('^(' + exclude + ')$', 'i')

  const filteredToc = toc.filter((heading) => {
    const isExcluded = re.test(heading.value)
    const isWithinRange =
      heading.depth >= fromHeading && heading.depth <= toHeading

    if (isExcluded) {
      // 如果父标题被排除，则排除所有子标题
      return false
    }

    return isWithinRange
  })

  const createList = (items: NestedTocItem[] | undefined) => {
    if (!items || items.length === 0) {
      return null
    }

    return (
      <ul className={''}>
        {items.map((item, index) => (
          <li key={index}>
            <a
              className=' underline-offset-2'
              href={item.url}
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
        <details open={!collapse}>
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
