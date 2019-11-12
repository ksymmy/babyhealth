import { HTTP } from '/util/http.js';
let http = new HTTP();
Page({
  data: {
    noticeid: '',
    noticeRec: {},
  },
  onLoad(e) {
    this.setData({
      noticeid: e.noticeid,
    })
  },
  onShow() {
    this.onReload();
  },
  async onReload() {
    dd.showLoading({ content: '加载中', });
    await this.onRequest();
    dd.hideLoading();
  }, onRequest() {
    let that = this;
    return new Promise((resolve, reject) => {
      http.request({
        url: "meetingnotice/get?noticeid=" + that.data.noticeid,
        success: res => {
          that.setData({
            noticeRec: res
          })
          resolve(null);
        }
      })
    })
  }
});
