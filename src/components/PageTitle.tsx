import { ReactNode } from 'react'
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
    <div className={twMerge(className, 'space-x-2 space-y-3 pb-5 pt-6 text-center')}>
      <h1
        className={twMerge(
          className,
          'break-words text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-neutral-100 sm:text-4xl sm:leading-10 md:px-6 md:text-6xl md:leading-14'
        )}
      >
        {title}
      </h1>
      {subtitle ? (
        <p
          className={twMerge(
            className,
            'break-words leading-7 text-gray-500 dark:text-neutral-300 sm:text-lg'
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}

export default PageTitle
