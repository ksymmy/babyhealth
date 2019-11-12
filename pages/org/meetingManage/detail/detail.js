import { HTTP } from '/util/http.js';
let http = new HTTP();
Page({
  data: {
    meetingId: '',
    meetingInfo: {},
  },
  onLoad(e) {
    this.setData({
      meetingId: e.meetingId,
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
        url: "meeting/get?setParticipants=true&meetingid=" + that.data.meetingId,
        success: res => {
          that.setData({
            meetingInfo: res
          })
          resolve(null);
        }
      })
    })
  }
});
