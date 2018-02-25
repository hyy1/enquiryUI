// pages/enquiry/enquiry.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CDN: app.CDN,
    msgStr: '数据加载中，请稍后。。。',
    // banner
    imgUrls: [
      app.CDN + 'banner-2.png?id=20180203'
    ],
    indicatorDots: false,

    list: [],
    areaData: null,
    params: {
      pageNum: 1,
      pageSize: 7,
      countType: '',//1:总价值；2:成交价值；3:跟单价值；4:流失价值
      timeType: 2,//	1:7天；2:30天；3:180天；4:365天
      timeStatus: 1,
    },
    label: '',
    count: 0,//默认 list总数
    isClear: false,
    // 是否固定
    isFixed: false,
    isshowFooter: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.params.countType = options.countType;
    this.data.params.timeType = options.timeType;
    this.data.label = options.label;
    this.setData({
      label: this.data.label,
      'params.timeType': options.timeType,
      'params.countType': options.countType
    });
    this.getList();
    this.countAnalysis();
  },

  onReady() {
    wx.setNavigationBarTitle({
      title: this.data.label + '询盘记录'
    });
  },
  onShareAppMessage: function () {
    let countType = this.data.params.countType;
    let timeType = this.data.params.timeType;
    let label = this.data.label;
    return {
      title: '四喜E伙伴',
      path: '/pages/home/enquiry/enquiry?countType=' + countType + '&timeType=' + timeType + '&label=' + label
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.data.params.pageNum = 1;
    this.data.list = [];
    this.getList(() => {
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // console.log('触底')
    if (this.data.list.length < this.data.count) {
      this.data.params.pageNum++;
      this.data.isClear = true;
      this.getList(() => {
        setTimeout(() => {
          this.setShowFooter();
        }, 100);
      });
    }
    if (!this.data.isshowFooter) {
      this.setShowFooter();
    }
  },
  setShowFooter() {
    this.setData({
      isshowFooter: true
    })
  },

  // 页面滚动
  onPageScroll(Object) {
    let width = 375, height = 603, oHeight = 1488;
    try {
      let res = wx.getSystemInfoSync();
      width = res.windowWidth;
      height = res.windowHeight;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    if (wx.createSelectorQuery) {
      wx.createSelectorQuery().select('.enquiry').boundingClientRect((rect) => {
        oHeight = rect.height;
        rolling(this);
      }).exec()
    } else {
      rolling(this);
    }

    function rolling(that) {
      let scrollTop = width * 217 / 375;
      if (Object.scrollTop >= scrollTop) {
        if (!that.data.isFixed && ((oHeight - height) > scrollTop)) {
          that.setData({
            isFixed: true
          });
        }
      } else {
        if (that.data.isFixed) {
          that.setData({
            isFixed: false
          });
        }
      }
    }
  },

  // 获取时间-询盘
  getTimeEnquiry(e) {
    this.data.params.pageNum = 1;
    this.setData({
      'params.timeType': e.detail.time.type
    })
    this.countAnalysis();
    this.getList();
  },
  // 获取统计分析
  countAnalysis() {
    app
      .get('/enquiry/statistics', { type: this.data.params.timeType })
      .then(e => {
        if (e.status == 200) {
          let data = e.data;
          if (data) {
            data.allAmount = this.toFixed(data.totalValue);
            data.followAmount = this.toFixed(data.enquireValue);
            data.gmvAmount = this.toFixed(data.tranValue);
            data.lossAmount = this.toFixed(data.lossValue);
            data.allCount = data.totalCount;
            data.gmvCount = data.tranCount;
            this.setData({
              areaData: data
            });
            return;
          }
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
  // 获取列表
  getList(cb) {
    app.get('/enquiry/statisticslist', this.data.params).then(res => {
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
        // app.utils.showModel('错误提示', res.msg);
        // console.log(res);
        return;
      }
      let formatData = res.data.list;
      this.data.count = res.data.count;
      formatData.forEach(item => {
        // 图片替换
        if (item.productImage) {
          item.productImage = item.productImage.replace(/\.[^.]+\.jpg$/i, '.' + app.imgSizeEnq + '.jpg');
        }
        // 时间换算
        var time = item.createTime;
        var yestoday = app.time.isDayType(time, 1);
        var today = app.time.isDayType(time, 2);
        if (yestoday) {
          item.createTime = '昨天' + app.time.formatTime(time, ' HH:mm');
          return;
        }
        if (today) {
          item.createTime = '今天' + app.time.formatTime(time, ' HH:mm');
          return;
        }

        let islastYear = app.time.islastYear(time);
        if (islastYear) {
          item.createTime = app.time.formatTime(time, 'YYYY-MM-DD HH:mm');
        } else {
          item.createTime = app.time.formatTime(time, 'MM-DD HH:mm');
        }
      });
      if (!this.data.isClear) {
        this.data.list = [];
      }
      this.data.isClear = false;
      this.data.list.push(...formatData);
      this.setData({
        list: this.data.list,
        isshowFooter: false,
        count: this.data.count,
        msgStr: '抱歉!没有找到符合条件的记录'
      });
    }).catch(res => {
      console.log(res);
      if (typeof cb == 'function') {
        cb();
      }
    });
  },
  toFixed(v) {
    if (v == '' || v == null || v == undefined) {
      return v;
    }
    return v.toFixed(2);
  },

  getScreening(e) {
    console.log(e.detail);
    this.data.params.pageNum = 1;
    let index = e.detail.acIndex;
    let sort = e.detail.sort;
    let cindex = e.detail.cindex;
    delete this.data.params.timeStatus;
    delete this.data.params.sumStatus;
    delete this.data.params.status;
    switch (index) {
      case 0:
        if (sort) {
          this.data.params.timeStatus = 1;
        } else {
          this.data.params.timeStatus = 2;
        }
        if (cindex != 3 && cindex != -1) {
          this.data.params.status = ++cindex;
        }
        break;
      case 1:
        if (sort) {
          this.data.params.sumStatus = 1;
        } else {
          this.data.params.sumStatus = 2;
        }
        if (cindex != 3 && cindex != -1) {
          this.data.params.status = ++cindex;
        }
        break;
    }

    if (wx.showLoading) {
      wx.showLoading({ title: '加载中...' });
    }
    this.getList(() => {
      if (wx.hideLoading) {
        wx.hideLoading();
      }
    });
  },
})