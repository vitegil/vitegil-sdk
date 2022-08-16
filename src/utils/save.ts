import type { exportPerformanceData, exportTimingData } from '../types/timing'

export function saveToStorage(input: exportTimingData | exportPerformanceData | Record<string, number>, key: string) {
  const storeData = JSON.parse(localStorage.getItem(key) || '{}')
  localStorage.setItem(key, JSON.stringify(Object.assign(storeData, input)))
}
