import type { MDXComponents } from 'mdx/types'
import Pre from 'pliny/ui/Pre'
import TOCInline from '@/components/TOC'
import Image from './Image'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'
import GCPlay from '@/components/mdxContentComponents/gc'

export const components: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  table: TableWrapper,
  GCPlay: GCPlay
}
