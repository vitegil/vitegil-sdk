import type { reportTrackerData } from '../types/index'
import type { exportTPData } from './../types/timing'

export function saveToStorage(input: exportTPData | Record<string, number>, key: string) {
  const storeData = JSON.parse(localStorage.getItem(key) || '{}')
  localStorage.setItem(key, JSON.stringify(Object.assign(storeData, input)))
}

export function saveTrackerArray<T extends reportTrackerData>(data: T, key: string) {
  const waitToSaveData = localStorage.getItem(key) || undefined
  if (waitToSaveData) {
    try {
      let arr: reportTrackerData[] = JSON.parse(waitToSaveData)
      arr = [...arr, data]
      localStorage.setItem(key, JSON.stringify(arr))
    }
    catch (error) {
      console.error(`sdk save ${key} error!`, error)
    }
  }
  else {
    localStorage.setItem(key, JSON.stringify([data]))
  }
}

export function saveTrackerData<T extends reportTrackerData>(data: T, key: string) {
  localStorage.setItem(key, JSON.stringify(data))
}
