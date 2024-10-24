import RecentlyMemos from '@/components/homeComponents/RecentlyMemos'
import RecentlyPosts from '@/components/homeComponents/RecentlyPosts'
import PageTitle from '@/components/PageTitle'
import SocialIcon from '@/components/svgs/social-icons'
import Tooltip from '@/components/Tooltip'
import YiYan from '@/components/YiYan'
import siteMetadata from '@/data/siteMetadata'
import Image from 'next/image'
import avatar from '../public/static/images/logo.png'

export default function Home() {
  return (
    <>
      <div className="flex min-h-[calc(100vh-4.8rem)] flex-col">
        <div className="my-auto flex flex-col items-center justify-between gap-12 md:flex-row md:gap-0">
          <div className="title-animate-fade-in flex flex-col">
            <PageTitle
              title="Roitiumの自留地"
              subtitle={siteMetadata.description ? siteMetadata.description : <YiYan />}
              className={''}
            />
            <div className="mb-3 flex justify-center space-x-4">
              <Tooltip text="Mail">
                <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={6} />
              </Tooltip>
              <Tooltip text="Github">
                <SocialIcon kind="github" href={siteMetadata.github} size={6} />
              </Tooltip>
              <Tooltip text="RSS">
                <SocialIcon kind="rss" href={siteMetadata.siteUrl + '/feed.xml'} size={6} />
              </Tooltip>
            </div>
          </div>
          <Image
            src={avatar}
            alt="Website logo"
            placeholder={'blur'}
            priority
            className="size-60 rounded-full transition-transform duration-700 ease-in-out hover:rotate-180 md:size-72"
          />
        </div>
        <div className="mb-2 mt-auto animate-bounce text-center text-lg">&darr;</div>
      </div>

      <div className="mx-auto mt-10 max-w-3xl space-y-24 px-4 sm:px-6">
        <RecentlyMemos />
        <RecentlyPosts />
      </div>
    </>
  )
}
