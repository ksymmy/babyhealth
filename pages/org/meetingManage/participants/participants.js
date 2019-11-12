import { HTTP } from '/util/http.js';
let http = new HTTP();
Page({
  data: {
    meetingId: '',
    checks: [],
    tabs: [],
    activeTab: 0,
  },
  handleTabClick({ index }) {
    this.setData({
      activeTab: index,
    });
  },
  handleTabChange({ index }) {
    this.setData({
      activeTab: index,
    });
  },
  onLoad: function(e) {
    let that = this;
    if (!this.data.meetingId) {
      this.setData({
        meetingId: e.meetingId
      })
    }
    http.request({
      url: "participants/badges?meetingid=" + that.data.meetingId,
      success: (res) => {
        that.setData({
          tabs: [
            {
              title: '待审核',
              badgeType: 'text',
              badgeText: res['0'] ? res['0'] : 0,
            },
            {
              title: '已审核通过',
              badgeType: 'text',
              badgeText: res['1'] ? res['1'] : 0,
            },
            {
              title: '审核未通过',
              badgeType: 'text',
              badgeText: res['2'] ? res['2'] : 0,
            },

          ]
        });

        http.request({
          url: "participants/list?meetingid=" + that.data.meetingId,
          success: (res) => {
            that.setData({
              checks: res
            })
          }
        })
      }
    })
  },
  pass: function(e) {
    let uid = e.currentTarget.dataset.uid,
      id = e.currentTarget.dataset.id,
      that = this;
    let param = {
      url: 'participants/update',
      method: 'post',
      data: {
        id: id,
        userId: uid,
        meetingId: that.data.meetingId,
        state: 1
      },
      success: (res) => {
        dd.showToast({
          content: '审核通过',
          icon: 'none',
          duration: 2000
        });
        that.onLoad();
      }
    }
    this.request(param);
  },
  noPass: function(e) {
    let uid = e.currentTarget.dataset.uid,
      id = e.currentTarget.dataset.id,
      that = this;
    let param = {
      url: 'participants/update',
      method: 'post',
      data: {
        id: id,
        userId: uid,
        meetingId: that.data.meetingId,
        state: 2
      },
      success: (res) => {
        dd.showToast({
          content: '审核不通过',
          icon: 'none',
          duration: 2000
        });
        that.onLoad();
      }
    }
    this.request(param);
  },
  cancel: function(e) {
    let uid = e.currentTarget.dataset.uid,
      id = e.currentTarget.dataset.id,
      that = this;
    let param = {
      url: 'participants/update',
      method: 'post',
      data: {
        id: id,
        userId: uid,
        meetingId: that.data.meetingId,
        state: 3
      },
      success: (res) => {
        dd.showToast({
          content: '已取消参会',
          icon: 'none',
          duration: 2000
        });
        that.onLoad();
      }
    }
    this.request(param);
  },
  request: function(param) {
    http.request({
      url: param.url,
      method: param.method,
      data: JSON.stringify(param.data),
      success: param.success
    })
  }
})