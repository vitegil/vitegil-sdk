# Vitegil Tracker-SDK

## 工具使用

### 安装

```bash
pnpm install snq-tracker
```

### 引入项目

> 以Vue.js项目为例，在APP.vue中，你可以使用如下代码引入Tracker SDK：

```javascript
import Tracker from 'snq-tracker'
// ...
mounted () {
  // ...
  new Tracker({
    requestUrl: `${YOUR_REQUEST_URL}`,
    historyTracker: true,
    domTracker: true,
    jsError: true,
    lazyReport: true,
    timeTracker: true
  })
}
```

## 功能介绍

### 获取页面加载时间

`timeTracker`属性设置为`true`，同时开启`lazyReport`，在页面关闭前会自动将页面加载时间返回。

> 注意
> 计算页面加载时间至少需要2.5秒，若用户在计算工程中关闭页面，则不能获得响应数据。

## 项目开发

### 文件目录

```bash
├── src #工程代码目录
│   ├── core #核心代码目录
│   │
│   ├── lib #业务代码目录
│   │
│   ├── types #类型定义目录
│   │
│   └── utils #工具文件目录
│
├── package.json #项目npm配置文件
│
├── rollup.config.js #rollup配置文件
│
└── index.html #测试页面
```