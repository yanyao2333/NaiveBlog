'use client'

import { components } from '@/components/MDXComponents'
import { MDXContent } from '@content-collections/mdx/react'
import type { Post } from 'content-collections'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function PasswordInput() {
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
    return (
      <MDXContent
        code={blog.mdx}
        components={components}
        toc={blog.toc}
      />
    )
  }

  return (
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
          className='w-12 flex-shrink-0 cursor-pointer content-center rounded-r border border-slate-6 border-l-0 bg-blue-7 text-center font-bold text-slate-11 hover:bg-blue-8 dark:bg-skydark-7 dark:text-slatedark-11 dark:hover:bg-skydark-8'
          onClick={() => verifyPassword(password, path)}
        >
          &rarr;
        </div>
      </div>
    </div>
  )
}
