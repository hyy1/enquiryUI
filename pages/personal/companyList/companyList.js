// pages/personal/companyList/companyList.js
import utils from '../../../utils/utils';
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    CDN: app.CDN,
    lists: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getList()
  },
  onShareAppMessage: function () {
    return {
      title: '四喜E伙伴',
      path: '/pages/personal/companyList/companyList'
    }
  },
  getList: function () {
    // if (app.globalData.companies)
    //   this.setData({
    //     lists: app.globalData.companies
    //   })
    app.get('/company/list').then(res => {
      if (res.status == 401) {
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
      if (res.status === 200) {
        app.globalData.companies = res.data
        this.setData({
          lists: app.globalData.companies
        })
      }
    })
  },
  // 选择公司
  changeCompany: function (event) {
    // console.log('changeCompany', event)
    wx.showModal({
      title: '提示',
      content: '是否切换公司?',
      success: function (res) {
        if (res.confirm) {
          if (wx.showLoading) {
            wx.showLoading({ title: '加载中...' });
          }
          //   setTimeout(() => {
          app.setcompany(event.currentTarget.dataset.aliaccountid, () => {
            if (wx.hideLoading) {
              wx.hideLoading();
            }
          })
          //   }, 2000);
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  }
})