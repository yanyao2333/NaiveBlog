import Link from '@/components/Link'
import Tag from '@/components/Tag'
import { genPageMetadata } from 'app/seo'
import tagData from 'app/tag-data.json'
import { slug } from 'github-slugger'

export const metadata = genPageMetadata({ title: 'Tags', description: 'Things I blog about' })

export default async function Page() {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])
  return (
    <div
      className={`flex min-w-full flex-col items-center justify-center divide-y divide-gray-200 dark:divide-gray-700 md:mt-24 md:space-x-6`}
    >
      <div className="space-x-2 space-y-3 pb-5 pt-6 text-center">
        <h1 className=" text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:px-6 md:text-6xl md:leading-14">
          Tags
        </h1>
        <p className="leading-7 text-gray-500 dark:text-gray-400 sm:text-lg">
          只是些无用的标签罢了
        </p>
      </div>
      <div className="mx-auto flex min-w-full flex-wrap justify-center pt-3 md:max-w-[calc(100%-10rem)]">
        {tagKeys.length === 0 && 'No tags found.'}
        {sortedTags.map((t) => {
          return (
            <div key={t} className="mb-2 mr-5 mt-2">
              <Tag text={t} />
              <Link
                href={`/tags/${slug(t)}`}
                className="-ml-2 text-sm font-semibold uppercase text-gray-600 dark:text-gray-300"
                aria-label={`View posts tagged ${t}`}
              >
                {` (${tagCounts[t]})`}
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
