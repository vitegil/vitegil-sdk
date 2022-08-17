import type { reportTrackerData } from './index'

export const BrowserType = [
  'Safari', 'Chrome', 'Edge', 'IE', 'Firefox', 'Firefox Focus', 'Chromium', 'Opera', 'Vivaldi', 'Yandex', 'Arora', 'Lunascape', 'QupZilla', 'Coc Coc', 'Kindle', 'Iceweasel', 'Konqueror', 'Iceape', 'SeaMonkey', 'Epiphany', '360', '360SE', '360EE', 'UC', 'QQBrowser', 'QQ', 'Baidu', 'Maxthon', 'Sogou', 'LBBROWSER', '2345Explorer', 'TheWorld', 'XiaoMi', 'Quark', 'Qiyu', 'Wechat', 'Taobao', 'Alipay', 'Weibo', 'Douban', 'Suning', 'iQiYi',
]
export const OsType = [
  'Windows', 'Linux', 'Mac OS', 'Android', 'Ubuntu', 'FreeBSD', 'Debian', 'iOS', 'Windows Phone', 'BlackBerry', 'MeeGo', 'Symbian', 'Chrome OS', 'WebOS',
]
export const DeviceType = [
  'Mobile', 'Tablet', 'iPad',
]
export const EngineType = [
  'Trident', 'Presto', 'WebKit', 'Gecko',
]

export interface version {
  [key: string]: (param: string) => string
}

