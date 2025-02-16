import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ScrollTopAndComment from '../ArticlePageButtonGroup'

// Mock siteMetadata
vi.mock('../../data/siteMetadata', () => ({
  default: {
    comments: {
      provider: 'giscus',
      giscusConfig: {
        id: 'your-giscus-id',
        repo: 'your-giscus-repo',
        category: 'your-giscus-category',
        categoryId: 'your-giscus-category-id',
        mapping: 'pathname',
        reactionsEnabled: '1',
        emitMetadata: '0',
        inputPosition: 'top',
        theme: 'light',
        lang: 'zh-CN',
        darkTheme: 'transparent_dark',
        themeURL: 'https://your-giscus-theme-url.com',
      },
    },
  },
}))

describe('ScrollTopAndComment 组件', () => {
  beforeEach(() => {
    // 重置 window.scrollY
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
    })

    // Mock scrollTo
    window.scrollTo = vi.fn()

    // Mock scrollIntoView
    Element.prototype.scrollIntoView = vi.fn()
  })

  it('初始状态下不应该显示按钮', () => {
    render(<ScrollTopAndComment />)
    const buttons = screen.queryAllByRole('button')
    buttons.forEach((button) => {
      expect(button.parentElement).toHaveClass('hidden')
    })
  })

  it('滚动超过50px时应该显示按钮', () => {
    render(<ScrollTopAndComment />)

    // 模拟滚动
    Object.defineProperty(window, 'scrollY', { value: 51 })
    fireEvent.scroll(window)

    const buttons = screen.queryAllByRole('button')
    buttons.forEach((button) => {
      expect(button.parentElement).toHaveClass('flex')
    })
  })

  it('点击回到顶部按钮应该调用 window.scrollTo', () => {
    render(<ScrollTopAndComment />)

    // 先显示按钮
    Object.defineProperty(window, 'scrollY', { value: 51 })
    fireEvent.scroll(window)

    const scrollTopButton = screen.getByLabelText('Scroll To Top')
    fireEvent.click(scrollTopButton)

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0 })
  })

  it('点击评论按钮应该滚动到评论区', () => {
    // 创建评论区元素
    const commentSection = document.createElement('div')
    commentSection.id = 'comment'
    document.body.appendChild(commentSection)

    render(<ScrollTopAndComment />)

    // 先显示按钮
    Object.defineProperty(window, 'scrollY', { value: 51 })
    fireEvent.scroll(window)

    const commentButton = screen.getByLabelText('Scroll To Comment')
    fireEvent.click(commentButton)

    expect(commentSection.scrollIntoView).toHaveBeenCalled()

    // 清理
    document.body.removeChild(commentSection)
  })

  it('滚动回到50px以下时应该隐藏按钮', () => {
    render(<ScrollTopAndComment />)

    // 先显示按钮
    Object.defineProperty(window, 'scrollY', { value: 51 })
    fireEvent.scroll(window)

    // 再隐藏按钮
    Object.defineProperty(window, 'scrollY', { value: 49 })
    fireEvent.scroll(window)

    const buttons = screen.queryAllByRole('button')
    buttons.forEach((button) => {
      expect(button.parentElement).toHaveClass('hidden')
    })
  })

  it('组件卸载时应该移除滚动事件监听器', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    const { unmount } = render(<ScrollTopAndComment />)

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
    )
  })
})
