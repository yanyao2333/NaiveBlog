import { genPageMetadata } from '@/app/seo'
import PageTitle from '@/components/PageTitle'
import CategoryTreeView from '@/components/categoryTreeView'
import categoryData from '@/temp/category-data.json'
import type { TreeNode } from 'contentlayer.config'
import Link from 'next/link'

export const metadata = genPageMetadata({
  title: 'Categories',
  description: 'Browse posts by category',
})

function TreeNodeComponent({ node }: { node: TreeNode }) {
  return (
    <>
      {node.name && (
        <li className='text-center'>
          <Link
            href={
              node.fullPath == 'blog' ? '/blog' : `/categories/${node.fullPath}`
            }
            aria-label={`View posts in category ${node.showName}`}
            className='inline-block'
          >
            <div className='flex'>
              <div className='mr-3 flex font-medium text-primary-500 text-sm uppercase hover:text-blue-11 dark:hover:text-primary-400'>
                {node.showName}
              </div>
              <div className='font-semibold text-gray-600 text-sm uppercase dark:text-gray-300'>
                {` (${node.count})`}
              </div>
            </div>
          </Link>
        </li>
      )}
      <ul className='list-inside list-disc pt-4 pl-8'>
        {Object.values(node.children).map((child) => {
          return (
            <TreeNodeComponent
              key={child.name}
              node={child}
            />
          )
        })}
      </ul>
    </>
  )
}

export default async function CategoriesPage() {
  return (
    <div className='flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center md:space-x-6'>
      <PageTitle
        title='Categories'
        subtitle='分类整理方便查找？我没感受到。'
      />
      <div className='min-w-60'>
        <CategoryTreeView
          root={categoryData}
          pathname=''
        />
      </div>
    </div>
  )
}
