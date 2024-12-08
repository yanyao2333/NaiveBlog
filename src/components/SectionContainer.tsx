import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function SectionContainer({ children }: Props) {
  return (
    <section className="container mx-auto mt-auto w-full flex flex-col px-6 lg:max-w-screen-lg">
      {children}
    </section>
  )
}
