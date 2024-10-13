import { allBlogs } from 'contentlayer/generated'
import Link from 'next/link'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { formatDate } from '../../utils/time'

export default function RecentlyPosts() {
  const posts = allCoreContent(sortPosts(allBlogs)).slice(0, 3)

  return (
    <div className="flex min-h-60 cursor-pointer flex-col rounded-lg bg-neutral-200/80 dark:bg-neutral-600 dark:text-neutral-100">
      <span className="ml-3 mt-2">📄 最近博文</span>
      <div className="prose m-3 flex min-w-fit flex-col justify-between gap-3 rounded-md px-3 prose-p:my-0">
        {posts.map((post) => {
          return (
            <Link
              className="rounded-lg bg-neutral-400 py-3 pl-3 font-bold no-underline shadow transition-shadow hover:shadow-xl dark:bg-neutral-200 dark:text-neutral-700"
              key={post.slug}
              href={'/' + post.path}
            >
              {post.title}
              <p className="text-sm font-normal text-neutral-500 dark:text-neutral-500">
                {formatDate(post.date)}
              </p>
            </Link>
          )
        })}
      </div>
      <Link className="mb-2 ml-auto mr-4 mt-auto" href={'/blog'}>
        查看更多 &rarr;
      </Link>
    </div>
  )
}
