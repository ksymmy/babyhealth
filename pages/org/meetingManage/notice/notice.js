import { HTTP } from '/util/http.js';
let http = new HTTP();
Page({
  onPullDownRefresh() {
    this.onShow();
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
    let that = this;
    this.setData({
      pagenum: that.data.pagenum++
    })
    console.log("当前页码:" + this.data.pagenum)
  },
  data: {
    meetingId: '',
    noticerecs: [],
    pagenum: 1,
    inputValue: '',
  },
  onShow() {
    let that = this;
    http.request({
      url: "meetingnotice/list",
      data: {
        meetingid: that.data.meetingId,
        name: that.data.inputValue,
      },
      success: function(res) {
        that.setData({
          noticerecs: res
        })
      },
      fail: function(res) {
        dd.alert({ content: JSON.stringify(res), buttonText: '好的' });
      },
      complete: function() {
        that.stopPullDownRefresh();
      }
    })
  },
  onLoad(e) {
    if (!this.data.meetingId) {
      this.setData({
        meetingId: e.meetingId
      })
    }
  },
  search: function() {
    this.onShow();
  },
  handleInput(e) {
    this.setData({
      inputValue: e.detail.value,
    });
  },
  addNotice: function() {
    dd.navigateTo({
      url: `addNotice/addNotice?insert=true&meetingId=` + this.data.meetingId,
    });
  },
  update: function(e) {
    let that = this,
      id = e.currentTarget.dataset.id;
    http.request({
      url: 'meetingnotice/get?noticeid=' + id,
      success: res => {
        dd.navigateTo({
          url: `addNotice/addNotice?insert=false&noticeRec=` + JSON.stringify(res),
        });
      }
    })

  },
  delete: function(e) {
    let that = this,
      id = e.currentTarget.dataset.id;
    dd.confirm({
      title: '温馨提示',
      content: '确定删除此记录吗?',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      success: (result) => {
        if (result.confirm) {
          http.request({
            url: 'meetingnotice/delete?noticeid=' + id,
            method: 'post',
            success: res => {
              dd.showToast({
                content: '删除成功',
                mask: true,
                duration: 1000
              });
              that.onShow();
            }
          })
        }
      },
    });
  },
  release: function(e) {
    let that = this,
      id = e.currentTarget.dataset.id,
      state = e.currentTarget.dataset.state;
    if (state == 1) {
      dd.showToast({
        content: '已经发布过了'
      });
      return
    }
    dd.confirm({
      title: '温馨提示',
      content: '确定发布会议通知吗?',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      success: (result) => {
        if (result.confirm) {
          http.request({
            url: 'meetingnotice/release?noticeid=' + id + '&corpId=' + dd.corpId,
            method: 'post',
            success: res => {
              dd.showToast({
                content: '发布成功',
                mask: true,
                duration: 1000
              });
              that.onShow();
            }
          })
        }
      },
    });
  },
  onDetail: function(e) {
    dd.navigateTo({
      url: `detail/detail?noticeid=` + e.currentTarget.dataset.id,
    });
  }
});
