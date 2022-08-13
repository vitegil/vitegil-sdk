import type { exportPerformanceData, exportTimingData } from '../types/timing'

export function saveToStorage(data: exportTimingData | exportPerformanceData, key: string) {
  localStorage.setItem(key, JSON.stringify(data))
}
