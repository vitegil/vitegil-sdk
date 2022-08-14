import path from 'path'
import ts from 'rollup-plugin-typescript2'
import dts from 'rollup-plugin-dts'

import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

export default [
  {
    input: './src/core/index.ts',
    output: [
      {
        file: path.resolve(__dirname, './dist/index.esm.js'),
        format: 'esm',
      },
      {
        file: path.resolve(__dirname, './dist/index.cjs.js'),
        format: 'cjs',
      },
      {
        file: path.resolve(__dirname, './dist/index.js'),
        format: 'umd',
        name: 'Tracker',
      },
    ],
    plugins: [
      ts(),
      // 本地服务器
      serve({
        open: true, // 在浏览器中启动
        openPage: '/index.html', // 初始页面
        contentBase: './', // 入口 html 文件位置
        host: 'localhost',
        port: 8000,
      }),
      // 热更新 默认监听根文件夹
      livereload(),
    ],
  },
  {
    // 打包声明文件
    input: './src/core/index.ts',
    output: {
      file: path.resolve(__dirname, './dist/index.d.ts'),
      format: 'es',
    },
    plugins: [dts()],
  },
]
