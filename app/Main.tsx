import RecentlyMemos from '@/components/homeComponents/RecentlyMemos'
import RecentlyMusic from '@/components/homeComponents/RecentlyMusic'
import PageTitle from '@/components/PageTitle'
import YiYan from '@/components/YiYan'
import siteMetadata from '@/data/siteMetadata'
import { Blog } from 'contentlayer/generated'
import { CoreContent } from 'pliny/utils/contentlayer'

export default function Home({ posts }: { posts: CoreContent<Blog>[] }) {
  return (
    <>
      <div className="flex min-h-[calc(100vh-5rem)] flex-col">
        <div className="my-auto flex flex-col items-center justify-between gap-12 md:flex-row md:gap-0">
          <PageTitle
            title="Roitiumの自留地"
            subtitle={siteMetadata.description ? siteMetadata.description : <YiYan />}
            className={''}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://secure.gravatar.com/avatar/67fdf38eaecc051ad06a276b8583b051?s=640"
            alt="Website logo"
            className="size-52 rounded-full transition-transform duration-700 ease-in-out hover:rotate-180"
          />
        </div>
        <div className="mb-2 mt-auto animate-bounce text-center text-lg">&darr;</div>
      </div>
      {/*<div className="prose mx-auto mt-10 text-center text-xl font-medium">*/}
      {/*  这里啥也没有，去别处转转？*/}
      {/*  <br />*/}
      {/*  （其实是不知道写什么啦，想放点小组件，但放什么好呢？）*/}
      {/*</div>*/}
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <RecentlyMemos />
        <RecentlyMusic />
      </div>
    </>
  )
}
