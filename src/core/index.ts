import type { DefaultOptions, Options, reportTrackerData } from '../types/index'
import { MouseEventList, TrackerConfig } from '../types/index'
import { createHistoryEvent } from '../utils/pv'
import { timing } from '../utils/timing'
import FMPTiming from '../lib/fmp'
import fingerprinting from '~/utils/fingerprinting'

export default class Tracker {
  public data: Options

  constructor(options: Options) {
    this.data = Object.assign(this.initDef(), options)
    this.data.uuid = fingerprinting()
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
    }
  }

  // 用户自定义添加参数
  public setExtra<T extends DefaultOptions['extra']>(extra: T): void {
    this.data.extra = extra
  }

  /**
   * 手动上报信息
   * @type reportTrackerData 上传数据类型
   */
  public sendTracker<T extends reportTrackerData>(data: T) {
    this.reportTracker(data)
  }

  private saveUserInfo<T extends reportTrackerData>(data: T): void {
    const userData = localStorage.getItem('userInfo') || undefined
    if (userData) {
      try {
        let arr: reportTrackerData[] = JSON.parse(userData)
        arr = [...arr, data]
        localStorage.setItem('userInfo', JSON.stringify(arr))
      }
      catch (error) {
        console.error('sdk saveUserInfo error!', error)
      }
    }
    else {
      localStorage.setItem('userInfo', JSON.stringify([data]))
    }
  }

  private saveTracker<T extends reportTrackerData>(data: T): void {
    const trackerData = localStorage.getItem('tracker') || undefined
    if (trackerData) {
      try {
        let arr: reportTrackerData[] = JSON.parse(trackerData)
        arr = [...arr, data]
        localStorage.setItem('tracker', JSON.stringify(arr))
      }
      catch (error) {
        console.error('sdk saveTracker error!', error)
      }
    }
    else {
      localStorage.setItem('tracker', JSON.stringify([data]))
    }
  }

  /**
   * 上报信息到后台
   */
  private reportTracker<T>(data: T) {
    const params = Object.assign(this.data, data, {
      time: new Date().getTime(),
    })
    const headers = {
      type: 'application/x-www-form-urlencoded',
    }
    const blob = new Blob([JSON.stringify(params)], headers)

    // 即使页面关闭了，sendBeacon也会完成请求（XMLHttpRequest不一定）
    // 由于data参数不支持JSON格式，这里使用Blob传数据
    navigator.sendBeacon(this.data.requestUrl, blob)
  }

  /**
   * 上报不带构造对象的信息
   */
  private reportTrackerWithoutConstructor(data: string): void {
    try {
      const headers = {
        type: 'application/x-www-form-urlencoded',
      }
      const blob = new Blob([data], headers)
      navigator.sendBeacon(this.data.requestUrl, blob)
    }
    catch (error) {
      console.error('sdk reportTrackerData error!', error)
    }
  }

  /**
   * 关闭页面前，上报所有信息到后台
   */
  private reportTrackerArray(): void {
    const userData = localStorage.getItem('userInfo') || undefined
    if (userData) {
      this.reportTrackerWithoutConstructor(userData)
      localStorage.removeItem('userInfo')
    }
    const trackerData = localStorage.getItem('tracker') || undefined
    if (trackerData) {
      this.reportTrackerWithoutConstructor(trackerData)
      localStorage.removeItem('tracker')
    }
    const timingData = localStorage.getItem('timing') || undefined
    if (timingData) {
      this.reportTrackerWithoutConstructor(timingData)
      localStorage.removeItem('timing')
    }
  }

  /**
   * 上报用户uuid
   */
  private reportID(): void {
    if (this.data.lazyReport) {
      this.saveUserInfo({
        event: 'uuid',
        targetKey: 'uuid',
        data: this.data.uuid,
      })
      return
    }
    this.reportTracker({
      event: 'uuid',
      targetKey: 'uuid',
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
              event,
              targetKey,
              clickData: {
                x: (e as MouseEvent).clientX,
                y: (e as MouseEvent).clientY,
              },
            })
            return
          }
          this.reportTracker({
            event,
            targetKey,
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
      this.reportTracker({
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
        this.reportTracker({
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
   * 页面关闭监听器
   */
  private unloadTracker(): void {
    window.addEventListener('beforeunload', () => {
      this.reportTrackerArray()
    })
  }

  /**
   * 监听器函数
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
        this.reportTracker({
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
    // 打印页面FMP
    // eslint-disable-next-line no-new
    new FMPTiming()

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

    if (this.data.timeTracker && this.data.lazyReport)
      timing()
  }
}
