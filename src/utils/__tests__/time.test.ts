import { beforeAll, describe, expect, it, vi } from 'vitest'
import { formatDate, formatToSemanticTime, isTimeDifferenceGreaterThan } from '../time'

describe('时间工具', () => {
  describe('isTimeDifferenceGreaterThan', () => {
    it('当时间差大于指定毫秒数时，应该返回true', () => {
      const now = Date.now()
      const fourHoursAgo = now - 4 * 60 * 60 * 1000 // 4小时前
      const threeHours = 3 * 60 * 60 * 1000 // 3小时的毫秒数

      expect(isTimeDifferenceGreaterThan(fourHoursAgo, threeHours)).toBe(true)
    })

    it('当时间差小于指定毫秒数时，应该返回false', () => {
      const now = Date.now()
      const twoHoursAgo = now - 2 * 60 * 60 * 1000 // 2小时前
      const threeHours = 3 * 60 * 60 * 1000 // 3小时的毫秒数

      expect(isTimeDifferenceGreaterThan(twoHoursAgo, threeHours)).toBe(false)
    })
  })

  describe('formatDate', () => {
    it('应该正确格式化日期（中文）', () => {
      const date = '2024-01-01'
      const formatted = formatDate(date, 'zh-CN')
      expect(formatted).toMatch(/2024年.*1月.*1日/)
    })

    it('应该正确格式化日期（英文）', () => {
      const date = '2024-01-01'
      const formatted = formatDate(date, 'en-US')
      expect(formatted).toMatch(/January 1, 2024/)
    })
  })

  describe('formatToSemanticTime', () => {
    beforeAll(() => {
      // 模拟当前时间为 2024-01-01 12:00:00
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2024-01-01T12:00:00'))
    })

    it('应该返回最近日期的相对时间', () => {
      const timeString = '2024-01-01T11:30:00' // 30分钟前
      const formatted = formatToSemanticTime(timeString, 'en')
      expect(formatted).toMatch(/30 minutes ago/)
    })

    it('应该返回一周内日期的日历格式', () => {
      const twoDaysAgo = '2023-12-30T12:00:00' // 星期六
      const formatted = formatToSemanticTime(twoDaysAgo, 'en')
      expect(formatted).toMatch(/Saturday at 12:00 PM/)
    })

    it('应该返回一周前日期的完整日期格式', () => {
      const twoWeeksAgo = '2023-12-15T12:00:00' // 2023年12月15日，星期五
      const formatted = formatToSemanticTime(twoWeeksAgo, 'en')
      expect(formatted).toMatch(/Fri, Dec 15, 2023 12:00 PM/)
    })
  })
})
