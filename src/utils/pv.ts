// 发布-订阅模式，重写history中的方法
// 用户触发history.pushState/replaceState方法时会注册该事件，然后可以调用方法监听该事件
export const createHistoryEvent = <T extends keyof History>(type: T) => {
  const origin = history[type]

  return function (this: any, ...args: any[]) {
    const res = origin.apply(this, args)

    // 创建事件
    const e = new Event(type)

    // 派发事件，之后addEventListener能够监听该事件
    window.dispatchEvent(e)

    return res
  }
}
