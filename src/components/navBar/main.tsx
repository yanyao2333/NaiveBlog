'use client'
import {
  AboutMeIcon,
  HomeIcon,
  MemoriesIcon,
  PostsIcon,
  ProjectsIcon,
} from '@/components/svgs/navBarIcons'
import { CloseButton, Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactElement, ReactNode } from 'react'
import SearchButton from '../SearchButton'
import CategoryShower from './categoryShower'
import TagShower from './tagShower'

interface HeaderNavLink {
  href: string
  title: string
  hrefComponent?: ReactElement // 用于自定义链接
  logo?: ReactNode
  children?: HeaderNavLink[]
}

interface HeaderNavLinkWithChildren extends Omit<HeaderNavLink, 'children'> {
  children: HeaderNavLink[]
}

const headerNavLinks: HeaderNavLink[] = [
  { href: '/', title: '🏠 主页', logo: <HomeIcon /> },
  {
    href: '/blog',
    title: '✍️ 文章',
    logo: <PostsIcon />,
    children: [
      { href: '/blog', title: '📄 所有' },
      { href: '/categories', title: '📦 分类' },
      { href: '/tags', title: '🏷 标签' },
    ],
  },
  { href: '/memory', title: '☁️ 回忆', logo: <MemoriesIcon /> },
  { href: '/projects', title: '🖥 项目', logo: <ProjectsIcon /> },
  { href: '/about', title: '❔ 关于', logo: <AboutMeIcon /> },
]

const headerNavLinksNewVersion: HeaderNavLink[] = [
  { href: '/', title: '🏠 主页', logo: '🏠' },
  {
    href: '/blog',
    title: '✍️ 文章',
    logo: '✍️',
    children: [
      { href: '/blog', title: '📄 所有' },
      // { href: '/categories', title: '📦 分类', hrefComponent: <CategoryShower /> },
      // { href: '/tags', title: '🏷 标签' },
    ],
  },
  { href: '/memory', title: '☁️ 回忆', logo: '☁️' },
  { href: '/projects', title: '🖥 项目', logo: '🖥' },
  { href: '/about', title: '❔ 关于', logo: '❔' },
]

// 判断当前路径是否与链接匹配
function isOnThisPage(link: HeaderNavLink, nowPath: string) {
  return (nowPath.startsWith(link.href) && link.href != '/') || (nowPath == '/' && link.href == '/')
}

// 按钮样式生成器
const buttonStyles = (selected: boolean) => ({
  text: clsx(
    'block font-medium py-3 cursor-pointer',
    'hover:text-blue-11 dark:hover:text-skydark-11',
    selected
      ? 'text-blue-11 dark:text-skydark-11 border-b border-b-blue-11 dark:border-b-skydark-11'
      : 'text-slate-12 dark:text-slatedark-12'
  ),
  icon: clsx(
    'py-2 cursor-pointer',
    'hover:text-blue-11 dark:hover:text-skydark-11',
    selected
      ? 'text-blue-11 dark:text-skydark-11 border-b border-b-blue-11 dark:border-b-skydark-11'
      : 'text-slate-12 dark:text-slatedark-12'
  ),
})

const generatePopoverButton = (child: HeaderNavLink) => {
  // if (child.hrefComponent) {
  //   return child.hrefComponent
  // }
  return (
    <CloseButton
      as={Link}
      key={child.title}
      className={clsx(
        'block px-8 py-2 text-center font-medium text-slate-12 transition',
        'md:hover:bg-slate-4/90 md:hover:text-blue-11',
        'dark:text-slatedark-12 dark:hover:bg-slatedark-4/90 dark:hover:text-skydark-11'
      )}
      href={child.href}
    >
      {child.title}
    </CloseButton>
  )
}

// 通用Popover生成器
const generatePopover = (link: HeaderNavLinkWithChildren, nowPath: string, iconMode: boolean) => (
  <Popover key={`${link.title}_popover`} className={clsx('my-auto')}>
    <PopoverButton
      key={`${link.title}_popover_btn`}
      role={'button'}
      className={buttonStyles(isOnThisPage(link, nowPath))[iconMode ? 'icon' : 'text']}
      as={'div'}
    >
      {iconMode ? link.logo : link.title}
    </PopoverButton>
    <PopoverPanel
      key={`${link.title}_popover_panel`}
      transition
      anchor={{ to: 'bottom', gap: 12 }}
      className={clsx(
        'rounded-xl bg-slate-2/90 text-sm shadow-md backdrop-blur-sm transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)]',
        'dark:bg-slatedark-2/90',
        'data-[closed]:-translate-y-1 data-[closed]:opacity-0'
      )}
    >
      {link.children.map((child) => generatePopoverButton(child))}
      <CategoryShower />
      <TagShower />
    </PopoverPanel>
  </Popover>
)

// 生成导航按钮
function singleNavButtonComponent(link: HeaderNavLink, iconMode: boolean, nowPath: string) {
  if (link.children) {
    return generatePopover(link as HeaderNavLinkWithChildren, nowPath, iconMode)
  }
  return (
    <Link
      key={link.title}
      href={link.href}
      className={buttonStyles(isOnThisPage(link, nowPath))[iconMode ? 'icon' : 'text']}
    >
      {iconMode ? link.logo : link.title}
    </Link>
  )
}

const FloatNavBar = () => {
  const nowPath = usePathname()

  return (
    <div
      className={clsx(
        `fixed inset-x-0 top-5 z-[100] mx-auto flex max-w-fit items-center justify-center
        rounded-full bg-slate-2/90 px-5 leading-5 shadow-md shadow-slate-9/50 ring-1 ring-slate-7/50 backdrop-blur-sm`,
        'dark:bg-slatedark-3/90 dark:shadow-slatedark-9/50 dark:ring-slatedark-7/50',
        'md:space-x-4'
      )}
    >
      <div
        className={clsx(
          'no-scrollbar hidden items-center space-x-4 overflow-x-auto',
          'md:flex md:space-x-8'
        )}
      >
        {headerNavLinksNewVersion.map((link) => singleNavButtonComponent(link, false, nowPath))}
        <SearchButton />
      </div>
      <div
        className={clsx(
          'no-scrollbar flex justify-between gap-[28px] overflow-x-auto',
          'sm:gap-6',
          'md:hidden'
        )}
      >
        {headerNavLinksNewVersion.map((link) => singleNavButtonComponent(link, true, nowPath))}
        <SearchButton />
      </div>
    </div>
  )
}

export default FloatNavBar
