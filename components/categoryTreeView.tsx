'use client'
import { TreeNode } from '@/contentlayer.config'
import clsx from 'clsx'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

// 判断是否在某个 分类/标签 页面上
function isOnThisPage(url: string, category?: string, tag?: string) {
  if (url == '/blog' && category == 'blog') return true
  if (url.startsWith('/categories') && category) {
    const lastNode = url.slice(1, url.length).split('/').pop()
    return lastNode == category
  }
  if (url.startsWith('/tags') && tag) {
    return url.includes(tag)
  }
  return false
}

function TreeNodeComponent({
  node,
  pathname,
  expanded,
}: {
  node: TreeNode
  pathname: string
  expanded?: boolean
}) {
  const [isExpanded, setIsExpanded] = useState(expanded || node.name === 'blog' ? true : false)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <li className="pt-2 ">
      <div
        className={clsx(
          'pl-3 border-gray-300 flex items-center justify-between cursor-pointer text-gray-600 dark:text-neutral-100',
          !(node.name === 'blog') && 'border-l-2'
        )}
        aria-label={`View posts in category ${node.showName}`}
      >
        <Link
          href={node.fullPath === 'blog' ? '/blog' : `/categories/${node.fullPath}`}
          className={
            'inline-block text-sm font-medium ' +
            (isOnThisPage(pathname, node.name)
              ? 'text-light-highlight-text'
              : 'text-gray-800 dark:text-gray-200 hover:text-light-highlight-text')
          }
        >
          {node.showName}
        </Link>
        <button onClick={toggleExpand} className="ml-2">
          {Object.keys(node.children).length > 0 && (
            <div
              className="transform transition-transform duration-200 hover:text-light-highlight-text"
              style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
            >
              <ChevronRight className="h-5 w-5" />
            </div>
          )}
        </button>
      </div>

      {isExpanded && (
        <ul className="pl-6">
          {Object.values(node.children).map((child) => (
            <TreeNodeComponent
              key={child.name}
              node={child}
              pathname={pathname}
              expanded={expanded}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

function CategoryTreeView({
  root,
  pathname,
  expanded,
}: {
  root: TreeNode
  pathname: string
  expanded?: boolean
}) {
  return (
    <ul className="w-full pt-2">
      <TreeNodeComponent node={root} pathname={pathname} expanded={expanded} />
    </ul>
  )
}

export default CategoryTreeView
