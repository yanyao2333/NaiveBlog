'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function SettingsPanel() {
	const [isOpen, setIsOpen] = useState(false)
	const { theme, setTheme } = useTheme()
	const [mounted, setMounted] = useState(false)

	const togglePanel = () => {
		setIsOpen(!isOpen)
	}

	// 好奇怪，但这样做确实就不会出问题
	useEffect(() => {
		setMounted(true)
	}, [])

	function genButtonClassName(_theme: string) {
		switch (_theme === theme) {
			case true:
				return 'text-sm font-light bg-primary-500/50 dark:bg-primary-500/50 select-none'
			case false:
				return 'text-sm font-light select-none'
		}
	}

	if (!mounted) {
		return null
	}

	function onClickThemeBtn(_theme: string) {
		setTheme(_theme)
	}

	return (
		<div>
			{/* 设置面板 */}
			<div
				className={`fixed top-[calc(66.666667%-20px)] right-0 flex h-50 w-64 transform flex-col bg-slate-3 transition-transform duration-300 dark:bg-slatedark-3 ${
					isOpen ? 'translate-x-0' : 'translate-x-full'
				}`}
			>
				<div className='h-10 min-w-full select-none content-center pl-3 font-bold text-lg ease-in-out'>
					设置
				</div>
				<div className='border-slate-7 border-t-2 bg-slate-3 dark:border-slatedark-7 dark:bg-slatedark-3'>
					<div className='mx-7 my-5 grid min-h-7 max-w-full grid-cols-3 overflow-hidden rounded-full border-1 border-slate-7 text-center shadow-sm'>
						<button
							onClick={() => onClickThemeBtn('light')}
							disabled={theme === 'light'}
							className={genButtonClassName('light')}
						>
							Light
						</button>
						<button
							onClick={() => onClickThemeBtn('system')}
							disabled={theme === 'system'}
							className={genButtonClassName('system')}
						>
							System
						</button>
						<button
							onClick={() => onClickThemeBtn('dark')}
							disabled={theme === 'dark'}
							className={genButtonClassName('dark')}
						>
							Dark
						</button>
					</div>
				</div>
			</div>

			{/* 打开面板按钮 */}
			<button
				onClick={togglePanel}
				className={`-translate-y-1/2 fixed top-2/3 transform rounded-l-full bg-slate-3 p-2 transition-all duration-300 ease-in-out dark:bg-slatedark-3 ${
					isOpen ? 'right-64' : 'right-0'
				}`}
				aria-label='open settings panel'
			>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 24 24'
					fill='currentColor'
					className='size-6'
				>
					<path
						fillRule='evenodd'
						d='M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z'
						clipRule='evenodd'
					/>
				</svg>
			</button>
		</div>
	)
}
