import { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

/**
 * Convert #tag/subtag syntax to span element with tag style
 */
export const remarkTagToJsx: Plugin = function () {
  return (tree) => {
    visit(tree, 'text', (node: { value: string }, index, parent) => {
      if (!parent || index === null || typeof node.value !== 'string') return

      const value = node.value
      const tagRegex = /#([a-zA-Z0-9]+(?:\/[a-zA-Z0-9]+)*)/g
      let match
      let lastIndex = 0
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parts: any[] = []

      while ((match = tagRegex.exec(value)) !== null) {
        // Add text before tag
        if (match.index > lastIndex) {
          parts.push({
            type: 'text',
            value: value.slice(lastIndex, match.index),
          })
          console.log(value.slice(lastIndex, match.index))
        }

        parts.push({
          type: 'inlineCode',
          value: match[0].replace('#', 'tag: '),
        })

        lastIndex = match.index + match[0].length
      }

      // Add remaining text
      if (lastIndex < value.length) {
        parts.push({
          type: 'text',
          value: value.slice(lastIndex),
        })
      }

      if (parts.length > 0) {
        // @ts-ignore
        parent.children.splice(index, 1, ...parts)
      }
    })
  }
}
