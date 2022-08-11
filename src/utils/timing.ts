import load from "./load";
import { saveToStorage } from "./save";
import { TimingData, TimingConfig, exportTimingData } from "../types/timing";

/**
 * 储存页面加载的数据
 */
function saveTiming() {
  // performance.timing: PerformanceTiming 兼容至 IE9
  const {
    fetchStart,
    connectStart,
    connectEnd,
    requestStart,
    responseStart,
    responseEnd,
    domLoading,
    domInteractive,
    domContentLoadedEventStart,
    domContentLoadedEventEnd,
    loadEventStart,
  } = performance.timing;
  const exportData: exportTimingData = {
    event: 'timing',
    targetKey: 'timing',
    data: {
      connectTime: connectEnd - connectStart,
      ttfbTime: responseStart - fetchStart,
      responseTime: responseEnd - responseStart,
      parseDOMTime: domLoading - requestStart,
      domContentLoadedTime: domContentLoadedEventEnd - domContentLoadedEventStart,
      timeToInteractive: domInteractive - domLoading,
      loadTime: loadEventStart - fetchStart,
    }
  }
  saveToStorage(exportData, TimingConfig.storageKey)
}

/**
 * 上报页面加载时间
 */
export function timing() {
  load(() => {
    // 延迟调用
    setTimeout(() => {
      saveTiming()
    }, 2500)
  })
}