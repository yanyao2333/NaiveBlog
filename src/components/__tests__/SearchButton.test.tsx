import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import SearchButton from '../SearchButton'

// Mock useKBar hook
const mockToggle = vi.fn()
vi.mock('kbar', () => ({
  useKBar: () => ({
    query: {
      toggle: mockToggle,
    },
  }),
}))

// Mock SearchIcon
vi.mock('lucide-react', () => ({
  SearchIcon: () => <div data-testid="search-icon">Search Icon</div>,
}))

describe('SearchButton 组件', () => {
  beforeEach(() => {
    mockToggle.mockClear()
  })

  it('应该渲染搜索按钮和图标', () => {
    render(<SearchButton />)
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByTestId('search-icon')).toBeInTheDocument()
  })

  it('点击按钮时应该触发搜索栏切换', () => {
    render(<SearchButton />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(mockToggle).toHaveBeenCalledTimes(1)
  })

  it('按钮应该有正确的无障碍标签', () => {
    render(<SearchButton />)
    expect(screen.getByLabelText('Search')).toBeInTheDocument()
  })
})
