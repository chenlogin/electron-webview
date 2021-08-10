import { BrowserView, BrowserWindow, dialog } from 'electron'
import * as path from 'path';
import { readFile, writeFile } from './createFile';

export function createMainWindow(params) {
    let { preload, url} = params;
    let mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        // frame: false,
        webPreferences: {
          webSecurity: false,
          enableRemoteModule:true,
          preload: path.join(__dirname, preload)
        },
        show: false,
        backgroundColor: '#2e2c29'
      });
              
    return mainWindow;
};

export function createTabWindow(params) {
    let { mainWindow, url} = params;
    const tabWindow = new BrowserWindow({
        webPreferences: {
            webSecurity: false,
            nodeIntegration: true,
            webviewTag:true
        }
    })
    tabWindow.loadFile(path.join(__dirname, url));
    //tabWindow.webContents.openDevTools();
    mainWindow.addTabbedWindow(tabWindow);

    return tabWindow;
}

export function createChildrenWindow(params) {
    let { parent, url, modal} = params;
    const childWindow = new BrowserWindow({ 
      parent: parent,
      modal: modal,
      webPreferences: {
          nodeIntegration: true
      },
      show:true 
    });
    childWindow.loadFile(path.join(__dirname, url))
    return childWindow;
}

export function createBrowserView(params) {
    let { mainWindow, url} = params;
    const view = new BrowserView({
        webPreferences: {
          webSecurity: false,
          nodeIntegration: true
        },
      })
      mainWindow.setBrowserView(view)
      view.setBounds({ x: 900, y: 100, width: 200, height: 220 })
      view.setBackgroundColor('#FF996633');
      view.webContents.loadFile(path.join(__dirname, url))
}

export function createDialog(params) {
  let { browserWindow } = params
  dialog.showOpenDialog(browserWindow, {
    title: "打开文件",
    defaultPath: "",
    properties: ['openFile', 'openDirectory'],
    filters: [{ name: '自定义', extensions: ['chen','cm','html','js','mp4'] }]
  }).then( async result => {
      let path = ''; 
      //console.log(result) 输出：{ canceled: false, filePaths: [ '/Users/chen/Desktop/aa.cm' ] }  
      if (!result.canceled && result.filePaths.length > 0) {
        path = result.filePaths[0];
      }
      let extensionName = path.split(".")[1];
      switch(extensionName){
        case 'cm':
        case 'chen':
          let fileData = await readFile(path);
          path = path.split(".")[0] + (extensionName == "chen" ? ".html" : ".js");
          await writeFile(path, fileData);
          break;
        default:
          break;
      }
      new BrowserWindow({
        width: 500, 
        height: 500
      }).loadFile(path)
  }).catch(err => {
      console.log(err)
  });
}