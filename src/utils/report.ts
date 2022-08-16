/**
 * 上报信息到后台
 * @param {string} type 上报类型
 * @param {string} url 上报地址
 */
export const reportTrackerInfo = (data: string, url: string) => {
  try {
    const headers = {
      type: 'application/x-www-form-urlencoded',
    }
    const blob = new Blob([data], headers)
    navigator.sendBeacon(url, blob)
  }
  catch (error) {
    console.error('sdk reportTrackerData error!', error)
  }
}

/**
 * 上报本地存储的全部信息到后台
 * @param url 上报地址
 */
export const reportStorageInfo = (url: string) => {
  const reportData = []

  const perf = localStorage.getItem('performance') || undefined
  perf && reportData.push(perf)

  const time = localStorage.getItem('timing') || undefined
  time && reportData.push(time)

  const uv = localStorage.getItem('useruv') || undefined
  uv && reportData.push(uv)

  const device = localStorage.getItem('device') || undefined
  device && reportData.push(device)

  const tracker = localStorage.getItem('tracker') || undefined
  tracker && reportData.push(tracker)

  try {
    const headers = {
      type: 'application/x-www-form-urlencoded',
    }
    const blob = new Blob(reportData, headers)
    navigator.sendBeacon(url, blob)
  }
  catch (error) {
    console.error('sdk report error!', error)
  }
}