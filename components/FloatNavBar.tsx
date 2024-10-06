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
      return 'block font-medium text-primary-500 dark:text-primary-400'
    }
    if (nowPath == '/' && link.href == '/') {
      return 'block font-medium text-primary-500 dark:text-primary-400'
    }
    return 'block font-medium hover:text-primary-500 text-gray-500 dark:text-gray-400 dark:hover:text-primary-400'
  }

  function genLogoLinkClassName(link: { href: string; title: string }) {
    if (nowPath.startsWith(link.href) && link.href != '/') {
      return 'mr-6 h-6 w-6 text-primary-500 dark:text-primary-400'
    }
    if (nowPath == '/' && link.href == '/') {
      return 'mr-6 h-6 w-6 text-primary-500 dark:text-primary-400'
    }
    return 'mr-6 h-6 w-6 text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400'
  }
  return (
    <div className="sticky top-10 z-[100] mx-auto flex max-w-fit items-center justify-center rounded-full bg-neutral-50/90 px-5 py-3 leading-5 shadow-md backdrop-blur-sm dark:bg-gray-700/90 md:space-x-4">
      <div className="no-scrollbar hidden items-center space-x-4 overflow-x-auto md:flex md:space-x-6">
        {headerNavLinks.map((link) => (
          <Link key={link.title} href={link.href} className={genTextLinkClassName(link)}>
            {link.title}
          </Link>
        ))}
      </div>
      <div className="no-scrollbar flex justify-between overflow-x-auto md:hidden">
        {headerNavLinks.map((link) => (
          <Link key={link.title} href={link.href} className={genLogoLinkClassName(link)}>
            {link.logo}
          </Link>
        ))}
      </div>
      <SearchButton />
      {/*<ThemeSwitch />*/}
    </div>
  )
}

export default FloatNavBar
