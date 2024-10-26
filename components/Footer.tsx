import Tooltip from '@/components/Tooltip'
import siteMetadata from '@/data/siteMetadata'
import * as child_process from 'node:child_process'
import Link from './Link'

export default function Footer() {
  const commitHash = child_process.execSync('git rev-parse HEAD').toString().trim().slice(0, 6)

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
          <Tooltip text={`最近一次提交 hash: ${commitHash}`} className={'left-0'}>
            构建时间：{new Date().toUTCString()}
          </Tooltip>
        </div>
      </div>
    </footer>
  )
}
