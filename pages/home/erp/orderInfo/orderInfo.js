// pages/home/erp/orderInfo/orderInfo.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CDN: app.CDN,

    info: null,

    params: {
      orderId: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.params.orderId = options.orderId;

    if (wx.showLoading) {
      wx.showLoading({ title: '加载中...' });
    }
    this.getInfo(() => {
      if (wx.hideLoading) {
        wx.hideLoading();
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 详情
  getInfo(cb) {
    app.get('/aliorder/get', this.data.params).then((res) => {
      console.log(res);
      if (typeof cb == 'function') {
        cb();
      }

      // 未登录、超时
      if (res.status == 401) {
        this.reset();
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
        this.reset();
        return;
      }

      let data = res.data;
      if (data) {
        this.setData({
          info: data
        });
        return;
      }
      this.reset();
    }).catch((res) => {
      console.log(res);
      if (typeof cb == 'function') {
        cb();
      }
    });
  },

  // 重置
  reset() {
    this.setData({
      info: null
    })
  },

  goLogistics(){
    wx.navigateTo({
      url: "/pages/home/erp/logisticsInfo/logisticsInfo?orderId=" + this.data.params.orderId
    });
  },
  goGoodsInfo(e){
    let product = e.currentTarget.dataset.product;
    wx.navigateTo({
        url: "/pages/home/erp/goodsInfo/goodsInfo?productId=" + product
    });
  }
})