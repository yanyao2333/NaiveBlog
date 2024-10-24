import { allBlogs } from 'contentlayer/generated'
import Link from 'next/link'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { formatDate } from '../../utils/time'
import { TimelineSection } from '../TimelineSection'

export default function RecentlyPosts() {
  const posts = allCoreContent(sortPosts(allBlogs)).slice(0, 3)

  return (
    <TimelineSection title="📄 最近博文">
      {posts.map((post) => (
        <div key={post.slug} className="relative pl-8">
          <div className="absolute left-0 top-2 h-4 w-4 rounded-full border-2 border-primary-300/80 bg-white dark:border-primary-400/60 dark:bg-neutral-800"></div>
          <Link href={'/' + post.path}>
            <div className="rounded-lg bg-gray-50 p-4 shadow-sm transition-all hover:shadow-md dark:bg-neutral-700/50">
              <div className="text-neutral-900 dark:text-neutral-100">{post.title}</div>
              <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">
                {formatDate(post.date)}
              </p>
            </div>
          </Link>
        </div>
      ))}
      <Link
        href="/blog"
        className="ml-8 mt-4 inline-block text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
      >
        查看更多 →
      </Link>
    </TimelineSection>
  )
}
