import { MemoListResponse } from '@/types/memos'
import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import RecentlyMemos from '../homeComponents/RecentlyMemos'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

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

describe('RecentlyMemos', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('成功渲染', () => {
    render(<RecentlyMemos />)
    expect(screen.getByText('💡 最近想法')).toBeInTheDocument()
  })

  it('能显示加载时占位标志', () => {
    render(<RecentlyMemos />)
    expect(screen.getByText('加载中...')).toBeInTheDocument()
  })

  it('能正确渲染数据', async () => {
    const mockResponse: MemoListResponse = {
      memos: [
        {
          name: 'memos/1593',
          uid: 'SzcjW2n62YFwPfvgfDXF9E',
          rowStatus: 'ACTIVE',
          creator: 'users/1',
          createTime: '2024-10-05T14:52:11Z',
          updateTime: '2024-10-05T14:52:30Z',
          displayTime: '2024-10-05T14:52:11Z',
          content: 'ciallo!!!!',
          nodes: [
            {
              paragraphNode: {
                children: [
                  {
                    type: 'TEXT',
                    textNode: {
                      content: 'ciallo!!!!',
                    },
                  },
                ],
              },
            },
          ],
          visibility: 'PUBLIC',
          tags: [],
          pinned: true,
          resources: [],
          relations: [],
          reactions: [],
          property: {
            tags: [],
            hasLink: false,
            hasTaskList: false,
            hasCode: false,
            hasIncompleteTasks: false,
          },
          snippet: 'ciallo!!!!',
        },
      ],
      nextPageToken: '',
    }

    mockFetch.mockResolvedValueOnce({
      json: async () => mockResponse,
    })

    render(<RecentlyMemos />)

    await act(async () => {
      await waitFor(() => {
        expect(screen.getByText('ciallo!!!!')).toBeInTheDocument()
      })
    })
  })

  it('能正确处理数据获取失败', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Fetch error'))

    render(<RecentlyMemos />)

    await act(async () => {
      await waitFor(() => {
        expect(screen.queryByText('Test memo')).not.toBeInTheDocument()
      })
    })
  })

  it('能正确处理滚动', () => {
    render(<RecentlyMemos />)
    expect(mockScrollEvent).toHaveBeenCalled()
  })
})
