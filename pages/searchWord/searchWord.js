// pages/searchWord/searchWord.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CDN: app.CDN,
    params: {
      categoryId: ''
    },

    // 热词搜索
    list: [],
    // 搜索列表
    result: [],

    // 标识
    signs: 0,// 0 产品，1 价格

    // 搜索
    searchName: '',

    // 是否首页进入
    isIndex: 0,// 0 否，1 是
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 不同页面入口进来，需要一个标识
    this.data.signs = options.signs || 0;
    this.data.params.categoryId = options.categoryId || '';
    this.data.params.classify = options.classify || '';
    this.data.params.categoryName = options.categoryName || '';
    this.data.isIndex = options.isIndex || 0;

    // if(this.data.isIndex == 1){
      this.getWords()
    // }
  },

  // 获取热词
  getWords() {
    app.get('/category/hotkeyword', this.data.params).then((res) => {
      console.log(res)
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
      if (data && data.length > 0) {
        // 校验字符
        // data = this.checkString(data);
        this.data.list.push(...data);
        this.setData({
          list: this.data.list
        });
        return;
      }
      this.reset();
    }).catch((res) => {
      console.log(res);
    });
  },

  // 校验字符
  checkString(arr, length = 14) {
    arr.forEach((item, index) => {
      var str = item.text,
        count = 0,
        zw = 0;
      for (var i = 0, len = str.length; i < len; i++) {
        if (count > length - 1) {
          break;
        }
        if (str.charCodeAt(i) > 255) {
          count += 2;
          zw++;
          continue;
        }
        count++; 
      }
      if (count >= length) {
        item.text = str.slice(0, length - zw)+'...';
      }
    });

    console.log(arr);
    return arr;
  },

  // 重置 热词搜索
  reset() {
    this.setData({
      list: []
    })
  },

  // 重置 搜索列表
  resetResult() {
    this.setData({
      result: []
    })
  },

  // 删除搜索关键词
  delSearch() {
    this.setData({
      searchName: ''
    })

    this.data.result = [];
    this.getSearchResult();
  },

  // 返回
  back() {
    if (this.data.isIndex == 1){
      wx.navigateBack();
      return;
    }
    
    if (this.data.signs == 1) {
      wx.redirectTo({
        url: '/pages/home/priceTrend/priceTrend?categoryId=' + this.data.params.categoryId + '&categoryName=' + this.data.params.categoryName + '&classify=' + this.data.params.classify
      });
      return;
    }
    wx.redirectTo({
      url: '/pages/home/productList/productList?categoryId=' + this.data.params.categoryId + '&categoryName=' + this.data.params.categoryName + '&classify=' + this.data.params.classify
    });
  },

  // 跳转页面
  jumpPage(e) {
    console.log(e);
    let categoryId = e.currentTarget.dataset.categoryid;
    let classify = e.currentTarget.dataset.classify;
    let categoryName = e.currentTarget.dataset.categoryname;
    if (this.data.signs == 1) {
      wx.redirectTo({
        url: '/pages/home/priceTrend/priceTrend?categoryId=' + categoryId + '&categoryName=' + categoryName + '&classify=' + classify
      });
      return;
    }
    wx.redirectTo({
      url: '/pages/home/productList/productList?categoryId=' + categoryId + '&categoryName=' + categoryName + '&classify=' + classify
    });
  },

  // 搜索结果
  searchHandle(e) {
    this.setData({
      searchName: e.detail.value
    });

    this.data.result = [];
    this.getSearchResult();
  },

  // 获取搜索结果
  getSearchResult() {
    app.get('/category/prompt', { categoryName: this.data.searchName }).then((res) => {
      console.log(res)
      // 未登录、超时
      if (res.status == 401) {
        this.resetResult();
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
        this.resetResult();
        return;
      }

      let data = res.data;
      if (data && data.length > 0) {
        this.data.result.push(...data);
        this.setData({
          result: this.data.result
        });
        return;
      }
      this.resetResult();
    }).catch((res) => {
      console.log(res);
    });
  }
})