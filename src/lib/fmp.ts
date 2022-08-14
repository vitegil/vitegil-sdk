/**
* A utility library that helps calculate FMP (First Meaning Paint).
* This was adapted from a post from CaelumTian on 20191022 to his
* blog here:
* https://caelumtian.github.io/
*/

const Utils = {
  getStyle(element: any, attr: any) {
    if (window.getComputedStyle)
      return window.getComputedStyle(element, null)[attr]
    else
      return element.currentStyle[attr]
  },
}

const START_TIME: number = performance.now()
const IGNORE_TAG_SET: Array<string> = [
  'SCRIPT',
  'STYLE',
  'META',
  'HEAD',
  'LINK',
]

const ELE_WEIGHT = {
  SVG: 2,
  IMG: 2,
  CANVAS: 4,
  OBJECT: 4,
  EMBED: 4,
  VIDEO: 4,
}

// onLoad 后最长时间
const LIMIT = 3000
const WW: number = window.innerWidth
const WH: number = window.innerHeight
// 计算 FMP 重试间隔
const DELAY = 500
declare namespace FMP {
  interface ICalScore {
    dpss: Array<ICalScore>
    st: number
    els: Els
    root?: Element
  }
  type Els = Array<{
    $node: Element
    st: number
    weight: number
  }>
}

export default class FMPTiming {
  // 用来保存每次节点变动的时间
  private statusCollector: Array<{ time: number }> = []
  private flag = true
  private observer: MutationObserver | null = null
  private callbackCount = 0
  // 资源加载集合
  private entries: any = {}
  private fmpCallback: any = null
  constructor(fmpCallback?: (res: any) => void) {
    if (fmpCallback)
      this.fmpCallback = fmpCallback

    this.initObserver()
  }

  private getFirstSnapShot(): void {
    const time: number = performance.now()
    const $body: HTMLElement = document.body
    if ($body)
      this.setTag($body, this.callbackCount)

    this.statusCollector.push({
      time,
    })
  }

  private initObserver() {
    // 首次记录
    this.getFirstSnapShot()
    this.observer = new MutationObserver(() => {
      this.callbackCount += 1
      const time = performance.now()
      const $body: HTMLElement = document.body
      if ($body)
        this.setTag($body, this.callbackCount)

      this.statusCollector.push({
        time,
      })
    })
    // 观察所有子节点
    this.observer.observe(document, {
      childList: true,
      subtree: true,
    })

    // 开始计算 FMP
    if (document.readyState === 'complete') {
      this.calculateFinalScore()
    }
    else {
      window.addEventListener(
        'load',
        () => {
          this.calculateFinalScore()
        },
        false,
      )
    }
  }

