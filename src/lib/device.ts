import { BrowserType, OsType, DeviceType, EngineType, OsVersionMap, DeviceData, BrowserVersionMap } from '../types/device'

const _window: Window = window

interface InfoMap {
  [key: string]: boolean
}

function getMatchMap(u: string): InfoMap {
  return {
    // 内核
    Trident: u.indexOf('Trident') > -1 || u.indexOf('NET CLR') > -1,
    Presto: u.indexOf('Presto') > -1,
    WebKit: u.indexOf('AppleWebKit') > -1,
    Gecko: u.indexOf('Gecko/') > -1,
    // 浏览器
    Safari: u.indexOf('Safari') > -1,
    Chrome: u.indexOf('Chrome') > -1 || u.indexOf('CriOS') > -1,
    IE: u.indexOf('MSIE') > -1 || u.indexOf('Trident') > -1,
    Edge: u.indexOf('Edge') > -1,
    Firefox: u.indexOf('Firefox') > -1 || u.indexOf('FxiOS') > -1,
    'Firefox Focus': u.indexOf('Focus') > -1,
    Chromium: u.indexOf('Chromium') > -1,
    Opera: u.indexOf('Opera') > -1 || u.indexOf('OPR') > -1,
    Vivaldi: u.indexOf('Vivaldi') > -1,
    Yandex: u.indexOf('YaBrowser') > -1,
    Arora: u.indexOf('Arora') > -1,
    Lunascape: u.indexOf('Lunascape') > -1,
    QupZilla: u.indexOf('QupZilla') > -1,
    'Coc Coc': u.indexOf('coc_coc_browser') > -1,
    Kindle: u.indexOf('Kindle') > -1 || u.indexOf('Silk/') > -1,
    Iceweasel: u.indexOf('Iceweasel') > -1,
    Konqueror: u.indexOf('Konqueror') > -1,
    Iceape: u.indexOf('Iceape') > -1,
    SeaMonkey: u.indexOf('SeaMonkey') > -1,
    Epiphany: u.indexOf('Epiphany') > -1,
    '360': u.indexOf('QihooBrowser') > -1 || u.indexOf('QHBrowser') > -1,
    '360EE': u.indexOf('360EE') > -1,
    '360SE': u.indexOf('360SE') > -1,
    UC: u.indexOf('UC') > -1 || u.indexOf(' UBrowser') > -1,
    QQBrowser: u.indexOf('QQBrowser') > -1,
    QQ: u.indexOf('QQ/') > -1,
    Baidu: u.indexOf('Baidu') > -1 || u.indexOf('BIDUBrowser') > -1,
    Maxthon: u.indexOf('Maxthon') > -1,
    Sogou: u.indexOf('MetaSr') > -1 || u.indexOf('Sogou') > -1,
    LBBROWSER: u.indexOf('LBBROWSER') > -1,
    '2345Explorer': u.indexOf('2345Explorer') > -1,
    TheWorld: u.indexOf('TheWorld') > -1,
    XiaoMi: u.indexOf('MiuiBrowser') > -1,
    Quark: u.indexOf('Quark') > -1,
    Qiyu: u.indexOf('Qiyu') > -1,
    Wechat: u.indexOf('MicroMessenger') > -1,
    Taobao: u.indexOf('AliApp(TB') > -1,
    Alipay: u.indexOf('AliApp(AP') > -1,
    Weibo: u.indexOf('Weibo') > -1,
    Douban: u.indexOf('com.douban.frodo') > -1,
    Suning: u.indexOf('SNEBUY-APP') > -1,
    iQiYi: u.indexOf('IqiyiApp') > -1,
    // 操作系统或平台
    Windows: u.indexOf('Windows') > -1,
    Linux: u.indexOf('Linux') > -1 || u.indexOf('X11') > -1,
    'Mac OS': u.indexOf('Macintosh') > -1,
    Android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1,
    Ubuntu: u.indexOf('Ubuntu') > -1,
    FreeBSD: u.indexOf('FreeBSD') > -1,
    Debian: u.indexOf('Debian') > -1,
    'Windows Phone': u.indexOf('IEMobile') > -1 || u.indexOf('Windows Phone') > -1,
    BlackBerry: u.indexOf('BlackBerry') > -1 || u.indexOf('RIM') > -1,
    MeeGo: u.indexOf('MeeGo') > -1,
    Symbian: u.indexOf('Symbian') > -1,
    iOS: u.indexOf('like Mac OS X') > -1,
    'Chrome OS': u.indexOf('CrOS') > -1,
    WebOS: u.indexOf('hpwOS') > -1,
    // 设备
    Mobile: u.indexOf('Mobi') > -1 || u.indexOf('iPh') > -1 || u.indexOf('480') > -1,
    Tablet: u.indexOf('Tablet') > -1 || u.indexOf('Nexus 7') > -1,
    iPad: u.indexOf('iPad') > -1
  }
}

function getValue(map: InfoMap, type: string[]): string | undefined {
  let value: string | undefined
  for (let key in map) {
    if ((map[key] == true) && (type.includes(key))) {
      value = key
    }
  }
  return value
}

function getOsVersion(os: string | undefined, u: string): string {
  if (typeof os == 'undefined') {
    return ''
  } else {
    if (typeof OsVersionMap[os] == 'function') {
      return OsVersionMap[os](u)
    }
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
  var orientation = _window.matchMedia('(orientation: portrait)')
  if (orientation.matches) {
    orientationStatus = 'portrait'
  } else {
    orientationStatus = 'landscape'
  }
  return orientationStatus
}

function getBrowserInfo(map: InfoMap, u: string) {
  // 获得浏览器类型
  let browser = getValue(map, BrowserType)
  if (typeof browser == 'undefined') {
    return ''
  }
  // 获得浏览器版本
  let version = ''
  if (typeof BrowserVersionMap[browser] == 'function') {
    version = BrowserVersionMap[browser](u)
  }
  if (version == u) {
    return `${browser}`
  }
  // 获得浏览器内核
  let engine = getValue(map, EngineType)
  switch (browser) {
    case 'Edge':
      engine = 'EdgeHTML'
      break
    case 'Chrome':
      if (parseInt(version) > 27) {
        engine = 'Blink'
      }
      break
    case 'Opera':
      if (parseInt(version) > 12) {
        engine = 'Blink'
      }
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
      browserInfo: getBrowserInfo(map, ua)
    }
    // console.log(data)
    return data
  } else {
    console.log('not support')
  }
}