import { HTTP } from '/util/http.js';
import { config } from '/app.js';
let http = new HTTP();
var listData, pageIndex = 0, isPageEnd = false;
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
      url: 'user/list' + url,
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
  }, onSearch(e) {
    var id = listData[e.currentTarget.dataset.index].id;
    var url = "/pages/org/memberManage/company/detail/detail?isModify=0&id=" + id;
    if (listData[e.currentTarget.dataset.index].userType == 2) {//个人会员
      url = "/pages/org/memberManage/personal/detail/detail?isModify=0&id=" + id;
    }
    dd.navigateTo({ url: url });
  },
  onModify(e) {
    var id = listData[e.currentTarget.dataset.index].id;
    var url = "/pages/org/memberManage/company/company?isModify=1&id=" + id;
    if (listData[e.currentTarget.dataset.index].userType == 2) {//个人会员
      url = "/pages/org/memberManage/personal/personal?isModify=1&id=" + id;
    }
    dd.navigateTo({ url: url });
  },
  onMofifyStatus(e) {
    var id = listData[e.currentTarget.dataset.index].id;
    var mess = listData[e.currentTarget.dataset.index].status == 1 ? '停用' : '启用';
    dd.confirm({
      title: '提示',
      content: '是否确定要' + mess + '选中的会员？',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      success: (result) => {
        if (result.confirm) {
          dd.showLoading({
            content: '加载中',
          });
          http.request({
            url: 'user/updateStatusById?id=' + id,
            success: (res) => {
              dd.showToast({
                content: mess + '成功！', icon: 'false', duration: 1000,
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
  },
  onDel(e) {
    var id = listData[e.currentTarget.dataset.index].id;
    dd.confirm({
      title: '提示',
      content: '是否确定要删除选中的会员？',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      success: (result) => {
        if (result.confirm) {
          dd.showLoading({
            content: '加载中',
          });
          http.request({
            url: 'user/deleteByid?id=' + id,
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
