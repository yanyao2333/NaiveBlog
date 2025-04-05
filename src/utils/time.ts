import dayjs from 'dayjs'
import './zh-cn'
import calendar from 'dayjs/plugin/calendar'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'

/**
 * 比较目标时间戳与当前时间是否相差指定的毫秒数
 *
 * @param {number} targetTimestamp - 目标时间戳（毫秒）
 * @param {number} diffMilliseconds - 需要比较的毫秒数，默认是3小时（10800000毫秒）
 * @returns {boolean} - 如果时间差大于或等于指定的毫秒数，则返回true；否则返回false
 */
export function isTimeDifferenceGreaterThan(targetTimestamp, diffMilliseconds) {
  const currentTimestamp = Date.now()
  const timeDifference = Math.abs(currentTimestamp - targetTimestamp)
  return timeDifference >= diffMilliseconds
}

export const formatDate = (date: string | Date, locale = 'zh-CN') => {
  let dateObj: Date
  if (typeof date === 'string') {
    dateObj = new Date(date)
  } else {
    dateObj = date
  }
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return dateObj.toLocaleDateString(locale, options)
}

// 加载插件
dayjs.extend(relativeTime)
dayjs.extend(calendar)
dayjs.extend(LocalizedFormat)

/**
 * 使用 dayjs 将时间字符串格式化为语义化的时间字符串
 */
export function formatToSemanticTime(
  timeInput: string | Date | dayjs.Dayjs,
  locale?: string,
) {
  let targetTime: dayjs.Dayjs
  const newLocale = locale?.toLowerCase()
  if (newLocale !== 'zh-cn' && newLocale !== 'en') {
    targetTime = dayjs(timeInput)
  } else {
    targetTime = newLocale
      ? dayjs(timeInput).locale(newLocale)
      : dayjs(timeInput)
  }

  if (!targetTime.isValid()) {
    return 'Invalid Date'
  }

  const now = dayjs()

  if (now.isSame(targetTime, 'day')) {
    return targetTime.fromNow()
  }
  if (now.diff(targetTime, 'day') < 7) {
    return targetTime.calendar(now)
  }
  return targetTime.format('llll')
}
