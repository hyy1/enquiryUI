// pages/home/winKing/winKing.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    CDN: app.CDN,
    fields: 'month',
    nowMonth: app.time.formatSubtractTime(1, 'month', new Date(), 'MM'),
    time: app.time.formatSubtractTime(1, 'month', new Date(), 'YYYY-MM'),
    defaultTime: {
      start: app.time.formatTime(new Date(), 'YYYY-01'),
      end: app.time.formatSubtractTime(1, 'month', new Date(), 'YYYY-MM')
    },
    winKing: []
  },
  setTitle(reportName) {
    wx.setNavigationBarTitle({
      title: reportName + '标王记录'
    });
  },
  getlistwinKing() {
    wx.setNavigationBarTitle({
      title: this.data.time + '标王记录'
    });
    if (wx.showLoading) {
      wx.showLoading({ title: '加载中...' });
    }
    app
      .get('/topbidder/list', { time: this.data.time })
      .then(e => {
        if (e.status == 200) {
          wx.stopPullDownRefresh();
          if (wx.hideLoading) {
            wx.hideLoading();
          }
          this.setData({
            winKing: e.data
          });
        } else if (e.status == 401) {
          wx.showModal({
            title: '提示',
            content: '登录超时或未登录，请重新登录',
            success: res => {
              if (res.confirm) {
                app.reset();
                wx.switchTab({
                  url: '/pages/personal/personal'
                });
              } else if (res.cancel) {
              }
            }
          });
          return;
        } else {
          console.log(e.msg);
        }
      })
      .catch(res => {
        console.log(res);
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getlistwinKing();
    this.setTitle(this.data.time);
  },
  timeChange(e) {
    this.setData({
      time: e.detail.value
    });
    this.setTitle(e.detail.value);
    this.getlistwinKing();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getlistwinKing();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
