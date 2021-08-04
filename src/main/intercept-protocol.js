
/** protocol拦截
 * HTML
 * JS,CSS
 * img,gif
 * API
 * mp3
*/
const { protocol } = require('electron');

const cacheResource =  {
    html: {
        original: "https://www.baidu.com/index.html",
        redirect: ""
    },
    jpg : {
        original: "https://dimg01.c-ctrip.com/images/100p0y000000m0n4d5A06_C_221_166.jpg",
        redirect: "http://dimg08.c-ctrip.com/images/100a0g00000087qb8E7CE_C_221_166.jpg"
    },
    gif : {
        original: "https://img1.bdstatic.com/img/image/shitu/feimg/uploading.gif",
        redirect: "http://dimg08.c-ctrip.com/images/100a0g00000087qb8E7CE_C_221_166.jpg"
    },
    js: {
        original: "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js",
        redirect: ""
    },
    css: {
        original: "",
        redirect: ""
    },
    api: {
        original: "",
        redirect: ""
    }
}

function hasCacheResource(url) {
    let key = url.split(".").pop();
    if(cacheResource[key]){
        return cacheResource[key].original == url;
    }
    return false
}

function getCacheResourcePath(url) {
    
    let redirect = url;
    let key = url.split(".").pop();
    if(hasCacheResource(url) && cacheResource[key].redirect){
        redirect = cacheResource[key].redirect;
    }
    return redirect;
}

export function intercept() {
    protocol.interceptHttpProtocol('https', (request, callback) => {
        
        if(hasCacheResource(request.url)){
            console.log("========request url=======:", request.url);
        }
        
        callback({
            url: getCacheResourcePath(request.url),
            session:null
        })
    }, (error) => {
        console.error('error', error) 
    })
}