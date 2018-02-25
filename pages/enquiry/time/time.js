// pages/enquiry/time/time.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CDN: app.CDN,
    fields:'day',
    time: {
      startTime: null,
      endTime: null,
    },
    defaultTime: {
      start: app.time.formatSubtractTime(1, 'years'),
      end: app.time.formatSubtractTime(0),
      yesterday: app.time.formatSubtractTime()
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.enquiryTime) {
      this.setData({
        time: app.enquiryTime
      });
    }
    if (options.pageName === "hasRecord"){
        this.setData({
            defaultTime: {
                start: app.time.formatTime('2018-01-01'),
                end: app.time.formatSubtractTime(0)
            },
            fields:'month'
        })
    }
  },

  // 完成
  confirmHandle() {
    // 校验
    if (this.isNull(this.data.time.startTime) || this.isNull(this.data.time.endTime)) {
      wx.showModal({
        content: '请选择开始日期或结束日期！',
        showCancel: false,
        success: function (res) {

        }
      });
      return;
    }
    app.enquiryTime = this.data.time;
    wx.navigateBack()
  },

  // 开始时间
  startTimeChange(e) {
    this.setData({
      'time.startTime': e.detail.value
    })
  },
  // 结束时间
  endTimeChange(e) {
    this.setData({
      'time.endTime': e.detail.value
    })
  },
  // 清除数据
  clearHandle() {
    this.setData({
      time: {
        startTime: null,
        endTime: null,
      }
    })
  },
  isNull(v) {
    if (v == '' || v == null || v == undefined) {
      return true;
    }
    return false;
  }
})