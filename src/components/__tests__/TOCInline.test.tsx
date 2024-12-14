import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import TOCInline, { TOCInlineProps } from '../TOCInline'

describe('TOCInline', () => {
  const mockToc: TOCInlineProps['toc'] = [
    { value: 'Introduction', url: '#introduction', depth: 1 },
    { value: 'Section 1', url: '#section-1', depth: 2 },
    { value: 'Section 1.1', url: '#section-1-1', depth: 3 },
    { value: 'Section 2', url: '#section-2', depth: 2 },
  ]

  it('should create nested list correctly', () => {
    const nestedList = TOCInline.createNestedList(mockToc)

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

  it('should render TOCInline correctly', () => {
    render(<TOCInline toc={mockToc} />)

    expect(screen.getByText('Introduction')).toBeInTheDocument()
    expect(screen.getByText('Section 1')).toBeInTheDocument()
    expect(screen.getByText('Section 1.1')).toBeInTheDocument()
    expect(screen.getByText('Section 2')).toBeInTheDocument()
  })

  it('should render TOCInline with asDisclosure and collapse', () => {
    render(<TOCInline toc={mockToc} asDisclosure collapse />)

    expect(screen.getByText('Table of Contents')).toBeInTheDocument()
    expect(screen.getByText('Introduction')).toBeInTheDocument()
    expect(screen.getByText('Section 1')).toBeInTheDocument()
    expect(screen.getByText('Section 1.1')).toBeInTheDocument()
    expect(screen.getByText('Section 2')).toBeInTheDocument()
  })

  it('should exclude headings based on exclude prop', () => {
    render(<TOCInline toc={mockToc} exclude="Section 1" />)

    expect(screen.getByText('Introduction')).toBeInTheDocument()
    expect(screen.queryByText('Section 1')).not.toBeInTheDocument()
    expect(screen.queryByText('Section 1.1')).not.toBeInTheDocument()
    expect(screen.getByText('Section 2')).toBeInTheDocument()
  })
})
