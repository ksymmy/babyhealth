import { HTTP } from '/util/http.js';
import { config } from '/app.js';
let http = new HTTP();
var listData, pageIndex = 1, isPageEnd = false;
Page({
  data: {
    listData: []
  },
  onLoad() {
  },
  onReady() {
  },
  onShow() {
    isPageEnd = false, pageIndex = 1, listData = [];
    this.setData({
      listData: []
    });
    this.onRequest();
  },
  onScrollToLower() {
    this.onRequest();
  },
  onRequest() {
    if (isPageEnd) {
      return;
    }
    var pageSearchIndex = (pageIndex - 1) * config.pageSize;
    var url = '?currentPageIndex=' + pageSearchIndex + '&pageSize=' + config.pageSize;
    dd.showLoading({
      content: '加载中',
    });
    http.request({
      url: 'user/listForStatus' + url,
      success: (res) => {
        var thisData = this.data.listData;
        console.log("thisData=",thisData);
        listData = thisData.concat(res);
        this.setData({
          listData: listData
        });
        if (res.length == config.pageSize) {
          pageIndex += 1;
        } else {
          isPageEnd = true;
        }
        console.log(res);
        dd.hideLoading();
      }
    });
  },
  onCheck(e) {
    var id = listData[e.currentTarget.dataset.index].id;
    dd.navigateTo({ url: "edit?id=" + id });
  },
  onAdd(e) {
    dd.navigateTo({ url: "edit" });
  }
})
