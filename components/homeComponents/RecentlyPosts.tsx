import { allBlogs } from 'contentlayer/generated'
import Link from 'next/link'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { formatDate } from '../../utils/time'

export default function RecentlyPosts() {
  const posts = allCoreContent(sortPosts(allBlogs)).slice(0, 3)

  return (
    <div className="flex min-h-60 cursor-pointer flex-col justify-between rounded-lg bg-gray-200 dark:bg-neutral-600 dark:text-neutral-100">
      <span className="ml-3 mt-2">📄 最近博文</span>
      <div className="prose m-3 flex min-w-fit flex-col justify-between gap-3 rounded-md px-3 prose-p:my-0">
        {posts.map((post) => {
          return (
            <Link
              className="text- rounded-lg bg-gray-50 py-3 pl-3 text-black no-underline shadow transition-shadow hover:text-black hover:shadow-xl dark:bg-neutral-200 dark:text-neutral-800 dark:shadow-neutral-500/90"
              key={post.slug}
              href={'/' + post.path}
            >
              {post.title}
              <p className="text-sm font-normal text-gray-500 dark:text-neutral-600/90">
                {formatDate(post.date)}
              </p>
            </Link>
          )
        })}
      </div>
      <Link className="mb-2 ml-auto mr-4" href={'/blog'}>
        查看更多 &rarr;
      </Link>
    </div>
  )
}
