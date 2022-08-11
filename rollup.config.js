import ts from 'rollup-plugin-typescript2'
import dts from 'rollup-plugin-dts'
import path from 'path'

export default [{
  // 入口文件
  input: './src/core/index.ts',
  output: [{
    file: path.resolve(__dirname, './dist/index.esm.js'),
    format: 'esm'
  }, {
    file: path.resolve(__dirname, './dist/index.cjs.js'),
    format: 'cjs'
  }, {
    file: path.resolve(__dirname, './dist/index.js'),
    format: 'umd',
    name: 'tracker'
  }],
  plugins: [ts()]
}, {
  // 打包声明文件
  input: './src/core/index.ts',
  outupt: {
    file: path.resolve(__dirname, './dist/index.d.ts'),
    format: 'es'
  },
  plugins: [dts()]
}]