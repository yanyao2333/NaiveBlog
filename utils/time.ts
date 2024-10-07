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
