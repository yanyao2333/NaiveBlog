import { describe, it, vi, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import YiYan from '../YiYan'
import toast from 'react-hot-toast'

vi.mock('react-hot-toast', () => ({
  error: vi.fn(),
}))

describe('YiYan 组件', () => {
  it('应该在加载时显示默认文本', () => {
    render(<YiYan />)
    expect(screen.getByText('加载中...')).toBeInTheDocument()
  })

  it('应该在成功获取数据后显示数据', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ hitokoto: '测试一言', from: '测试来源' }),
    })

    render(<YiYan />)

    expect(await screen.findByText('测试一言 ——测试来源')).toBeInTheDocument()
  })

  it('应该在获取数据失败时显示错误信息', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('获取失败'))

    render(<YiYan />)

    expect(await screen.findByText('获取失败')).toBeInTheDocument()
    expect(toast.error).toHaveBeenCalledWith('获取一言失败！你运气太差了喵！')
  })
})
