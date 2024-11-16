import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import categoryData from '@/temp/category-data.json'
import { cn } from '@/utils/classname'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import useMediaQuery from 'src/hooks/useMediaQuery'
import CategoryTreeView from '../categoryTreeView'

function CategoryDialogModal({ isOpen, setIsOpen }) {
  return (
    <Dialog
      open={isOpen}
      as="div"
      key={'categoryDialog'}
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
              <CategoryTreeView
                root={categoryData}
                pathname={usePathname()}
                closeFunction={() => setIsOpen(false)}
                expanded
              />
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

function CategoryDialog() {
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
      <CategoryDialogModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  )
}

function CategoryDrawer() {
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
        📦 分类
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>想去哪？</DrawerTitle>
          {/* <DrawerDescription></DrawerDescription> */}
        </DrawerHeader>
        <div className="p-4">
          <CategoryTreeView
            root={categoryData}
            pathname={usePathname()}
            closeFunction={() => setIsOpen(false)}
            expanded
          />
        </div>
        <DrawerFooter>
          <DrawerClose></DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default function CategoryShower() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  return isMobile ? <CategoryDrawer /> : <CategoryDialog />
}
