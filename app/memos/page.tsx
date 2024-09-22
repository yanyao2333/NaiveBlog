'use client'
import { useEffect, useState } from 'react'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { Memo, MemoListResponse } from '../../types/memos'

export default function MemosPage() {
  const [memos, setMemos] = useState<Memo[]>([])

  useEffect(() => {
    fetch(
      process.env.NEXT_PUBLIC_MEMOS_ENDPOINT + '/api/v1/memos' + "?filter=creator == 'users/1'"
    ).then((response) => {
      response.json().then((data: MemoListResponse) => {
        data.memos.map(async (memo: Memo) => {
          memo.resources.map((resource) => {
            if (resource.type.startsWith('image')) {
              const imageUrl = `![${resource.filename}](${process.env.NEXT_PUBLIC_MEMOS_ENDPOINT}/file/${resource.name}/${resource.filename})`
              memo.content += '\n' + imageUrl
            }
          })
          memo.parsedContent = await unified()
            .use(remarkParse)
            .use(remarkRehype)
            .use(rehypeSanitize)
            .use(rehypeStringify)
            .process(memo.content)
            .then((file) => file.toString())
        })
        setMemos(data.memos)
      })
    })
  }, [])

  return (
    <>
      {memos
        ? memos.map((memo, index) => (
            <div key={index} className="border-b border-gray-200 py-4 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(memo.createTime).toLocaleString()}
              </div>
              <div className="prose text-lg text-gray-800 dark:prose-invert dark:text-gray-200">
                {memo.parsedContent ? (
                  <div dangerouslySetInnerHTML={{ __html: memo.parsedContent }} />
                ) : (
                  ''
                )}
              </div>
            </div>
          ))
        : '...'}
    </>
  )
}
