'use client'

import { TableOfContents } from 'lucide-react'
import TOCInline, { type TOCInlineProps } from './TOC'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer'

interface TOCDrawerProps extends TOCInlineProps {}

export const TOCDrawer = ({ toc, ...props }: TOCDrawerProps) => {
  //FIXME: 需要增加一个功能：当文章为私密或有密码时不显示 TOC
  return (
    <Drawer>
      <DrawerTrigger className='rounded-full bg-gray-200 p-2 text-gray-500 transition-all hover:bg-gray-300 lg:hidden dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'>
        <TableOfContents className='size-5' />
      </DrawerTrigger>
      <DrawerContent aria-describedby='toc'>
        <DrawerHeader>
          <DrawerTitle>目录</DrawerTitle>
        </DrawerHeader>
        <div className='prose dark:prose-invert prose-li:my-1 prose-ul:my-1 overflow-y-auto px-4 prose-li:text-sm prose-ul:text-sm'>
          <TOCInline
            toc={toc}
            {...props}
          />
        </div>
        <DrawerFooter>
          <DrawerClose />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
