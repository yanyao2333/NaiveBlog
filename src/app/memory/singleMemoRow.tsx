import Logo from '@/public/static/images/logo.png'
import { Memo } from '@/types/memos'
import { formatToSemanticTime } from '@/utils/time'
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgZoom from 'lightgallery/plugins/zoom'
import LightGallery from 'lightgallery/react'
import Image from 'next/image'
import { memo, useState } from 'react'
import toast from 'react-hot-toast'
import { fetchComments } from './fetchFunctions'
import { CommentsList } from './memoComments'

/**
 * 单Memo组件
 */
export const MemoRowComponent = memo(function MemoRowComponent({ memo }: { memo: Memo }) {
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<Memo[]>([])
  const [isLoadingComments, setIsLoadingComments] = useState(false)

  const handleCommentClick = async (memoOrCommentId: string) => {
    if (showComments) {
      setShowComments(false)
      return
    }
    setIsLoadingComments(true)
    try {
      const newComments = await fetchComments(memoOrCommentId)
      setComments(newComments)
      setShowComments(true)
    } catch (error) {
      toast.error('获取评论失败')
      console.error(error)
    } finally {
      setIsLoadingComments(false)
    }
  }

  return (
    <div className="flex flex-col gap-3 border-gray-200 py-6 dark:border-gray-700 lg:w-[720px]">
      {/* 头像、日期、名称 */}
      <div className="flex justify-between gap-3">
        <Image src={Logo} alt="avatar" className="mt-1 size-[40px] rounded-full" />
        <div className="flex flex-col">
          <span className="font-medium">Roitium.</span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {formatToSemanticTime(memo.createTime, navigator.language)}
          </span>
        </div>
        {memo.relations.length > 0 ? (
          <div className="ml-auto flex gap-3">
            <button
              onClick={() => handleCommentClick(memo.name)}
              className="inline-block self-center align-middle transition hover:opacity-30"
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
            </button>
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
      <div className="prose ml-[52px] rounded-e-md rounded-bl-md bg-gray-100 pl-2 pr-2 text-gray-800 shadow-sm ring-1 ring-gray-200 dark:prose-invert prose-p:my-2 dark:bg-neutral-600 dark:text-neutral-100 dark:ring-neutral-500">
        {memo.parsedContent ? (
          <article dangerouslySetInnerHTML={{ __html: memo.parsedContent }} />
        ) : (
          ''
        )}
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
      {/* 评论区 */}
      {isLoadingComments && (
        <div className="mx-auto mt-3 w-6">
          <span className="relative flex size-6">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75"></span>
            <span className="relative inline-flex size-6 rounded-full bg-primary-500"></span>
          </span>
        </div>
      )}
      {showComments && !isLoadingComments && (
        <div className="mt-4 ml-[52px]">
          <CommentsList comments={comments} onCommentClick={handleCommentClick} />
        </div>
      )}
    </div>
  )
})
