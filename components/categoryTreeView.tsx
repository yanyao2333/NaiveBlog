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

function TreeNodeComponent({ node, pathname }: { node: TreeNode; pathname: string }) {
  const [isExpanded, setIsExpanded] = useState(node.name === 'blog' ? true : false)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <li className="pt-2 ">
      <div
        className={clsx(
          'pl-3 border-gray-300 flex items-center justify-between cursor-pointer text-gray-600 dark:text-neutral-100 hover:text-light-hover-text',
          !(node.name === 'blog') && 'border-l-2'
        )}
        onClick={toggleExpand}
        aria-label={`View posts in category ${node.showName}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') toggleExpand()
        }}
      >
        <Link
          href={node.fullPath === 'blog' ? '/blog' : `/categories/${node.fullPath}`}
          className={
            'inline-block text-sm font-medium ' +
            (isOnThisPage(pathname, node.name)
              ? 'text-light-hover-text'
              : 'text-gray-800 dark:text-gray-200 hover:text-light-hover-text')
          }
        >
          {node.showName}
        </Link>
        <span className="ml-2">
          {Object.keys(node.children).length > 0 && (
            <div
              className="transform transition-transform duration-200 hover:text-light-hover-text"
              style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
            >
              <ChevronRight className="h-5 w-5" />
            </div>
          )}
        </span>
      </div>

      {isExpanded && (
        <ul className="pl-6">
          {Object.values(node.children).map((child) => (
            <TreeNodeComponent key={child.name} node={child} pathname={pathname} />
          ))}
        </ul>
      )}
    </li>
  )
}

function CategoryTreeView({ root, pathname }: { root: TreeNode; pathname: string }) {
  return (
    <ul className="w-full pt-2">
      <TreeNodeComponent node={root} pathname={pathname} />
    </ul>
  )
}

export default CategoryTreeView
