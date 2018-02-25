// components/analysisReport/analysisReport.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 选择项
    active: {
      type: String,
      value: '1'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    CDN: app.CDN,
    value: app.selectValueTime,
    params: {
      reportName: '2018年1月',
      reportId: 74
    },
    data: [
      {
        label: '基础数据',
        url: '/pages/home/analysisReport/index/index'
      },
      {
        label: '标王分析',
        url: '/pages/home/analysisReport/has/has'
      },
      {
        label: '运营建议',
        url: '/pages/home/analysisReport/operating/operating'
      }
    ],
    list: [
      // {
      //   reportName: '2018年1月',
      //   reportId: 74
      // },
      // {
      //   reportName: '2017年度',
      //   reportId: 74
      // },
      // {
      //   reportName: '2017年第四季度',
      //   reportId: 74
      // },
      // {
      //   reportName: '2017年12月',
      //   reportId: 74
      // }
    ]
  },

  ready() {
    this.getList();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 切换tab
    clickHandle(e) {
      let index = e.currentTarget.dataset.index;
      this.setData({
        active: index,
        value:app.selectValueTime
      });
      if(this.data.list.length!=0){
        this.triggerEvent('selectReport', { params: this.data.list[Number(app.selectValueTime)] });
     }
    },
    //选择报告列表id
    bindPickerChange(e) {
      if(this.data.list.length!=0){
        this.setData({
        value:e.detail.value,
        params: this.data.list[e.detail.value]
      });
      app.selectValueTime=e.detail.value;
      this.triggerEvent('selectReport', { params: this.data.params });
      }
    },
    //获取分析报告列表
    getList() {
      app
        .get('/report/list')
        .then(e => {
          if (e.status == 200) {
            this.setData({
              list: e.data
            });
            if(e.data.length!=0){
               this.triggerEvent('selectReport', { params: e.data[Number(app.selectValueTime)] });
            }
          }
          if (e.status == 401) {
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
          console.log(e.list);
        })
        .catch(res => {
          console.log(res);
        });
    }
  }
});
