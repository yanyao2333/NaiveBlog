import PageTitle from '@/components/PageTitle'
import Link from 'next/link'
import React from 'react'
import { TreeNode } from '../../../contentlayer.config'
import categoryData from '../../../temp/category-data.json'
import { genPageMetadata } from '../../seo'

export const metadata = genPageMetadata({
  title: 'Categories',
  description: 'Browse posts by category',
})

function TreeNodeComponent({ node }: { node: TreeNode }) {
  return (
    <>
      {node.name && (
        <li className="text-center">
          <Link
            href={`/blog/categories/${node.fullPath}`}
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
      <ul className="list-inside list-disc pl-8 pt-4">
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
      <div className="flex flex-col items-center justify-center md:space-x-6">
        <PageTitle title="Categories" subtitle="分类整理方便查找？我没感受到。" />
        <ul className="mx-auto min-w-full list-inside list-disc pt-3">
          <TreeNodeComponent node={categoryData} />
        </ul>
      </div>
    </>
  )
}
