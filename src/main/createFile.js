const fs = require('fs');

/**  
 * 读取文件
 * 第一个参数就是要读取的文件路径
 * 第二个参数是一个回调函数
 * 错误优先机制，回调函数的第一个参数为错误信息
 *   成功：data 数据，error null
 *   失败：data undefined没有数据，error 错误对象
 *      <Buffer 68 65 6c 6c 6f 20 6e 6f 64 65 6a 73 0d 0a>
 *      文件中存储的其实都是二进制数据 0 1
 *      这里为什么看到的不是 0 和 1 是因为二进制转为 16 进制了
 *      但是无论是二进制01还是16进制，人类都不认识
 *      所以我们可以通过 toString 方法把其转为我们能认识的字符
 */
export async function readFile(path){
    return new Promise( resolve => {
        fs.readFile(path, function (error, data) {
            if (error) {
              console.log(error)
            } else {
              resolve(data.toString())
            }
          })
    }) 
}

/** 
 * 第一个参数：文件路径
 * 第二个参数：文件内容
 * 第三个参数：回调函数
 *  成功：文件写入成功, error 是 null
 *  失败：文件写入失败,error 就是错误对象
*/ 
export function writeFile(path, data){
    return new Promise(resolve => {
        fs.writeFile(path, data, function (error) {
            if (error) {
                console.log(error)
            } else {
                resolve({"success":true});
            }
          })
    })  
}     

