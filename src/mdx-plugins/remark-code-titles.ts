/**
 * This function/module is adapted from Pliny.
 * @see {@link https://github.com/timlrx/pliny/blob/main/packages/pliny/src/mdx-plugins/remark-code-title.ts}
 * @license MIT Copyright (c) timlrx
 */
import type { Parent } from 'unist'
import { visit } from 'unist-util-visit'

/**
 * Parses title from code block and inserts it as a sibling title node.
 *
 */
export function remarkCodeTitles() {
	return (tree: Parent & { lang?: string }) =>
		visit(
			tree,
			'code',
			(node: Parent & { lang?: string }, index, parent: Parent) => {
				const nodeLang = node.lang || ''
				let language = ''
				let title = ''

				if (nodeLang.includes(':')) {
					language = nodeLang.slice(0, nodeLang.search(':'))
					title = nodeLang.slice(nodeLang.search(':') + 1, nodeLang.length)
				}

				if (!title) {
					return
				}

				const className = 'remark-code-title'

				const titleNode = {
					type: 'mdxJsxFlowElement',
					name: 'div',
					attributes: [
						{ type: 'mdxJsxAttribute', name: 'className', value: className },
					],
					children: [{ type: 'text', value: title }],
					data: { _xdmExplicitJsx: true },
				}

				parent.children.splice(index as number, 0, titleNode)
				node.lang = language
			},
		)
}
