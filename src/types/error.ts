import type { reportTrackerData } from '../types/index'

export enum errorType {
  jsError = 'js-error',
  promiseError = 'promise-error',
  resourceError = 'resource-error',
  clickEvent = 'click-event',
}

/**
 * @errorInfo 错误信息
 * @errorRow 错误行号
 * @errorCol 错误列号
 * @errorExtra 错误额外信息
 * @errorUrl 请求资源错误，目标地址
 */
export interface errorData {
  errorInfo: string
  errorRow: number | undefined
  errorCol: number | undefined
  errorExtra: string | undefined
  errorUrl: string | undefined
}

/**
 * @url 页面URL(location.href)
 */
export interface exportErrorData extends reportTrackerData {
  url: string | undefined
  errorUrl: string | undefined
  errorInfo: string
  errorRow: number | undefined
  errorCol: number | undefined
  errorExtra: string | undefined
}
