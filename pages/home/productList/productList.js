// pages/home/productList/productList.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CDN: app.CDN,
    msgStr: '数据加载中，请稍后。。。',
    params: {
      cat: '',//	关键词id	number	
      dim: 'trade',//	显示纬度	string	交易: trade （流量: flow目前不开放）
      num: 10,//	显示数量	number	10
      period: 'week',//	统计周期	string	近一周:week 近一月:month
      rankType: 'hot',//	排行类型	string	热门榜: hot 最新榜: latest 上升榜: rise
      time: new Date().getTime(),//	时间戳	number	1515205535851
      pageNum: 1,
    },

    list: [],

    // 标签切换
    tabLabels: ['热销榜', '最新榜', '上升榜'],
    tabAcIndex: 0,
    rankType: ['hot', 'latest', 'rise'],

    // 时间切换
    labels: ['近一周', '近一月'],
    acIndex: 0,
    periodType: ['week', 'month'],

    // 搜索
    searchUrl: '/pages/searchWord/searchWord?signs=0&categoryId=',
    searchLabel: '产品关键词',

    // 弹窗
    modal: false,

    // 是否固定
    isFixed: false,
    count: 0,
    isClear: false,
    isshowFooter: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取产品关键词
    this.data.params.cat = options.classify || '';
    this.data.params.categoryName = options.categoryName || '产品关键词';
    this.data.params.categoryId = options.categoryId || '';
    this.setData({
      searchLabel: this.data.params.categoryName,
      searchUrl: this.data.searchUrl + this.data.params.categoryId + '&categoryName=' + this.data.params.categoryName + '&classify=' + this.data.params.cat
    })

    if (wx.showLoading) {
      wx.showLoading({ title: '加载中...' });
    }
    this.getList(() => {
      if (wx.hideLoading) {
        wx.hideLoading();
      }
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.data.params.pageNum = 1;
    this.getList(() => {
      // 关闭刷新
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
      wx.createSelectorQuery().select('.product-list').boundingClientRect((rect) => {
        oHeight = rect.height;
        rolling(this);
      }).exec()
    } else {
      rolling(this);
    }

    function rolling(that) {
      let scrollTop = width * 88 / 375;
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '四喜E伙伴',
      path: '/pages/home/productList/productList?categoryId=' + this.data.params.categoryId + '&categoryName=' + this.data.params.categoryName + '&classify=' + this.data.params.cat
    }
  },

  // 获取产品列表
  getList(cb) {
    // wx.showLoading({ title: '加载中...' });
    app.get('/product/offer/rank', this.data.params).then((res) => {
      console.log(res);
      // wx.hideLoading();
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
        this.setData({
          msgStr: '当前无搜索结果'
        })
        return;
      }
      if (res.status != 200) {
        this.reset();
        this.setData({
          msgStr: '当前无搜索结果'
        })
        return;
      }

      let data = res.data.list;
      this.data.count = res.data.count;
      if (data && data.length > 0) {
        // 图片+头
        data.forEach((item, index) => {
          item.imgUrl = item.imgUrl.replace(/\.[^.]+.jpg$/i, '.' + app.imgSizePro + '.jpg');
          item.imgUrl = 'http:' + item.imgUrl;
        })

        if (!this.data.isClear) {
          this.data.list = [];
        }
        this.data.isClear = false;
        this.data.list.push(...data);

        this.setData({
          list: this.data.list,
          isshowFooter: false,
          count: this.data.count,
          msgStr: '当前无搜索结果'
        });
        return;
      }
      this.reset();
    }).catch((res) => {
      this.setData({
        msgStr: '当前无搜索结果'
      })
      if (wx.hideLoading) {
        wx.hideLoading();
      }
      if (typeof cb == 'function') {
        cb();
      }
    });
  },

  // 重置
  reset() {
    this.setData({
      list: [],
    })
  },

  // 获取选中的项
  getAcItem(e) {
    console.log(e);
    let index = e.detail.acIndex;
    this.data.params.period = this.data.periodType[index];
    if (wx.showLoading) {
      wx.showLoading({ title: '加载中...' });
    }
    this.data.params.pageNum = 1;
    this.getList(() => {
      if (wx.hideLoading) {
        wx.hideLoading();
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 0
        })
      }
    });
  },

  // 获取选中榜
  getAcClass(e) {
    console.log(e);
    let index = e.detail.acIndex;
    this.data.params.rankType = this.data.rankType[index];
    if (wx.showLoading) {
      wx.showLoading({ title: '加载中...' });
    }
    this.data.params.pageNum = 1;
    this.getList(() => {
      if (wx.hideLoading) {
        wx.hideLoading();
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 0
        })
      }
    });
  },

  // 显隐弹窗
  setModal() {
    this.setData({
      modal: !this.data.modal
    })
  },
})