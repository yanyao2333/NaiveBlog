import moment from 'moment/min/moment-with-locales'

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

export const formatDate = (date: string, locale = 'zh-CN') => {
  const dateObj = new Date(date)
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return dateObj.toLocaleDateString(locale, options)
}

/**
 * 使用 moment.js 将时间字符串格式化为语义化的时间字符串
 * @param timeString 时间字符串
 * @returns 格式化后的时间字符串
 */
export function formatToSemanticTime(timeString, locale) {
  const targetTime = moment(timeString).locale(locale)
  const diffDays = moment().diff(targetTime, 'days')
  switch (true) {
    case diffDays < 1:
      return targetTime.fromNow()
    case diffDays >= 1 && diffDays < 7:
      return targetTime.calendar()
    case diffDays >= 7:
      return targetTime.format('llll')
  }
}
