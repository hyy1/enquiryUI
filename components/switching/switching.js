// components/switching/switching.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    labels: {
      type: Array,
      value: []
    },
    acIndex: {
      type: Number,
      value: 0
    },
    species: {
      type: String,
      value: 'default'
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
    clickHandle(e) {
      let index = e.currentTarget.dataset.index;
      this.setData({
        acIndex: index
      });

      this.triggerEvent('getAcItem', { acIndex: index });
    }
  }
})
