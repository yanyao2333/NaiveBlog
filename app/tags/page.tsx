import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
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
    <div className={`flex flex-col items-center justify-center md:space-x-6`}>
      <PageTitle title="Tags" subtitle="只是些无用的标签罢了" />
      <div className="mx-auto flex flex-wrap justify-center pt-3 md:max-w-[calc(100%-10rem)] lg:max-w-[calc(100%-20rem)]">
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
