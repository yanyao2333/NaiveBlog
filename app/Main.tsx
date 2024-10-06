import PageTitle from '@/components/PageTitle'
import YiYan from '@/components/YiYan'
import siteMetadata from '@/data/siteMetadata'
import { Blog } from 'contentlayer/generated'
import { CoreContent } from 'pliny/utils/contentlayer'

export default function Home({ posts }: { posts: CoreContent<Blog>[] }) {
  return (
    <div className="flex min-h-[calc(100dvh-5rem)] flex-col justify-between">
      <div />
      <div className="flex items-center justify-between">
        <PageTitle
          title="Roitiumの自留地"
          subtitle={siteMetadata.description ? siteMetadata.description : <YiYan />}
          className={''}
        />
        <img
          src="https://secure.gravatar.com/avatar/67fdf38eaecc051ad06a276b8583b051?s=640"
          alt="Website logo"
          className="h-52 w-52 rounded-full transition-transform duration-700 ease-in-out hover:rotate-180"
        />
      </div>
      <div className="mb-2 animate-bounce text-center text-lg">&darr;</div>
    </div>
  )
}
