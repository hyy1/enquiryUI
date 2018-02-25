var config = require('../config')
var utils = require('./utils')

/**
 * 组装接口完整的路径名称
 * @param {接口名称 /app/index/recommend} urlName 
 */
var apiName = function (urlName = '') {
    return config.service.apiUrl + urlName || '';
}

/**
 * 接口调用
 * @param {接口路径} url
 * @param {接口的参数} data
 */
var api = {
    cookie: '',
    setCookie: (respone) => {
        if (respone.header && respone.header['Set-Cookie']) {
            api.cookie = respone.header['Set-Cookie'];
        }
    },
    request: function () {
        var method = arguments[0];
        var url = arguments[1];
        var data = arguments[2];
        let firstTime = new Date().getTime();
        return new Promise(function (resolve, reject) {
            wx.request({
                url: apiName(url),
                method: method.toUpperCase(),
                data: data,
                dataType: "json",
                header: {
                    // 'content-type': 'application/x-www-form-urlencoded',
                    'Cookie': api.cookie || ''
                },
                success: function (e) {
                    api.setCookie(e);
                    if (e.status == 500) {
                        utils.showModel('', '服务器错误')
                        reject(e.data);
                        return;
                    }
                    console.log('全局拦截：', url, e.data, '耗时', new Date().getTime() - firstTime)
                    resolve(e.data);
                },
                fail: function (e) {
                    console.log(e)
                    utils.showModel('', '服务器错误：' + e.errMsg)
                    reject(e.data);
                }
            })
        });
    }
}

let like = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch'];

like.forEach(method => {
    api[method] = function () {
        return api.request(method, ...arguments);
    };
});

api['download'] = function (url) {
    return new Promise(function (resolve, reject) {
        wx.downloadFile({
            url: url, //仅为示例，并非真实的资源
            header: {
                // 'content-type': 'application/x-www-form-urlencoded',
                'Cookie': api.cookie || ''
            },
            success: function (res) {
                // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                if (res.statusCode === 200) {
                    resolve(res.tempFilePath);
                } else {
                    reject("下载错误！");
                }
            }
        })
    })
}

export {
    api,
    apiName
}