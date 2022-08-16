import type { DeviceData } from '../types/device'
import { BrowserType, BrowserVersionMap, DeviceType, EngineType, OsType, OsVersionMap } from '../types/device'

const _window: Window = window

interface InfoMap {
  [key: string]: boolean
}

function getMatchMap(u: string): InfoMap {
  return {
    // 内核
    'Trident': u.includes('Trident') || u.includes('NET CLR'),
    'Presto': u.includes('Presto'),
    'WebKit': u.includes('AppleWebKit'),
    'Gecko': u.includes('Gecko/'),
    // 浏览器
    'Safari': u.includes('Safari'),
    'Chrome': u.includes('Chrome') || u.includes('CriOS'),
    'IE': u.includes('MSIE') || u.includes('Trident'),
    'Edge': u.includes('Edge'),
    'Firefox': u.includes('Firefox') || u.includes('FxiOS'),
    'Firefox Focus': u.includes('Focus'),
    'Chromium': u.includes('Chromium'),
    'Opera': u.includes('Opera') || u.includes('OPR'),
    'Vivaldi': u.includes('Vivaldi'),
    'Yandex': u.includes('YaBrowser'),
    'Arora': u.includes('Arora'),
    'Lunascape': u.includes('Lunascape'),
    'QupZilla': u.includes('QupZilla'),
    'Coc Coc': u.includes('coc_coc_browser'),
    'Kindle': u.includes('Kindle') || u.includes('Silk/'),
    'Iceweasel': u.includes('Iceweasel'),
    'Konqueror': u.includes('Konqueror'),
    'Iceape': u.includes('Iceape'),
    'SeaMonkey': u.includes('SeaMonkey'),
    'Epiphany': u.includes('Epiphany'),
    '360': u.includes('QihooBrowser') || u.includes('QHBrowser'),
    '360EE': u.includes('360EE'),
    '360SE': u.includes('360SE'),
    'UC': u.includes('UC') || u.includes(' UBrowser'),
    'QQBrowser': u.includes('QQBrowser'),
    'QQ': u.includes('QQ/'),
    'Baidu': u.includes('Baidu') || u.includes('BIDUBrowser'),
    'Maxthon': u.includes('Maxthon'),
    'Sogou': u.includes('MetaSr') || u.includes('Sogou'),
    'LBBROWSER': u.includes('LBBROWSER'),
    '2345Explorer': u.includes('2345Explorer'),
    'TheWorld': u.includes('TheWorld'),
    'XiaoMi': u.includes('MiuiBrowser'),
    'Quark': u.includes('Quark'),
    'Qiyu': u.includes('Qiyu'),
    'Wechat': u.includes('MicroMessenger'),
    'Taobao': u.includes('AliApp(TB'),
    'Alipay': u.includes('AliApp(AP'),
    'Weibo': u.includes('Weibo'),
    'Douban': u.includes('com.douban.frodo'),
    'Suning': u.includes('SNEBUY-APP'),
    'iQiYi': u.includes('IqiyiApp'),
    // 操作系统或平台
    'Windows': u.includes('Windows'),
    'Linux': u.includes('Linux') || u.includes('X11'),
    'Mac OS': u.includes('Macintosh'),
    'Android': u.includes('Android') || u.includes('Adr'),
    'Ubuntu': u.includes('Ubuntu'),
    'FreeBSD': u.includes('FreeBSD'),
    'Debian': u.includes('Debian'),
    'Windows Phone': u.includes('IEMobile') || u.includes('Windows Phone'),
    'BlackBerry': u.includes('BlackBerry') || u.includes('RIM'),
    'MeeGo': u.includes('MeeGo'),
    'Symbian': u.includes('Symbian'),
    'iOS': u.includes('like Mac OS X'),
    'Chrome OS': u.includes('CrOS'),
    'WebOS': u.includes('hpwOS'),
    // 设备
    'Mobile': u.includes('Mobi') || u.includes('iPh') || u.includes('480'),
    'Tablet': u.includes('Tablet') || u.includes('Nexus 7'),
    'iPad': u.includes('iPad'),
  }
}

function getValue(map: InfoMap, type: string[]): string | undefined {
  let value: string | undefined
  for (const key in map) {
    if ((map[key] === true) && (type.includes(key)))
      value = key
  }
  return value
}

function getOsVersion(os: string | undefined, u: string): string {
  if (typeof os == 'undefined') {
    return ''
  }
  else {
    if (typeof OsVersionMap[os] == 'function')
      return OsVersionMap[os](u)

    return ''
  }
}

function getNetwork(navigator: any) {
  const netWork = navigator && navigator.connection && navigator.connection.effectiveType
  return netWork
}

function getLanguage(navigator: any) {
  return navigator.browserLanguage || navigator.language
}

function getOrientationStatu(_window: any) {
  let orientationStatus = ''
  const orientation = _window.matchMedia('(orientation: portrait)')
  if (orientation.matches)
    orientationStatus = 'portrait'
  else
    orientationStatus = 'landscape'

  return orientationStatus
}

function getBrowserInfo(map: InfoMap, u: string) {
  // 获得浏览器类型
  const browser = getValue(map, BrowserType)
  if (typeof browser == 'undefined')
    return ''

  // 获得浏览器版本
  let version = ''
  if (typeof BrowserVersionMap[browser] == 'function')
    version = BrowserVersionMap[browser](u)

  if (version === u)
    return `${browser}`

  // 获得浏览器内核
  let engine = getValue(map, EngineType)
  switch (browser) {
    case 'Edge':
      engine = 'EdgeHTML'
      break
    case 'Chrome':
      if (parseInt(version) > 27)
        engine = 'Blink'

      break
    case 'Opera':
      if (parseInt(version) > 12)
        engine = 'Blink'

      break
    case 'Yandex':
      engine = 'Blink'
      break
    default:
      break
  }
  return `${browser}-${version}-${engine}`
}

export function getDeviceData() {
  if (_window.navigator) {
    const navigator = _window.navigator
    const ua = _window.navigator.userAgent
    const map = getMatchMap(ua)
    const data: DeviceData = {
      deviceType: getValue(map, DeviceType) || 'PC',
      OS: getValue(map, OsType),
      OSVersion: getOsVersion(getValue(map, OsType), ua),
      screenHeight: _window.screen.height,
      screenWidth: _window.screen.width,
      language: getLanguage(navigator),
      netWork: getNetwork(navigator),
      orientation: getOrientationStatu(_window),
      browser: getValue(map, BrowserType),
      browserInfo: getBrowserInfo(map, ua),
    }
    // console.log(data)
    return data
  }
  else {
    console.error('not support current browser')
  }
}
