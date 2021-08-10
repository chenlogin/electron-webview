/** 
 * All of the Node.js APIs are available in the preload process.
 * It has the same sandbox as a Chrome extension.
 * preload脚本是运行在渲染进程中的（new一个BrowserWindow，打开了一个窗口，就是启动了一个渲染进程），
 * 在页面中其他脚本运行之前被加载，又能调用Node API。有以下场景：
 * a、若启动了一个窗口（渲染进程），加载了一个线上的页面，做一些网络错误，页面加载失败等错误处理
 * b、若一套代码部署在web端和客户端，需要用一个变量判断是在web端还是客户端；
*/

const remote = require('electron').remote;
const loudness = require('loudness');

//调节系统音量
loudness.setVolume(10);

window.addEventListener('error', event => {
  try {
    let logInfo = {
        module: 'javascript_error',
        err_code: '50000',
        msg: event.message || '',
        etc: {
            location: window.location.href,
            err_url: event.filename || undefined,
            err_line: event.lineno > 0 ? event.lineno : undefined,
            err_column: event.colno > 0 ? event.colno : undefined,
            err_stack: event.error && event.error.hasOwnProperty('stack') ? event.error.stack : undefined
        }
    };
    console.error(logInfo);
  } catch (err) {
      // 避免死循环
    console.error(err);
  }
});

window.addEventListener('keydown', event => {

  //开启控制台
  const { altKey, ctrlKey, metaKey, keyCode } = event;
  //alt + ctrl + (Command | Windows) + d 
  if(altKey && ctrlKey && metaKey && keyCode === 68){
      //在渲染进程中使用主进程模块，创建窗口时需要开启remote模块
      const currentWindow = remote.getCurrentWindow();
      currentWindow && currentWindow.toggleDevTools();
      event.preventDefault();
  }
},false);




//扫描ip
