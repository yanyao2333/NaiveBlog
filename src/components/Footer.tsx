import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import siteMetadata from '@/data/siteMetadata'

export default function Footer() {
	const commitHash = process.env.NEXT_PUBLIC_COMMIT_HASH?.slice(0, 6)

	return (
		<footer>
			<div className='mt-16 mb-8 flex select-none flex-col items-center'>
				<span className='mb-2 text-gray-500 text-sm dark:text-neutral-400'>
					{'Ciallo ～(∠・ω< )⌒★!'}
				</span>
				<div className='mb-2 flex space-x-2 text-gray-500 text-sm dark:text-neutral-400'>
					<div>{siteMetadata.author}</div>
					<div>{' • '}</div>
					<div>{`© ${new Date().getFullYear()}`}</div>
					<div>{' • '}</div>
					<div>{siteMetadata.title}</div>
				</div>
				{/*<div className="mb-2 flex space-x-2 text-sm text-gray-500 dark:text-gray-400">*/}
				{/*  <Link href="https://github.com/timlrx/tailwind-nextjs-starter-blog">*/}
				{/*    Based on ♥️ Tailwind Next.js Theme*/}
				{/*  </Link>*/}
				{/*</div>*/}
				<div className='text-gray-500 text-sm dark:text-neutral-400'>
					<Tooltip>
						<TooltipTrigger>
							构建时间：{new Date().toUTCString()}
						</TooltipTrigger>
						<TooltipContent className='TooltipContent mt-2 bg-slate-3 text-slate-12 ring-1 ring-slate-7 dark:bg-slatedark-3 dark:text-slatedark-12 dark:ring-slatedark-7'>
							{`最近一次提交 hash: ${commitHash}`}
						</TooltipContent>
					</Tooltip>
				</div>
			</div>
		</footer>
	)
}
