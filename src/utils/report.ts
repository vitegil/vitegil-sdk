/**
 * 上报信息到后台
 * @param {string} type 上报类型
 * @param {string} url 上报地址
 */
export const reportTrackerInfo = (data: string, url: string) => {
  try {
    const headers = {
      type: 'application/json',
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
 * @param baseUrl 上报基础地址
 */
export const reportStorageInfo = async (baseUrl: string) => {
  const perf = localStorage.getItem('performance') || undefined
  const device = localStorage.getItem('device') || undefined
  const tracker = localStorage.getItem('tracker') || undefined

  try {
    // const blob = new Blob([reportData.toString()], {
    //   type: 'application/json; charset=UTF-8',
    // })
    // return navigator.sendBeacon(url, blob)
    const headers = {
      type: 'application/json',
    }
    if (perf) {
      const blobPerf = new Blob([perf], headers)
      navigator.sendBeacon(`${baseUrl}/performance/savePerformance`, blobPerf)
    }
    if (device) {
      const blobDevice = new Blob([device], headers)
      navigator.sendBeacon(`${baseUrl}/device/saveDevice`, blobDevice)
    }
    if (tracker) {
      const blobTracker = new Blob([tracker], headers)
      navigator.sendBeacon(`${baseUrl}/error/saveErrorTotal`, blobTracker)
    }
  }
  catch (error) {
    console.error('sdk report error!', error)
  }
}
