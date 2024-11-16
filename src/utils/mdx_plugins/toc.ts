/** From https://github.com/timlrx/pliny */
import { slug } from 'github-slugger'
import { Heading } from 'mdast'
import { toString } from 'mdast-util-to-string'
import { remark } from 'remark'
import { Parent } from 'unist'
import { visit } from 'unist-util-visit'
import { VFile } from 'vfile'

export type TocItem = {
  value: string
  url: string
  depth: number
}

export type Toc = TocItem[]

/**
 * Extracts TOC headings from markdown file and adds it to the file's data object.
 * 我修改了一下，去除掉了包装textContent的slug，因为他会在我的链接后面加一个自增的数字，导致链接不准确。我不确定这是不是预期行为，但总之在我这跑不了。
 */
export function remarkTocHeadings() {
  return (tree: Parent, file: VFile) => {
    const toc: Toc = []
    visit(tree, 'heading', (node: Heading) => {
      const textContent = toString(node)
      const slugUrl = slug(textContent)
      toc.push({
        value: textContent,
        url: '#' + slugUrl,
        depth: node.depth,
      })
    })
    file.data.toc = toc
  }
}

/**
 * Passes markdown file through remark to extract TOC headings
 *
 * @param {string} markdown
 * @return {*}  {Promise<Toc>}
 */
export async function extractTocHeadings(markdown: string): Promise<Toc> {
  const vfile = await remark().use(remarkTocHeadings).process(markdown)
  // @ts-ignore
  return vfile.data.toc
}
