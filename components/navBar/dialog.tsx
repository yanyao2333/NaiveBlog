'use client'
import categoryData from '@/temp/category-data.json'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import CategoryTreeView from '../categoryTreeView'

function CategoryDialog({ isOpen, setIsOpen }) {
  return (
    <Dialog
      open={isOpen}
      as="div"
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
            <DialogTitle as="h3" className="text-base/7 font-medium text-gray-800">
              想去哪？
            </DialogTitle>
            <div className="mt-4">
              <CategoryTreeView root={categoryData} pathname={usePathname()} expanded />
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

export default function DialogDemo() {
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
        📦 分类
      </button>
      <CategoryDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  )
}
