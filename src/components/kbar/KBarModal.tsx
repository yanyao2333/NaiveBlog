/* from pliny/search/kbar */
// noinspection TypeScriptMissingConfigOption
import {
	type Action,
	KBarAnimator,
	KBarPortal,
	KBarPositioner,
	KBarResults,
	KBarSearch,
	useMatches,
	useRegisterActions,
} from 'kbar'

export const KBarModal = ({
	actions,
	isLoading,
}: {
	actions: Action[]
	isLoading: boolean
}) => {
	useRegisterActions(actions, [actions])

	return (
		<KBarPortal>
			<KBarPositioner className='bg-gray-300/50 p-4 backdrop-blur-sm backdrop-filter dark:bg-black/50'>
				<KBarAnimator className='w-full max-w-xl'>
					<div className='overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-900'>
						<div className='flex items-center space-x-4 p-4'>
							<span className='block w-5'>
								<svg
									className='text-gray-400 dark:text-gray-300'
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
									/>
								</svg>
							</span>
							<KBarSearch className='h-8 w-full bg-transparent text-gray-600 placeholder-gray-400 focus:outline-hidden dark:text-gray-200 dark:placeholder-gray-500' />
							<kbd className='inline-block whitespace-nowrap rounded-sm border border-gray-400 px-1.5 align-middle font-medium text-gray-400 text-xs leading-4 tracking-wide'>
								ESC
							</kbd>
						</div>
						{!isLoading && <RenderResults />}
						{isLoading && (
							<div className='block border-gray-100 border-t px-4 py-8 text-center text-gray-400 dark:border-gray-800 dark:text-gray-600'>
								Loading...
							</div>
						)}
					</div>
				</KBarAnimator>
			</KBarPositioner>
		</KBarPortal>
	)
}

const RenderResults = () => {
	const { results } = useMatches()

	if (results.length) {
		return (
			<KBarResults
				items={results}
				onRender={({ item, active }) => (
					<div>
						{typeof item === 'string' ? (
							<div className='pt-3'>
								<div className='block border-gray-100 border-t px-4 pt-6 pb-2 font-semibold text-primary-600 text-xs uppercase dark:border-gray-800'>
									{item}
								</div>
							</div>
						) : (
							<div
								className={`flex cursor-pointer justify-between px-4 py-2 ${
									active
										? 'bg-primary-600 text-gray-100'
										: 'bg-transparent text-gray-700 dark:text-gray-100'
								}`}
							>
								<div className={'flex space-x-2'}>
									{item.icon && (
										<div className={'self-center'}>{item.icon}</div>
									)}
									<div className='block'>
										{item.subtitle && (
											<div
												className={`${active ? 'text-gray-200' : 'text-gray-400'} text-xs`}
											>
												{item.subtitle}
											</div>
										)}
										<div>{item.name}</div>
									</div>
								</div>
								{item.shortcut?.length ? (
									<div
										aria-hidden
										className='flex flex-row items-center justify-center gap-x-2'
									>
										{item.shortcut.map((sc) => (
											<kbd
												key={sc}
												className={`flex h-7 w-6 items-center justify-center rounded border font-medium text-xs ${
													active
														? 'border-gray-200 text-gray-200'
														: 'border-gray-400 text-gray-400'
												}`}
											>
												{sc}
											</kbd>
										))}
									</div>
								) : null}
							</div>
						)}
					</div>
				)}
			/>
		)
	}
	return (
		<div className='block border-gray-100 border-t px-4 py-8 text-center text-gray-400 dark:border-gray-800 dark:text-gray-600'>
			No results for your search...
		</div>
	)
}
