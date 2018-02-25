// pages/home/erp/myGoods/myGoods.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        ALI: app.ALI,
        CDN: app.CDN,
        pageType: 1,
        list: [],
        params: {
            pageNum: 1,
            page: 1,
            pageSize: 8,
            count: 0
        },
        count: 0,
        isClear: false,
        isshowFooter: false
    },
    // 设置选项卡值
    setPageType(e) {
        let pageType = e.currentTarget.dataset && e.currentTarget.dataset.pagetype || 0;
        this.setData({
            list:[],
            pageType: pageType
        })

        let title = '';
        
        this.data.params.pageNum = 1;
        this.data.params.page = 1;
        if (pageType == 1) {
            this.init(this.getList);
            title = '我的商品';
        } else if (pageType == 2) {
            // 订单列表
            this.init(this.getOrder);
            title = '我的订单';
        }
        wx.setNavigationBarTitle({
            title: title
        })
    },
    getOrder(cb) {
        app
            .get('/aliorder/list', this.data.params)
            .then(res => {
                if (typeof cb == 'function') {
                    cb();
                }
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
                                });
                                return;
                            }
                        }
                    });
                    return;
                }
                if (res.status !== 200) {
                  this.reset();
                    app.utils.showModel('获取商品列表数据', res.msg);
                    return;
                }
                this.data.count = res.data.totalRecord;
                if (!this.data.isClear) {
                    this.data.list = [];
                }
                this.data.isClear = false;
                if(res.data.result && res.data.result.length > 0){
                  this.data.list.push(...res.data.result);
                  this.setData({
                    'list': this.data.list,
                    isshowFooter: false,
                    count: this.data.count
                  })
                }else{
                  this.reset();
                }
            })
            .catch(res => {
                console.log('获取商品列表数据', res)
                if (typeof cb == 'function') {
                    cb();
                }
            })
    },
    // 获取商品列表数据
    getList(cb) {
        app
            .get('/product/list', this.data.params)
            .then(res => {
                if (typeof cb == 'function') {
                    cb();
                }
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
                                });
                                return;
                            }
                        }
                    });
                    return;
                }
                if (res.status !== 200) {
                  this.reset();
                    app.utils.showModel('获取商品列表数据', res.msg);
                    return;
                }
                this.data.count = res.data.count;
                if (!this.data.isClear) {
                    this.data.list = [];
                }
                this.data.isClear = false;
                if (res.data.productList && res.data.productList.length > 0) {
                  this.data.list.push(...res.data.productList);
                  this.setData({
                    'list': this.data.list,
                    isshowFooter: false,
                    count: this.data.count
                  })
                } else {
                  this.reset();
                }
            })
            .catch(res => {
                console.log('获取商品列表数据', res)
                if (typeof cb == 'function') {
                    cb();
                }
            })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.data.params.pageNum = 1;
        this.data.params.page = 1;
        this.init(this.getList);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        // this.getList();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.data.params.pageNum = 1;
        this.data.params.page = 1;
        let pageType = this.data.pageType;
        if (pageType == 1) {
            this.getList(() => {
                wx.stopPullDownRefresh();
            });
        } else if (pageType == 2) {
            this.getOrder(() => {
                wx.stopPullDownRefresh()
            });
        }
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (this.data.list.length < this.data.count) {
            this.data.params.pageNum++;
            this.data.params.page++;
            this.data.isClear = true;

            let pageType = this.data.pageType;
            if (pageType == 1) {
                this.getList(() => {
                  setTimeout(() => {
                    this.setShowFooter();
                  }, 100);
                });
            } else if (pageType == 2) {
                this.getOrder(() => {
                  setTimeout(() => {
                    this.setShowFooter();
                  }, 100);
                });
            }
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    init(callback){
        if (wx.showLoading) {
            wx.showLoading({ title: '加载中...' });
        }
        callback(() => {
            if (wx.hideLoading) {
                wx.hideLoading();
            }
        });
    },

    reset(){
      this.setData({
        'list': []
      })
    }
})