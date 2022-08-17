export enum eventType {
  jsError = 'js-error',
  promiseError = 'promise-error',
  resourceError = 'resource-error',
  clickEvent = 'click-event',
  deviceEvent = 'device-event',
  performance = 'performance',
}

export interface DeviceEventData {
  event: eventType.deviceEvent
  targetKey: string
}

export interface ClickEventData {
  event: eventType.clickEvent
  targetKey: string
}

export interface JSErrorData {
  event: eventType.jsError
  targetKey: string
}

export interface PromiseErrorData {
  event: eventType.promiseError
  targetKey: string
}

export interface ResourceErrorData {
  event: eventType.resourceError
  targetKey: string
}

export interface PerformanceEventData {
  event: eventType.performance
  targetKey: string
  firstMeaningfulPaint?: string
}
