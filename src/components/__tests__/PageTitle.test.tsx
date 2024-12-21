import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import PageTitle from '../PageTitle'

describe('PageTitle 组件', () => {
  it('应该正确渲染标题和副标题', () => {
    render(
      <PageTitle
        title='主标题'
        subtitle='副标题'
      />,
    )
    expect(screen.getByRole('heading', { name: '主标题' })).toBeInTheDocument()
    expect(screen.getByText('副标题')).toBeInTheDocument()
  })

  it('应该支持 ReactNode 类型的副标题', () => {
    render(
      <PageTitle
        title='标题'
        subtitle={<span data-testid='custom-subtitle'>自定义副标题</span>}
      />,
    )
    expect(screen.getByTestId('custom-subtitle')).toBeInTheDocument()
    expect(screen.getByText('自定义副标题')).toBeInTheDocument()
  })

  it('应该包含标题的容器', () => {
    render(<PageTitle title='标题' />)
    const container = screen
      .getByRole('heading', { name: '标题' })
      .closest('div')
    expect(container).toBeInTheDocument()
  })

  it('应该正确地应用自定义类', () => {
    const customClass = 'this-is-a-custom-class'
    render(
      <PageTitle
        title='标题'
        className={customClass}
      />,
    )
    const title = screen.getByRole('heading', { name: '标题' })
    expect(title).toHaveClass(customClass)
  })
})
