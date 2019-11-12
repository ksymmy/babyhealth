import { HTTP } from '/util/http.js';
let http = new HTTP();
Page({
  data: {
    meetingrecs: [],
    pagenum: 1,
    inputValue: '',
    group: '',
  },
  onLoad(e) {
    dd.showLoading({ content: '加载中', });
    if (!this.data.group) {
      var now = Date.now();
      var year = new Date(now).getFullYear()
      var month = new Date(now).getMonth() + 1
      month = month < 10 ? '0' + month : month;
      var currentDate = year + "-" + month;
      this.setData({
        group: currentDate
      })
    }
  },
  onShow() {
    this.onRequest().then((data) => {
      console.log(data)
      dd.hideLoading();
    });
  },
  onRequest() {
    let that = this;
    return new Promise((resolve, reject) => {
      http.request({
        url: "meeting/list",
        data: {
          name: that.data.inputValue,
          group: that.data.group
        },
        success: function(res) {
          that.setData({
            meetingrecs: res
          })
          resolve(res);
        },
        fail: function(res) {
          dd.alert({ content: JSON.stringify(res), buttonText: '好的' });
        }
      })
    });
  },
  dataPicker: function() {
    let that = this;
    dd.datePicker({
      format: 'yyyy-MM',
      currentDate: that.data.group,
      success: (res) => {
        if (!res.date) {
          return
        }
        that.setData({
          group: res.date
        })
        that.onRequest();
      },
    });
  },
  search: function() {
    this.onRequest();

    // 自定义流程 代码注释
    // http.request({
    //   url: 'process/createCustomTemplate?corpId=' + dd.corpId,
    //   method: 'post',
    //   success: res => {
    //     console.log(res)
    //   }
    // })

    // http.request({
    //   url: 'process/createCustomProcessInstance?processCode=PROC-11F5BCA5-204E-4C42-9977-562BBD3AED87&corpId=' + dd.corpId,
    //   method: 'post',
    //   success: res => {
    //     res = JSON.parse(res);
    //     console.log(res);
    //     let processInstanceId = res.result.process_instance_id,
    //       requestId = res.request_id;
    //     http.request({
    //       url: 'process/createCustomProcessTask?processInstanceId=' + processInstanceId + '&corpId=' + dd.corpId,
    //       method: 'post',
    //       success: res => {
    //         console.log(res)
    //       }
    //     })
    //   }
    // })

    // http.request({
    //   url: 'process/updateCustomProcessStatus?processInstanceId=88a8e253-5197-4403-bd1b-c35212ecb6a2&corpId=' + dd.corpId,
    //   method: 'post',
    //   success: res => {
    //     console.log(res)
    //   }
    // })

    // http.request({
    //   url: 'process/updateCustomProcessTaskStatus?processInstanceId=88a8e253-5197-4403-bd1b-c35212ecb6a2&taskId=62507297431&corpId=' + dd.corpId,
    //   method: 'post',
    //   success: res => {
    //     console.log(res)
    //   }
    // })
  },
  bindKeyInput(e) {
    this.setData({
      inputValue: e.detail.value,
    });
  },
  adddMeeting: function() {
    dd.navigateTo({
      url: `addMeeting/addMeeting?insert=true`,
    });
  },
  participants: function(e) {
    let id = e.currentTarget.dataset.id;
    dd.navigateTo({
      url: `participants/participants?meetingId=` + id,
    });
  },
  notice: function(e) {
    let id = e.currentTarget.dataset.id;
    dd.navigateTo({
      url: `notice/notice?meetingId=` + id,
    });
  },
  summary: function(e) {
    let id = e.currentTarget.dataset.id;
    dd.navigateTo({
      url: `summary/summary?meetingId=` + id,
    });
  },
  onMeetingDetail: function(e) {
    let id = e.currentTarget.dataset.id;
    dd.navigateTo({
      url: `detail/detail?meetingId=` + id,
    });
  },
  delete(e) {
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
            url: 'meeting/delete?meetingid=' + id,
            method: 'post',
            success: res => {
              dd.showToast({
                content: '删除成功',
                mask: true,
                duration: 1000
              });
              that.onRequest();
            }
          })
        }
      },
    });
  },
  update(e) {
    let that = this,
      id = e.currentTarget.dataset.id;
    http.request({
      url: 'meeting/get?meetingid=' + id,
      success: res => {
        dd.navigateTo({
          url: `addMeeting/addMeeting?insert=false&meetingInfo=` + JSON.stringify(res),
        });
      }
    })
  },
  release: function(e) {
    let that = this,
      id = e.currentTarget.dataset.id;

    dd.confirm({
      title: '温馨提示',
      content: '确定发布吗?',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      success: (result) => {
        if (result.confirm) {
          http.request({
            url: 'meeting/update',
            method: 'post',
            data: JSON.stringify({ id: id, state: 1 }),
            success: res => {
              dd.showToast({
                content: '发布成功',
                mask: true,
                duration: 1000
              });
              that.onRequest();
            }
          })
        }
      },
    });
  }
});
