/**
 * @uuid uv
 * @requestUrl 接口地址
 * @historyTracker history上报
 * @hashTracker hash上报
 * @domTracker 携带 Tracker-key 点击事件上报
 * @sdkVersion sdk版本
 * @extra 用户自定义参数
 * @jsError js 和 promise 报错异常上报
 * @lazyReport 懒上报
 */
export interface DefaultOptons {
  uuid: string | undefined,
  requestUrl: string | undefined,
  historyTracker: boolean,
  hashTracker: boolean,
  domTracker: boolean,
  sdkVersion: string | number,
  extra: Record<string, any> | undefined,
  jsError:boolean,
  lazyReport: boolean | undefined,
  timeTracker: boolean,
}

export interface Options extends Partial<DefaultOptons> {
  requestUrl: string
}

export enum TrackerConfig {
  version = '1.0.0',
  requestUrl = 'https://koa-template-382-4-1312741325.sh.run.tcloudbase.com/api/test',
}

// remove 'mousemove' error
export const MouseEventList: string[] = ['click', 'dblclick', 'contextmenu', 'mousedown', 'mouseup', 'mouseover', 'mouseout'];

// 上报必传参数
export type reportTrackerData = {
  [key: string]: any,
  event: string,
  targetKey: string
}
