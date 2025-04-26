import remarkMediaCard from '@zhouhua-dev/remark-media-card'
import { toast } from 'sonner'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { remarkTagToJsx } from '@/mdx-plugins/remark-tag-to-jsx'
import type { Memo, MemoListResponse } from '@/types/memos'

let nextPageToken = ''

export function clearNextPageToken() {
  nextPageToken = ''
}

export async function fetchComments(memoName: string) {
  const response = await fetch(
    `/api/3party/memos/comments?name=${memoName}&view=MEMO_VIEW_FULL`,
  )
  const comments: Memo[] = (await response.json()).details.memos

  // 处理评论内容
  return await Promise.all(
    comments.map(async (comment) => {
      comment.parsedContent = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkTagToJsx)
        .use(remarkRehype, { allowDangerousHtml: true })
        // .use(rehypeSanitize)
        .use(rehypeStringify, { allowDangerousHtml: true })
        .process(comment.content)
        .then((file) => file.toString())
      return comment
    }),
  )
}

/**
 * 获取Memos列表
 * @returns Memos列表
 */
export async function fetchMemos() {
  // 如果没有设置Memos端点，则返回空列表
  if (!process.env.NEXT_PUBLIC_MEMOS_ENDPOINT) {
    return []
  }
  const apiEndpoint = process.env.NEXT_PUBLIC_MEMOS_ENDPOINT?.replace(/\/$/, '')
  // 查询参数
  const filter = `filter=creator=='users/1'%26%26order_by_pinned==true`
  const pageSize = 'pageSize=5'
  const pageToken = nextPageToken ? `pageToken=${nextPageToken}` : ''
  const view = 'view=MEMO_VIEW_FULL'
  const apiPath = 'api/v1/memos'
  const response = await fetch(
    `${apiEndpoint}/${apiPath}?${filter}&${pageSize}&${pageToken}&${view}`,
  )
  if (!response.ok) {
    toast.error('获取 memos 时发生错误！')
    return false
  }
  const jsonResp: MemoListResponse = await response.json()
  nextPageToken = jsonResp.nextPageToken
  // 处理Memos内容
  return await Promise.all(
    jsonResp.memos.map(async (memo: Memo) => {
      memo.parsedContent = await unified()
        .use(remarkParse)
        .use(remarkMediaCard)
        .use(remarkGfm)
        .use(remarkTagToJsx)
        .use(remarkRehype, { allowDangerousHtml: true })
        // .use(rehypeSanitize)
        .use(rehypeStringify, { allowDangerousHtml: true })
        .process(memo.content)
        .then((file) => file.toString())
      return memo
    }),
  )
}