  private calculateFinalScore() {
    if (MutationEvent && this.flag) {
      if (this.checkNeedCancel(START_TIME)) {
        // 取消 DOM 变动监听
        this.observer?.disconnect()
        this.flag = false

        const res = this.getTreeScore(document.body)

        // 取 st 最大的节点
        let tp: FMP.ICalScore | null = null
        res.dpss.forEach((item: any) => {
          if (tp && tp.st) {
            if (tp.st < item.st)
              tp = item
          }
          else {
            tp = item
          }
        })
        // 获取所有资源加载时间
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        performance.getEntries().forEach((item: PerformanceResourceTiming) => {
          this.entries[item.name] = item.responseEnd
        })
        if (!tp) {
          if (this.fmpCallback) {
            this.fmpCallback({
              tp: null,
              resultEls: [],
              fmpTiming: 0,
            })
          }
          return false
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const resultEls: FMP.Els = this.filterResult(tp.els)
        console.log('最终节点集合', tp, resultEls)
        const fmpTiming: number = this.getFmpTime(resultEls)
        console.log('最终 FMP', fmpTiming)
        if (this.fmpCallback) {
          this.fmpCallback({
            tp,
            resultEls,
            fmpTiming,
          })
        }
      }
      else {
        setTimeout(() => {
          this.calculateFinalScore()
        }, DELAY)
      }
    }
  }

  private getFmpTime(resultEls: FMP.Els): number {
    let rt = 0
    resultEls.forEach((item) => {
      let time = 0
      if (item.weight === 1) {
        const index: number = parseInt(
          item.$node.getAttribute('fmp_c') as string,
          10,
        )
        time = this.statusCollector[index].time
      }
      else if (item.weight === 2) {
        if (item.$node.tagName === 'IMG') {
          time = this.entries[(item.$node as HTMLImageElement).src]
        }
        else if (item.$node.tagName === 'SVG') {
          const index: number = parseInt(
            item.$node.getAttribute('fmp_c') as string,
            10,
          )
          time = this.statusCollector[index].time
        }
        else {
          // 取出图片路径
          const match: Array<any> = Utils.getStyle(
            item.$node,
            'background-image',
          ).match(/url\(\"(.*?)\"\)/)
          let url = ''
          if (match && match[1])
            url = match[1]

          if (!url.includes('http'))
            url = location.protocol + match[1]

          time = this.entries[url]
        }
      }
      else if (item.weight === 4) {
        if (item.$node.tagName === 'CANVAS') {
          const index: number = parseInt(
            item.$node.getAttribute('fmp_c') as string,
            10,
          )
          time = this.statusCollector[index].time
        }
        else if (item.$node.tagName === 'VIDEO') {
          time = this.entries[(item.$node as HTMLVideoElement).src]
          if (!time)
            time = this.entries[(item.$node as HTMLVideoElement).poster]
        }
      }
      // 如果，time 真的取不到值，就 0
      if (typeof time !== 'number')
        time = 0

      rt < time && (rt = time)
    })
    return rt
  }

  // 将可见区域内得分最高的节点集合，取平均值，淘汰低的
  private filterResult(els: FMP.Els): FMP.Els {
    // 仅有一个值得情况下
    if (els.length === 1)
      return els

    let sum = 0
    els.forEach((item) => {
      sum += item.st
    })
    // 平均值
    const avg: number = sum / els.length
    return els.filter((item) => {
      return item.st > avg
    })
  }

  private checkNeedCancel(start: number): boolean {
    const time: number = performance.now() - start
    const lastCalTime: number
      = this.statusCollector.length > 0
        ? this.statusCollector[this.statusCollector.length - 1].time
        : 0
    return time > LIMIT || time - lastCalTime > 1000
  }

  private getTreeScore($node: Element): FMP.ICalScore | any {
    if ($node) {
      const dpss = []
      const $children: HTMLCollection = $node.children
      for (let i = 0; i < $children.length; i++) {
        const $child = $children[i]
        // 如果没被标记就不用计算了
        if (!$child.getAttribute('fmp_c'))
          continue

        const s = this.getTreeScore($child)
        if (s.st)
          dpss.push(s)
      }
      return this.calculateScore($node, dpss)
    }
    return {}
  }

  private calculateScore(
    $node: Element,
    dpss: Array<FMP.ICalScore>,
  ): FMP.ICalScore {
    const { width, height, left, top } = $node.getBoundingClientRect()
    let isInViewPort = true
    // 该元素不再页面内，不参数计算
    if (WH < top || WW < left)
      isInViewPort = false

    // 所有子节点得分
    let sdp = 0
    dpss.forEach((item) => {
      sdp += item.st
    })

    // 元素权重分
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    let weight = ELE_WEIGHT[$node.tagName] || 1
    // 如果有背景图的普通元素，按照图片计算
    if (
      weight === 1
      && Utils.getStyle($node, 'background-image')
      && Utils.getStyle($node, 'background-image') !== 'initial'
      && Utils.getStyle($node, 'background-image') !== 'none'
    )
      weight = ELE_WEIGHT.IMG

    // 得分 = 占据面积
    let st: number = isInViewPort ? width * height * weight : 0
    // 记录子元素值
    let els = [{ $node, st, weight }]
    // 根元素
    const root = $node
    // 当前元素，在视口中的占比
    const areaPercent = this.calculateAreaParent($node)
    // 如果子元素权重和大于父元素真实权重
    if (sdp > st * areaPercent || areaPercent === 0) {
      st = sdp
      els = []
      dpss.forEach((item) => {
        els = els.concat(item.els)
      })
    }
    return {
      dpss,
      st,
      els,
      root,
    }
  }

  private calculateAreaParent($node: Element): number {
    const { left, right, top, bottom, width, height }
      = $node.getBoundingClientRect()

    const winLeft = 0
    const winTop = 0
    const winRight: number = WW
    const winBottom: number = WH

    const overlapX
      = right
      - left
      + (winRight - winLeft)
      - (Math.max(right, winRight) - Math.min(left, winLeft))
    const overlapY
      = bottom
      - top
      + (winBottom - winTop)
      - (Math.max(bottom, winBottom) - Math.min(top, winTop))
    if (overlapX <= 0 || overlapY <= 0)
      return 0

    return (overlapX * overlapY) / (width * height)
  }

  // 深度优先遍历，添加节点 attr fmp_c 值
  private setTag(target: Element, callbackCount: number): void {
    const tagName: string = target.tagName
    if (!IGNORE_TAG_SET.includes(tagName)) {
      const $children: HTMLCollection = target.children
      if ($children && $children.length > 0) {
        for (let i = $children.length - 1; i >= 0; i--) {
          const $child: Element = $children[i]
          const hasSetTag = $child.getAttribute('fmp_c') !== null
          // 如果没有标记过，则检测是否满足标记条件
          if (!hasSetTag) {
            const { left, top, width, height } = $child.getBoundingClientRect()
            if (WH < top || WW < left || width === 0 || height === 0)
              continue

            $child.setAttribute('fmp_c', `${callbackCount}`)
          }
          this.setTag($child, callbackCount)
        }
      }
    }
  }
}

