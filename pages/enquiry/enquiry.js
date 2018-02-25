// pages/enquiry/enquiry.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CDN: app.CDN,
    list: [],
    msgStr: '数据加载中，请稍后。。。',
    params: {
      endTime: app.time.getTimeLimit(-1),
      pageNum: 1,
      pageSize: 6,
      startTime: app.time.getTimeLimit(1, 'months'),
      timeStatus: 1
    },

    count: 0,//默认 list总数
    isClear: false,
    // 是否固定
    isFixed: 0,
    isshowFooter: false,

    // 区域统计
    areaData: null,
    // 时间
    timeSearch: {
      startTime: app.time.formatSubtractTime(1, 'months'),
      endTime: app.time.formatSubtractTime(0),
    },
    defaultTime: {
      start: app.time.formatSubtractTime(10, 'years'),
      end: app.time.formatSubtractTime(0),
    },
    addData: {
      label: '不限',
      type: -1,
      startTime: null,
      endTime: null
    },
    timeActive: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log('onLoad')
  },
  onShow: function () {
    // 初始化
    this.data.params.pageNum = 1;
    this.setData({
      msgStr: '数据加载中，请稍后。。。'
    })
    this.init();
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
  },
  onHide() {
    // this.setData({
    //   list: []
    // })
  },
  onShareAppMessage: function () {
    return {
      title: '四喜E伙伴',
      path: '/pages/enquiry/enquiry'
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.data.params.pageNum = 1;
    this.getAreacount(() => {
      this.getList(() => {
        wx.stopPullDownRefresh();
      });
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
  onPageScroll(Obj) {
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
      console.log('rolling')
      let scrollTop = width * 175 / 375;
      if (Obj.scrollTop >= scrollTop) {
        if (!that.data.isFixed && ((oHeight - height) > scrollTop)) {
          that.setData({
            isFixed: 1
          });
          console.log('fixed true');
        }
      } else {
        if (that.data.isFixed) {
          that.setData({
            isFixed: 0
          });
          console.log('fixed false');
        }
      }
    }
  },

  // 获取列表
  getList(cb) {
    app.get('/enquiry/list', this.data.params).then(res => {
      if (typeof cb == 'function') {
        cb();
      }
      if (res.status == 401) {
        this.resetList();
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
        this.setData({
          msgStr: '抱歉!没有找到符合条件的记录'
        })
        return;
      }
      if (res.status != 200) {
        this.resetList();
        this.setData({
          msgStr: '抱歉!没有找到符合条件的记录'
        })
        // console.log(res);
        return;
      }

      let formatData = res.data.list;
      this.data.count = res.data.count;
      if (formatData && formatData.length > 0) {
        formatData.forEach(item => {
          // 图片替换
          if (item.productImage) {
            item.productImage = item.productImage.replace(/\.[^.]+\.jpg$/i, '.' + app.imgSizeEnq + '.jpg');
          }
          // 时间换算
          let time = item.createTime;
          let yestoday = app.time.isDayType(time, 1);
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
        return;
      }
      this.resetList();
    }).catch(res => {
      // console.log(res);
      this.setData({
        msgStr: '抱歉!没有找到符合条件的记录'
      })
      if (typeof cb == 'function') {
        cb();
      }
    });
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

  // 区域统计
  getAreacount(cb) {
    app.get('/enquiry/analysecount', this.data.params).then((res) => {
      console.log(res);
      if (typeof cb == 'function') {
        cb();
      }
      if (res.status != 200) {
        this.reset();
        this.setData({
          msgStr: '抱歉!没有找到符合条件的记录'
        })
        return;
      }

      let data = res.data;
      if (data) {
        data.allAmount = this.toFixed(data.allAmount);
        data.followAmount = this.toFixed(data.followAmount);
        data.gmvAmount = this.toFixed(data.gmvAmount);
        data.lossAmount = this.toFixed(data.lossAmount);
        this.setData({
          areaData: data,
          msgStr: '抱歉!没有找到符合条件的记录'
        });
        return;
      }
      this.reset();
    }).catch((res) => {
      this.setData({
        msgStr: '抱歉!没有找到符合条件的记录'
      })
      if (typeof cb == 'function') {
        cb();
      }
    });
  },

  reset() {
    this.setData({
      areaData: null
    })
  },

  resetList() {
    this.setData({
      list: []
    })
  },

  toFixed(v) {
    if (v == '' || v == null || v == undefined) {
      return v;
    }
    return v.toFixed(2);
  },

  // 开始时间
  startTimeChange(e) {
    console.log(e);
    if (this.data.params.endTime && app.time.formatInitTime(e.detail.value, 'x') >= this.data.params.endTime) {
      wx.showModal({
        title: '提示',
        content: '开始时间不可以大于结束时间！',
        showCancel: false
      })
      this.setData({
        'timeSearch.startTime': app.time.formatTime(Number(this.data.params.startTime), 'YYYY-MM-DD')
      })
      return;
    }

    this.setData({
      'timeSearch.startTime': e.detail.value,
      timeActive: 4
    })

    this.data.params.startTime = app.time.formatInitTime(e.detail.value, 'x');
    this.data.params.pageNum = 1;
    this.init();
  },

  // 结束时间
  endTimeChange(e) {
    if (this.data.params.startTime && this.data.params.startTime >= app.time.endTime(e.detail.value, 'x')) {
      wx.showModal({
        title: '提示',
        content: '开始时间不可以大于结束时间！',
        showCancel: false
      })
      this.setData({
        'timeSearch.endTime': app.time.formatSubtractTime(1, 'days', Number(this.data.params.endTime), 'YYYY-MM-DD')
      })
      return false;
    }

    this.setData({
      'timeSearch.endTime': e.detail.value,
      timeActive: 4
    })

    this.data.params.endTime = app.time.endTime(e.detail.value, 'x');
    this.data.params.pageNum = 1;
    this.init();
  },

  // 初始化
  init() {
    if (wx.showLoading) {
      wx.showLoading({ title: '加载中...' });
    }
    this.getAreacount(() => {
      this.getList();
      if (wx.hideLoading) {
        wx.hideLoading();
      }
    });
  },

  // 时间选择
  getTimeEnquiry(e) {
    console.log(e);
    let time = e.detail.time;
    if (time.type == -1) {
      this.setData({
        'timeSearch.startTime': '',
        'timeSearch.endTime': ''
      })
    } else {
      this.setData({
        'timeSearch.startTime': app.time.formatTime(Number(time.startTime), 'YYYY-MM-DD'),
        'timeSearch.endTime': app.time.formatSubtractTime(1, 'days', Number(time.endTime), 'YYYY-MM-DD')
      })
    }
    this.data.params.startTime = time.startTime;
    this.data.params.endTime = time.endTime;
    this.data.params.pageNum = 1;
    this.init();
  }
})