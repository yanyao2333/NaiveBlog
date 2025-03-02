'use client'

import { components } from '@/components/MDXComponents'
import PostLayout from '@/layouts/PostLayout'
import type { Author, Post } from '@/services/content/core'
import { type CoreContent, coreContent } from '@/services/content/utils'
import { MDXContent } from '@content-collections/mdx/react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'
import LightGalleryWrapper from './LightGalleryWrapper'

export default function ArticalWithPassword({
  authorDetails,
  corePostContent,
  next,
  prev,
}: {
  authorDetails: CoreContent<Author>[]
  corePostContent: CoreContent<Post>
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
}) {
  const [password, setPassword] = useState('')
  const path = usePathname()
  const [verified, setVerified] = useState(false)
  const [blog, setBlog] = useState<Post | undefined>(undefined)

  function verifyPassword(password: string, path: string) {
    fetch(`/api/blog/password?password=${password}&path=${path}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          setVerified(true)
          setBlog(JSON.parse(data.blog))
          toast.success('密码正确~')
        } else {
          setVerified(false)
          setBlog(undefined)
          toast.error('密码错误，请重新输入！')
        }
      })
      .catch((e) => {
        toast.error('获取密码时出错，请重试！')
        console.error(`获取密码时出错，报错信息：${e}`)
        setVerified(false)
        setBlog(undefined)
      })
  }

  if (verified && blog) {
    console.log('blog', blog)
    return (
      <PostLayout
        content={coreContent(blog)}
        authorDetails={authorDetails}
        next={next}
        prev={prev}
        toc={blog.toc}
      >
        {/* <TOCInline toc={post.toc as unknown as Toc} />
              {post.toc.length > 0 && <hr />} */}
        <LightGalleryWrapper>
          <MDXContent
            code={blog.mdx}
            components={components}
          />
        </LightGalleryWrapper>
      </PostLayout>
    )
  }

  return (
    <PostLayout
      content={corePostContent}
      authorDetails={authorDetails}
      next={next}
      prev={prev}
    >
      <div className='flex w-full flex-col items-center'>
        本文需要密码才能查看，请输入密码~
        <div className='mt-3 flex w-full justify-center'>
          <label
            hidden
            htmlFor='password-field'
          >
            Password
          </label>
          <input
            type='password'
            id='password-field'
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                verifyPassword(password, path)
              }
            }}
            className='max-w-[200px] rounded-l border border-slate-6 border-r-0 bg-slate-3 px-4 py-2 text-slate-12 sm:max-w-[300px] dark:bg-slatedark-3 dark:text-slatedark-12'
            onChange={(e) => setPassword(e.target.value)}
          />
          <div
            role='button'
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                verifyPassword(password, path)
              }
            }}
            className='w-12 shrink-0 cursor-pointer content-center rounded-r border border-slate-6 border-l-0 bg-blue-7 text-center font-bold text-slate-11 hover:bg-blue-8 dark:bg-skydark-7 dark:text-slatedark-11 dark:hover:bg-skydark-8'
            onClick={() => verifyPassword(password, path)}
          >
            &rarr;
          </div>
        </div>
      </div>
    </PostLayout>
  )
}
