import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import LinkWithTooltip from '../Link'
import { TooltipProvider } from '../ui/tooltip'

const renderWithTooltipProvider = (ui: React.ReactElement) => {
  return render(<TooltipProvider>{ui}</TooltipProvider>)
}

describe('LinkWithTooltip 组件', () => {
  it('应该正确渲染内部链接', () => {
    renderWithTooltipProvider(
      <LinkWithTooltip href='/blog/test'>Internal Link</LinkWithTooltip>,
    )

    const link = screen.getByRole('link', { name: /Internal Link/ })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/blog/test')
    expect(link).toHaveAttribute('target', '_self')
  })

  it('应该正确渲染外部链接', () => {
    renderWithTooltipProvider(
      <LinkWithTooltip href='https://example.com'>
        External Link
      </LinkWithTooltip>,
    )

    const link = screen.getByRole('link', { name: /External Link/ })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('应该正确渲染锚点链接', () => {
    renderWithTooltipProvider(
      <LinkWithTooltip href='#section'>Anchor Link</LinkWithTooltip>,
    )

    const link = screen.getByRole('link', { name: /Anchor Link/ })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '#section')
  })
})
