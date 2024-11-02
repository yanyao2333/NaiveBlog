import { genPageMetadata } from '@/app/seo'
import CategoryTreeView from '@/components/categoryTreeView'
import PageTitle from '@/components/PageTitle'
import { TreeNode } from '@/contentlayer.config'
import categoryData from '@/temp/category-data.json'
import Link from 'next/link'

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
            href={node.fullPath == 'blog' ? '/blog' : `/categories/${node.fullPath}`}
            aria-label={`View posts in category ${node.showName}`}
            className="inline-block"
          >
            <div className="flex">
              <div className="mr-3 flex text-sm font-medium uppercase text-primary-500 hover:text-light-highlight-text dark:hover:text-primary-400">
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
    <div className="flex min-h-[calc(100dvh-5rem)] flex-col items-center justify-center md:space-x-6">
      <PageTitle title="Categories" subtitle="分类整理方便查找？我没感受到。" />
      <div className="min-w-60">
        <CategoryTreeView root={categoryData} pathname="" />
      </div>
    </div>
  )
}
