/**
 * @uuid 用户id
 * @requestUrl 接口地址
 * @historyTracker history上报
 * @hashTracker hash上报
 * @domTracker 携带 Tracker-key 点击事件上报
 * @extra 用户自定义参数
 * @jsError js 和 promise 报错异常上报
 * @deviceTracker 设备信息
 * @lazyReport 懒上报
 */
export interface DefaultOptions {
  uuid: string | undefined
  requestUrl: string | undefined
  historyTracker: boolean
  hashTracker: boolean
  domTracker: boolean
  extra: Record<string, any> | undefined
  jsError: boolean
  lazyReport: boolean | undefined
  timeTracker: boolean
  deviceTracker: boolean | undefined
}

// requestUrl是Options必传的参数
export interface Options extends Partial<DefaultOptions> {
  requestUrl: string
}

// remove 'mousemove' error
export const MouseEventList: string[] = ['click', 'dblclick', 'contextmenu', 'mousedown', 'mouseup', 'mouseover', 'mouseout']

// 上报必传参数
export interface reportTrackerData {
  [key: string]: any
  event: string
  targetKey: string
}
