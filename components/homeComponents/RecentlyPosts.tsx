import { allBlogs } from 'contentlayer/generated'
import Link from 'next/link'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { formatDate } from '../../utils/time'

export default function RecentlyPosts() {
  const posts = allCoreContent(sortPosts(allBlogs)).slice(0, 3)

  return (
    <div className="flex min-h-60 cursor-pointer flex-col rounded-lg bg-zinc-200/80 shadow-lg dark:bg-gray-500">
      <span className="ml-3 mt-2">📄 最近博文</span>
      <div className="prose m-3 flex min-w-fit flex-col gap-3 rounded-md px-3 prose-p:my-0">
        {posts.map((post) => {
          return (
            <Link
              className="rounded-lg bg-white py-3 pl-3 no-underline shadow transition-shadow hover:shadow-xl dark:bg-gray-200"
              key={post.slug}
              href={'/' + post.path}
            >
              {post.title}
              <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(post.date)}</p>
            </Link>
          )
        })}
      </div>
      <button className="mb-2 ml-auto mr-4">查看更多 &rarr;</button>
    </div>
  )
}
