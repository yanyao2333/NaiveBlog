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
      <div className="mb-8 space-y-2 border-b pb-8 pt-6 md:space-y-5">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          Memos
        </h1>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
          写点什么吧，在一切还没太糟糕之前~
        </p>
      </div>
      {memos
        ? memos.map((memo, index) => (
            <div key={index} className="border-gray-200 py-6 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(memo.createTime).toLocaleString()}
              </div>
              <div className="prose text-gray-800  dark:prose-invert prose-p:my-2 dark:text-gray-200">
                {memo.parsedContent ? (
                  <div dangerouslySetInnerHTML={{ __html: memo.parsedContent }} />
                ) : (
                  ''
                )}
              </div>
            </div>
          ))
        : null}
    </>
  )
}
