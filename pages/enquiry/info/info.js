// pages/enquiry/info/info.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CDN: app.CDN,
    params: {
      enquiryId: '',
      pageNum: 1,
      pageSize: 12,
      count: 0
    },
    // 数据
    // 成交金额
    amount: 0,
    // 跟单状态
    saleStatus: 0,// 0 默认 1 已成交 2 跟单中 3 已流失
    saleStatusName: {
      1: '已成交',
      2: '跟单中',
      3: '已流失',
      4: '已流失'
    },
    saleStatusAmount: {
      1: '成交',
      2: '跟踪',
      3: '流失'
    },
    saleStatusClass: {
      1: 'headerRight1',
      2: 'headerRight2',
      3: 'headerRight3'
    },
    // 买家旺旺
    aliTM: '',
    // 跟单记录
    list: [],
    // 买家类型
    typeName: {
      0: '',
      1: '淘卖',
      2: '经销商',
      3: '微商',
      4: '外贸',
      5: '其他',
    },
    // 买家意向
    buyerIntentionName: {
      1: '低',
      2: '中',
      3: '高'
    },
    // 有无去同行购买
    peerBuyName: {
      0: '',
      1: '有',
      2: '无'
    },
    // 是否加微信
    isWechatName: {
      0: '正在跟进',
      1: '是',
      2: '否'
    },

    // 默认项
    acIndex: 0,
    toggle: [],
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 请求接口
    this.data.params.enquiryId = options.id;
    this.getInfo();
  },
  onShareAppMessage: function () {
    return {
      title: '四喜E伙伴',
      path: '/pages/enquiry/info/info?id=' + this.data.params.enquiryId
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.data.params.pageNum = 1;
    this.data.list = [];
    this.getInfo(() => {
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.list.length < this.data.params.count){
      this.data.params.pageNum++;
      this.getInfo();
    }
  },
  // 调启微信电话接口
  callPhone: function (res) {
      if (!res.currentTarget.dataset.phone || res.currentTarget.dataset.phone.length <= 0 || res.currentTarget.dataset.phone == '无') {
          return
      }
      wx.makePhoneCall({
          phoneNumber: res.currentTarget.dataset.phone
      })
  },

  // 获取详情
  getInfo(cb) {
    app.get('/enquiry/listinfo', this.data.params).then(res => {
      if (typeof cb == 'function') {
        cb();
      }
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
      if (res.status != 200) {
        // console.log(res);
        return;
      }

      let data = res.data;
      // 时间换算
      data.list.forEach(item => {
        var time = item.gmtCreate;
        var yestoday = app.time.isDayType(time, 1);
        var today = app.time.isDayType(time, 2);
        if (yestoday) {
          item.gmtCreate = '昨天' + app.time.formatTime(time, ' HH:mm');
          return;
        }
        if (today) {
          item.gmtCreate = '今天' + app.time.formatTime(time, ' HH:mm');
          return;
        }
        item.gmtCreate = app.time.formatTime(time, 'YYYY-MM-DD HH:mm');
      });
      this.data.list.push(...data.list);
      this.setData({
        amount: data.amount,
        saleStatus: data.saleStatus,
        aliTM: data.aliTM,
        list: this.data.list,
        'params.pageNum': this.data.params.pageNum,
        'params.count': data.count,
      });

      this.data.list.forEach((item, index) => {
        if (index == 0) {
          this.data.toggle[index] = { isDB: true };
          return;
        }
        this.data.toggle[index] = { isDB: false };
      });
      this.setData({
        toggle: this.data.toggle
      })
    }).catch(res => {
      // console.log(res);
      if (typeof cb == 'function') {
        cb();
      }
    });
  },

  // 选中操作
  extendHandle(e){
    
    let index = e.currentTarget.dataset.index;
    
    this.data.toggle.forEach((item, i) => {
      if (index == i) {
        this.data.toggle[i].isDB = !this.data.toggle[i].isDB;
        return;
      }
      this.data.toggle[i].isDB = false;
    })
    this.setData({
      acIndex: index,
      toggle: this.data.toggle
    });
  }
})