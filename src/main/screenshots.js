import { app, globalShortcut } from 'electron'
import Screenshots from 'electron-screenshots'

app.on('ready', () => {
  const screenshots = new Screenshots()
  globalShortcut.register('ctrl+shift+a', () => screenshots.startCapture())
  // 点击确定按钮回调事件
  screenshots.on('ok', (e, { viewer }) => {
    console.log('capture', viewer)
  })
  // 点击取消按钮回调事件
  screenshots.on('cancel', () => {
    console.log('capture', 'cancel1')
  })
  screenshots.on('cancel', e => {
    // 执行了preventDefault
    // 点击取消不会关闭截图窗口
    e.preventDefault()
    console.log('capture', 'cancel2')
  })
  // 点击保存按钮回调事件
  screenshots.on('save', (e, { viewer }) => {
    console.log('capture', viewer)
  })
})
