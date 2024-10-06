'use client'
import {
  AboutMeIcon,
  CategoriesIcon,
  HomeIcon,
  MemoriesIcon,
  PostsIcon,
  ProjectsIcon,
  TagsIcon,
} from '@/components/svgs/navBarIcons'
import { usePathname } from 'next/navigation'
import Link from './Link'
import SearchButton from './SearchButton'

const headerNavLinks = [
  { href: '/', title: 'Home', logo: <HomeIcon /> },
  { href: '/blog', title: 'Posts', logo: <PostsIcon /> },
  { href: '/memory', title: 'Memories', logo: <MemoriesIcon /> },
  { href: '/tags', title: 'Tags', logo: <TagsIcon /> },
  {
    href: '/categories',
    title: 'Categories',
    logo: <CategoriesIcon />,
  },
  { href: '/projects', title: 'Projects', logo: <ProjectsIcon /> },
  { href: '/about', title: 'About', logo: <AboutMeIcon /> },
]

const FloatNavBar = () => {
  const nowPath = usePathname()
  function genTextLinkClassName(link: { href: string; title: string }) {
    if (nowPath.startsWith(link.href) && link.href != '/') {
      return 'block font-medium text-primary-500 dark:text-primary-400 py-3 border-b border-b-primary-500 dark:border-b-primary-400'
    }
    if (nowPath == '/' && link.href == '/') {
      return 'block font-medium text-primary-500 dark:text-primary-400 py-3 border-b border-b-primary-500 dark:border-b-primary-400'
    }
    return 'block font-medium hover:text-primary-500 text-gray-500 dark:text-gray-400 dark:hover:text-primary-400 py-3'
  }

  function genLogoLinkClassName(link: { href: string; title: string }) {
    if (nowPath.startsWith(link.href) && link.href != '/') {
      return 'text-primary-500 dark:text-primary-400 py-2 border-b border-b-primary-500 dark:border-b-primary-400'
    }
    if (nowPath == '/' && link.href == '/') {
      return 'text-primary-500 dark:text-primary-400 py-2 border-b border-b-primary-500 dark:border-b-primary-400'
    }
    return 'text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400 py-2'
  }

  return (
    <div className="fixed inset-x-0 top-10 z-[100] mx-auto flex max-w-fit items-center justify-center rounded-full bg-neutral-50/90 px-5 leading-5 shadow-md backdrop-blur-sm dark:bg-gray-700/90 md:space-x-4">
      <div className="no-scrollbar hidden items-center space-x-4 overflow-x-auto md:flex md:space-x-6">
        {headerNavLinks.map((link) => (
          <Link key={link.title} href={link.href} className={genTextLinkClassName(link)}>
            {link.title}
          </Link>
        ))}
        <SearchButton />
      </div>
      <div className="no-scrollbar flex justify-between gap-[18px] overflow-x-auto sm:gap-6 md:hidden">
        {headerNavLinks.map((link) => (
          <Link key={link.title} href={link.href} className={genLogoLinkClassName(link)}>
            {link.logo}
          </Link>
        ))}
        {/*<SearchButton />*/}
      </div>
      {/*<ThemeSwitch />*/}
    </div>
  )
}

export default FloatNavBar
