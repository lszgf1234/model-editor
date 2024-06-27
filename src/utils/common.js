import Lodash from 'lodash'

/**
 * 文件下载 单文件或者多文件
 * @param val {[String, Array]}
 */
export function downloadFiles (val) {
  function download (url) {
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.style.height = 0
    iframe.src = url
    document.body.appendChild(iframe)
    setTimeout(() => {
      iframe.remove()
    }, 1000 * 15)
  }

  if (val instanceof Array) {
    for (it of val) {
      download(it)
    }
  } else {
    download(val)
  }
}

/*
* 千分位转化
* @params
*   s {Number}
*   type {Number}
*     取值为0不显示浮点，其他显示
* */
export function formatMoney (s, type) {
  if (/[^0-9\.]/.test(s))
    return '0.00'
  if (s === null || s === 'null' || s === '')
    return '0.00'
  s = s.toString().replace(/^(\d*)$/, '$1.')
  s = (s + '00').replace(/(\d*\.\d\d)\d*/, '$1')
  s = s.replace('.', ',')
  let re = /(\d)(\d{3},)/
  while (re.test(s))
    s = s.replace(re, '$1,$2')

  s = s.replace(/,(\d\d)$/, '.$1')
  if (type === 0) {
    let a = s.split('.')
    if (a[1] === '00') {
      s = a[0]
    }
  }
  return s
}

/**
 * 字节格式化
 *
 * @param val {Number} - 字节大小
 * @return {String} - 格式化后的尺寸大小
 */
export function humanizeFileSize (val) {
  const ONE_KB = 1024
  const ONE_MB = ONE_KB * 1024

  if (val >= ONE_MB) {
    return `${Math.round(val / ONE_MB * 10) / 10}MB`
  } else if (val >= ONE_KB) {
    return `${Math.round(val / ONE_KB * 10) / 10}KB`
  } else {
    return `${val}B`
  }
}

/**
 * 拼接后端返回的图片key
 * @param val {String} - 字符串
 * @return {String} - 图片地址
 */
export function toImgHref (val) {
  if (!val) return ''
  return `${process.env.NUXT_ENV_ALL_ENDPOINT_HTTP}/fileDownload?ambryId=${val}&show=true`
}

export function toFileHref (val) {
  if (!val) return ''
  return `${process.env.NUXT_ENV_ALL_ENDPOINT_HTTP}/fileDownload?ambryId=${val}`
}

/**
 * 生成一个随机数
 * * @param [val] {String} - 字符串(可有可无)
 * *  @return {String} - 字符串
 */
export function newUniqueField (val) {
  let str = `${+new Date()}${Lodash.random(10000, 99999)}`
  val && (str = val + str)
  return str
}

/**
 * 生成一个字符串
 * * @param [val] {String} - 字符串(可有可无)
 * *  @return {String} - 字符串
 */
export function randomString (len, start) {
  len = len || 32
  let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz12345678'
  let maxPos = $chars.length
  let checkcode = start || ''
  for (let i = 0 ; i < len ; i++) {
    checkcode += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return checkcode
}

/**
 * 删除 __typename
 * * @param [val] {Object} - 对象(可有可无)
 *  @return {Object} - 字符串
 */
export function delTypeName (val) {
  let obj = Lodash.cloneDeep(val)

  let delFiled = (obj) => {
    for (let key in obj) {
      if (key === '__typename') {
        delete obj[key]
      }

      if (obj[key] instanceof Object) {
        delFiled(obj[key])
      }
    }
  }

  delFiled(obj)

  return obj
}

/**
 * 获取非空（包含取值为false）参数
 * @param val {Object} - 对象
 * @return {Object} - 对象
 */
export function validParams (obj) {
  if (typeof obj === 'object') {
    let params = {}
    for (let key in obj) {
      if (!(obj[key] === '')) {
        params[key] = obj[key]
      }
    }
    return params
  } else {
    return obj
  }
}

/*跳转登录*/
export function goto () {
  let url = `${process.env.NUXT_ENV_LOGIN_URL}?redirect_url=${encodeURIComponent(location.href)}`
  console.log(url)
  location.href = url
}
