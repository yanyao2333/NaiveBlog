import type { MDXComponents } from 'mdx/types'
import GCPlay from '@/components/mdxContentComponents/gc'
import TOCInline from '@/components/TOC'
import Image from './Image'
import CustomLink from './Link'
import Pre from './mdxContentComponents/pre'
import TableWrapper from './TableWrapper'

export const components: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  table: TableWrapper,
  GCPlay: GCPlay,
}
