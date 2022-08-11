import { exportTimingData } from "../types/timing"


export function saveToStorage (data: exportTimingData, key: string) {
  localStorage.setItem(key, JSON.stringify(data))
}