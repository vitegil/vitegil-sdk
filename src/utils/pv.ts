// 发布-订阅模式，重写history中的方法。用户触发history.pushState方法时会注册该事件。
// 然后可以调用方法监听该事件。
export const createHistoryEvent = <T extends keyof History>(type: T) => {
  const origin = history[type]

  return function (this: any) {
    const res = origin.apply(this, arguments)
    // 注册事件，使得addEventListener能够监听该事件
    const e = new Event(type)
    window.dispatchEvent(e)
    return res
  }
}