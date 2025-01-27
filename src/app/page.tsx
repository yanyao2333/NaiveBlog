import MyStatus from '@/components/MyStatus'
import PageTitle from '@/components/PageTitle'
import YiYan from '@/components/YiYan'
import RecentlyMemos from '@/components/homeComponents/RecentlyMemos'
import RecentlyPosts from '@/components/homeComponents/RecentlyPosts'
import { Github } from '@/components/svgs/social-icons/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import siteMetadata from '@/data/siteMetadata'
import clsx from 'clsx'
import { Mail, Rss } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

function SocialButtonTooltip({
  text,
  children,
}: { text: string; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent
        side='bottom'
        className='TooltipContent mt-2 bg-slate-3 text-slate-12 ring-1 ring-slate-7 dark:bg-slatedark-3 dark:text-slatedark-12 dark:ring-slatedark-7'
      >
        {text}
      </TooltipContent>
    </Tooltip>
  )
}

export default function Home() {
  return (
    <>
      {/* 在 100vh 的基础上减小 4.8rem，让下方箭头显示出来，并留出一部分空白*/}
      <div className='flex min-h-[calc(100vh-4.8rem)] flex-col'>
        <div className='my-auto flex flex-col items-center justify-between gap-12 lg:flex-row lg:gap-0'>
          <div className='title-animate-fade-in flex flex-col'>
            <PageTitle
              title={siteMetadata.title}
              subtitle={
                siteMetadata.description ? siteMetadata.description : <YiYan />
              }
              className={''}
            />
            <div className='mb-3 flex justify-center space-x-4'>
              <SocialButtonTooltip text='Email'>
                <Link href={`mailto:${siteMetadata.email}`}>
                  <Mail className='size-6' />
                </Link>
              </SocialButtonTooltip>
              <SocialButtonTooltip text='Github'>
                <Link href={siteMetadata.github}>
                  <Github className='size-6' />
                </Link>
              </SocialButtonTooltip>
              <SocialButtonTooltip text='RSS'>
                <Link href='/feed.xml'>
                  <Rss className='size-6' />
                </Link>
              </SocialButtonTooltip>
            </div>
          </div>
          <div className='relative rounded-full'>
            <Image
              src={
                'https://cdn.jsdelivr.net/gh/yanyao2333/NaiveBlog@main/public/static/images/logo.png'
              }
              alt='Website logo'
              height={640}
              width={640}
              priority
              className='size-60 rounded-full ring-2 ring-slate-7 md:size-72 dark:ring-slatedark-7'
            />
            <MyStatus />
          </div>
        </div>
        <div className='mt-auto mb-2 animate-bounce text-center text-lg'>
          &darr;
        </div>
      </div>

      <div
        className={clsx(
          'mx-auto mt-24 grid grid-cols-1 space-y-24 px-4',
          'sm:px-6',
          'lg:grid-cols-2 lg:gap-x-24 lg:space-y-0',
        )}
      >
        <RecentlyMemos />
        <RecentlyPosts />
      </div>
    </>
  )
}
