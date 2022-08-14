import path from 'path'
import ts from 'rollup-plugin-typescript2'
import dts from 'rollup-plugin-dts'

import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

export default [
  {
    // 入口文件
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
      // 热更新 默认监听根文件夹
      livereload(),
      // 本地服务器
      serve({
        open: true, // 自动打开页面
        port: 8000,
        openPage: '/index.html', // 打开的页面
        contentBase: '',
      }),
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
