// components/common/screening/screening.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 选择项
    active: {
      type: Number,
      value: 0
    },
    isDelte: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 数据
    data: [
      {
        label: '时间',
        classname: 'arrow',
        type: 1,
      },
      {
        label: '金额',
        classname: 'arrow',
        type: 2,
      },
      {
        label: '状态',
        classname: 'arrow-drop',
        type: 3,
        children: {
          '-1': '状态',
          '0': '已成交',
          '1': '跟单中',
          '2': '已流失',
          '3': '不限'
        }
      },
    ],
    cindex: -1,
    toggle: [
      {
        isDB: true,
      },
      {
        isDB: false,
      },
      {
        isDB: false,
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    openAction(index, type) {
      wx.showActionSheet({
        itemList: ['已成交', '跟单中', '已流失', '不限'],
        success: (res) => {
          this.common(index, res.tapIndex, type);
        },
        fail: (res) => {
          console.log(res.errMsg)
        }
      });
    },
    clickHandle(e) {
      let index = e.currentTarget.dataset.index;

      if (this.data.data[index].type == 3) {
        this.openAction(index, 3);
        return false;
      }
      this.common(index, this.data.cindex);
    },
    common(index, cindex = -1, type = -1) {
      if (type == 3) {
        this.setData({
          cindex: cindex,
        });

        this.triggerEvent('getScreening', { acIndex: this.data.active, sort: this.data.toggle[this.data.active].isDB, cindex: cindex });
        return;
      }

      this.data.toggle.forEach((item, i) => {
        if (index == i) {
          this.data.toggle[i].isDB = !this.data.toggle[i].isDB;
          return;
        }
        this.data.toggle[i].isDB = false;
      })

      this.setData({
        active: index,
        cindex: cindex,
        toggle: this.data.toggle
      });

      this.triggerEvent('getScreening', { acIndex: index, sort: this.data.toggle[index].isDB, cindex: cindex });
    }
  }
})
