// components/noData/noData.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    text: {
      type: String,
      value: '抱歉!没有找到符合条件的记录'
    },
    type: {
      type: String,
      value: 'img'
    },
    imgUrl: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    CDN: app.CDN
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
