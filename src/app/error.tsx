'use client'

import { useCopyToClipboard } from 'src/hooks/useClipboard'

export default function ErrorComponent({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [_, copy] = useCopyToClipboard()

  return (
    <div className='flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center md:flex-row md:space-x-6'>
      <div className='space-x-2 pt-6 pb-8 md:space-y-5'>
        <h1 className='font-extrabold text-3xl text-slate-11 leading-9 tracking-tight md:border-r-2 md:px-6 md:text-5xl md:leading-14 dark:text-slatedark-11'>
          Client Error
        </h1>
      </div>
      <div className='flex max-w-md flex-col'>
        <p className='mb-4 text-center font-bold text-base text-slate-12 leading-normal md:text-xl dark:text-slatedark-12'>
          抱歉发生了错误！我会尽快修复的！
        </p>
        <p className='mb-4 text-center text-slate-12 text-xs leading-normal dark:text-slatedark-12'>
          报错名：{error.name}
          <br />
          错误信息：{error.message}
          <br />
          {error.stack ? (
            <>
              错误堆栈：
              <button
                className='w-12 cursor-pointer content-center rounded border border-slate-6 border-l-0 bg-blue-7 text-center font-bold text-slate-11 text-xs hover:bg-blue-8 dark:bg-skydark-7 dark:text-slatedark-11 dark:hover:bg-skydark-8'
                onClick={() => copy(error.stack as string)}
              >
                复制
              </button>
              <br />
            </>
          ) : null}
          {error.digest ? (
            <>
              错误标识：{error.digest}
              <br />
            </>
          ) : null}
          <br />
          如果可以，请将上方相关内容（包含复制的堆栈信息）发送给开发者
          me@roitium.com
        </p>
      </div>
      <button
        className='w-12 cursor-pointer content-center rounded border border-slate-6 border-l-0 bg-blue-7 text-center font-bold text-slate-11 hover:bg-blue-8 dark:bg-skydark-7 dark:text-slatedark-11 dark:hover:bg-skydark-8'
        onClick={reset}
      >
        刷新
      </button>
    </div>
  )
}
