
Page({

  data: {
    overTime: {
      time1: 26,
      time2: 12,
      time3: 6
    },
    personNum: {
      notifyNum: 12,
      changeNum: 26,
      total: 1026
    }
  },
  // 跳转页面
  viewList(e) {
    dd.navigateTo({
      url: `/pages/doctor/${ e.currentTarget.dataset.url}/index`
    })

  }
})