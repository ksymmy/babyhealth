import {HTTP} from '/util/http.js';
let http = new HTTP();
var app = getApp()
Page({
  data: {
    // overTime: {
    //   time1: 26,
    //   time2: 12,
    //   time3: 6
    // },
    // personNum: {
    //   notifyNum: 12,
    //   changeNum: 26,
    //   total: 1026
    // }
  },
  onLoad(){
    var that = this;
    http.request({
      url:"baby/indexCount",
      success:function(res){
        // console.log(res)
        that.setData({
          overTime: {
            time1: res.overdueDays7,
            time2: res.overdueDays14,
            time3: res.overdueDays21
          },
          personNum: {
            notifyNum: res.tomorrowExaminationBabys,
            changeNum: res.changeDateBabys,
            total: res.allBabys
          }
        })
      }
    })
  },
  
  // 跳转页面
  viewList(e) {
    dd.navigateTo({
      url: `/pages/doctor/${ e.currentTarget.dataset.url}/index?overduestart=${e.currentTarget.dataset.overduestart}&overdueend=${e.currentTarget.dataset.overdueend}&num=${e.currentTarget.dataset.num}`
    })

  }
})