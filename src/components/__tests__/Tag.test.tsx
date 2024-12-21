import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Tag from '../Tag'

// 模拟 next/link 组件
vi.mock('next/link', () => {
  return {
    __esModule: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default: ({ children, href, className }: any) => (
      <a
        href={href}
        className={className}
      >
        {children}
      </a>
    ),
  }
})

describe('Tag 组件', () => {
  it('应该正确渲染标签文本', () => {
    render(<Tag text='React' />)
    expect(screen.getByText('React')).toBeInTheDocument()
  })

  it('应该正确 slug 化链接', () => {
    render(<Tag text='Next js' />)
    expect(screen.getByText('Next-js')).toHaveAttribute('href', '/tags/next-js')
  })
})
