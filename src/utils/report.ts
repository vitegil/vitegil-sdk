/**
 * 上报信息到后台
 * @param {string} type 上报类型
 * @param {string} url 上报地址
 */
export const reportTrackerInfo = (data: string, url: string) => {
  try {
    // const headers = {
    //   type: 'application/x-www-form-urlencoded',
    // }
    // const blob = new Blob(data, headers)
    navigator.sendBeacon(url, data)
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

  const device = localStorage.getItem('device') || undefined
  device && reportData.push(device)

  const tracker = localStorage.getItem('tracker') || undefined
  tracker && reportData.push(tracker)

  // const pv = localStorage.getItem('pv') || undefined
  // pv && reportData.push(pv)

  try {
    // const headers = {
    //   type: 'application/x-www-form-urlencoded',
    // }
    // const blob = new Blob(reportData, headers)
    navigator.sendBeacon(url, JSON.stringify(reportData))
  }
  catch (error) {
    console.error('sdk report error!', error)
  }
}
