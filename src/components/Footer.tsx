import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import siteMetadata from '@/data/siteMetadata'

export default function Footer() {
  const commitHash = process.env.NEXT_PUBLIC_COMMIT_HASH?.slice(0, 6)

  return (
    <footer>
      <div className="mb-8 mt-16 flex select-none flex-col items-center">
        <span className="mb-2 text-sm text-gray-500 dark:text-neutral-400">
          {'Ciallo ～(∠・ω< )⌒★!'}
        </span>
        <div className="mb-2 flex space-x-2 text-sm text-gray-500 dark:text-neutral-400">
          <div>{siteMetadata.author}</div>
          <div>{` • `}</div>
          <div>{`© ${new Date().getFullYear()}`}</div>
          <div>{` • `}</div>
          <div>{siteMetadata.title}</div>
        </div>
        {/*<div className="mb-2 flex space-x-2 text-sm text-gray-500 dark:text-gray-400">*/}
        {/*  <Link href="https://github.com/timlrx/tailwind-nextjs-starter-blog">*/}
        {/*    Based on ♥️ Tailwind Next.js Theme*/}
        {/*  </Link>*/}
        {/*</div>*/}
        <div className="text-sm text-gray-500 dark:text-neutral-400">
          <Tooltip>
            <TooltipTrigger>构建时间：{new Date().toUTCString()}</TooltipTrigger>
            <TooltipContent className="TooltipContent dark:bg-neutral-600 dark:text-neutral-100 dark:ring-neutral-500 bg-gray-100 text-gray-800 ring-gray-200">
              {`最近一次提交 hash: ${commitHash}`}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </footer>
  )
}
