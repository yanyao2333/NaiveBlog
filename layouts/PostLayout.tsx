import Image from '@/components/Image'
import PageTitle from '@/components/PageTitle'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import '@/css/markdown.css'
import categoryMapping from '@/data/category-mapping'
import siteMetadata from '@/data/siteMetadata'
import type { Authors, Blog } from 'contentlayer/generated'
import { slug as _slug } from 'github-slugger'
import { default as Link, default as NextLink } from 'next/link'
import { Comments as CommentsComponent } from 'pliny/comments'
import { CoreContent } from 'pliny/utils/contentlayer'
import { ReactNode } from 'react'

const editUrl = (path: string) =>
  `${siteMetadata.siteContentRepo}/blob/main/blog-posts/${path.replace('blog/', '')}`

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
}

function generateCategoryTree(categories: string[]) {
  const tree: { name: string; displayName: string; url: string }[] = []
  let nowPath = ''
  for (const category of categories) {
    nowPath += `/${category}`
    tree.push({
      name: category,
      displayName: categoryMapping[category].show || category,
      url: `/categories${nowPath}`,
    })
  }
  return tree
}

// function TreeNodeComponent({
//   node,
//   pathname,
// }: {
//   node: { name: string; displayName: string; url: string }[]
//   pathname: string
// }) {
//   return (
//     <li className="pt-2 ">
//       <div
//         className={clsx(
//           'pl-3 border-gray-300 flex items-center justify-between cursor-pointer text-gray-600 dark:text-neutral-100 hover:text-primary-500',
//           !(node.name === 'blog') && 'border-l-2'
//         )}
//         aria-label={`in category: ${node.displayName}`}
//         role="button"
//         tabIndex={0}
//         onKeyDown={(e) => {
//           if (e.key === 'Enter') toggleExpand()
//         }}
//       >
//         <div className={'inline-block text-sm font-medium text-gray-800 dark:text-gray-200'}>
//           {node.showName}
//         </div>
//         <span className="ml-2">
//           {Object.keys(node.children).length > 0 && (
//             <div
//               className="transform transition-transform duration-200"
//               style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
//             >
//               <ChevronRight className="h-5 w-5" />
//             </div>
//           )}
//         </span>
//       </div>

//       {isExpanded && (
//         <ul className="pl-6">
//           {node..map((child) => (
//             <TreeNodeComponent key={child.name} node={child} pathname={pathname} />
//           ))}
//         </ul>
//       )}
//     </li>
//   )
// }

// function CategoryTreeView({ root, pathname }: { root: TreeNode; pathname: string }) {
//   return (
//     <ul className="w-full pt-2">
//       <TreeNodeComponent node={root} pathname={pathname} />
//     </ul>
//   )
// }

