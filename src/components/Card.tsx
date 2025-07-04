import Link from 'next/link'
import Image from './Image'

const Card = ({ title, description, imgSrc, href }) => (
	<div className='md max-w-[544px] p-4 md:w-1/2'>
		<div
			className={`${
				imgSrc && 'h-full'
			} overflow-hidden rounded-md border-2 border-gray-200 border-opacity-60 dark:border-gray-700`}
		>
			{imgSrc &&
				(href ? (
					<Link
						href={href}
						aria-label={`Link to ${title}`}
					>
						<Image
							alt={title}
							src={imgSrc}
							className='object-cover object-center md:h-36 lg:h-48'
							width={544}
							height={306}
						/>
					</Link>
				) : (
					<Image
						alt={title}
						src={imgSrc}
						className='object-cover object-center md:h-36 lg:h-48'
						width={544}
						height={306}
					/>
				))}
			<div className='p-6'>
				<h2 className='mb-3 font-bold text-2xl leading-8 tracking-tight'>
					{href ? (
						<Link
							href={href}
							aria-label={`Link to ${title}`}
						>
							{title}
						</Link>
					) : (
						title
					)}
				</h2>
				<p className='prose prose-slate mb-3 max-w-none text-gray-500 dark:text-gray-400'>
					{description}
				</p>
				{href && (
					<Link
						href={href}
						className='font-medium text-base text-primary-500 leading-6 hover:text-blue-11 dark:hover:text-primary-400'
						aria-label={`Link to ${title}`}
					>
						Learn more &rarr;
					</Link>
				)}
			</div>
		</div>
	</div>
)

export default Card
