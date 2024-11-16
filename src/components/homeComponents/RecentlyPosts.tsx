import { formatDate } from '@/utils/time'
import { allBlogs } from 'contentlayer/generated'
import Link from 'next/link'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'

export default function RecentlyPosts() {
  const coreContents = allCoreContent(sortPosts(allBlogs))
  const posts = coreContents.slice(0, 5)
  if (posts.length != 0 && new Date(posts[0].date).getFullYear() >= 2040) {
    posts.shift()
    if (coreContents[6]) posts.push(coreContents[6])
  }

  return (
    // <div className={'flex max-h-60 flex-col space-y-4'}>
    //   <TimelineSection title="📄 最近博文">
    //     {posts.map((post) => (
    // <div key={post.slug} className="relative pl-8">
    //   <div className="absolute left-0 top-2 h-4 w-4 rounded-full border-2 border-primary-300/80 bg-white dark:border-primary-400/60 dark:bg-neutral-800"></div>
    //   <Link
    //     href={'/' + post.path}
    //     className="flex flex-row justify-between pt-1 dark:bg-neutral-700/50"
    //   >
    //     <div className="truncate text-base text-neutral-900 dark:text-neutral-100">
    //       {post.title}
    //     </div>
    //     <div className="shrink-0 pl-2 text-xs font-light text-gray-500 dark:text-neutral-400">
    //       {formatDate(post.date)}
    //     </div>
    //   </Link>
    // </div>
    //     ))}
    //   </TimelineSection>
    //   <Link
    //     href="/blog"
    //     className="ml-8 inline-block self-end text-sm text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
    //   >
    //     查看更多 &rarr;
    //   </Link>
    // </div>
    <div className="relative flex flex-col">
      <h2 className="mb-4 text-lg font-medium">📄 最近文章</h2>
      <div className="no-scrollbar relative h-[17.5rem] list-none overflow-scroll">
        <ol className="relative ml-4 border-s-[2px] border-blue-7 dark:border-skydark-7">
          <li className="h-2"></li>
          {posts.map((post) => (
            <li key={post.slug} className="mb-5 ms-6">
              <div className="absolute -start-[7px] mt-2 flex h-3 w-3 items-center justify-center rounded-full border-2 border-blue-7 bg-slate-2 dark:border-skydark-7 dark:bg-slatedark-2"></div>
              <Link href={'/' + post.path} className="flex flex-row justify-between pt-1 ">
                <div className="truncate text-base text-slate-12 dark:text-slatedark-12">
                  {post.title}
                </div>
                <div className="shrink-0 pl-4 text-xs font-light text-slate-11 dark:text-slatedark-11">
                  {formatDate(post.date)}
                </div>
              </Link>
            </li>
          ))}
          <li className="ms-6 flex min-w-max justify-between">
            <div></div>
            <Link
              href="/memory"
              className="mt-2 min-w-max text-sm text-slate-11 dark:text-slatedark-11"
            >
              查看更多 &rarr;
            </Link>
          </li>
        </ol>
      </div>
    </div>
  )
}
