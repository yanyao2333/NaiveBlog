// 本页面用于显示Memos列表
'use client'
import 'lightgallery/css/lightgallery.css'
import 'lightgallery/css/lg-zoom.css'
import 'lightgallery/css/lg-thumbnail.css'
import PageTitle from '@/components/PageTitle'
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgZoom from 'lightgallery/plugins/zoom'
import LightGallery from 'lightgallery/react'
import moment from 'moment/min/moment-with-locales'
import Link from 'next/link'
import { memo, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { Memo, MemoListResponse } from '../../types/memos'

// 下一页的 token
let nextPageToken = ''

/**
 * 格式化时间字符串
 * @param timeString 时间字符串
 * @returns 格式化后的时间字符串
 */
function formatTime(timeString) {
  const targetTime = moment(timeString)
  const diffDays = moment().diff(targetTime, 'days')
  switch (true) {
    case diffDays < 1:
      return targetTime.fromNow()
    case diffDays >= 1 && diffDays < 7:
      return targetTime.calendar()
    case diffDays >= 7:
      return targetTime.format('llll')
  }
}

/**
 * 获取Memos列表
 * @returns Memos列表
 */
async function fetchMemos() {
  // 如果没有设置Memos端点，则返回空列表
  if (!process.env.NEXT_PUBLIC_MEMOS_ENDPOINT) {
    return []
  }
  const apiEndpoint = process.env.NEXT_PUBLIC_MEMOS_ENDPOINT?.replace(/\/$/, '')
  // 查询参数
  const filter = `filter=creator=='users/1'%26%26order_by_pinned==true`
  const pageSize = 'pageSize=5'
  const pageToken = nextPageToken ? `&pageToken=${nextPageToken}` : ''
  const apiPath = 'api/v1/memos'
  const response = await fetch(`${apiEndpoint}/${apiPath}?${filter}&${pageSize}${pageToken}`)
  const jsonResp: MemoListResponse = await response.json()
  nextPageToken = jsonResp.nextPageToken
  // 处理Memos内容
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

/**
 * 单Memo组件
 * @param memo Memo
 * @returns Memos行组件
 */
const MemoRowComponent = memo(function MemoRowComponent({ memo }: { memo: Memo }) {
  return (
    <div className="flex flex-col gap-3 border-gray-200 py-6 dark:border-gray-700 lg:w-[720px]">
      {/* 头像、日期、名称 */}
      <div className="flex justify-between gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/static/images/logo.png" alt="avater" className="mt-1 size-[40px] rounded-full" />
        <div className="flex flex-col">
          <span className="font-medium">Roitium.</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatTime(memo.createTime)}
          </span>
        </div>
        {memo.relations.length > 0 ? (
          <div className="ml-auto flex gap-3">
            <Link
              className="inline-block self-center align-middle transition hover:opacity-30"
              href={`https://memos.yanyaolab.xyz/m/${memo.uid}#comments`}
              target={'_blank'}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="inline-block size-5 align-middle"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                />
              </svg>
              <span className="align-middle">{memo.relations.length}</span>
            </Link>
            <div className="ml-auto select-none self-center text-base">
              {memo.pinned ? '📌' : null}
            </div>
          </div>
        ) : (
          <div className="ml-auto select-none self-center text-base">
            {memo.pinned ? '📌' : null}
          </div>
        )}
      </div>
      {/* 内容框 */}
      <div className="prose ml-[52px] rounded-e-md rounded-bl-md bg-gray-100 pl-2 pr-2 text-gray-800 shadow-sm dark:prose-invert prose-p:my-2 dark:bg-gray-700 dark:text-gray-100">
        {memo.parsedContent ? <div dangerouslySetInnerHTML={{ __html: memo.parsedContent }} /> : ''}
        {memo.resources.length > 0 ? (
          <LightGallery
            speed={500}
            plugins={[lgThumbnail, lgZoom]}
            elementClassNames="flex flex-row gap-2 flex-wrap not-prose mt-4 mb-3 mr-2"
            licenseKey={process.env.NEXT_PUBLIC_LIGHT_GALLERY_LICENSE_KEY}
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
})

/**
 * Memos页面
 * @returns Memos页面
 */
export default function MemosPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [memos, setMemos] = useState<Memo[]>([])

  // 初始化Memos列表
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

  // 加载更多Memos
  function onClickFetchMore() {
    setIsLoading(true)
    fetchMemos().then((data) => {
      setMemos(memos.concat(data))
      setIsLoading(false)
    })
  }

  return (
    <div className="flex flex-col">
      <PageTitle title="Memories" subtitle="人生三大乐事：梗图、发癫与暴论" />
      <div className="mx-auto flex flex-col">
        {memos ? memos.map((memo) => <MemoRowComponent memo={memo} key={memo.uid} />) : null}
      </div>
      <button
        onClick={onClickFetchMore}
        disabled={isLoading}
        className="mt-3 justify-center text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
      >
        {isLoading ? (
          <div className="mx-auto mt-3 w-6">
            {/*<LoadSpinner />*/}
            <span className="relative flex size-6">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex size-6 rounded-full bg-primary-500"></span>
            </span>
          </div>
        ) : (
          <>加载更多 &darr;</>
        )}
      </button>
    </div>
  )
}
