import type { reportTrackerData } from './index'

/**
 * @connectTime TCP连接耗时
 * @ttfbTime ttfb时间:发出页面请求到接收到应答数据第一个字节所花费的毫秒数
 * @responseTime 响应时间
 * @parseDOMTime 解析DOM时间
 * @domContentLoadedTime DOMContentLoaded事件时间
 * @domContentLoaded DOMContentLoaded时间
 * @loadTime 完整的页面加载时间
 * @parseDNSTime DNS解析时间
 * @domReadyTime DOM准备总时间
 */
export interface TimingData {
  connectTime: number | undefined
  ttfbTime: number | undefined
  responseTime: number | undefined
  parseDOMTime: number | undefined
  domContentLoadedTime: number | undefined
  domContentLoaded: number | undefined
  loadTime: number | undefined
  parseDNSTime: number | undefined
  domReadyTime: number | undefined
}

/**
 * @firstPaint 页面首次渲染时间，即白屏时间
 * @firstContentfulPaint 首次有内容渲染
 * @largestContentfulPaint 最大可交互内容渲染时间
 * @timeToInteractive 首次可交互时间
 * @firstMeaningfulPaint 首次有意义渲染
 */
export interface PerformanceData {
  firstPaint: number | undefined
  firstContentfulPaint: number | undefined
  largestContentfulPaint: number | undefined
  timeToInteractive: number | undefined
  firstMeaningfulPaint?: number | undefined
}

export enum TimeConfig {
  PerformanceKey = 'performance',
}

/**
 * @url 页面URL(location.href)
 */
export interface exportTPData extends reportTrackerData {
  url: string | undefined
  connectTime: number | undefined
  ttfbTime: number | undefined
  responseTime: number | undefined
  parseDOMTime: number | undefined
  domContentLoadedTime: number | undefined
  domContentLoaded: number | undefined
  loadTime: number | undefined
  parseDNSTime: number | undefined
  domReadyTime: number | undefined
  firstPaint: number | undefined
  firstContentfulPaint: number | undefined
  largestContentfulPaint: number | undefined
  timeToInteractive: number | undefined
  firstMeaningfulPaint?: number | undefined
}
