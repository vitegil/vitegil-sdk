/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { DefaultOptions, Options, reportTrackerData } from '../types/index'
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
  }

  /**
   * 用户自定义添加参数
   */
  public setExtra<T extends DefaultOptions['extra']>(extra: T): void {
    this.data.extra = extra
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
  private saveTracker<T extends reportTrackerData>(data: T, key?: string, notArr?: boolean): void {
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
   * 上报不带构造对象的信息
   */
  // private reportTrackerWithoutConstructor(data: string): void {
  //   try {
  //     const headers = {
  //       type: 'application/x-www-form-urlencoded',
  //     }
  //     const blob = new Blob([data], headers)
  //     navigator.sendBeacon(this.data.requestUrl, blob)
  //   }
  //   catch (error) {
  //     console.error('sdk reportTrackerData error!', error)
  //   }
  // }

  /**
   * 关闭页面前，上报所有信息到后台
   */
  private reportTrackerArray(): void {
    reportStorageInfo(this.data.requestUrl)
    localStorage.clear()
  }

  /**
   * 上报用户uuid(计算uv)
   */
  private reportID(): void {
    if (this.data.lazyReport) {
      this.saveTracker({
        event: 'uv-event',
        targetKey: 'uv-event',
        data: this.data.uuid,
      }, 'useruv', true)
      return
    }
    this.sendTracker({
      event: 'uv-event',
      targetKey: 'uv-event',
      data: this.data.uuid,
    })
  }

  /**
   * 上报DOM点击事件
   */
  private reportDomTracker(): void {
    MouseEventList.forEach((event) => {
      window.addEventListener(event, (e) => {
        const target = e.target as HTMLElement
        const targetKey = target.getAttribute('data-tracker-key')
        if (targetKey) {
          if (this.data.lazyReport) {
            this.saveTracker({
              event: `${event}-event`,
              targetKey: `${event}-event`,
              clickData: {
                x: (e as MouseEvent).clientX,
                y: (e as MouseEvent).clientY,
              },
            })
            return
          }
          this.sendTracker({
            event: `${event}-event`,
            targetKey: `${event}-event`,
            clickData: {
              x: (e as MouseEvent).clientX,
              y: (e as MouseEvent).clientY,
            },
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
      if (this.data.lazyReport) {
        this.saveTracker({
          event: 'js-error',
          targetKey: 'js-error',
          data: {
            message: e.message,
            filename: e.filename,
            lineno: e.lineno,
            colno: e.colno,
          },
        })
        return
      }
      this.sendTracker({
        event: 'js-error',
        targetKey: 'js-error',
        data: {
          message: e.message,
          filename: e.filename,
          lineno: e.lineno,
          colno: e.colno,
        },
      })
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
    if (this.data.lazyReport) {
      this.saveTracker({
        event: 'resource-error',
        targetKey: 'resource-error',
        data: {
          // @ts-expect-error
          url: target.src || target.href,
        },
      })
    }
    else {
      this.sendTracker({
        event: 'resource-error',
        targetKey: 'resource-error',
        data: {
          // @ts-expect-error
          url: target.src || target.href,
        },
      })
    }
    return true
  }

  /**
   * 捕获Promise错误
   */
  private promiseErrorEvent(): void {
    window.addEventListener('unhandledrejection', (e) => {
      e.promise.catch((err) => {
        if (this.data.lazyReport) {
          this.saveTracker({
            event: 'promise-error',
            targetKey: 'promise-error',
            data: {
              message: e.reason.message,
              filename: e.reason.stack.split('\n')[0],
              err,
            },
          })
          return
        }
        this.sendTracker({
          event: 'promise-error',
          targetKey: 'promise-error',
          data: {
            message: e.reason.message,
            filename: e.reason.stack.split('\n')[0],
            err,
          },
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
        data,
      }, 'device', true)
      return
    }
    this.sendTracker({
      event: 'device',
      targetKey: 'device',
      data,
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
  private captureEvents<T>(
    mouseEventList: string[],
    targetKey: string,
    data?: T,
  ): void {
    mouseEventList.forEach((event) => {
      window.addEventListener(event, () => {
        if (this.data.lazyReport) {
          this.saveTracker({
            event,
            targetKey,
            data,
          })
          return
        }
        this.sendTracker({
          event,
          targetKey,
          data,
        })
      })
    })
  }

  /**
   * 安装监听器
   */
  private installTracker(): void {
    if (this.data.uuid)
      this.reportID()

    if (this.data.historyTracker) {
      this.captureEvents(
        ['pushState', 'replaceState', 'popstate'],
        'history-pv',
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
