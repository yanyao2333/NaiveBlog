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
          'break-words text-3xl font-extrabold leading-9 tracking-tight text-slate-12 dark:text-slatedark-12 sm:text-4xl sm:leading-10 md:px-6 md:text-6xl md:leading-14'
        )}
      >
        {title}
      </h1>
      {subtitle ? (
        <p
          className={twMerge(
            className,
            'break-words leading-7 text-slate-11 dark:text-slatedark-11 sm:text-lg'
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}

export default PageTitle
