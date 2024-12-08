import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { usePathname } from 'next/navigation'
import toast from 'react-hot-toast'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import PasswordInput from '../PasswordInput'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}))

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('PasswordInput 组件', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(usePathname as any).mockReturnValue('/test-path')
  })

  it('应该渲染密码输入框和提交按钮', () => {
    render(<PasswordInput />)
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('应该能更新密码输入值', () => {
    render(<PasswordInput />)
    const input = screen.getByLabelText('Password')
    fireEvent.change(input, { target: { value: 'test123' } })
    expect(input).toHaveValue('test123')
  })

  it('密码验证成功时应该显示文章内容', async () => {
    const mockBlog = {
      body: {
        code: 'var Component=(()=>{var x=Object.create;var o=Object.defineProperty;var d=Object.getOwnPropertyDescriptor;var p=Object.getOwnPropertyNames;var _=Object.getPrototypeOf,l=Object.prototype.hasOwnProperty;var g=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports),j=(t,e)=>{for(var r in e)o(t,r,{get:e[r],enumerable:!0})},m=(t,e,r,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let a of p(e))!l.call(t,a)&&a!==r&&o(t,a,{get:()=>e[a],enumerable:!(s=d(e,a))||s.enumerable});return t};var M=(t,e,r)=>(r=t!=null?x(_(t)):{},m(e||!t||!t.__esModule?o(r,"default",{value:t,enumerable:!0}):r,t)),w=t=>m(o({},"__esModule",{value:!0}),t);var c=g((F,u)=>{u.exports=_jsx_runtime});var C={};j(C,{default:()=>i,frontmatter:()=>y});var n=M(c()),y={title:"\\u5C55\\u793A\\u52A0\\u5BC6\\u529F\\u80FD",date:"2024-09-08",tags:["\\u535A\\u5BA2"],draft:!1,summary:"\\u52A0\\u5BC6\\uFF01",private:!0,password:"111111"};function f(t){return(0,n.jsx)(n.Fragment,{})}function i(t={}){let{wrapper:e}=t.components||{};return e?(0,n.jsx)(e,{...t,children:(0,n.jsx)(f,{...t})}):f(t)}return w(C);})();\n;return Component;',
      },
      toc: [],
    }

    mockFetch.mockResolvedValueOnce({
      json: () =>
        Promise.resolve({
          ok: true,
          blog: JSON.stringify(mockBlog),
        }),
    })
    render(<PasswordInput />)
    const input = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button')

    fireEvent.change(input, { target: { value: 'correct-password' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/blog/password?password=correct-password'),
        expect.any(Object)
      )
      expect(toast.success).toHaveBeenCalled()
    })
  })

  it('密码验证失败时应该显示错误提示', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () =>
        Promise.resolve({
          ok: false,
        }),
    })

    render(<PasswordInput />)
    const input = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button')

    fireEvent.change(input, { target: { value: 'wrong-password' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled()
    })
  })

  it('按回车键应该触发密码验证', async () => {
    // 加上 mock 只是为了让程序不报错
    mockFetch.mockResolvedValueOnce({
      json: () =>
        Promise.resolve({
          ok: false,
        }),
    })

    render(<PasswordInput />)
    const input = screen.getByLabelText('Password')

    fireEvent.change(input, { target: { value: 'test-password' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
    })
  })

  it('网络请求失败时应该优雅处理', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network boom!!!'))

    render(<PasswordInput />)
    const input = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button')

    fireEvent.change(input, { target: { value: 'test-password' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled()
    })
  })
})
