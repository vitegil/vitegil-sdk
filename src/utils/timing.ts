import load from "./load";
import { saveToStorage } from "./save";
import { TimeConfig, exportTimingData, exportPerformaceData } from "../types/timing";

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
    domainLookupStart,
    domainLookupEnd,
  } = performance.timing;
  const exportData: exportTimingData = {
    event: 'timing',
    targetKey: 'timing',
    data: {
      connectTime: connectEnd - connectStart,
      ttfbTime: responseStart - fetchStart,
      responseTime: responseEnd - responseStart,
      parseDOMTime: domInteractive - responseEnd,
      domContentLoadedTime: domContentLoadedEventEnd - domContentLoadedEventStart, // domContentLoadedEventEnd – fetchStart
      loadTime: loadEventStart - fetchStart,
      parseDNSTime: domainLookupEnd - domainLookupStart,
      domReadyTime: domContentLoadedEventStart - fetchStart,
    }
  }
  const exportPerformaceData: exportPerformaceData = {
    event: 'performace',
    targetKey: 'performace',
    data: {
      firstPaint: responseEnd - fetchStart,
      timeToInteractive: domInteractive - domLoading,
    }
  }
  saveToStorage(exportData, TimeConfig.TimingKey)
  saveToStorage(exportPerformaceData, TimeConfig.PerformanceKey)
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