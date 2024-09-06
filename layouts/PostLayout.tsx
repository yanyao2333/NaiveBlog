import Image from '@/components/Image'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import SectionContainer from '@/components/SectionContainer'
import Tag from '@/components/Tag'
import categoryMapping from '@/data/category-mapping'
import siteMetadata from '@/data/siteMetadata'
import type { Authors, Blog } from 'contentlayer/generated'
import { Comments as CommentsComponent } from 'pliny/comments'
import { CoreContent } from 'pliny/utils/contentlayer'
import { ReactNode } from 'react'

const editUrl = (path) =>
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
  // 直接以列表形式储存，因为不存在其他分支（后续或许可以考虑展示整个分类文件夹结构，并高亮当前文章所属分类？）
  const tree: { name: string; displayName: string; url: string }[] = []
  let nowPath = ''
  for (const category of categories) {
    nowPath += `/${category}`
    tree.push({
      name: category,
      displayName: categoryMapping[category] || category,
      url: `/categories${nowPath}`,
    })
  }
  return tree
}

export default function PostLayout({ content, authorDetails, next, prev, children }: LayoutProps) {
  const { filePath, path, slug, date, title, tags } = content
  const basePath = path.split('/')[0]
  const paths = path.split('/')
  // 去掉最后一个元素，因为它是文章名
  paths.pop()
  const categories = generateCategoryTree(paths)

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
          <header className="pt-6 xl:pb-6">
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
                <PageTitle>{title}</PageTitle>
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
          <div className="grid-rows-[auto_1fr] divide-y divide-gray-200 pb-8 dark:divide-gray-700 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0">
            <dl className="pb-10 pt-6 xl:border-b xl:border-gray-200 xl:pt-11 xl:dark:border-gray-700">
              <dt className="sr-only">Authors</dt>
              <dd>
                <ul className="flex flex-wrap justify-center gap-4 sm:space-x-12 xl:block xl:space-x-0 xl:space-y-8">
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
            <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div className="prose max-w-none pb-8 pt-10 dark:prose-invert">{children}</div>
              <div className="pb-6 pt-6 text-center text-sm text-gray-700 dark:text-gray-300">
                {/*<Link href={discussUrl(path)} rel="nofollow">*/}
                {/*  Discuss on Twitter*/}
                {/*</Link>*/}
                {/*{` • `}*/}
                <Link href={editUrl(filePath)}>View on GitHub (If you have access)</Link>
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
              <div className="divide-gray-200 text-sm font-medium leading-5 dark:divide-gray-700 xl:col-start-1 xl:row-start-2 xl:divide-y">
                <div className="py-4 xl:py-8">
                  <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Categories
                  </h2>
                  <div className="flex-col flex-wrap">
                    {(() => {
                      let nowIndex = 0
                      return categories.map((category) => {
                        const { name, displayName, url } = category
                        nowIndex += 1
                        return (
                          <div
                            key={name}
                            className={`flex items-center gap-2 ml-[${nowIndex * 5}px]`}
                          >
                            &gt;
                            <Link
                              href={url}
                              className="mr-3 text-sm font-medium uppercase text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                            >
                              {displayName}
                            </Link>
                          </div>
                        )
                      })
                    })()}
                  </div>
                </div>
                {tags && (
                  <div className="py-4 xl:py-8">
                    <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Tags
                    </h2>
                    <div className="flex flex-wrap">
                      {tags.map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))}
                    </div>
                  </div>
                )}
                {(next || prev) && (
                  <div className="flex justify-between py-4 xl:block xl:space-y-8 xl:py-8">
                    {prev && prev.path && (
                      <div>
                        <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Previous Article
                        </h2>
                        <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                          <Link href={`/${prev.path}`}>{prev.title}</Link>
                        </div>
                      </div>
                    )}
                    {next && next.path && (
                      <div>
                        <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Next Article
                        </h2>
                        <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                          <Link href={`/${next.path}`}>{next.title}</Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="pt-4 xl:pt-8">
                <Link
                  href={`/${basePath}`}
                  className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  aria-label="Back to the blog"
                >
                  &larr; Back to the blog
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