export const BrowserVersionMap: version = {
  'Safari': (u) => {
    return u.replace(/^.*Version\/([\d.]+).*$/, '$1')
  },
  'Chrome': (u) => {
    return u.replace(/^.*Chrome\/([\d.]+).*$/, '$1').replace(/^.*CriOS\/([\d.]+).*$/, '$1')
  },
  'IE': (u) => {
    return u.replace(/^.*MSIE ([\d.]+).*$/, '$1').replace(/^.*rv:([\d.]+).*$/, '$1')
  },
  'Edge': (u) => {
    return u.replace(/^.*Edge\/([\d.]+).*$/, '$1')
  },
  'Firefox': (u) => {
    return u.replace(/^.*Firefox\/([\d.]+).*$/, '$1').replace(/^.*FxiOS\/([\d.]+).*$/, '$1')
  },
  'Firefox Focus': (u) => {
    return u.replace(/^.*Focus\/([\d.]+).*$/, '$1')
  },
  'Chromium': (u) => {
    return u.replace(/^.*Chromium\/([\d.]+).*$/, '$1')
  },
  'Opera': (u) => {
    return u.replace(/^.*Opera\/([\d.]+).*$/, '$1').replace(/^.*OPR\/([\d.]+).*$/, '$1')
  },
  'Vivaldi': (u) => {
    return u.replace(/^.*Vivaldi\/([\d.]+).*$/, '$1')
  },
  'Yandex': (u) => {
    return u.replace(/^.*YaBrowser\/([\d.]+).*$/, '$1')
  },
  'Arora': (u) => {
    return u.replace(/^.*Arora\/([\d.]+).*$/, '$1')
  },
  'Lunascape': (u) => {
    return u.replace(/^.*Lunascape[\/\s]([\d.]+).*$/, '$1')
  },
  'QupZilla': (u) => {
    return u.replace(/^.*QupZilla[\/\s]([\d.]+).*$/, '$1')
  },
  'Coc Coc': (u) => {
    return u.replace(/^.*coc_coc_browser\/([\d.]+).*$/, '$1')
  },
  'Kindle': (u) => {
    return u.replace(/^.*Version\/([\d.]+).*$/, '$1')
  },
  'Iceweasel': (u) => {
    return u.replace(/^.*Iceweasel\/([\d.]+).*$/, '$1')
  },
  'Konqueror': (u) => {
    return u.replace(/^.*Konqueror\/([\d.]+).*$/, '$1')
  },
  'Iceape': (u) => {
    return u.replace(/^.*Iceape\/([\d.]+).*$/, '$1')
  },
  'SeaMonkey': (u) => {
    return u.replace(/^.*SeaMonkey\/([\d.]+).*$/, '$1')
  },
  'Epiphany': (u) => {
    return u.replace(/^.*Epiphany\/([\d.]+).*$/, '$1')
  },
  '360': (u) => {
    return u.replace(/^.*QihooBrowser\/([\d.]+).*$/, '$1')
  },
  '360SE': (u) => {
    const hash: Record<string, string> = {
      63: '10.0',
      55: '9.1',
      45: '8.1',
      42: '8.0',
      31: '7.0',
      21: '6.3',
    }
    const vision = u.replace(/^.*Chrome\/([\d]+).*$/, '$1')
    return hash[vision] || ''
  },
  '360EE': (u) => {
    const hash: Record<string, string> = {
      69: '11.0',
      63: '9.5',
      55: '9.0',
      50: '8.7',
      30: '7.5',
    }
    const vision = u.replace(/^.*Chrome\/([\d]+).*$/, '$1')
    return hash[vision] || ''
  },
  'Maxthon': (u) => {
    return u.replace(/^.*Maxthon\/([\d.]+).*$/, '$1')
  },
  'QQBrowser': (u) => {
    return u.replace(/^.*QQBrowser\/([\d.]+).*$/, '$1')
  },
  'QQ': (u) => {
    return u.replace(/^.*QQ\/([\d.]+).*$/, '$1')
  },
  'Baidu': (u) => {
    return u.replace(/^.*BIDUBrowser[\s\/]([\d.]+).*$/, '$1')
  },
  'UC': (u) => {
    return u.replace(/^.*UC?Browser\/([\d.]+).*$/, '$1')
  },
  'Sogou': (u) => {
    return u.replace(/^.*SE ([\d.X]+).*$/, '$1').replace(/^.*SogouMobileBrowser\/([\d.]+).*$/, '$1')
  },
  'LBBROWSER': (u) => {
    const hash: Record<string, string> = {
      57: '6.5',
      49: '6.0',
      46: '5.9',
      42: '5.3',
      39: '5.2',
      34: '5.0',
      29: '4.5',
      21: '4.0',
    }
    const vision = u.replace(/^.*Chrome\/([\d]+).*$/, '$1')
    return hash[vision] || ''
  },
  '2345Explorer': (u) => {
    return u.replace(/^.*2345Explorer\/([\d.]+).*$/, '$1')
  },
  'TheWorld': (u) => {
    return u.replace(/^.*TheWorld ([\d.]+).*$/, '$1')
  },
  'XiaoMi': (u) => {
    return u.replace(/^.*MiuiBrowser\/([\d.]+).*$/, '$1')
  },
  'Quark': (u) => {
    return u.replace(/^.*Quark\/([\d.]+).*$/, '$1')
  },
  'Qiyu': (u) => {
    return u.replace(/^.*Qiyu\/([\d.]+).*$/, '$1')
  },
  'Wechat': (u) => {
    return u.replace(/^.*MicroMessenger\/([\d.]+).*$/, '$1')
  },
  'Taobao': (u) => {
    return u.replace(/^.*AliApp\(TB\/([\d.]+).*$/, '$1')
  },
  'Alipay': (u) => {
    return u.replace(/^.*AliApp\(AP\/([\d.]+).*$/, '$1')
  },
  'Weibo': (u) => {
    return u.replace(/^.*weibo__([\d.]+).*$/, '$1')
  },
  'Douban': (u) => {
    return u.replace(/^.*com.douban.frodo\/([\d.]+).*$/, '$1')
  },
  'Suning': (u) => {
    return u.replace(/^.*SNEBUY-APP([\d.]+).*$/, '$1')
  },
  'iQiYi': (u) => {
    return u.replace(/^.*IqiyiVersion\/([\d.]+).*$/, '$1')
  },
}

export const OsVersionMap: version = {
  'Windows': (u) => {
    const v: string = u.replace(/^.*Windows NT ([\d.]+);.*$/, '$1')
    const oldWindowsVersionMap: Record<string, string> = {
      '6.4': '10',
      '6.3': '8.1',
      '6.2': '8',
      '6.1': '7',
      '6.0': 'Vista',
      '5.2': 'XP',
      '5.1': 'XP',
      '5.0': '2000',
    }
    return (oldWindowsVersionMap[v] || v) as string
  },
  'Android': (u) => {
    return u.replace(/^.*Android ([\d.]+);.*$/, '$1')
  },
  'iOS': (u) => {
    return u.replace(/^.*OS ([\d_]+) like.*$/, '$1').replace(/_/g, '.')
  },
  'Debian': (u) => {
    return u.replace(/^.*Debian\/([\d.]+).*$/, '$1')
  },
  'Windows Phone': (u) => {
    return u.replace(/^.*Windows Phone( OS)? ([\d.]+);.*$/, '$2')
  },
  'Mac OS': (u) => {
    return u.replace(/^.*Mac OS X ([\d_]+).*$/, '$1').replace(/_/g, '.')
  },
  'WebOS': (u) => {
    return u.replace(/^.*hpwOS\/([\d.]+);.*$/, '$1')
  },
}

/**
 * @deviceType 设备类型
 * @OS 操作系统
 * @OSVersion 操作系统版本
 * @screenHeight 屏幕高
 * @screenWidth 屏幕宽
 * @language 当前使用的语言-国家
 * @network 联网类型
 * @orientation 横竖屏
 * @browser 浏览器类型
 * @browserInfo 浏览器信息
 */
export interface DeviceData {
  deviceType: string | undefined
  OS: string | undefined
  OSVersion: string | undefined
  screenHeight: number | undefined
  screenWidth: number | undefined
  language: string | undefined
  network: string | undefined
  orientation: string | undefined
  browser: string | undefined
  browserInfo: string | undefined
}

export interface exportDeviceData extends reportTrackerData {
  deviceType: string | undefined
  OS: string | undefined
  OSVersion: string | undefined
  screenHeight: number | undefined
  screenWidth: number | undefined
  language: string | undefined
  netWork: string | undefined
  orientation: string | undefined
  browser: string | undefined
  browserInfo: string | undefined
}

