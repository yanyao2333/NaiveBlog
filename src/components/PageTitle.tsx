import type { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

const PageTitle = ({
	title,
	subtitle,
	className,
}: {
	title: string
	subtitle?: string | ReactNode
	className?: string
}) => {
	return (
		<div
			className={twMerge(
				className,
				'space-x-2 space-y-3 pt-6 pb-5 text-center',
			)}
		>
			<h1
				className={twMerge(
					className,
					'break-words font-extrabold text-3xl text-slate-12 leading-9 tracking-tight sm:text-4xl sm:leading-10 md:px-6 md:text-6xl md:leading-14 dark:text-slatedark-12',
				)}
			>
				{title}
			</h1>
			{subtitle ? (
				<div
					className={twMerge(
						className,
						'break-words text-slate-11 leading-7 sm:text-lg dark:text-slatedark-11',
					)}
				>
					{subtitle}
				</div>
			) : null}
		</div>
	)
}

export default PageTitle
