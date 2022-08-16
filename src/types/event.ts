import type { DeviceData } from './device'
import type { PerformanceData, TimingData } from './timing'

export enum eventType {
  jsError = 'js-error',
  promiseError = 'promise-error',
  resourceError = 'resource-error',
  clickEvent = 'click-event',
  uvEvent = 'uv-event',
  deviceEvent = 'device-event',
  timing = 'timing',
  performance = 'performance',
}

export interface DeviceEventData {
  event: eventType.deviceEvent
  targetKey: string
  data: DeviceData
}

export interface ClickEventData {
  event: eventType.clickEvent
  targetKey: string
  data: {
    x: number
    y: number
  }
}

export interface UVEventData {
  event: eventType.uvEvent
  targetKey: string
  data: string // 唯一标识符，可以计算总数获得uv
}

export interface JSErrorData {
  event: eventType.jsError
  targetKey: string
  data: {
    message: string
    filename: string
    lineno: number
    colno: number
  }
}

export interface PromiseErrorData {
  event: eventType.promiseError
  targetKey: string
  data: {
    message: string
    filename: string
    err: any
  }
}

export interface ResourceErrorData {
  event: eventType.resourceError
  targetKey: string
  data: {
    url: string | undefined
  }
}

export interface TimingEventData {
  event: eventType.timing
  targetKey: string
  data: TimingData
}

export interface PerformanceEventData {
  event: eventType.performance
  targetKey: string
  data: PerformanceData
  firstMeaningfulPaint?: string
}
