# Vitegil SDK

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
    timeTracker: true
  })
}
```

## 功能介绍

### 获取页面加载时间

`timeTracker` 属性设置为 `true`，同时开启 `lazyReport`，在页面关闭前会自动将页面加载时间返回。

> 注意
> 计算页面加载时间至少需要 2.5 秒，若用户在计算工程中关闭页面，则不能获得响应数据。

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
