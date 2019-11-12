import { HTTP } from '/util/http.js';
import { config } from '/app.js';
let http = new HTTP(), page = 1;
Page({
  onPullDownRefresh() {
    // this.onLoad();
  },
  stopPullDownRefresh() {
    dd.stopPullDownRefresh({
      complete(res) {
        console.log(res, new Date())
      }
    })
  }, onReachBottom() {
    // 下拉触底，先判断是否有请求正在进行中
    // 以及检查当前请求页数是不是小于数据总页数，如符合条件，则发送请求
  },
  data: {
    duesrecs: [],
    inputValue: ''
  },
  onLoad(e) {

  },
  onShow() {
    page = 1;
    this.setData({
      duesrecs: []
    })
    this.onRequest()
  },
  onRequest() {
    let that = this;
    http.request({
      url: "duesrecord/notice",
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
      fail: (res) => {
        dd.alert({ content: JSON.stringify(res), buttonText: '好的' });
      },
      complete: () => {
        that.stopPullDownRefresh();
      }
    })
  },
  search: function() {
    page = 1;
    this.setData({
      duesrecs: []
    })
    this.onRequest();
  },
  onScrollToLower() {
    this.onRequest();
  },
  bindKeyInput(e) {
    this.setData({
      inputValue: e.detail.value,
    });
  }
});
