import PageTitle from '@/components/PageTitle'
import YiYan from '@/components/YiYan'
import siteMetadata from '@/data/siteMetadata'
import { Blog } from 'contentlayer/generated'
import { CoreContent } from 'pliny/utils/contentlayer'

export default function Home({ posts }: { posts: CoreContent<Blog>[] }) {
  return (
    <>
      <div className="flex min-h-[calc(100dvh-5rem)] flex-col">
        <div className="my-auto flex flex-col items-center justify-between gap-12 md:flex-row md:gap-0">
          <PageTitle
            title="Roitiumの自留地"
            subtitle={siteMetadata.description ? siteMetadata.description : <YiYan />}
            className={''}
          />
          <img
            src="https://secure.gravatar.com/avatar/67fdf38eaecc051ad06a276b8583b051?s=640"
            alt="Website logo"
            className="size-52 rounded-full transition-transform duration-700 ease-in-out hover:rotate-180"
          />
        </div>
        <div className="mb-2 mt-auto animate-bounce text-center text-lg">&darr;</div>
      </div>
      <div className="prose mx-auto mt-10 text-center text-xl font-medium">
        这里啥也没有，去别处转转？
        <br />
        （其实是不知道写什么啦，想放点小组件，但放什么好呢？）
      </div>
      {/*<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">*/}
      {/*  <div className="col-span-2 flex flex-col rounded-lg bg-primary-200">*/}
      {/*    <span className="ml-3 mt-2">💡 最近想法</span>*/}
      {/*    <div className="prose m-3 flex min-w-fit flex-col rounded-sm bg-white">*/}
      {/*      <div></div>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*  <div className="col-span-1 rounded-lg bg-neutral-100 ">xxx</div>*/}
      {/*  <div className="col-span-1 rounded-lg bg-neutral-100 ">xxx</div>*/}
      {/*  <div className="col-span-2 rounded-lg bg-neutral-100 ">xxx</div>*/}
      {/*</div>*/}
    </>
  )
}
