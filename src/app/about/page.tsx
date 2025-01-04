import { genPageMetadata } from '@/app/seo'
import Image from '@/components/Image'
import PageTitle from '@/components/PageTitle'
import SocialIcon from '@/components/svgs/social-icons'
// import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { MDXContent } from '@content-collections/mdx/react'
import { type Author, allAuthors } from 'content-collections'

export const metadata = genPageMetadata({ title: 'About' })

export default function Page() {
  const author = allAuthors.find((p) => p.slug === 'default') as Author
  const {
    name,
    avatar,
    occupation,
    company,
    email,
    twitter,
    linkedin,
    github,
  } = author

  return (
    <div>
      <PageTitle
        title='About'
        subtitle='我几把谁？你几把谁？ta几把谁？'
      />
      <div className='items-start space-y-2 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:space-y-0'>
        <div className='flex flex-col items-center space-x-2 pt-8'>
          {avatar && (
            <Image
              src={avatar}
              alt='avatar'
              width={192}
              height={192}
              priority
              className='h-48 w-48 rounded-full'
            />
          )}
          <h3 className='pt-4 pb-2 font-bold text-2xl leading-8 tracking-tight'>
            {name}
          </h3>
          <div className='text-gray-500 dark:text-gray-400'>{occupation}</div>
          <div className='text-gray-500 dark:text-gray-400'>{company}</div>
          <div className='flex space-x-3 pt-6'>
            <SocialIcon
              kind='mail'
              href={`mailto:${email}`}
            />
            <SocialIcon
              kind='github'
              href={github}
            />
            <SocialIcon
              kind='linkedin'
              href={linkedin}
            />
            <SocialIcon
              kind='x'
              href={twitter}
            />
          </div>
        </div>
        <article className='prose prose-slate dark:prose-invert max-w-none pt-8 pb-8 xl:col-span-2'>
          <MDXContent code={author.mdx} />
        </article>
      </div>
    </div>
  )
}
