var utils = require('./utils')
import { api } from '../utils/api';

var auth={
    // 1、判断登录是否过期
  ifcheckSession: function () {
    // console.log('1、判断登录是否过期')
    wx.checkSession({
      success: res => {
        //1-1、session 未过期，并且在本生命周期一直有效
        // console.log('1-true、session 未过期，并且在本生命周期一直有效')
        this.getUserInfo();
      },
      fail: res => {
        //1-2、登录态过期
        // console.log('1-flase、登录态过期')
        this.login(); //重新登录
      }
    })
  },
  // 1.1、 小程序登录 获取code
  login: function (cb) {
      this.reset();
      if(wx.showLoading){
        wx.showLoading({title: '加载中...'});
      }
     
    // console.log('1.1、 小程序登录 获取code')
    wx.login({
      success: res => {
        if (typeof cb == 'function') {
          cb();
        }
        if (!res.code) {
          utils.showModel('用户登录', '登录失败:' + res.errMsg)
        //   console.log('1.1-flase、获取用户登录态失败！' + res.errMsg)
          return;
        }
        //发起网络请求
        this.authorize(res.code)
      },
      complete: res => {
        if(wx.hideLoading){
          wx.hideLoading();
      }
      }
    });
  },
  // 1.2、 code 换取 openId 
  authorize: function (code) {
    // console.log('1.2、 code 换取 openId,code:', code)
    api
      .post('/auth/authorize', { code: code })
      .then(res => {
        if (res.status !== 200) {
          utils.showModel('用户授权', '授权失败:' + res.msg)
        //   console.log('1.2-flase、获取openId失败！' + res.msg)
          return;
        }
        this.getUserInfo();
      })
  },
  // 2、小程序 获取用户信息
  getUserInfo: function () {
    wx.getUserInfo({
      success: res => {
        // console.log('2、小程序 获取用户信息', res)
        this.globalData.userInfo = res.userInfo;
        this.accountMy();
      },
      fail: res => {
        this.openSetting();
      }
    })
  },
  // 2.1、 调起客户端小程序设置界面
  openSetting: function () {
    // console.log('2.1、 调起客户端小程序设置界面')
    wx.showModal({
      content: '检测到您的账号未授权，请先授权。',
      showCancel: false,
      success: res => {
        // console.log('用户点击确定')
        wx.openSetting({
          success: (res) => {
            if (res.authSetting['scope.userInfo']) {
            //   console.log('2.1-true、设置授权--授权', res)
              this.getUserInfo();
            } else {
            //   console.log('2.1-true、设置授权--失败', res)
            }
          }
        })
      }
    })

  },
  // 3、获取客户信息
  accountMy: function () {
    this.getCustome(res => {
      this.ifBindPhone();
    })
  },
  getCustome: function (cb) {
    api.get('/account/my').then(res => {
    //   console.log('3、获取客户信息', res)
      if (res.status !== 200) {
        // console.log('获取客户信息失败：' + res.msg)
        // utils.showModel('获取客户信息', '获取客户信息失败：' + res.msg)
        this.ifBindPhone();
        return;
      }
      this.globalData.customeInfo = res.data;
      cb(this.globalData)
    })
  },
  // 4、判断 是否绑定手机
  ifBindPhone: function () {
    let customeInfo = this.globalData.customeInfo;
    // console.log('4、判断 是否绑定手机: ', customeInfo)
    if (!customeInfo || !customeInfo.phone) {
      this.showBindPhone();
      return;
    }
    this.ifBindCustome();
  },
  // 5、 提示 是否绑定手机号
  showBindPhone: function () {
    // console.log('5、提示 是否绑定手机号')
    wx.showModal({
      content: '检测到您的账号还未绑定手机号，请绑定手机号。',
      success: res => {
        if (res.confirm) {
        //   console.log('5-true、绑定手机号')
          wx.navigateTo({
            url: '/pages/personal/bindPhone/bindPhone'
          })
        } else if (res.cancel) {
        //   console.log('5-false、不绑定手机号')
        }
      }
    })
  },
  // 6、判断是否选择公司
  ifBindCustome: function () {
    let customeInfo = this.globalData.customeInfo;
    console.log('6、判断是否选择公司', customeInfo);
    if (!customeInfo || !customeInfo.companyName) {
        console.log('6-flase、判断是否选择公司')
      this.getCompanies();
      return;
    }
    console.log('6-true、判断是否选择公司')
    wx.switchTab({
      url: '/pages/home/home'
    })
  },
  // 6.1、获取客户列表
  getCompanies: function () {
    api.get('/company/list').then(res => {
    //   console.log('6.1、获取客户列表', this.globalData.customeInfo)
      // console.log(res);
      if (res.status === 200) {
        this.globalData.companies = res.data
        this.bindCustome()
      }
    })
  },
  // 6.2、判断有几家客户
  bindCustome: function () {
    // console.log('6.2、判断有几家客户', this.globalData.companies)
    let companies = this.globalData.companies;
    let companyName = this.globalData.customeInfo && this.globalData.customeInfo.companyName;
    let num = companies.length;
    if (companyName) {
      return;
    }
    if (num < 1) {
      utils.showModel('', '您拥有 ' + num + ' 家公司，请联系客服绑定!')
      wx.switchTab({
        url: '/pages/personal/personal'
      })
      return;
    }
    if (num >= 1) {
      this.setcompany(companies[0]['aliAccountId'])
    //   wx.switchTab({
    //     url: '/pages/home/home'
    //   })
      return;
    }
    wx.navigateTo({
      url: '/pages/personal/companyList/companyList'
    })
  },
  // 6.3 选择公司
  setcompany: function (aliAccountId, cb) {
    // console.log('6.3 选择公司', aliAccountId)
    api
      .post('/auth/setcompany', { aliAccountId: aliAccountId })
      .then(res => {
        if (typeof cb == 'function') {
          cb();
        }
        if (res.status !== 200) {
          utils.showModel('', res.msg)
          return;
        }
        this.getCustome(e => {
          wx.switchTab({
            url: '/pages/home/home'
          })
        })
      })
  },
  isBindPhoneOrBindCustome: function () {
    wx.getUserInfo({
      success: res => {
        let customeInfo = this.globalData.customeInfo;
        // console.log('7-phone、判断 是否绑定手机: ', customeInfo)
        if (!customeInfo || !customeInfo.phone) {
          this.showBindPhone();
          return;
        }
        // console.log('7-custom、判断是否选择公司', customeInfo);
        if (!customeInfo || !customeInfo.companyName) {
          this.getCompanies();
          return;
        }
      },
      fail: res => {
        this.openSetting();
        return;
      }
    })
  },
  // 重置
  reset() {
    this.globalData.customeInfo = null;
    this.globalData.companies = null;
  },
  globalData: {
    userInfo: null,
    customeInfo: null,
    companies: null
  },
}

module.exports = auth