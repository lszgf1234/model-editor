import Lodash from 'lodash'
/**
 * 相对格式日期
 *
 * @param {*} msNum 时间戳
 */
export function relativeFormatDate (msNum = new Date().getTime()) {
  const getTime = msNum
  const currentTime = new Date().getTime()
  return showDate(currentTime, getTime)
}

/**
 * 相对时间-单位
 */
let unit = {
  daysAgo: '天前',
}
const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24 // 1天内
const TWO_DAYS_IN_MS = 1000 * 60 * 60 * 48 // 2天内
const THREE_DAYS_IN_MS = 1000 * 60 * 60 * 72 // 3天内

const showDate = (currentTime, getTime) => {
  let distance = currentTime - getTime // 当前系统时间与传入时间的差值
  distance = distance < 0 ? 0 : distance
  if (distance < ONE_DAY_IN_MS) {
    return formatDate(new Date(getTime), 'HH:mm')
  } else if (distance < TWO_DAYS_IN_MS) {
    return '1' + unit.daysAgo
  } else if (distance < THREE_DAYS_IN_MS) {
    return '2' + unit.daysAgo
  } else {
    return formatDate(new Date(getTime), 'MM-DD')
  }
}

/**
 * 时间格式化
 *
 * @param [d] {Date} - Date 对象，默认为当前时间
 * @param [format] {String} - 格式模板，默认为 `2019-04-01 01:02:03`
 * @return {String} - 格式化后的时间字符串
 */
export function formatDate (d = new Date(), format = 'YYYY-MM-DD HH:mm:ss') {
  if (typeof d === 'string') {
    d = new Date(d)
  }

  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const date = d.getDate()
  const hour = d.getHours()
  const minute = d.getMinutes()
  const second = d.getSeconds()

  return format
    .replace('YYYY', year)
    .replace('YY', (year % 100 + '').padStart(2, '0'))
    .replace('MM', (month + '').padStart(2, '0'))
    .replace('M', month)
    .replace('DD', (date + '').padStart(2, '0'))
    .replace('D', date)
    .replace('HH', (hour + '').padStart(2, '0'))
    .replace('H', hour)
    .replace('hh', (hour % 12 + '').padStart(2, '0'))
    .replace('h', hour % 12)
    .replace('mm', (minute + '').padStart(2, '0'))
    .replace('m', minute)
    .replace('ss', (second + '').padStart(2, '0'))
    .replace('s', second)
}

/**
 * 时间转化 天 小时 分 秒
 *
 * @param val {Number} - 毫秒
 * @return {String} - 格式化后的时间长度
 */
export function humanizeTime (val) {
  const m = 1000 * 60
  const h = 1000 * 60 * 60
  const d = 1000 * 60 * 60 * 24

  if (val >= d) {
    return `${Lodash.round(val / d, 1)}天`
  } else if (val >= h) {
    return `${Lodash.round(val / h, 1)}小时`
  } else if (val >= m) {
    return `${Math.round(val / m)}分钟`
  } else {
    return `${Math.round(val / 1000)}秒`
  }
}
