// components/entrance/entrance.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    entrance: [
      {
        label: '询盘数据',
        navUrl: '/pages/enquiry/enquiry',
        imgUrl: app.CDN + 'icon_index_xp.png',
        type: 'xp',
      },
      {
        label: '询盘分析',
        navUrl: '/pages/home/analysisReport/data/data',
        imgUrl: app.CDN + 'icon_index_ls.png',
        type: 'ls',
      },
      {
        label: '标王记录',
        navUrl: '/pages/home/winKing/winKing',
        imgUrl: app.CDN + '/icon_index_bw.png',
        type: 'jl',
      },
      {
        label: '进销存管理',
        navUrl: '/pages/home/erp/myGoods/myGoods',
        imgUrl: app.CDN + 'icon_index_fx.png',
        type: 'fx',
      },
      {
        label: '价格分布',
        navUrl: '/pages/home/priceTrend/priceTrend',
        imgUrl: app.CDN + 'icon_index_jg.png',
        type: 'fb',
        signs: 1
      },
      {
        label: '产品排行',
        navUrl: '/pages/home/productList/productList',
        imgUrl: app.CDN + 'icon_index_cp.png',
        type: 'ph',
        signs: 0,
      },
    ],
    categoryId: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    jumpPage(e) {
      // 是否登录
      if (!app.globalData.customeInfo) {
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
      if (e.currentTarget.dataset.type == 'fx') {
        app.get('/check/aliauthorize').then(res => {
          if(res.data){
            wx.navigateTo({
              url: e.currentTarget.dataset.link
            });
          }else{
            wx.showToast({
              title: '敬请期待',
              icon: 'loading',
              duration: 2000
            })
          }
        });
        return;
      }
      if (e.currentTarget.dataset.type == 'xp') {
        wx.switchTab({
          url: e.currentTarget.dataset.link
        });
        return;
      }
      // 除 产品排行 价格分布 以外
      console.log(e.currentTarget.dataset.link)
      if (e.currentTarget.dataset.type != 'fb' && e.currentTarget.dataset.type != 'ph') {
        wx.navigateTo({
          url: e.currentTarget.dataset.link
        });
        return;
      }
      // 其他
      let link = e.currentTarget.dataset.link;
      let categoryId = app.globalData.customeInfo.categoryId;
      let categoryName = app.globalData.customeInfo.categoryName;
      let classify = app.globalData.customeInfo.classify;
      this.data.categoryId = categoryId || '';
      this.data.categoryName = categoryName || '';
      this.data.classify = classify || '';
      if (this.data.categoryId && this.data.classify) {
        wx.navigateTo({
          url: link + '?categoryId=' + this.data.categoryId + '&categoryName=' + this.data.categoryName + '&classify=' + this.data.classify
        });
        return;
      }
      // 搜索页
      wx.navigateTo({
        url: '/pages/searchWord/searchWord?signs=' + e.currentTarget.dataset.signs+'&isIndex=1'
      });
    }
  }
})
