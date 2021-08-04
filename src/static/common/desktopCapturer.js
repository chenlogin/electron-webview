/**
 * 渲染进程：录屏
 * 1、通过 electron desktopCapturer 和 navigator 获取要进行录制的媒体源信息；
 * 2、使用 MediaRecorder 对视频流进行录制；
 * 3、将 MediaRecorder 保存到本地文件。
 */
const { desktopCapturer } = require('electron')
const fs = require("fs");
const path = require('path');
const { addAbortSignal } = require('stream');


var startRecording = async function(screenName = "Webview"){
  desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
    //每个 DesktopCapturerSource 代表一个屏幕或一个可以被捕获的独立窗口
    for (const source of sources) {
        if (source.name === screenName) {
            try {
                //getUserMedia获取可以用来从桌面捕获音频和视频的媒体源的信息
                //无法在macOS上进行音频捕获，因此要访问系统音频的应用程序需要一个签名内核拓展. Chromium以及Electron扩展不提供这个
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: false,
                    video: {
                        mandatory: {
                          chromeMediaSource: 'desktop',
                          chromeMediaSourceId: source.id,
                          minWidth: 180,
                          maxWidth: 1280,
                          minHeight: 720,
                          maxHeight: 720
                        }
                    }
                })
                handleStream(stream)
            } catch (e) {
                handleError(e)
            }
            return
        }
    }
  })
}

function handleStream (stream) {
  const video = document.querySelector('video')
  //src 是播多媒体文件的；srcobj 是实时流
  video.srcObject = stream
  video.onloadedmetadata = (e) => video.play();

  //生成文件
  createRecorder(stream);
}

function handleError (e) {
  console.log(e)
}

var recorder = null;
function createRecorder(stream){
    recorder = new MediaRecorder(stream)
    
    recorder.start()
    // 如果 start 没设置 timeslice，ondataavailable 在 stop 时会触发
    recorder.ondataavailable = (event) => {
      const blob = new Blob([event.data], {
        type: 'video/webm',
      })
      saveMedia(blob)
    }
    recorder.onerror = (err) => {
      console.error(err)
    }
    setTimeout(() => {
      recorder.stop()
    }, 5000)
}

function saveMedia(blob) {
  let reader = new FileReader()
  reader.onload = () => {
    const buffer = Buffer.from(reader.result);
    var filePath = path.resolve(__dirname, "record.webm");
    filePath = "record.webm";
    fs.writeFile(filePath, buffer, {}, (err) => {
      if (err) return console.error(err)
      console.log('The file has been saved!');
    }) 
  }
  reader.onerror = (err) => console.error(err)
  reader.readAsArrayBuffer(blob)
}



