// pages/personal/bindPhone/bindPhone.js
//获取应用实例
const app = getApp()
Page({
    verifyBindphone: function () {
        // console.log({ ...this.data.params })
        let params = { ...this.data.params };
        if (!params.phone || !/^1[34578]\d{9}$/.test(params.phone)) {
            app.utils.showModel('绑定手机号', '请填写正确的手机号')
            return;
        }
        if (!params.code) {
            app.utils.showModel('绑定手机号', '请填写正确的短信验证码')
            return;
        }
        if (!params.verifycode && this.data.isShowYzm) {
            app.utils.showModel('绑定手机号', '请填写正确的图片验证码')
            return;
        }
        this.bindphone();
    },
    bindphone: function () {
        app
            .post('/auth/bindphone', { ...this.data.params })
            .then(res => {
                if (res.status !== 200) {
                    app.utils.showModel('绑定手机号', res.msg)
                    return;
                }

                // 判断是否需要选择公司
                app.accountMy();
            })
    },
    // 获取图片验证码
    setYzm: function () {
        app.download(app.apiName('/auth/verifycode') + '?time=' + app.time.formatTime(new Date(), 'x')).then(path => {
            // console.log(path)
            this.setData({
                yzm: path
            })
        })

        // console.log(app.time.formatTime(new Date(), 'x'))
    },
    setPhone: function (res) {
        this.setData({
            "params.phone": res.detail.value
        })
        this.setSubmit()
    },
    setVerifycode: function (res) {
        this.setData({
            "params.verifycode": res.detail.value
        })
        this.setSubmit()
    },
    setCode: function (res) {
        this.setData({
            "params.code": res.detail.value
        })
        this.setSubmit()
    },
    setSubmit: function () {
        if (this.data.params.code && this.data.params.phone) {
            this.setData({
                isSubmit: true
            })
        } else {
            this.setData({
                isSubmit: false
            })
        }
    },
    // 获取短信验证码
    getSendcode: function () {
        let params = { ...this.data.params };
        if (!params.phone || !/^1[34578]\d{9}$/.test(params.phone)) {
            app.utils.showModel('绑定手机号', '请填写正确的手机号')
            return;
        }
        if ((!params.verifycode && this.data.isShowYzm) || (params.verifycode && params.verifycode.length !== 4)) {
            app.utils.showModel('绑定手机号', '请填写正确的图片验证码')
            return;
        }
        if (this.data.clickNum !== 1) {
            clearInterval(this.data.update)
            this.setData({ isGetCode: false })
            this.update();
        }
        this.data.clickNum++
        this.setData({ clickNum: this.data.clickNum })
        // console.log(this.data.clickNum)
        app
            .post('/auth/sendcode?time=' + app.time.formatTime(new Date(), 'x'), params)
            .then(res => {
                // console.log(res)
                if (res.status !== 200) {
                    app.utils.showModel('绑定手机号', res.msg)
                    // console.log(this.data.isShowYzm)
                    // clearInterval(this.data.update)
                    //   if (this.data.isShowYzm) {
                    //     this.setData({ isGetCode: false })
                    //     this.update();
                    //   }
                    this.setData({
                        isShowYzm: true
                    })
                    this.setYzm();

                    return;
                }
                app.utils.showSuccess('已发送')
                this.setData({
                    'params.code': res.data
                })

            })
    },
    update: function () {
        this.data.update = setInterval(() => {
            this.data.codeIntervalTime--
            let codeIntervalTime = this.data.codeIntervalTime;
            if (codeIntervalTime <= 0) {
                codeIntervalTime = 60;
                this.setData({ isGetCode: true })
                clearInterval(this.data.update);
            }
            this.setData({ codeIntervalTime: codeIntervalTime })
        }, 1000)
    },

    formSubmit: function (e) {
        // console.log('form发生了submit事件，携带数据为：', e.detail.value)
    },
    formReset: function () {
        // console.log('form发生了reset事件')
    },
    /**
     * 页面的初始数据
     */
    data: {
        CDN: app.CDN,
        yzm: '',
        isShowYzm: false,
        isGetCode: true,
        isSubmit: false,
        codeIntervalTime: 60,
        clickNum: 0,
        update: 0,
        params: {
            verifycode: '',
            phone: '',
            code: ''
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: '四喜E伙伴',
            path: '/pages/personal/bindPhone/bindPhone'
        }
    },
})