import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import tagData from '@/temp/tag-data.json'
import useMediaQuery from '@/utils/hooks/useMediaQuery'
import { cn } from '@/utils/tailwind'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import clsx from 'clsx'
import Link from 'next/link'
import { useState } from 'react'
import Tag from '../Tag'

function TagsContent({ close }) {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])
  return (
    <div className="mx-auto flex flex-wrap justify-center pt-3 w-full">
      {tagKeys.length === 0 && '你还没有标签'}
      {sortedTags.map((t) => {
        return (
          <div
            key={t}
            onClick={close}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') close()
            }}
            className="mb-2 mr-5 mt-2"
          >
            <Tag text={t} />
            <Link
              href={`/tags/${t}`}
              className="-ml-2 text-sm font-semibold uppercase text-gray-600 dark:text-gray-300"
              aria-label={`View posts tagged ${t}`}
            >
              {` (${tagCounts[t]})`}
            </Link>
          </div>
        )
      })}
    </div>
  )
}

function TagDialogModal({ isOpen, setIsOpen }) {
  return (
    <Dialog
      open={isOpen}
      as="div"
      key={'tagDialog'}
      className="relative z-10 focus:outline-none"
      onClose={() => setIsOpen(false)}
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className={clsx(
              'w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl text-gray-800 duration-300 ease-out',
              'ring-1 ring-gray-200/90',
              'data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0'
            )}
          >
            <DialogTitle
              as="h3"
              className="text-base/7 font-medium text-gray-800 dark:text-gray-200"
            >
              想去哪？
            </DialogTitle>
            <div className="mt-4">
              <TagsContent close={() => setIsOpen(false)} />
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

function TagDialog() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <button
        className={clsx(
          'block px-8 py-2 text-center font-medium text-gray-800 transition',
          'md:hover:bg-primary-50/80 md:hover:text-light-highlight-text',
          'dark:text-neutral-100 dark:hover:bg-primary-50/20 dark:hover:text-primary-500'
        )}
        onClick={() => setIsOpen(true)}
      >
        🏷 标签
      </button>
      <TagDialogModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  )
}

function TagDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger
        className={cn(
          'block px-8 py-2 text-center font-medium text-gray-800 transition',
          'md:hover:bg-primary-50/80 md:hover:text-light-highlight-text',
          'dark:text-neutral-100 dark:hover:bg-primary-50/20 dark:hover:text-primary-500'
        )}
      >
        🏷 标签
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>想去哪？</DrawerTitle>
          {/* <DrawerDescription></DrawerDescription> */}
        </DrawerHeader>
        <div className="p-4">
          <TagsContent close={() => setIsOpen(false)} />
        </div>
        <DrawerFooter>
          <DrawerClose></DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default function TagShower() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  return isMobile ? <TagDrawer /> : <TagDialog />
}
