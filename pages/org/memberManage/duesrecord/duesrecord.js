import { HTTP } from '/util/http.js';
import { config } from '/app.js';
let http = new HTTP(), page = 1;
Page({
  data: {
    duesrecs: [],
    inputValue: '',
  },
  onShow() {
    page = 1;
    this.setData({
      duesrecs: []
    })
    this.onRequest();
  },
  onLoad(e) {
  },
  onReady() {
  },
  onRequest() {
    dd.showLoading({
      content: '加载中',
    });
    let that = this;
    console.log('请求page:' + page)
    http.request({
      url: "duesrecord/list",
      method: 'post',
      data: JSON.stringify({
        param: { corpname: that.data.inputValue },
        page: page,
        size: config.pageSize,
        // size: 6,
      }),
      success: (res) => {
        if (res.length == 0) {
          return
        }
        page++;
        var oldData = that.data.duesrecs;
        var newData = oldData.concat(res);
        that.setData({
          duesrecs: newData,
        })
      },
      fail: function(res) {
        dd.alert({ content: JSON.stringify(res), buttonText: '好的' });
      },
      complete: function() {
        dd.hideLoading();
        // that.stopPullDownRefresh();
      }
    })
  },
  onScrollToLower: function(e) {
    this.onRequest();
  },
  search: function() {
    page = 1;
    this.setData({
      duesrecs: []
    })
    this.onRequest();
  },
  bindKeyInput(e) {
    this.setData({
      inputValue: e.detail.value,
    });
  },
  addDues: function() {
    dd.navigateTo({
      url: `adddues/adddues`,
    });
  }, onPullDownRefresh() {
    page = 1;
    this.onRequest();
  },
  stopPullDownRefresh() {
    dd.stopPullDownRefresh({
      complete(res) {
        console.log(res, new Date())
      }
    })
  },
  onReachBottom() {
    // 下拉触底，先判断是否有请求正在进行中
    // 以及检查当前请求页数是不是小于数据总页数，如符合条件，则发送请求
    let that = this;
    // console.log("onReachBottom,当前页码:" + page)
  },
});
