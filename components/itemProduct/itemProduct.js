// components/itemProduct1/itemProduct.js
const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    order: {
      type: Number,
      value: 1
    },
    item: {
      type: Object,
      value: {}
    },
    comName: {
      type: String,
      value: ''
    },//	公司名称	string	
    comUrl: {
      type: String,
      value: ''
    },//	公司链接	string	
    flow: {
      type: Number,
      value: 0
    },//	流量	number	
    imgUrl: {
      type: String,
      value: ''
    },//	产品图片	string	
    offerId: {
      type: Number,
      value: 0
    },//	id	number	
    price: {
      type: Number,
      value: 0
    },//	价格	number	
    sameGoodUrl: {
      type: String,
      value: ''
    },//	产品链接	string	
    title: {
      type: String,
      value: ''
    },//	标题	string	
    trade: {
      type: Number,
      value: 0
    },//	交易量	number	
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
