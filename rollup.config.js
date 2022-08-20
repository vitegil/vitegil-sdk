import path from 'path'
import ts from 'rollup-plugin-typescript2'
import dts from 'rollup-plugin-dts'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import nodeResolve from '@rollup/plugin-node-resolve'

export default [
  {
    input: './src/core/index.ts',
    output: [
      {
        file: path.resolve(__dirname, './dist/index.esm.js'),
        format: 'esm',
        exports: 'auto',
      },
      {
        file: path.resolve(__dirname, './dist/index.cjs.js'),
        format: 'cjs',
        exports: 'auto',
      },
      {
        file: path.resolve(__dirname, './dist/index.js'),
        format: 'umd',
        exports: 'auto',
        name: 'Tracker',
      },
    ],
    plugins: [
      ts(),
      // 定位和打包node_modules中的第三方库
      nodeResolve(),
      // 本地服务器
      serve({
        open: true, // 在浏览器中启动
        openPage: '/index.html', // 初始页面
        contentBase: './', // 入口 html 文件位置
        host: 'localhost',
        port: 8123,
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
      exports: 'auto',
    },
    plugins: [dts()],
  },
]
