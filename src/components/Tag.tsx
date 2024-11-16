import { slug } from 'github-slugger'
import Link from 'next/link'

interface Props {
  text: string
}

const Tag = ({ text }: Props) => {
  return (
    <Link
      href={`/tags/${slug(text)}`}
      className="mr-3 mt-1 text-sm font-medium text-slate-12 dark:text-slatedark-12 uppercase hover:text-blue-11 dark:hover:text-skydark-11"
    >
      {text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
