import { genPageMetadata } from '@/app/seo'
import Card from '@/components/Card'
import PageTitle from '@/components/PageTitle'
import projectsData from '@/data/projectsData'

export const metadata = genPageMetadata({ title: 'Projects' })

export default function Projects() {
  return (
    <>
      <div className='min-w-full'>
        <PageTitle
          title='Projects'
          subtitle='Just for fun.'
        />
        <div className='container pt-2'>
          <div className='-m-4 flex flex-wrap'>
            {projectsData.map((d) => (
              <Card
                key={d.title}
                title={d.title}
                description={d.description}
                imgSrc={d.imgSrc}
                href={d.href}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
