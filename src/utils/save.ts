import type { exportPerformanceData, exportTimingData } from '../types/timing'

export function saveToStorage(data: exportTimingData | exportPerformanceData, key: string) {
  const storeData = JSON.parse(localStorage.getItem(key) || '{}')
  localStorage.setItem(key, JSON.stringify(Object.assign(storeData, data)))
}
