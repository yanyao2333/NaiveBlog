import { genPageMetadata } from '@/app/seo'
import PageTitle from '@/components/PageTitle'
import Tag from '@/components/Tag'
import tagData from '@/temp/tag-data.json'
import Link from 'next/link'

export const metadata = genPageMetadata({
  title: 'Tags',
  description: 'Things I blog about',
})

export default async function Page() {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])
  return (
    <div
      className={`flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center md:space-x-6`}
    >
      <PageTitle
        title='Tags'
        subtitle='只是些无用的标签罢了'
      />
      <div className='mx-auto flex flex-wrap justify-center pt-3 md:max-w-[calc(100%-10rem)] lg:max-w-[calc(100%-20rem)]'>
        {tagKeys.length === 0 && '你还没有标签'}
        {sortedTags.map((t) => {
          return (
            <div
              key={t}
              className='mt-2 mr-5 mb-2'
            >
              <Tag text={t} />
              <Link
                href={`/tags/${t}`}
                className='-ml-2 font-semibold text-gray-600 text-sm uppercase dark:text-gray-300'
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
