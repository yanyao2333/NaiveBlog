import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function SectionContainer({ children }: Props) {
  return (
    <section className="mx-auto mt-auto flex max-w-3xl flex-col px-4 sm:px-6 lg:max-w-5xl">
      {children}
    </section>
  )
}
