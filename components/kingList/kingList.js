// components/kingList/kingList.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 选择项
    keyword: {
      type: String,
      value: '1'
    },
    isobtain: {
      type: String,
      value: '1'
    },
    finalprice: {
      type: String,
      value: '1'
    },
    dealcompany: {
      type: String,
      value: '1'
    },
    time: {
      type: String,
      value: '1'
    },
    navLink: {
      type: String,
      value: '1'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    CDN: app.CDN,
    isobtains: ['未中标', '已中标'],
  },

  ready() {
  },

  /**
   * 组件的方法列表
   */
  methods: {
  }
});
