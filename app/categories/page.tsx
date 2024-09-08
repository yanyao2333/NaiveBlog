import categoryData from 'app/category-data.json'
import Link from 'next/link'
import React from 'react'
import { TreeNode } from '../../contentlayer.config'
import { genPageMetadata } from '../seo'

export const metadata = genPageMetadata({
  title: 'Categories',
  description: 'Browse posts by category',
})

function TreeNodeComponent({ node }: { node: TreeNode }) {
  return (
    <>
      {node.name && (
        <li>
          <Link
            href={`/categories/${node.fullPath}`}
            aria-label={`View posts in category ${node.showName}`}
            className="inline-block"
          >
            <div className="flex">
              <div className="mr-3 flex text-sm font-medium uppercase text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                {node.showName}
              </div>
              <div className="text-sm font-semibold uppercase text-gray-600 dark:text-gray-300">
                {` (${node.count})`}
              </div>
            </div>
          </Link>
        </li>
      )}
      <ul className="list-disc pl-8 pt-4">
        {Object.values(node.children).map((child) => {
          return <TreeNodeComponent key={child.name} node={child} />
        })}
      </ul>
    </>
  )
}

export default async function CategoriesPage() {
  return (
    <>
      <div className="flex max-w-full flex-col items-center justify-center divide-gray-200 dark:divide-gray-700 md:mt-24 md:space-x-6 md:divide-y-0">
        <div className="space-x-2 border-b-2 pb-5 pt-6 md:space-y-5">
          <h1 className="text-center text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:px-6 md:text-6xl md:leading-14">
            Categories
          </h1>
        </div>
        <ul className="max-w-full list-disc pt-3">
          <TreeNodeComponent node={categoryData} />
        </ul>
      </div>
    </>
  )
}
