import ScrollTopAndComment from '@/components/ArticlePageButtonGroup'
import Image from '@/components/Image'
import PageTitle from '@/components/PageTitle'
import TOCInline from '@/components/TOC'
import '@/css/markdown.css'
import categoryMapping from '@/data/category-mapping'
import siteMetadata from '@/data/siteMetadata'
import type { Toc } from '@/mdx-plugins/toc'
import { cn } from '@/utils/classname'
import type { Authors, Blog } from 'contentlayer/generated'
import { slug as _slug } from 'github-slugger'
import { default as Link, default as NextLink } from 'next/link'
import { Comments as CommentsComponent } from 'pliny/comments'
import type { CoreContent } from 'pliny/utils/contentlayer'
import type { ReactNode } from 'react'

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
  hideTOC?: boolean
}

function generateCategoryTree(categories: string[]) {
  const tree: { name: string; displayName: string; url: string }[] = []
  let nowPath = ''
  for (const category of categories) {
    nowPath += `/${category}`
    tree.push({
      name: category,
      displayName: categoryMapping[category]
        ? categoryMapping[category].show
        : category,
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

export default function PostLayout({
  content,
  authorDetails,
  next,
  prev,
  children,
  hideTOC,
}: LayoutProps) {
  const { filePath, path, slug, date, title, tags, pinned } = content
  const basePath = path.split('/')[0]
  const paths = path.split('/')
  // 去掉最后一个元素，因为它是文章名
  paths.pop()
  const categories = generateCategoryTree(paths)

  return (
    <>
      <ScrollTopAndComment toc={content.toc as unknown as Toc} />
      <article>
        <div className='mx-auto lg:divide-y lg:divide-slate-5 lg:dark:divide-slatedark-5'>
          <header className='pt-6 lg:pb-6'>
            <div className='space-y-1 text-center'>
              <dl className='space-y-10'>
                <div>
                  <dt className='sr-only'>Published on</dt>
                  <dd className='font-medium text-base text-slate-11 leading-6 dark:text-slatedark-11'>
                    <time dateTime={date}>
                      {new Date(date).toLocaleDateString(
                        siteMetadata.locale,
                        postDateTemplate,
                      )}
                      {pinned ? '  (置顶博文)' : ''}
                    </time>
                  </dd>
                </div>
              </dl>
              <div>
                <PageTitle title={title} />
                <div className='mt-3 flex justify-center text-[12px]'>
                  <svg
                    role='img'
                    aria-label='clock'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-[18px]'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                    />
                  </svg>
                  预计阅读时长：
                  {Math.ceil(content.readingTime.minutes)}
                  分钟
                </div>
              </div>
            </div>
          </header>
          <div className='grid-rows-[auto_1fr] divide-y divide-slate-5 pb-8 lg:grid lg:grid-cols-4 lg:gap-x-6 lg:divide-y-0 dark:divide-slatedark-5'>
            <dl className='pt-6 pb-10 lg:border-slate-5 lg:border-b lg:pt-11 lg:dark:border-slatedark-5'>
              <dt className='sr-only'>Authors</dt>
              <dd>
                <ul className='flex flex-wrap justify-center gap-4 sm:space-x-12 lg:block lg:space-x-0 lg:space-y-8'>
                  {authorDetails.map((author) => (
                    <li
                      className='flex items-center space-x-2'
                      key={author.name}
                    >
                      {author.avatar && (
                        <Image
                          src={author.avatar}
                          width={38}
                          height={38}
                          alt='avatar'
                          className='h-10 w-10 rounded-full'
                        />
                      )}
                      <dl className='whitespace-nowrap font-medium text-sm leading-5'>
                        <dt className='sr-only'>Name</dt>
                        <dd className='text-slate-12 dark:text-slatedark-12'>
                          {author.name}
                        </dd>
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
            <div className='divide-y divide-slate-5 lg:col-span-2 lg:row-span-2 lg:pb-0 dark:divide-slatedark-5'>
              <div className='prose prose-slate dark:prose-invert mx-auto pt-10 pb-8'>
                {children}
              </div>
              <div className='pt-6 pb-6 text-center text-slate-11 text-sm dark:text-slatedark-11'>
                {/*<Link href={discussUrl(path)} rel="nofollow">*/}
                {/*  Discuss on Twitter*/}
                {/*</Link>*/}
                {/*{` • `}*/}
                <NextLink href={editUrl(filePath)}>
                  View on GitHub (If you have access)
                </NextLink>
              </div>
              {siteMetadata.comments && (
                <div
                  className='pt-6 pb-6 text-center text-slate-11 dark:text-slatedark-11'
                  id='comment'
                >
                  <CommentsComponent
                    commentsConfig={siteMetadata.comments}
                    slug={slug}
                  />
                </div>
              )}
            </div>
            <footer className='lg:col-start-1 lg:row-start-2 lg:divide-y'>
              <div className='divide-slate-5 font-medium text-sm leading-5 lg:divide-y dark:divide-slatedark-5'>
                <div className='divide-slate-5 py-4 lg:divide-y lg:py-8 dark:divide-slatedark-5'>
                  <div className='mb-8'>
                    <h2 className='pb-2 text-slate-11 text-sm uppercase tracking-wide dark:text-slatedark-11'>
                      当前分类
                    </h2>
                    {categories.map((category, index) => (
                      <>
                        <span
                          key={`${category.name}_span`}
                          className={cn(index !== 0 && 'mr-3')}
                        >
                          {index !== 0 && '>'}
                        </span>
                        <Link
                          key={`${category.name}_link`}
                          href={category.url}
                          className='mr-3 font-medium text-slate-12 text-sm uppercase hover:text-blue-11 dark:text-slatedark-12 dark:hover:text-skydark-11'
                        >
                          {category.displayName}
                        </Link>
                      </>
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
                                className="mr-3 text-sm font-medium uppercase text-gray-800 hover:text-blue-11 dark:hover:text-primary-400 dark:text-neutral-100"
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
                    <div className='lg:pt-8'>
                      <h2 className='pb-2 text-slate-11 text-sm uppercase tracking-wide dark:text-slatedark-11'>
                        标签
                      </h2>
                      <div className='flex flex-wrap'>
                        {tags.map((tag) => (
                          <NextLink
                            href={`/tags/${_slug(tag)}`}
                            key={tag}
                            className='mt-2 mr-4 font-medium text-slate-12 text-sm uppercase hover:text-blue-11 dark:text-slatedark-12 dark:hover:text-skydark-11'
                          >
                            {tag.split(' ').join('-')}
                          </NextLink>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {(next || prev) && (
                  <div className='flex justify-between py-4 lg:block lg:space-y-8 lg:py-8'>
                    {prev?.path && (
                      <div>
                        <h2 className='pb-2 text-slate-11 text-sm uppercase tracking-wide dark:text-slatedark-11'>
                          上一篇
                        </h2>
                        <div className='text-slate-12 hover:text-blue-11 dark:text-slatedark-12 dark:hover:text-skydark-11'>
                          <NextLink href={`/${prev.path}`}>
                            {prev.title}
                          </NextLink>
                        </div>
                      </div>
                    )}
                    {next?.path && (
                      <div>
                        <h2 className='pb-2 text-slate-11 text-sm uppercase tracking-wide dark:text-slatedark-11'>
                          下一篇
                        </h2>
                        <div className='text-slate-12 hover:text-blue-11 dark:text-slatedark-12 dark:hover:text-skydark-11'>
                          <NextLink href={`/${next.path}`}>
                            {next.title}
                          </NextLink>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className='pt-4 lg:pt-8'>
                <NextLink
                  href={`/${basePath}`}
                  className='text-slate-12 hover:text-blue-11 dark:text-slatedark-12 dark:hover:text-skydark-11'
                  aria-label='回到列表页'
                >
                  &larr; 回到列表页
                </NextLink>
              </div>
            </footer>
            <div className='hidden lg:col-span-1 lg:row-span-2 lg:block lg:pb-0 '>
              <div className='prose dark:prose-invert sticky top-20 pt-10 text-sm'>
                <h2 className='not-prose ml-5 pb-2 text-lg text-slate-11 uppercase tracking-wide dark:text-slatedark-11'>
                  TOC
                </h2>
                {!hideTOC ? (
                  <TOCInline toc={content.toc as unknown as Toc} />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
