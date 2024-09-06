import { useMDXComponent } from 'next-contentlayer2/hooks'

export function MdxComponentRenderer({ doc, mdxComponents }) {
  const MDXContent = useMDXComponent(doc.body.code)

  return <MDXContent components={mdxComponents} />
}
