//app.js
import { api, apiName } from '/utils/api';
import time from '/utils/time';
import utils from '/utils/utils';
import auth from '/utils/auth';
import configA from '/config';
const config = {
    onLaunch: function () {
        this.compatibleProcessing();
    },
    compatibleProcessing() {
        if (!wx.canIUse) {
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
            })
            return;
        }
        if (!wx.canIUse('request.success.header')) {
            wx.showModal({
                title: '提示2',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
            })
        }
    },
    apiName: apiName,
    time,
    utils,
    CDN: configA.service.imgUrl,
    ALI:configA.service.aliImgURL,
    ...auth,
    ...api,
    selectValueTime:'0',
    imgSizePro: configA.service.imgSizePro,
    imgSizeEnq: configA.service.imgSizeEnq
}
// for (var name in api) {
//   config[name] = api[name]
// }
App(config)
