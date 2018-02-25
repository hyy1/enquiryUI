// pages/home/analysisReport/data/data.js
import echarts from "../../../../utils/resources/wxcharts.js";
const app = getApp();
let columnChart = null;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        CDN: app.CDN,
        pageType: 1,
        times: [],
        timeArray: [],
        disabled: true,
        msgStr:'数据加载中，请稍后。。。',
        area1: {
            canvasId: 'area1',
            tabType: 'area',
            title: '按总金额统计',
            titles: ['询盘地区', '询盘总数', '总金额', '询盘占比'],
            tabList: [],
            colorType: ['#00DACE', '#33CC82', '#FFC444', '#F88133', '#F56364', '#CCB433'],
        },
        area2: {
            canvasId: 'area2',
            tabType: 'area',
            title: '按成交金额统计',
            titles: ['询盘地区', '有效询盘数量', '成交金额', '成交占比'],
            tabList: [],
            colorType: ['#00DACE', '#33CC82', '#FFC444', '#F88133', '#F56364', '#CCB433'],
        },
        product1: {
            canvasId: 'product1',
            tabType: 'product',
            title: '高频产品排行',
            titles: ['产品名称', '询盘数量', '公司报价', '同行报价'],
            tabList: [],
            colorType: ['#F56364', '#FFC444', '#F6825C', '#FFECA3', '#FF9938', '#C15266', '#FDDA9D', '#EFA08E', '#DC7A78', '#E8BE5B', '#E5B6B5'],
        },
        product2: {
            canvasId: 'product2',
            tabType: 'product',
            title: '已成交高频产品排行',
            titles: ['产品名称', '询盘数量', '公司报价', '同行报价'],
            tabList: [],
            colorType: ['#F56364', '#FFC444', '#F6825C', '#FFECA3', '#FF9938', '#C15266', '#FDDA9D', '#EFA08E', '#DC7A78', '#E8BE5B', '#E5B6B5'],
        },
        colorType1: ['#00DACE', '#33CC82', '#FFC444', '#F88133', '#F56364', '#CCB433'],
        colorType2: ['#F56364', '#FFC444', '#F6825C', '#FFECA3', '#FF9938', '#C15266', '#FDDA9D', '#EFA08E', '#DC7A78', '#E8BE5B', '#E5B6B5'],
        reportId: 0,
    },
    bindPickerChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        if (this.data.timeArray.length <= 0) {
            console.log('timeArray', this.data.timeArray)
            return;
        }
        let reportId = this.data.timeArray[e.detail.value]['reportId'];
        let reportName = this.data.timeArray[e.detail.value]['reportName'];
        // let reportId = 0;
        this.setTitle(reportName);
        this.setData({
            index: e.detail.value,
            reportId
        })
        // 获取图标数据
        this.getArea1();
        this.getArea2();
        this.product1();
        this.product2();
    },
    setTitle(reportName) {
        wx.setNavigationBarTitle({
            title: reportName + '询盘分析'
        })
    },
    // 设置选项卡值
    setPageType(e) {
        let pageType = e.currentTarget.dataset && e.currentTarget.dataset.pagetype || 0;
        this.setData({
            pageType: pageType
        })
        if (pageType == 2 && (this.data.product1.tabList.length <= 0 || this.data.product2.tabList.length <= 0)) {
            this.product1();
            this.product2();
        }
        if (pageType == 1 && (this.data.area1.tabList.length <= 0 || this.data.area2.tabList.length <= 0)) {
            this.getArea1();
            this.getArea2();
        }
        if (this.data.times.length <= 0) {
            this.getTimes();
        }
    },
    setMsgStr(){
        this.setData({
            'msgStr':'抱歉!没有找到符合条件的记录'
        })
    },
    // 询盘报告分析-数据分析-区域分布与排行统计-按总金额统计
    getArea1() {
        if (wx.showLoading) {
            wx.showLoading({ title: '加载中...' });
        }
        app
            .get('/report/statistics/area', {
                reportId: this.data.reportId,
                orderType: 0
            })
            .then(res => {
                
                if (res.status == 401) {
                    wx.showModal({
                        title: '提示',
                        content: '登录超时或未登录，请重新登录',
                        success: res => {
                            if (res.confirm) {
                                app.reset();
                                wx.switchTab({
                                    url: '/pages/personal/personal'
                                });
                                return;
                            }
                        }
                    });
                    if (wx.hideLoading) {
                        wx.hideLoading();
                    }
                    return;
                }
                if (res.status !== 200) {
                    app.utils.showModel('获取分析数据', res.msg);
                    if (wx.hideLoading) {
                        wx.hideLoading();
                    }
                    return;
                }
                let data = this.filterZero(res.data)
                this.setData({
                    'area1.tabList': data
                })
                if (wx.hideLoading) {
                    wx.hideLoading();
                }
                this.getEcharts(data, 'area1', this.data.colorType1);
                this.setMsgStr();
            })
            .catch(res => {
                console.log(res)
                this.setMsgStr();
            })
    },
    // 询盘报告分析-数据分析-区域分布与排行统计-按成交金额统计
    getArea2() {
        if (wx.showLoading) {
            wx.showLoading({ title: '加载中...' });
        }
        app
            .get('/report/statistics/area', {
                reportId: this.data.reportId,
                orderType: 1
            })
            .then(res => {
                if (res.status == 401) {
                    wx.showModal({
                        title: '提示',
                        content: '登录超时或未登录，请重新登录',
                        success: res => {
                            if (res.confirm) {
                                app.reset();
                                wx.switchTab({
                                    url: '/pages/personal/personal'
                                });
                                return;
                            }
                        }
                    });
                    if (wx.hideLoading) {
                        wx.hideLoading();
                    }
                    return;
                }
                if (res.status !== 200) {
                    app.utils.showModel('获取分析数据', res.msg);
                    if (wx.hideLoading) {
                        wx.hideLoading();
                    }
                    return;
                }
                let data = this.filterZero(res.data)
                this.setData({
                    'area2.tabList': data
                })

                if (wx.hideLoading) {
                    wx.hideLoading();
                }
                this.getEcharts(data, 'area2', this.data.colorType1);
                this.setMsgStr();
            })
            .catch(res => {
                console.log(res)
                this.setMsgStr();
            })
    },
    product1() {
        if (wx.showLoading) {
            wx.showLoading({ title: '加载中...' });
        }
        app
            .get('/report/statistics/product', {
                reportId: this.data.reportId,
                orderType: 0
            })
            .then(res => {
                if (res.status == 401) {
                    wx.showModal({
                        title: '提示',
                        content: '登录超时或未登录，请重新登录',
                        success: res => {
                            if (res.confirm) {
                                app.reset();
                                wx.switchTab({
                                    url: '/pages/personal/personal'
                                });
                                return;
                            }
                        }
                    });
                    if (wx.hideLoading) {
                        wx.hideLoading();
                    }
                    return;
                }
                if (res.status !== 200) {
                    app.utils.showModel('获取分析数据', res.msg);
                    if (wx.hideLoading) {
                        wx.hideLoading();
                    }
                    return;
                }
                let data = this.filterZero(res.data)
                this.setData({
                    'product1.tabList': data
                })

                if (wx.hideLoading) {
                    wx.hideLoading();
                }
                this.getEcharts(data, 'product1', this.data.colorType2);
                this.setMsgStr();
            })
            .catch(res => {
                console.log(res)
                this.setMsgStr();
            })
    },
    product2() {
        if (wx.showLoading) {
            wx.showLoading({ title: '加载中...' });
        }
        app
            .get('/report/statistics/gmvproduct', {
                reportId: this.data.reportId,
                orderType: 1
            })
            .then(res => {
                if (res.status == 401) {
                    wx.showModal({
                        title: '提示',
                        content: '登录超时或未登录，请重新登录',
                        success: res => {
                            if (res.confirm) {
                                app.reset();
                                wx.switchTab({
                                    url: '/pages/personal/personal'
                                });
                                return;
                            }
                        }
                    });
                    if (wx.hideLoading) {
                        wx.hideLoading();
                    }
                    return;
                }
                if (res.status !== 200) {
                    app.utils.showModel('获取分析数据', res.msg);
                    if (wx.hideLoading) {
                        wx.hideLoading();
                    }
                    return;
                }
                let data = this.filterZero(res.data)
                this.setData({
                    'product2.tabList': data
                })

                if (wx.hideLoading) {
                    wx.hideLoading();
                }
                this.getEcharts(data, 'product2', this.data.colorType2);
                this.setMsgStr();
            })
            .catch(res => {
                console.log(res)
                this.setMsgStr();
            })
    },
    // 过滤零的数据
    filterZero(data) {
        console.log('过滤零的数据 filterZero', data)
        let arr = [];
        if (!data || data.length <= 0) {
            console.log('过滤零的数据' + data)
            return [];
        }
        data.map(e => {
            if (e.percent > 0) {
                arr.push(e);
            }
        })
        console.log('过滤零的数据 ==> filterZero', arr)
        return arr;
    },
    // 获取选择时间
    getTimes() {
        app
            .get('/report/pastreport')
            .then(res => {
                if (!res.data || res.data.length == 0) {
                    console.log('获取选择时间数据' + res)
                    return;
                }
                let times = [];
                res.data.map(e => {
                    times.push(e.reportName)
                })
                console.log('获取选择时间 ==> ', times, res.data)
                this.setData({
                    timeArray: res.data,
                    times,
                    disabled: false
                })

            })
            .catch(res => {
                console.log('获取选择时间数据错误', res)
            })
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

    // 图表
    getEcharts(series, canvasId, colorType) {
        if (!series || series.length == 0) {
            console.log('图标数据：' + series)
            return;
        }
        let cache = [...series].filter((item, index) => {
            item.number = index;
            if (item.value != 0) {
                return true;
            }
        });
        let newSeries = cache.map((item, index) => {
            return {
                name: item.name,
                data: item.percent,
                color: colorType[item.number % 10],
                format: function (val) {
                    return item.percent + '% ';
                }
            }
        });
        // console.log(newSeries);
        var windowWidth = 320;
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth - 30;
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }

        columnChart = new echarts({
            canvasId: canvasId,
            type: 'ring',
            animation: true,
            legend: false,
            series: newSeries,
            width: windowWidth,
            height: windowWidth * 340 / 375,
            dataLabel: true,
            disablePieStroke: false
        });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        console.log('初试onShow', app.globalData.customeInfo)
        this.data.reportId = app.globalData.customeInfo && app.globalData.customeInfo.reportId || 0;
        this.setTitle(app.globalData.customeInfo && app.globalData.customeInfo.reportName || '');
        this.getTimes();
        this.getArea1();
        this.getArea2();
        this.product1();
        this.product2();
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

    }
})