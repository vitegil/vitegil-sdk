/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { DefaultOptions, Options, reportTrackerData } from '../types/index'
import type { errorData, exportErrorData } from '../types/error'
import { errorType } from '../types/error'
import { MouseEventList } from '../types/index'
import { timing } from '../lib/timing'
import FMPTiming from '../lib/fmp'
import { getDeviceData } from '../lib/device'
import { createHistoryEvent } from '../utils/pv'
import fingerprinting from '../utils/fingerprinting'
import { saveTrackerArray, saveTrackerData } from '../utils/save'
import { reportStorageInfo, reportTrackerInfo } from '../utils/report'

export default class Tracker {
  public data: Options

  constructor(options: Options) {
    this.data = Object.assign(this.initDef(), options)
    this.setUserId(fingerprinting())
    this.setAppid(window.location.host)
    this.installTracker()
  }

  private initDef(): DefaultOptions {
    // pushState() will change the URL, and keep the old one in the browser history
    // (ie. pressing the back button will take you back)
    window.history.pushState = createHistoryEvent('pushState')

    // replaceState() will change the URL in the browser
    // (ie. pressing the back button won't take you back)
    window.history.replaceState = createHistoryEvent('replaceState')

    return <DefaultOptions>{
      historyTracker: false,
      hashTracker: false,
      domTracker: false,
      jsError: false,
      lazyReport: false,
      timeTracker: false,
      deviceTracker: false,
    }
  }

  /**
   * 设置唯一标识
   */
  public setUserId <T extends DefaultOptions['uuid']>(id: T): void {
    this.data.uuid = id
    localStorage.setItem('uuid', this.data.uuid as string)
  }

  /**
   * 用户自定义添加参数
   */
  public setExtra<T extends DefaultOptions['extra']>(extra: T): void {
    this.data.extra = extra
  }

  /**
   * 设置监控应用的地址
   */
  public setAppid<T extends DefaultOptions['appId']>(appid: T): void {
    this.data.appId = appid
    localStorage.setItem('appId', this.data.appId as string)
  }

  /**
   * 手动上报信息
   * @type reportTrackerData 上传数据类型
   */
  public sendTracker<T extends reportTrackerData>(data: T) {
    // this.reportTracker(data)
    reportTrackerInfo(JSON.stringify(data), this.data.requestUrl)
  }

  /**
   * 保存事件信息到本地
   * @param data 上报数据
   * @param key key
   */
  private saveTracker<T extends reportTrackerData >(data: T, key?: string, notArr?: boolean): void {
    if (key) {
      if (notArr) {
        saveTrackerData(data, key)
        return
      }
      saveTrackerArray(data, key)
    }
    else {
      if (notArr) {
        saveTrackerData(data, 'tracker')
        return
      }
      saveTrackerArray(data, 'tracker')
    }
  }

  /**
   * 上报信息到后台
   */
  // private reportTracker<T>(data: T) {
  //   const params = Object.assign(this.data, data, {
  //     time: new Date().getTime(),
  //   })
  //   const headers = {
  //     type: 'application/x-www-form-urlencoded',
  //   }
  //   const blob = new Blob([JSON.stringify(params)], headers)

  //   // 即使页面关闭了，sendBeacon也会完成请求（XMLHttpRequest不一定）
  //   // 由于data参数不支持JSON格式，这里使用Blob传数据
  //   navigator.sendBeacon(this.data.requestUrl, blob)
  // }

  /**
   * 关闭页面前，上报所有信息到后台
   */
  private reportTrackerArray(): void {
    // 单独的pv上报
    const pv = localStorage.getItem('pv')
    pv && reportTrackerInfo(pv, this.data.requestUrl)
    reportStorageInfo(this.data.requestUrl)
    localStorage.clear()
  }

  /**
   * 上报DOM点击事件
   */
  private reportDomTracker(): void {
    MouseEventList.forEach((event) => {
      window.addEventListener(event, (e) => {
        const target = e.target as HTMLElement
        const targetKey = target.querySelector('body')
        if (targetKey) {
          const domData: errorData = {
            errorRow: (e as MouseEvent).clientX,
            errorCol: (e as MouseEvent).clientY,
            errorUrl: '',
            errorExtra: '',
            errorInfo: '',
          }
          if (this.data.lazyReport) {
            this.saveTracker({
              event: `${event}-event`,
              targetKey: `${event}-event`,
              userId: this.data.uuid as string,
              time: new Date().getTime(),
              appId: this.data.appId as string,
              ...domData,
            })
            return
          }
          this.sendTracker({
            event: `${event}-event`,
            targetKey: `${event}-event`,
            userId: this.data.uuid as string,
            time: new Date().getTime(),
            appId: this.data.appId as string,
            ...domData,
          })
        }
      })
    })
  }

  /**
   * js错误
   */
  private jsError(): void {
    this.jsErrorEvent()
    this.promiseErrorEvent()
  }

