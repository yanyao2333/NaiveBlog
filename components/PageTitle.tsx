import { ReactNode } from 'react'

const PageTitle = ({ title, subtitle }: { title: string; subtitle?: string | ReactNode }) => {
  return (
    <div className="space-x-2 space-y-3 pb-5 pt-6 text-center">
      <h1 className=" text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:px-6 md:text-6xl md:leading-14">
        {title}
      </h1>
      {subtitle ? (
        <p className="leading-7 text-gray-500 dark:text-gray-400 sm:text-lg">{subtitle}</p>
      ) : null}
    </div>
  )
}

export default PageTitle
