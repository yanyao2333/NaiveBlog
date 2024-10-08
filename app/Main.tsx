import RecentlyBangumi from '@/components/homeComponents/RecentlyBangumi'
import RecentlyMemos from '@/components/homeComponents/RecentlyMemos'
import RecentlyPosts from '@/components/homeComponents/RecentlyPosts'
import PageTitle from '@/components/PageTitle'
import SocialIcon from '@/components/svgs/social-icons'
import YiYan from '@/components/YiYan'
import siteMetadata from '@/data/siteMetadata'

export default function Home() {
  return (
    <>
      <div className="flex min-h-[calc(100vh-5rem)] flex-col">
        <div className="my-auto flex flex-col items-center justify-between gap-12 md:flex-row md:gap-0">
          <div className="flex flex-col">
            <PageTitle
              title="Roitiumの自留地"
              subtitle={siteMetadata.description ? siteMetadata.description : <YiYan />}
              className={''}
            />
            <div className="mb-3 flex justify-center space-x-4">
              <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={6} />
              <SocialIcon kind="github" href={siteMetadata.github} size={6} />
              <SocialIcon kind="rss" href={siteMetadata.siteUrl + '/feed.xml'} size={6} />
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://secure.gravatar.com/avatar/67fdf38eaecc051ad06a276b8583b051?s=640"
            alt="Website logo"
            className="size-52 rounded-full transition-transform duration-700 ease-in-out hover:rotate-180"
          />
        </div>
        <div className="mb-2 mt-auto animate-bounce text-center text-lg">&darr;</div>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <RecentlyMemos />
        <RecentlyPosts />
        {/*<RecentlyMusic />*/}
        <RecentlyBangumi />
      </div>
    </>
  )
}
