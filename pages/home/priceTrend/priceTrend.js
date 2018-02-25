// pages/home/priceTrend/priceTrend.js
import echarts from "../../../utils/resources/wxcharts.js";

let columnChart = null;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgStr: '数据加载中，请稍后。。。',
    params: {
      categoryId: '',// 关键词 3~9005
      categoryType: 'browser'
    },
    // 列表数据
    list: [],

    // 搜索
    searchUrl: '/pages/searchWord/searchWord?signs=1&categoryId=',
    searchLabel: '产品关键词',

    // 商品切换
    labels: ['浏览商品', '交易商品'],
    acIndex: 0,
    categoryType: ['browser', 'trade'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取产品关键词
    this.data.params.categoryId = options.categoryId || '';
    this.data.params.classify = options.classify || '';
    this.data.params.categoryName = options.categoryName || '产品关键词';
    this.setData({
      searchLabel: this.data.params.categoryName,
      searchUrl: this.data.searchUrl + this.data.params.categoryId + '&categoryName=' + this.data.params.categoryName + '&classify=' + this.data.params.classify
    })

    this.getList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '四喜E伙伴',
      path: '/pages/home/priceTrend/priceTrend?categoryId=' + this.data.params.categoryId + '&categoryName=' + this.data.params.categoryName + '&classify=' + this.data.params.classify
    }
  },

  // 获取数据
  getList() {
    if (wx.showLoading) {
      wx.showLoading({ title: '加载中...' });
    }
    app.get('/alizs/price/analyse', this.data.params).then((res) => {
      console.log(res);


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
              this.setData({
                msgStr: '当前无搜索结果'
              })
            } else if (res.cancel) {
            }
          }
        })
        if (wx.hideLoading) {
          wx.hideLoading();
        }
        return;
      }
      if (res.status != 200) {
        this.reset();
        this.setData({
          msgStr: '当前无搜索结果'
        })
        if (wx.hideLoading) {
          wx.hideLoading();
        }
        return;
      }

      let data = res.data;
      let type = this.data.params.categoryType;
      if (data[type] && data[type].length > 0) {
        this.setData({
          list: data[type],
          msgStr: '当前无搜索结果'
        });
        // 图表
        this.getEcharts(this.data.list);
        if (wx.hideLoading) {
          wx.hideLoading();
        }
        return;
      }
      this.reset();
      if (wx.hideLoading) {
        wx.hideLoading();
      }
    }).catch((res) => {
      this.setData({
        msgStr: '当前无搜索结果'
      })
      if (wx.hideLoading) {
        wx.hideLoading();
      }
    });
  },

  // 重置
  reset() {
    this.setData({
      list: []
    });
  },

  // 获取切换项
  getAcItem(e) {
    console.log(e);
    let index = e.detail.acIndex;
    this.data.params.categoryType = this.data.categoryType[index];
    this.getList();
  },

  // 图表
  getEcharts(series) {
    let colorType = ['#9f73fb', '#52c187', '#5d77e5', '#f27a52', '#f1b93e', '#be9f46'];
    let cache = [...series].filter((item, index) => {
      item.number = index;
      if (item.value != 0) {
        return true;
      }
    });
    let newSeries = cache.map((item, index) => {
      return {
        name: item.name,
        data: item.value,
        color: colorType[item.number % 6],
        format: function (val) {
          return item.value + '%';
        }
      }
    });

    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    columnChart = new echarts({
      canvasId: 'columnCanvas',
      type: 'pie',
      animation: true,
      legend: false,
      series: newSeries,
      width: windowWidth,
      height: windowWidth * 270 / 375,
      dataLabel: true,
      disablePieStroke: true
    });
  },
})