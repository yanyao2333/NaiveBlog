import remarkMediaCard from '@zhouhua-dev/remark-media-card'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { toast } from 'sonner'
import { unified } from 'unified'
import { remarkTagToJsx } from '@/mdx-plugins/remark-tag-to-jsx'
import { useInfiniteQuery } from '@tanstack/react-query' // Added useInfiniteQuery
import type { Memo, MemoListResponse } from '@/types/memos'

// Removed global nextPageToken and clearNextPageToken function

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
 * @param pageParam The page token for fetching the next set of memos.
 * @returns An object containing the list of memos and the next page token.
 */
export async function fetchMemos(pageParam?: string) {
  // 如果没有设置Memos端点，则返回空列表和undefined token
  if (!process.env.NEXT_PUBLIC_MEMOS_ENDPOINT) {
    console.warn('Memos endpoint is not configured. Returning empty array.')
    return { memos: [], nextPageToken: undefined }
  }
  const apiEndpoint = process.env.NEXT_PUBLIC_MEMOS_ENDPOINT?.replace(/\/$/, '')
  // 查询参数
  const filter = `filter=creator=='users/1'%26%26order_by_pinned==true`
  const pageSize = 'pageSize=5' // Keep pageSize as defined
  const pageTokenQuery = pageParam ? `pageToken=${pageParam}` : ''
  const view = 'view=MEMO_VIEW_FULL'
  const apiPath = 'api/v1/memos'

  const requestUrl = `${apiEndpoint}/${apiPath}?${filter}&${pageSize}&${pageTokenQuery}&${view}`.replace(/&{2,}/g, '&').replace(/\?&/, '?');


  const response = await fetch(requestUrl)

  if (!response.ok) {
    toast.error('获取 memos 时发生错误！')
    throw new Error('Failed to fetch memos')
  }

  const jsonResp: MemoListResponse = await response.json()

  // 处理Memos内容
  const processedMemos = await Promise.all(
    (jsonResp.memos || []).map(async (memo: Memo) => { // Added null check for jsonResp.memos
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
  return { memos: processedMemos, nextPageToken: jsonResp.nextPageToken }
}

export function useMemos() {
  return useInfiniteQuery<
    { memos: Memo[]; nextPageToken?: string }, // Type of data returned by fetchMemos
    Error, // Type of error
    { memos: Memo[]; nextPageToken?: string }, // Type of the pages array
    { memos: Memo[]; nextPageToken?: string }, // Type of initialData (not used here)
    string | undefined // Type of pageParam
  >({
    queryKey: ['memos'],
    queryFn: ({ pageParam }) => fetchMemos(pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextPageToken,
  })
}

// If useMemoComments was here from a previous step, it would be:
/*
export function useMemoComments(memoName: string) {
  return useQuery<Memo[], Error>({
    queryKey: ['comments', memoName],
    queryFn: () => fetchComments(memoName),
    enabled: !!memoName,
  });
}
*/
