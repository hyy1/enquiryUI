// pages/components/roasting.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    indicatorDots:{
      type: Boolean,
      value: true,
    },    //是否显示面板指示点
    indicatorActiveColor: {
      type: String,
      value: "#f54203"
    }, //当前选中的指示点颜色
    autoplay: {
      type: Boolean,
      value: true,
    },           //是否自动切换
    interval: {
      type: Number,
      value: 3000,
    },           //自动切换时间间隔
    duration: {
      type: Number,
      value: 1000,
    },           //滑动动画时长
    circular: {
      type: Boolean,
      value: true,
    },           //是否采用衔接滑动
    imgUrls: {
      type: Array,
      value: []
    },
    height: {
      type: String,
      value: '240rpx'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
