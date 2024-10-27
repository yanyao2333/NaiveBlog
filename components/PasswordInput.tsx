'use client'

import { components } from '@/components/MDXComponents'
import { Blog } from 'contentlayer/generated'
import { usePathname } from 'next/navigation'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function PasswordInput() {
  const [password, setPassword] = useState('')
  const path = usePathname()
  const [verified, setVerified] = useState(false)
  const [blog, setBlog] = useState<Blog | undefined>(undefined)

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
  }

  if (verified && blog) {
    return <MDXLayoutRenderer code={blog.body.code} components={components} toc={blog.toc} />
  }

  return (
    <div className="flex flex-col items-center w-full">
      本文需要密码才能查看，请输入密码~
      <div className="mt-3 flex w-full justify-center">
        <input
          type="password"
          className="rounded-l max-w-[200px] sm:max-w-[300px] border border-gray-500 border-r-0 bg-gray-200 px-4 py-2 text-gray-700 dark:bg-neutral-700 dark:text-neutral-300"
          onChange={(e) => setPassword(e.target.value)}
        />
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              verifyPassword(password, path)
            }
          }}
          className="w-12 text-center border border-l-0 flex-shrink-0 border-gray-500 content-center cursor-pointer rounded-r bg-primary-400 dark:bg-primary-600 dark:hover:bg-primary-700font-bold text-white hover:bg-primary-700"
          onClick={() => verifyPassword(password, path)}
        >
          &rarr;
        </div>
      </div>
    </div>
  )
}
