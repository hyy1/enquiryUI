// pages/home/analysisReport/has/has.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    has: []
  },
  //选择传入信息
  selectReport(e) {
    console.log(e.detail.params);
    let tittle = String(e.detail.params.reportName)+'询盘分析报告';
    wx.setNavigationBarTitle({
      title: tittle
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '2017年整年度询盘分析报告'
    });
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
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
