import CryptoES from 'crypto-es'

export default function fingerprinting() {
  // 构造离屏canvas对象，二维渲染上下文
  const offscreenCanvas = document.createElement('canvas')
  const ctx = offscreenCanvas.getContext('2d')!

  // 构造有大、小写字母和标点符号的测试文本
  const txt = 'Inspire Creativity, Enrich Life'
  ctx.textBaseline = 'top'

  // 基础文本框设置
  ctx.font = '14px "Arial"'
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = '#ff9900'
  ctx.fillRect(155, 1, 28, 20)

  // 混色，加大不同用户之间的渲染差异
  ctx.fillStyle = '#828282'
  ctx.fillText(txt, 2, 15)
  ctx.fillStyle = '#3c8cff'
  ctx.fillText(txt, 4, 17)

  // 导出base64编码的图像数据
  const canvasImageData = offscreenCanvas.toDataURL()

  // 通过sha256算法得出唯一的canvas指纹
  const fingerprint = CryptoES.SHA256(canvasImageData).toString()

  console.log(`指纹 ${fingerprint}`)

  return fingerprint
}