  /**
   * 捕获js错误
   */
  private jsErrorEvent(): void {
    window.addEventListener('error', (e) => {
      if (this.isResourseError(e))
        return
      const errorData: errorData = {
        errorCol: e.colno,
        errorRow: e.lineno,
        errorInfo: e.message,
        errorExtra: e.error.stack || JSON.stringify(e.error),
        errorUrl: e.filename || '<anonymous>',
      }
      if (this.data.lazyReport) {
        this.saveTracker({
          event: errorType.jsError,
          targetKey: 'js-error',
          userId: this.data.uuid as string,
          time: new Date().getTime(),
          appId: this.data.appId as string,
          ...errorData,
        } as exportErrorData)
        return
      }
      this.sendTracker({
        event: errorType.jsError,
        targetKey: 'js-error',
        userId: this.data.uuid as string,
        time: new Date().getTime(),
        appId: this.data.appId as string,
        ...errorData,
      } as exportErrorData)
    })
  }

  /**
   * 资源错误
   * @param event 事件对象
   * @returns boolean 是否是资源错误
   */
  private isResourseError(event: ErrorEvent): boolean {
    const target = event.target || event.srcElement
    const isElementTarget = target instanceof HTMLScriptElement || target instanceof HTMLLinkElement || target instanceof HTMLImageElement
    if (!isElementTarget)
      return false
    const errorData: errorData = {
      errorCol: event.colno || 1,
      errorRow: event.lineno || 1,
      errorInfo: event.message || '',
      errorExtra: event.error.stack || JSON.stringify(event.error),
      // @ts-expect-error
      errorUrl: target.src || target.href,
    }
    if (this.data.lazyReport) {
      this.saveTracker({
        event: errorType.resourceError,
        targetKey: 'resource-error',
        userId: this.data.uuid as string,
        time: new Date().getTime(),
        appId: this.data.appId as string,
        ...errorData,
      })
    }
    else {
      this.sendTracker({
        event: errorType.resourceError,
        targetKey: 'resource-error',
        userId: this.data.uuid as string,
        time: new Date().getTime(),
        appId: this.data.appId as string,
        ...errorData,
      })
    }
    return true
  }

  /**
   * 捕获Promise错误
   */
  private promiseErrorEvent(): void {
    window.addEventListener('unhandledrejection', (e) => {
      e.promise.catch(() => {
        console.log('promise error', e)
        const errorData: errorData = {
          errorCol: e.reason.stack.split('\n')[1].split(':').slice(-1)[0],
          errorRow: e.reason.stack.split('\n')[1].split(':').slice(-2, -1)[0],
          errorInfo: e.reason.stack.split('\n')[0],
          errorExtra: '',
          errorUrl: e.reason.stack.split('\n')[1].trim(),
        }
        if (this.data.lazyReport) {
          this.saveTracker({
            event: errorType.promiseError,
            targetKey: 'promise-error',
            userId: this.data.uuid as string,
            time: new Date().getTime(),
            appId: this.data.appId as string,
            ...errorData,
          })
          return
        }
        this.sendTracker({
          event: errorType.promiseError,
          targetKey: 'promise-error',
          userId: this.data.uuid as string,
          time: new Date().getTime(),
          appId: this.data.appId as string,
          ...errorData,
        })
      })
    })
  }

  /**
   * 上报设备信息
   */
  private reportDeviceData(): void {
    const data = getDeviceData()
    if (this.data.lazyReport) {
      this.saveTracker({
        event: 'device-event',
        targetKey: 'device-event',
        userId: this.data.uuid as string,
        time: new Date().getTime(),
        appId: this.data.appId as string,
        ...data,
      }, 'device', true)
      return
    }
    this.sendTracker({
      event: 'device',
      targetKey: 'device',
      userId: this.data.uuid as string,
      time: new Date().getTime(),
      appId: this.data.appId as string,
      ...data,
    })
  }

  /**
   * 页面关闭监听器
   */
  private unloadTracker(): void {
    window.addEventListener('beforeunload', () => {
      this.reportTrackerArray()
    })
  }

  /**
   * 监听器函数(监听页面跳转，计算pv)
   * @param mouseEventList 触发事件
   * @param targetKey 后台枚举值
   * @param data 其他数据
   */
  private captureEvents(
    mouseEventList: string[],
    targetKey: string,
  ): void {
    mouseEventList.forEach((event) => {
      window.addEventListener(event, () => {
        this.saveTracker({
          event: errorType.pvEvent,
          targetKey,
          userId: this.data.uuid as string,
          time: new Date().getTime(),
          appId: this.data.appId as string,
        }, 'pv')
        // this.sendTracker({
        //   event: errorType.pvEvent,
        //   targetKey,
        //   userId: this.data.uuid as string,
        //   time: new Date().getTime(),
        //   appId: this.data.appId as string,
        //   data,
        // })
      })
    })
  }

  /**
   * 安装监听器
   */
  private installTracker(): void {
    if (this.data.historyTracker) {
      this.captureEvents(
        ['pushState', 'replaceState', 'popstate'],
        'pv-event',
      )
    }

    if (this.data.hashTracker)
      this.captureEvents(['hashchange'], 'hash-pv')

    if (this.data.domTracker)
      this.reportDomTracker()

    if (this.data.jsError)
      this.jsError()

    if (this.data.lazyReport)
      this.unloadTracker()

    if (this.data.timeTracker && this.data.lazyReport) {
      // 获取页面FMP
      new FMPTiming()
      timing()
    }

    if (this.data.deviceTracker)
      this.reportDeviceData()
  }
}
