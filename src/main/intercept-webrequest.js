/**
 * webRequest
 * 
 */

import { app, session } from 'electron'

export default async function () {
    await app.whenReady()
    
    const UA = session.fromPartition('persist:name').getUserAgent();
    
    // 需要拦截的URL地址
    const filter = {
        urls: ['*://*/*'],
    }
    session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {

        details.requestHeaders['User-Agent'] = "MyAgent_Electron_CShrome";
        details.requestHeaders['Referer'] = 'http://www.baidu.com/';
        callback({ requestHeaders: details.requestHeaders });
    })

    session.defaultSession.webRequest.onBeforeRequest(filter,(details, callback) => {
        
        const { url } = details
        const isneedRedirect = url.includes('https://img1.bdstatic.com/img/image/shitu/feimg/uploading.gif')
        if (isneedRedirect) {
            console.log("========request url=======:", url);
            const redirectURL = "http://dimg08.c-ctrip.com/images/100a0g00000087qb8E7CE_C_221_166.jpg";
            callback({ redirectURL })
        }else{
            callback({})
        }
    })
}