export default function PostLayout({ content, authorDetails, next, prev, children }: LayoutProps) {
  const { filePath, path, slug, date, title, tags } = content
  const basePath = path.split('/')[0]
  const paths = path.split('/')
  // 去掉最后一个元素，因为它是文章名
  paths.pop()
  const categories = generateCategoryTree(paths)

  return (
    <>
      <ScrollTopAndComment />
      <article>
        <div className="lg:divide-y mx-auto xl:divide-gray-200 xl:dark:divide-gray-700">
          <header className="pt-6 lg:pb-6">
            <div className="space-y-1 text-center">
              <dl className="space-y-10">
                <div>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                    <time dateTime={date}>
                      {/*用这种奇怪的方式hack一下，2040年我的博客还会存在吗？*/}
                      {new Date(date).getFullYear() === 2040
                        ? '置顶博文'
                        : new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
                    </time>
                  </dd>
                </div>
              </dl>
              <div>
                <PageTitle title={title} />
                <div className="mt-3 flex justify-center text-[12px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-[18px]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  预计阅读时长：
                  {Math.ceil(content.readingTime.minutes)}
                  分钟
                </div>
              </div>
            </div>
          </header>
          <div className="grid-rows-[auto_1fr] divide-y divide-gray-200 pb-8 dark:divide-gray-700 lg:grid lg:grid-cols-4 lg:gap-x-6 lg:divide-y-0">
            <dl className="pb-10 pt-6 lg:border-b lg:border-gray-200 lg:pt-11 lg:dark:border-gray-700">
              <dt className="sr-only">Authors</dt>
              <dd>
                <ul className="flex flex-wrap justify-center gap-4 sm:space-x-12 lg:block lg:space-x-0 lg:space-y-8">
                  {authorDetails.map((author) => (
                    <li className="flex items-center space-x-2" key={author.name}>
                      {author.avatar && (
                        <Image
                          src={author.avatar}
                          width={38}
                          height={38}
                          alt="avatar"
                          className="h-10 w-10 rounded-full"
                        />
                      )}
                      <dl className="whitespace-nowrap text-sm font-medium leading-5">
                        <dt className="sr-only">Name</dt>
                        <dd className="text-gray-900 dark:text-gray-100">{author.name}</dd>
                        {/*<dt className="sr-only">Twitter</dt>*/}
                        {/*<dd>*/}
                        {/*  {author.twitter && (*/}
                        {/*    <Link*/}
                        {/*      href={author.twitter}*/}
                        {/*      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"*/}
                        {/*    >*/}
                        {/*      {author.twitter*/}
                        {/*        .replace('https://twitter.com/', '@')*/}
                        {/*        .replace('https://x.com/', '@')}*/}
                        {/*    </Link>*/}
                        {/*  )}*/}
                        {/*</dd>*/}
                      </dl>
                    </li>
                  ))}
                </ul>
              </dd>
            </dl>
            <div className="divide-y divide-gray-200 dark:divide-gray-700 lg:col-span-3 lg:row-span-2 lg:pb-0">
              <div className="prose mx-auto pb-8 pt-10 dark:prose-invert">{children}</div>
              <div className="pb-6 pt-6 text-center text-sm text-gray-700 dark:text-gray-300">
                {/*<Link href={discussUrl(path)} rel="nofollow">*/}
                {/*  Discuss on Twitter*/}
                {/*</Link>*/}
                {/*{` • `}*/}
                <NextLink href={editUrl(filePath)}>View on GitHub (If you have access)</NextLink>
              </div>
              {siteMetadata.comments && (
                <div
                  className="pb-6 pt-6 text-center text-gray-700 dark:text-gray-300"
                  id="comment"
                >
                  <CommentsComponent commentsConfig={siteMetadata.comments} slug={slug} />
                </div>
              )}
            </div>
            <footer>
              <div className="divide-gray-200 text-sm font-medium leading-5 dark:divide-gray-700 lg:col-start-1 lg:row-start-2 lg:divide-y">
                <div className="py-4 lg:py-8 lg:divide-y">
                  <div>
                    <h2 className="text-sm pb-2 uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      当前分类
                    </h2>
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        href={category.url}
                        className="mr-3 text-sm font-medium uppercase text-gray-800 hover:text-light-highlight-text dark:hover:text-primary-400 dark:text-neutral-100"
                      >
                        {category.displayName}
                      </Link>
                    ))}
                    {/* <div className="flex-col ml-1 pb-8">
                      {(() => {
                        let nowIndex = 0
                        return categories.map((category) => {
                          const { name, displayName, url } = category
                          nowIndex += 1
                          return (
                            <div
                              key={name}
                              style={{
                                marginLeft: `${nowIndex == 1 ? 0 : (nowIndex - 1) * 10}px`,
                              }}
                              className="flex content-center gap-2"
                            >
                              &gt;
                              <NextLink
                                href={url}
                                className="mr-3 text-sm font-medium uppercase text-gray-800 hover:text-light-highlight-text dark:hover:text-primary-400 dark:text-neutral-100"
                              >
                                {displayName}
                              </NextLink>
                            </div>
                          )
                        })
                      })()}
                    </div> */}
                  </div>
                  {tags && (
                    <div className="lg:pt-8">
                      <h2 className="text-sm pb-2 uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        标签
                      </h2>
                      <div className="flex flex-wrap">
                        {tags.map((tag) => (
                          <NextLink
                            href={`/tags/${_slug(tag)}`}
                            key={tag}
                            className="mr-4 mt-2 text-sm font-medium uppercase text-gray-800 hover:text-light-highlight-text dark:hover:text-primary-400 dark:text-neutral-100"
                          >
                            {tag.split(' ').join('-')}
                          </NextLink>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {(next || prev) && (
                  <div className="flex justify-between py-4 lg:block lg:space-y-8 lg:py-8">
                    {prev && prev.path && (
                      <div>
                        <h2 className="text-sm pb-2 uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          上一篇
                        </h2>
                        <div className="text-gray-800 hover:text-light-highlight-text dark:hover:text-primary-400 dark:text-neutral-100">
                          <NextLink href={`/${prev.path}`}>{prev.title}</NextLink>
                        </div>
                      </div>
                    )}
                    {next && next.path && (
                      <div>
                        <h2 className="text-sm pb-2 uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          下一篇
                        </h2>
                        <div className="text-gray-800 hover:text-light-highlight-text dark:hover:text-primary-400 dark:text-neutral-100">
                          <NextLink href={`/${next.path}`}>{next.title}</NextLink>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="pt-4 lg:pt-8">
                <NextLink
                  href={`/${basePath}`}
                  className="text-gray-800 hover:text-light-highlight-text dark:hover:text-primary-400 dark:text-neutral-100"
                  aria-label="回到列表页"
                >
                  &larr; 回到列表页
                </NextLink>
              </div>
            </footer>
          </div>
        </div>
      </article>
    </>
  )
}
