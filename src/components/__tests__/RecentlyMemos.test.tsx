import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import RecentlyMemos from '../homeComponents/RecentlyMemos'
import { MemoListResponse } from '@/types/memos'

// Mock fetch
global.fetch = vi.fn()

// Mock scroll event
const mockScrollEvent = vi.fn()
Object.defineProperty(global, 'scrollRef', {
  value: {
    current: {
      addEventListener: mockScrollEvent,
      removeEventListener: mockScrollEvent,
      scrollTop: 0,
      scrollHeight: 100,
      clientHeight: 100,
    },
  },
})

describe('RecentlyMemos Component', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders the component', () => {
    render(<RecentlyMemos />)
    expect(screen.getByText('💡 最近想法')).toBeInTheDocument()
  })

  it('displays loading state', () => {
    render(<RecentlyMemos />)
    expect(screen.getByText('加载中...')).toBeInTheDocument()
  })

  it('fetches and displays memos', async () => {
    const mockResponse: MemoListResponse = {
      memos: [
        {
          uid: '1',
          content: 'Test memo',
          createTime: '2023-10-01T00:00:00Z',
          // Add other required fields
        },
      ],
      nextPageToken: '',
    }

    ;(fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockResponse,
    })

    render(<RecentlyMemos />)

    await waitFor(() => {
      expect(screen.getByText('Test memo')).toBeInTheDocument()
    })
  })

  it('handles fetch error', async () => {
    ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Fetch error'))

    render(<RecentlyMemos />)

    await waitFor(() => {
      expect(screen.queryByText('Test memo')).not.toBeInTheDocument()
    })
  })

  it('handles scroll event', () => {
    render(<RecentlyMemos />)
    expect(mockScrollEvent).toHaveBeenCalled()
  })
})
