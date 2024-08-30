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
  const [verifed, setVerified] = useState(false)
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

  if (verifed && blog) {
    return <MDXLayoutRenderer code={blog.body.code} components={components} toc={blog.toc} />
  }

  return (
    <div className="flex flex-col items-center">
      本文需要密码才能查看，请输入密码~
      <div className="mt-3">
        <input
          type="text"
          className="rounded border-0 bg-gray-200 px-4 py-2 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="submit"
          className="ml-2 cursor-pointer rounded border-0 bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          value="提交"
          onClick={() => verifyPassword(password, path)}
        />
      </div>
    </div>
  )
}
