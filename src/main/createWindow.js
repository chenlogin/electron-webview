import { BrowserView, BrowserWindow, dialog } from 'electron'
import * as path from 'path';

export function createMainWindow(params) {
    let { preload, url} = params;
    let mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        // frame: false,
        webPreferences: {
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
    let { parent, url} = params;
    const childWindow = new BrowserWindow({ 
      parent: parent,
      modal: true,
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
    properties: ['openFile', 'openDirectory']
  }).then(result => {
      //console.log(result)
  }).catch(err => {
      console.log(err)
  });
}