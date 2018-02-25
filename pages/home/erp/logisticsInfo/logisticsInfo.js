// pages/home/erp/logisticsInfo/logisticsInfo.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    CDN: app.CDN,
    show: [],
    goodsList: [],
    orderId:'',
    params:[],
  },
  clickHandle(e) {
    let index=e.currentTarget.dataset.index;
    if(this.data.show[index]){
       this.data.show[index] = false;
    }else{
      this.data.show[index] = true;
    }
    this.setData({
      show: this.data.show
    });
  },
  showALL(e) {
    let index=e.currentTarget.dataset.goodslist;
    if(!this.data.goodsList[index]){
       this.data.goodsList[index] = '999999';
    }else{
      this.data.goodsList[index] = '2';
    }
      this.setData({
        goodsList: this.data.goodsList
      });
  },
  getOrderList(){
    if (wx.showLoading) {
      wx.showLoading({ title: '加载中...' });
    }
    app
    .get('/aliorder/logistics', { orderId: this.data.orderId })
    .then(e => {
      if (e.status == 200) {
        if (wx.hideLoading) {
          wx.hideLoading();
        }
        this.setData({
          params: e.data
        });
      }
        if (e.status == 401) {
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
    })
    .catch(res => {
      console.log(res);
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      orderId: options.orderId,
    });
    this.getOrderList();
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
