// pages/personal/personal.js
import utils from '../../utils/utils';
var app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        dbLogin: true,
        CDN: app.CDN,
        info: {},
        avatarUrl: '',
        companyName: '',
        services: [],
        isShowCompany: false
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 我的公司长度大于1时显示选择公司链接
        // this.login();
        this.getServices();
        if (typeof options.scene !== "string") {
            return;
        }

        let scene = decodeURIComponent(options.scene)
        let param = scene.split('&');
        let actions = param[0].split('=');
        let secrets = param[1].split('=');
        if (actions[1] !== 'e') {
            return;
        }
        let secret = secrets[1];
        if (!secret) {
            app.utils.showModel('体验版登录', '登录失败，请联系客户重新获取体验码！')
            return;
        }
        this.toggleHandle(secret);
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        app.enquiryTime = null;
        this.getInfo();
    },
    onShareAppMessage: function () {
        return {
            title: '四喜E伙伴',
            path: '/pages/personal/personal'
        }
    },
    getServices: function () {
        app
            .get('/common/services')
            .then(res => {
                if (res.status !== 200) {
                    // console.log('获取客服接口', res)
                    return;
                }
                this.setData({
                    services: res.data
                })
            })
    },
    //获取页面数据
    getInfo: function () {
        if (app.globalData.customeInfo && app.globalData.customeInfo.companyName) {
            this.setData({
                info: app.globalData.customeInfo,
                companyName: app.globalData.customeInfo.companyName,
                isShowCompany: app.globalData.customeInfo.companies.length > 1 ? true : false
            })
        } else {
            this.setData({
                info: { login: false }
            })
        }
        if (app.globalData.userInfo && app.globalData.userInfo.avatarUrl) {
            let avatarUrl = app.globalData.userInfo.avatarUrl || ''
            this.setData({
                avatarUrl: avatarUrl
            })
        }
    },
    // 点击登录
    login: function () {
        if (this.data.dbLogin) {
            this.setData({
                isTiYan: false
            });
            app.reset();
            this.data.dbLogin = false;
            app.login(() => {
                setTimeout(() => {
                    this.data.dbLogin = true;
                }, 3000);
            });
        }
    },
    // 选择我的公司
    toCompany: function () {
        wx.navigateTo({
            url: "./companyList/companyList"
        })
    },
    callPhone: function (res) {
        if (!res.currentTarget.dataset.phone) {
            return
        }
        wx.makePhoneCall({
            phoneNumber: res.currentTarget.dataset.phone
        })
    },
    // 退出登录事件
    logOut: function () {
        wx.showModal({
            title: '提示',
            content: '确认退出登录？',
            success: res => {
                if (res.confirm) {
                    app
                        .post('/auth/logout')
                        .then(res => {
                            app.reset();
                            this.setData({
                                info: {},
                                avatarUrl: '',
                                companyName: '',
                                isShowCompany: false
                            })
                        })
                } else if (res.cancel) {
                    return
                }
            }
        })
    },
    // 体验版切换
    toggleHandle(secret) {
        if (wx.showLoading) {
            wx.showLoading({ title: '加载中...' });
        }
        this.setData({
            isTiYan: true
        });
        app.reset();
        app
            .post('/auth/experience', {
                secret: secret
            })
            .then(res => {
                if (wx.hideLoading) {
                    wx.hideLoading();
                }
                if (res.status !== 200) {
                    app.utils.showModel('体验版登录', res.msg)
                    return;
                }
                app.getUserInfo();
            })
    }
})