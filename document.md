- 源有问题
    - 1、package文件的build中添加
    "electronDownload":{"mirror":"https://npm.taobao.org/mirrors/electron/" }
    - 2、.npmrc中添加配置
    - 3、npm config set electron_mirror "http://npm.taobao.org/mirrors/electron/" 
    npm install electron

- globalShortcut
    - 向操作系统注册/注销全局键盘快捷方式，以便自定义各种快捷方式的操作。
    - 快捷方式是全局的，即使应用程序没有键盘焦点，它也能工作。您不应该使用此模块，直到ready发出APP模块的事件。
- electron-debug
    - Adds useful debug features to your Electron app
- 截屏
    - https://github.com/nashaofu/screenshots/tree/master/packages/electron-screenshots
- electron-builder
    - 目前比较流行的打包库：Electron-packager Electron-builder
    - https://github.com/QDMarkMan/CodeBlog/blob/master/Electron/electron-builder%E6%89%93%E5%8C%85%E8%AF%A6%E8%A7%A3.md
    - electron-builder --dir
        - to package in a distributable format (e.g. dmg, windows installer, deb package).
    - electron-builder
        - only generates the package directory without really packaging it. This is useful for testing purposes.
- 主进程、渲染进程、webview之间的通讯
    - https://www.jianshu.com/p/7f1002c281e2