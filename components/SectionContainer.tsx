import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function SectionContainer({ children }: Props) {
  return (
    <section className="mx-auto flex min-h-dvh max-w-3xl flex-col px-4 pt-20 sm:px-6 xl:max-w-5xl xl:px-0">
      {children}
    </section>
  )
}
