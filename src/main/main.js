const {app, ipcMain, BrowserView, BrowserWindow, globalShortcut, dialog, desktopCapturer, protocol} = require('electron');
const path = require('path');
const nodeDiskInfo = require('node-disk-info');

import "./screenshots";
import { createMainWindow, createTabWindow, createChildrenWindow, createBrowserView, createDialog } from './createWindow';

let mainWindow = null;
let tab1 = null;
let tab2 = null;
let childWindow = null;
function createWindow () {
  //创建浏览器窗口
  mainWindow = createMainWindow({
    preload:"../../src/renderer/preload.js",
    url:""
  });

  //嵌入更多的 web 内容。 它就像一个子窗口，可以替代webview标签.
  //渲染进程中使用process对象和require等，需要在创建窗口时，配置 nodeIntegration: true，可以获得系统参数，比如内存，系统版本，进程ID等等
  createBrowserView({
    mainWindow,
    url: "../../pages/info.html"
  })
  
  //添加选项卡
  tab1 = createTabWindow({
    mainWindow,
    url: "../../pages/webview.html"
  })

  //添加选项卡，单页多tab
  tab2 = createTabWindow({
    mainWindow,
    url: "../../pages/webview-tab.html"
  })

  //在加载页面时，渲染进程第一次完成绘制时，如果窗口还没有被显示，渲染进程会发出 ready-to-show 事件 。 在此事件后显示窗口将没有视觉闪烁
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  })

  // and load the index.html of the app.
  mainWindow.loadURL('https://www.baidu.com/')
  
  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  ipcMain.on('asynchronous-message', (event, arg) => {
    if(arg === 'showAlert'){
      //展示对话框
      createDialog({
        browserWindow: tab1,
      })
    }else if(arg === 'showModalWindow'){
      //添加子窗口
      childWindow = createChildrenWindow({
        parent:tab1,
        url:"../../pages/index.html"
      });
    }else if(arg === 'hideModalWindow'){
      childWindow.close();
      childWindow = null;
    }
    event.reply('asynchronous-reply', 'success:' + arg);
  })

  protocol.interceptHttpProtocol('http', (request, callback) => {

    console.log("========request url=======:", request.url);
    callback({
          url: `https://dimg08.c-ctrip.com/images/100a0g00000087qb8E7CE_C_221_166.jpg`,
          session:null
        })
  }, (error) => {
    if (error) console.error('无法注册协议')  
  })
})

app.on('web-contents-created', (e, contents) => {
  // Check for a webview
  console.log("content=====",contents.getType());
  if (contents.getType() == 'webview') {
      // Listen for any new window events
      //Emitted when the page requests to open a new window for a url. 
      //It could be requested by window.open or an external link like <a target='_blank'>.
      contents.on('new-window', (e, ...url) => {
          console.log("url=====:",url[0])
          e.preventDefault();//阻止Electron自动创建新的BrowserWindow实例
          tab2.webContents.send('newTab', url[0])
      })
  }
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

//扫描盘符
nodeDiskInfo.getDiskInfo()
    .then(disks => {
        //console.log('ASYNC WAY', disks)
    })
    .catch(reason => {
        console.error(reason);
    });

/** 
* 为了提高页面加载速度，我们会将比较大的文件预先下载到本地。
* 然后在请求的时候先判断本地文件是否存在，存在从本地加载，不存在时再从网络下载，并进行缓存，
* 可以使用protocol.interceptHttpProtocol实现
*/

// protocol.interceptHttpProtocol('http', (request, callback) => {
//   // if(AssetsHelper.isCacheResource(request.url)){
//   //   if (!AssetsHelper.hasCacheResource(request.url)) {
//   //     AssetsHelper.cacheResource(request.url, function () {
//   //       let localURL = AssetsHelper.getCacheResourcePath(request.url)
//   //       callback({url: toLocalURL(localURL)}) 
//   //     })
//   //   } else {
//   //     let localURL = AssetsHelper.getCacheResourcePath(request.url)
//   //     callback({url: toLocalURL(localURL)})
//   //   }
//   // } else {
//   //   callback({
//   //     url: request.url
//   //   })
//   // }

//   console.log("request url:", request.url);
//   callback({
//         url: request.url
//       })

// }, (error) => {
//   if (error) console.error('无法注册协议')  
// })
  
