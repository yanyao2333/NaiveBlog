import fs from 'node:fs'
import { sync as sizeOf } from 'probe-image-size'
import type { Literal, Node, Parent } from 'unist'
import { visit } from 'unist-util-visit'

export type ImageNode = Parent & {
  url: string
  alt: string
  name: string
  attributes: (Literal & { name: string })[]
}

/**
 * 将 img 标签转换成 next/Image ，并增加 data-src 标签供灯箱使用
 *
 */
export function remarkImgToJsx() {
  return (tree: Node) => {
    visit(
      tree,
      // only visit p tags that contain an img element
      (node: Parent): node is Parent =>
        node.type === 'paragraph' &&
        node.children.some((n) => n.type === 'image'),
      (node: Parent) => {
        const imageNodeIndex = node.children.findIndex(
          (n) => n.type === 'image',
        )
        const imageNode = node.children[imageNodeIndex] as ImageNode

        // only local files
        if (fs.existsSync(`${process.cwd()}/public${imageNode.url}`)) {
          const dimensions = sizeOf(
            fs.readFileSync(`${process.cwd()}/public${imageNode.url}`),
          )

          // Convert original node to next/image
          imageNode.type = 'mdxJsxFlowElement'
          imageNode.name = 'Image'
          imageNode.attributes = [
            { type: 'mdxJsxAttribute', name: 'alt', value: imageNode.alt },
            { type: 'mdxJsxAttribute', name: 'src', value: imageNode.url },
            { type: 'mdxJsxAttribute', name: 'width', value: dimensions.width },
            {
              type: 'mdxJsxAttribute',
              name: 'height',
              value: dimensions.height,
            },
            { type: 'mdxJsxAttribute', name: 'date-src', value: imageNode.url },
          ]

          node.type = 'div'
          node.children[imageNodeIndex] = imageNode
          // console.log(JSON.stringify(node, null, 2))
        }
      },
    )
  }
}
