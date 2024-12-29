'use client'

import { Drawer } from './ui/drawer'
import TOCInline, { TOCInlineProps } from './TOC'

interface TOCDrawerProps extends TOCInlineProps {}

export const TOCDrawer = ({ toc, ...props }: TOCDrawerProps) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button className="rounded-full bg-gray-200 p-2 text-gray-500 transition-all hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 lg:hidden">
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
            <path d="M8 10h8" />
            <path d="M8 14h8" />
            <path d="M8 18h8" />
          </svg>
        </button>
      </DrawerTrigger>
      <DrawerContent className="h-[90%]">
        <DrawerHeader>
          <DrawerTitle>目录</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto px-4">
          <TOCInline toc={toc} {...props} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
