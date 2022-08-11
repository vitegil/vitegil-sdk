import { reportTrackerData } from "./index";

/**
 * @connectTime TCP连接耗时
 * @ttfbTime 第一个响应耗时,ttfb时间
 * @responseTime 响应时间
 * @parseDOMTime DOM解析时间
 * @domContentLoadedTime DOMContentLoaded事件时间
 * @timeToInteractive 首次可交互时间
 * @loadTime 完整的页面加载时间
 */
export interface TimingData {
  connectTime: number | undefined,
  ttfbTime: number | undefined,
  responseTime: number | undefined,
  parseDOMTime: number | undefined,
  domContentLoadedTime: number | undefined,
  timeToInteractive: number | undefined,
  loadTime: number | undefined,
}

export enum TimingConfig {
  storageKey= 'timing',
}

export interface exportTimingData extends reportTrackerData {
  data: TimingData,
}
