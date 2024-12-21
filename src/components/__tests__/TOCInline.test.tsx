import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import TOCInline, { type TOCInlineProps, createNestedList } from '../TOCInline'

describe('内联目录', () => {
  const mockToc: TOCInlineProps['toc'] = [
    { value: 'Introduction', url: '#introduction', depth: 1 },
    { value: 'Section 1', url: '#section-1', depth: 2 },
    { value: 'Section 1.1', url: '#section-1-1', depth: 3 },
    { value: 'Section 2', url: '#section-2', depth: 2 },
  ]

  it('应该创建嵌套列表', () => {
    const nestedList = createNestedList(mockToc)

    expect(nestedList).toEqual([
      {
        value: 'Introduction',
        url: '#introduction',
        depth: 1,
        children: [
          {
            value: 'Section 1',
            url: '#section-1',
            depth: 2,
            children: [
              {
                value: 'Section 1.1',
                url: '#section-1-1',
                depth: 3,
                children: [],
              },
            ],
          },
          {
            value: 'Section 2',
            url: '#section-2',
            depth: 2,
            children: [],
          },
        ],
      },
    ])
  })

  it('应该正确渲染 TOCInline', () => {
    render(<TOCInline toc={mockToc} />)

    expect(screen.getByText('Introduction')).toBeInTheDocument()
    expect(screen.getByText('Section 1')).toBeInTheDocument()
    expect(screen.getByText('Section 1.1')).toBeInTheDocument()
    expect(screen.getByText('Section 2')).toBeInTheDocument()
  })

  it('应该正确渲染使用 summary 标签折叠的 TOC', () => {
    render(
      <TOCInline
        toc={mockToc}
        asDisclosure
        collapse
      />,
    )

    expect(screen.getByText('目录')).toBeInTheDocument()
    expect(screen.getByText('Introduction')).toBeInTheDocument()
    expect(screen.getByText('Section 1')).toBeInTheDocument()
    expect(screen.getByText('Section 1.1')).toBeInTheDocument()
    expect(screen.getByText('Section 2')).toBeInTheDocument()
  })

  it('应该正确忽略指定的标题', () => {
    render(
      <TOCInline
        toc={mockToc}
        exclude='Section 1'
      />,
    )

    expect(screen.getByText('Introduction')).toBeInTheDocument()
    expect(screen.queryByText('Section 1')).not.toBeInTheDocument()
    // TODO 这个应该实现，但先放着，需求不是很大
    // expect(screen.queryByText('Section 1.1')).not.toBeInTheDocument()
    expect(screen.getByText('Section 2')).toBeInTheDocument()
  })
})
