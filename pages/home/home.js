// pages/home/home.js
import echarts from "../../utils/resources/wxcharts.js";

var columnChart = null;
var chartData = {
  setColor: [
    { start: '#7B73FE', end: '#55ABF6' },
    { start: '#7B73FE', end: '#55ABF6' },
    { start: '#7B73FE', end: '#55ABF6' },
    { start: '#7B73FE', end: '#55ABF6' },
    { start: '#7B73FE', end: '#55ABF6' },
    { start: '#7B73FE', end: '#55ABF6' },
    { start: '#7B73FE', end: '#55ABF6' },
  ]
};

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowChart: false,
    CDN: app.CDN,
    // banner
    imgUrls: [
      app.CDN + 'banner-2.png?id=20180203'
    ],
    indicatorDots: false,      //是否显示面板指示点

    // 询盘
    newEnquire: [
      {
        t1: 'totalValue',
        t2: 'totalCount'
      },
      {
        t1: 'tranValue',
        t2: 'tranCount'
      },
      {
        t1: 'enquireValue',
        t2: 'followCount'
      },
      {
        t1: 'lossValue',
        t2: 'lossCount'
      },
    ],
    enquire: null,
    images: {
      totalValue: app.CDN + 'enquiry_1.png',
      tranValue: app.CDN + 'enquiry_2.png',
      enquireValue: app.CDN + 'enquiry_3.png',
      lossValue: app.CDN + 'enquiry_4.png',
    },
    enquireName: {
      totalValue: '总金额',
      enquireValue: '跟单金额',
      tranValue: '成交金额',
      lossValue: '流失金额',
    },
    enquiryType: {
      totalValue: 1,
      tranValue: 2,
      enquireValue: 3,
      lossValue: 4,
    },
    enquireTime: {
      label: '一月',
      startTime: app.time.getTimeLimit(1, 'month'),
      endTime: app.time.getTimeLimit(-1),
      type: 2
    },
    // 客户地区
    customerarea: [],
    customerareaTime: {},
    // 公司
    company: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onShow() {
    app.enquiryTime = null;
    // 初始化操作
    // console.log('show');
    // app.isBindPhoneOrBindCustome();
    this.getEnquire(this.data.enquireTime, () => {
      this.getCustomArea(this.data.customerareaTime);
    });

    if (app.globalData.customeInfo) {
      this.setData({
        company: app.globalData.customeInfo.companyName
      });
    } else {
      this.setData({
        company: ''
      });
    }
  },
  onPullDownRefresh: function () {
    this.getEnquire(this.data.enquireTime, () => {
      this.getCustomArea(this.data.customerareaTime);
      wx.stopPullDownRefresh();
    });

    if (app.globalData.customeInfo) {
      this.setData({
        company: app.globalData.customeInfo.companyName
      });
    } else {
      this.setData({
        company: ''
      });
    }
  },

  onShareAppMessage: function () {
    return {
      title: '四喜E伙伴',
      path: '/pages/home/home'
    }
  },

  // 客户地区
  getCustomArea({ type = 2 }) {
    app.get('/enquiry/customerarea', {
      type: type,
    }).then(res => {
      if (res.status == 401) {
        this.setData({
          customerarea: [],
          isShowChart: false
        });
        return;
      }
      if (res.status != 200) {
        // app.utils.showModel('错误提示', res.msg);
        // console.log(res);
        return;
      }

      let formatData = res.data;
      if (formatData.length == 0) {
        this.setData({
          customerarea: [],
          isShowChart: false
        });
        return;
      }
      formatData.forEach(item => {
        if(item.sumAllAmount<10000){
        item.sumAllAmount = item.sumAllAmount.toFixed(2);
        item.sumGmvAmountFormat = item.sumAllAmount.replace(/\d{1,3}(?=(\d{3})+\.)/g, '$&,');
      }else{
        item.sumGmvAmountFormat = app.time.NumberUpperFormat(item.sumAllAmount);
      }
      });
      this.setData({
        customerarea: formatData,
        // isShowChart: true
      });
      this.getEcharts();
      this.getRing(formatData);
    }).catch(res => {
      this.setData({
        customerarea: [],
        isShowChart: false
      });
      // console.log(res);
    });
  },
  // 询盘统计
  getEnquire({ type = 1 }, cb) {
    app.get('/enquiry/statistics', {
      type: type,
    }).then(res => {
      if (typeof cb == 'function') {
        cb();
      }
      if (res.status == 401) {
        this.setData({
          enquire: null,
          enquireTime: this.data.enquireTime
        })
        wx.showModal({
          title: '提示',
          content: '登录超时或未登录，请重新登录',
          success: res => {
            if (res.confirm) {
              app.reset();
              wx.switchTab({
                url: '/pages/personal/personal'
              })
            } else if (res.cancel) {
            }
          }
        })
        return;
      }
      if (res.status != 200) {
        // app.utils.showModel('错误提示', res.msg);
        // console.log(res);
        return;
      }

      let formatData = res.data;
      for (let i in formatData) {
        if (formatData[i] && (i == 'enquireValue' || i == 'lossValue' || i == 'totalValue' || i == 'tranValue')) {
          if(formatData[i]<10000){
          formatData[i] = formatData[i].toFixed(2);
          formatData[i] = formatData[i].replace(/\d{1,3}(?=(\d{3})+\.)/g, '$&,');
          }else{
            formatData[i] = app.time.NumberUpperFormat(formatData[i]);
          }
        }
      }
      this.setData({
        enquire: formatData,
        enquireTime: this.data.enquireTime
      })
    }).catch(res => {
      this.setData({
        enquire: null,
        enquireTime: this.data.enquireTime
      })
      // console.log(res);
    });
  },
  // 图表
  getEcharts() {
    let cacheData = [...this.data.customerarea];
    if (cacheData.length == 0) {
      return;
    }
    cacheData = cacheData.filter((res, index) => {
      if(index < 5){
        if (res.sumAllAmount > 0) {
          return true;
        }
      }
    });
    let windowWidth = this.getWindowWidth();
    let categories = cacheData.map(item => {
      return item.provinceName;
    });
    chartData.seriesData = cacheData.map(item => {
      return item.sumAllAmount;
    });
    chartData.setColor = cacheData.map(item => {
      return { start: '#7B73FE', end: '#55ABF6' };
    });
    let subCategories = cacheData.map(item => {
      return item.num + '人';
    });

    columnChart = new echarts({
      canvasId: 'columnCanvas',
      type: 'column',
      animation: true,
      legend: false,
      categories: categories,
      // subCategories: subCategories,
      // subCategoriesColor: 'rgba(0, 0, 0, .3)',
      series: [{
        data: chartData.seriesData,
        format: function (val) {
            return String(val).replace(/\d{1,3}(?=(\d{3})+\.)/g, '$&,');
        },
        setColor: chartData.setColor,
        isGradation: true,
      }],
      yAxis: {
        gridColor: 'rgba(204, 204, 204, .25)',
        format: function (val) {
          return val;
        },
        min: 0
      },
      xAxis: {
        disableGrid: true,
        type: 'calibration'
      },
      extra: {
        column: {
          width: 35
        }
      },
      width: windowWidth,
      height: windowWidth * 223 / 375,
    });
    this.setData({
      isShowChart: true
    });
  },
  getRing(array) {
    let windowWidth = this.getWindowWidth();
    setTimeout(() => {
      array.forEach((item, index) => {
        let cache = item.tranProportion;
        this.drawRing(index, cache, windowWidth);
      });
    }, 500)
  },
  drawRing(index, process = 30, windowWidth, width = 46.8, r = width / 2 - 3) {
    var context = wx.createCanvasContext('ring_' + index);
    width = width * windowWidth / 375;
    var height = width;

    this.drawCricle(context, process, width, height, r);
    context.draw();
  },
  drawCricle(ctx, percent, width, height, r) {
    // 画外圆  
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.setFillStyle('#D8D8D8');
    ctx.fill();
    // 进度环  
    ctx.beginPath();
    ctx.moveTo(width / 2, height / 2);
    ctx.arc(width / 2, height / 2, r, Math.PI * 1.5, Math.PI * (1.5 + 2 * percent / 100));
    ctx.closePath();
    ctx.setFillStyle('#55ABF6');
    ctx.fill();

    // 内圆
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, r - 3, 0, Math.PI * 2);
    ctx.closePath();
    ctx.setFillStyle('white');
    ctx.fill();

    // 填充文字  
    ctx.setFontSize(12);
    ctx.setFillStyle("#6495F9");
    ctx.setTextAlign("center");
    ctx.setTextBaseline('middle');
    ctx.moveTo(width / 2, height / 2);
    ctx.fillText(percent + '%', width / 2, height / 2);
  },
  touchHandler: function (e) {
    if (this.data.customerarea.length == 0) {
      return;
    }
    var index = columnChart.getCurrentDataIndex(e);
    let color = chartData.setColor.map((item, i) => {
      item.start = '#7B73FE';
      item.end = '#55ABF6';
      if (i == index) {
        item.start = '#FF731D';
        item.end = '#FEA449';
      }
      return item;
    });
    columnChart.updateData({
      series: [{
        data: chartData.seriesData,
        setColor: color,
        isGradation: true,
      }],
    });
  },
  // 获取时间-询盘
  getTimeEnquiry(e) {
    // this.setData({
    //   animationEnquiry: this.animationEnquiry()
    // })
    if (wx.showLoading) {
      wx.showLoading({ title: '加载中...' });
    }
    this.data.enquireTime = e.detail.time;
    this.getEnquire(e.detail.time, () => {
      if (wx.hideLoading) {
        wx.hideLoading();
      }
    });
  },
  // 获取时间-地区
  getTimeErea(e) {
    // this.setData({
    //   animationErea: this.animationErea()
    // })

    this.data.customerareaTime = e.detail.time;
    this.getCustomArea(e.detail.time);
  },
  getWindowWidth() {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    return windowWidth;
  },
  // 地区询盘
  jumpArea(e) {
    let index = e.currentTarget.dataset.index;
    let item = e.currentTarget.dataset.obj;
    let timeType = this.data.customerareaTime.type || 2;
    let timeName = this.data.customerareaTime.label || '一月';
    let url = "/pages/home/areaEnquiry/areaEnquiry?provinceId=" + item.provinceId + "&provinceName=" + item.provinceName + "&ranking=" + (index + 1) + "&timeType=" + timeType + "&timeName=" + timeName;
    wx.navigateTo({
      url: url,
    });
  },
  // 动画
  animationEnquiry() {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-in',
    })
    animation.opacity(.3).rotate3d(0, 1, 0, 90).step()
    animation.opacity(1).rotate3d(0, 0, 0, 0).step()
    return animation.export();
  },
  animationErea() {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-in',
    })
    animation.opacity(0.3).step()
    animation.opacity(1).step()
    return animation.export();
  }
})