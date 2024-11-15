import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function SectionContainer({ children }: Props) {
  return (
    <section className="container mx-auto mt-auto flex flex-col px-6 lg:max-w-5xl">
      {children}
    </section>
  )
}
