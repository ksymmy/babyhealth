import { HTTP } from '/util/http.js';
import { config } from '/app.js';
let http = new HTTP();
var listData, pageIndex = 0, isPageEnd = false, searchIndex = null, rylbItems = [];
Page({
  data: {
    listData: [],
    rylbItems: []
  },
  onLoad() {
  },
  onReady() {
  },
  onShow() {
    isPageEnd = false, pageIndex = 1, listData = [], searchIndex = null;
    this.setData({
      rylbItems: []
    });
    rylbItems = [
      { name: '全部', value: null, checked: true },
      { name: '个人会员', value: '2' },
      { name: '单位会员', value: '3' }];
    this.setData({
      rylbItems: rylbItems,
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
    if (searchIndex) {
      url += "&type=" + searchIndex;
    }
    dd.showLoading({
      content: '加载中',
    });
    http.request({
      url: 'duesStandard/list' + url,
      success: (res) => {
        var thisData = this.data.listData;
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
  }, radioChange(e) {
    isPageEnd = false, pageIndex = 1, listData = [];
    this.setData({
      listData: []
    });
    var check = e.detail.value;
    searchIndex = check;
    this.onRequest();
  },
  onAdd(e) {
    dd.navigateTo({ url: "edit" });
  },
  onModify(e) {
    var id = listData[e.currentTarget.dataset.index].id;
    dd.navigateTo({ url: "edit?id=" + id });
  }, onDel(e) {
    var id = listData[e.currentTarget.dataset.index].id;
    dd.confirm({
      title: '提示',
      content: '是否确定要删除选中的会费标准？',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      success: (result) => {
        if (result.confirm) {
          dd.showLoading({
            content: '加载中',
          });
          http.request({
            url: 'duesStandard/deleteByid?id=' + id,
            success: (res) => {
              dd.showToast({
                content: '删除成功！', icon: 'false', duration: 1000,
                mask: true, success: (result) => {
                  dd.hideLoading();
                  this.onShow();
                }
              });
            }
          });
        }
      },
    });
  }
})
