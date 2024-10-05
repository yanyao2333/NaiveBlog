'use client'
import 'lightgallery/css/lightgallery.css'
import 'lightgallery/css/lg-zoom.css'
import 'lightgallery/css/lg-thumbnail.css'
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgZoom from 'lightgallery/plugins/zoom'
import LightGallery from 'lightgallery/react'
import moment from 'moment/min/moment-with-locales'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import LoadSpinner from '../../components/svgs/load-spinner.svg'
import { Memo, MemoListResponse } from '../../types/memos'

let nextPageToken = ''

async function fetchMemos() {
  if (!process.env.NEXT_PUBLIC_MEMOS_ENDPOINT) {
    return []
  }
  const response = await fetch(
    process.env.NEXT_PUBLIC_MEMOS_ENDPOINT?.replace(/\/$/, '') +
      '/api/v1/memos' +
      "?pageSize=5&filter=creator == 'users/1'" +
      (nextPageToken ? `&pageToken=${nextPageToken}` : '')
  )
  const jsonResp: MemoListResponse = await response.json()
  nextPageToken = jsonResp.nextPageToken
  return await Promise.all(
    jsonResp.memos.map(async (memo: Memo) => {
      memo.parsedContent = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeSanitize)
        .use(rehypeStringify)
        .process(memo.content)
        .then((file) => file.toString())
      return memo
    })
  )
}

function memoRowComponent(memo: Memo, key: string | number) {
  return (
    <div key={key} className="justify-center border-gray-200 py-6 dark:border-gray-700">
      <div className="prose mx-auto  text-gray-800  dark:prose-invert prose-p:my-2 dark:text-gray-200">
        <div className="mx-auto text-sm text-gray-500 dark:text-gray-400">
          {moment(memo.createTime).fromNow()}
        </div>
        {memo.parsedContent ? <div dangerouslySetInnerHTML={{ __html: memo.parsedContent }} /> : ''}
        {memo.resources.length > 0 ? (
          <LightGallery
            speed={500}
            plugins={[lgThumbnail, lgZoom]}
            elementClassNames="flex flex-row gap-2 flex-wrap"
          >
            {memo.resources.map((resource) => {
              const imgUrl = `${process.env.NEXT_PUBLIC_MEMOS_ENDPOINT}/file/${resource.name}/${resource.filename}`
              return (
                <a href={imgUrl} key={resource.name}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={resource.filename}
                    src={imgUrl + '?thumbnail=true'}
                    height={128}
                    width={128}
                    className="h-36 w-36 rounded-xl border object-cover shadow-sm hover:shadow-xl"
                  />
                </a>
              )
            })}
          </LightGallery>
        ) : null}
      </div>
    </div>
  )
}

export default function MemosPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [memos, setMemos] = useState<Memo[]>([])

  useEffect(() => {
    setIsLoading(true)
    moment.locale(navigator.language)
    if (!process.env.NEXT_PUBLIC_MEMOS_ENDPOINT) {
      toast.error('你还没设置 memos endpoint！')
      return
    }
    fetchMemos().then((data) => {
      setMemos(data)
      setIsLoading(false)
    })
    return () => {
      nextPageToken = ''
    }
  }, [])

  function onClickFetchMore() {
    setIsLoading(true)
    fetchMemos().then((data) => {
      setMemos(memos.concat(data))
      setIsLoading(false)
    })
  }

  return (
    <div className="flex flex-col">
      <div className="mb-8 space-y-2 border-b pb-8 pt-6 text-center md:space-y-5">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          Memories
        </h1>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
          人生三大乐事：梗图、发癫与暴论
        </p>
      </div>
      <div className="flex flex-col">
        {memos ? memos.map((memo, index) => memoRowComponent(memo, index)) : null}
      </div>
      <button
        onClick={onClickFetchMore}
        disabled={isLoading}
        className="justify-center text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
      >
        {isLoading ? (
          <div className="mx-auto w-[24px]">
            <LoadSpinner />
          </div>
        ) : (
          <>加载更多 &darr;</>
        )}
      </button>
    </div>
  )
}
