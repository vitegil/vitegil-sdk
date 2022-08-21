# Vitegil SDK 💉

[![npm](https://img.shields.io/npm/v/vitegil-sdk?color=3c8cff)](https://www.npmjs.com/package/vitegil-sdk)
[![node compatibility](https://img.shields.io/node/v/vitegil-sdk?color=0F9D58)](https://nodejs.org/en/about/releases/)
[![build status](https://github.com/vitegil/vitegil-sdk/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/vitegil/vitegil-sdk/actions/workflows/ci.yml)

## 工具使用

### 安装

```bash
pnpm i vitegil-sdk
```

### 引入项目

> 以 Vue.js 项目为例，在 App.vue 中，你可以使用如下代码引入 Vitegil SDK：

```javascript
import Tracker from 'vitegil-sdk'
// ...
mounted () {
  // ...
  new Tracker({
    requestUrl: `${YOUR_REQUEST_URL}`,
    historyTracker: true,
    domTracker: true,
    jsError: true,
    lazyReport: true,
    timeTracker: true,
    deviceTracker: true,
  })
}
```

## 功能介绍

### 监控页面异常

在初始化 Vitegil Tracker 类时，设置`jsError`属性为`true`。

```javascript
new Tracker({
  // ...
  jsError: true,
})
```

如果页面出现异常，SDK 会自动上报异常信息给服务器。该功能会监控页面中的所有 JS 异常：
- JS 错误
- Promise 错误
- 资源加载错误
- 其他错误

异常信息格式如下：

```typescript
interface ErrorData {
  url: string | undefined
  errorUrl: string | undefined
  errorInfo: string
  errorRow: number | undefined
  errorCol: number | undefined
  errorExtra: string | undefined
}
```

### 监控网站访问人数(uv)

该工具会监控每个访问用户并为其生成一个唯一的标识符，即`指纹(fingerprint)`。通过该指纹，可以精准的计算网站的访问人数。

### 监控网站访问总数(pv)

在初始化 Vitegil Tracker 类时，设置`historyTracker`属性为`true`。

```javascript
new Tracker({
  // ...
  historyTracker: true,
})
```

开启该选项后会监控每个访问用户的访问次数，即`访问次数(page view)`。

### 访问用户设备信息

在初始化 Vitegil Tracker 类时，设置`deviceTracker`属性为`true`。

```javascript
new Tracker({
  // ...
  deviceTracker: true,
})
```

获取访问用户的设备信息，包括：
- 设备类型
- 操作系统
- 操作系统版本
- 屏幕高
- 屏幕高
- 当前使用的语言-国家
- 联网类型
- 横竖屏
- 浏览器类型
- 浏览器信息

格式如下：

```typescript
interface DeviceData {
  deviceType: string | undefined
  OS: string | undefined
  OSVersion: string | undefined
  screenHeight: number | undefined
  screenWidth: number | undefined
  language: string | undefined
  netWork: string | undefined
  orientation: string | undefined
  browser: string | undefined
  browserInfo: string | undefined
}
```

### 获取页面加载时间和页面性能

在初始化 Vitegil Tracker 类时，设置`timeTracker` 属性设置为 `true`，同时设置 `lazyReport`属性为 `true` ，在页面关闭前会自动将页面加载时间返回。

```javascript
new Tracker({
  // ...
  timeTracker: true,
  lazyReport: true,
})
```

> 注意
> 计算页面加载时间至少需要` 2500ms`，若用户在计算过程中关闭页面，则不能获得响应数据。

获取页面性能数据，包括：
- TCP连接耗时
- ttfb时间:发出页面请求到接收到应答数据第一个字节所花费的毫秒数
- 响应时间
- 解析DOM时间
- DOMContentLoaded事件时间
- DOMContentLoaded时间
- 完整的页面加载时间
- DNS解析时间
- DOM准备总时间
- 页面首次渲染时间，即白屏时间
- 首次有内容渲染
- 最大可交互内容渲染时间
- 首次可交互时间
- 首次有意义渲染

格式如下：

```typescript
interface TPData {
  connectTime: number | undefined
  ttfbTime: number | undefined
  responseTime: number | undefined
  parseDOMTime: number | undefined
  domContentLoadedTime: number | undefined
  domContentLoaded: number | undefined
  loadTime: number | undefined
  parseDNSTime: number | undefined
  domReadyTime: number | undefined
  firstPaint: number | undefined
  firstContentfulPaint: number | undefined
  largestContentfulPaint: number | undefined
  timeToInteractive: number | undefined
  firstMeaningfulPaint: number | undefined
}
```

> 我们建议您只在需要（生产环境中）的时候打开该选项来查看页面的性能，帮助你更好的了解页面性能的瓶颈，帮助您优化网页的性能。

### 获取页面DOM信息

在初始化 Vitegil Tracker 类时，设置 `domTracker` 属性 设置为 `true`。可监控页面的DOM信息。

```javascript
new Tracker({
  // ...
  domTracker: true,
})
```

> 我们建议您只在需要（生产环境中）的时候打开该选项来查看页面的DOM信息。因为该选项会消耗大量的性能。

## 项目开发

### 安装依赖

```bash
pnpm i
```

### 打包 + 监听

打包并监听源文件，若检测到改动，则重新打包

```bash
pnpm dev
```

### 打包

使用 rollup 配置文件打包

```bash
pnpm build
```

### 文件目录

```bash
.
├── src
│   ├── core   # 核心代码目录
│   ├── lib    # 业务代码目录
│   ├── types  # 类型定义目录
│   └── utils  # 工具文件目录
├── LICENSE
├── README.md
├── index.html         # 测试页面
├── package.json       # 项目配置文件
├── pnpm-lock.yaml
├── rollup.config.js   # rollup 配置文件
└── tsconfig.json
```
