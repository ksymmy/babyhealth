import msglist from '/util/msglist';
import { HTTP } from '/util/http.js';
import { config } from '/app.js';
let http = new HTTP();
let timeperiod = {}
var page;
var _my$getSystemInfoSync = my.getSystemInfoSync(), windowHeight = _my$getSystemInfoSync.windowHeight;
var scrollHeight = windowHeight;
Page({
  ...msglist,
  data: {
    pagesize: 10,
    listData: {
      toLower: 'toLower',
      delayOne: 'handleDelay',
      pageHeight: 1200,//scroll-view触底高度
      scrollHeight: 0,//最小scroll-view高度
      dataFinish: false,//数据加载完全
      noDataState: false,//无数据状态
      list: [
        //   {
        //   babyId: 1,
        //   name: '任慕瑶',
        //   sex: 0,
        //   birthday: '2019-06-30',
        //   age: '3月龄',
        //   textTime: '2019-09-30'
        // },
        // {
        //   babyId: 2,
        //   name: '任慕瑶',
        //   sex: 0,
        //   birthday: '2019-04-04',
        //   age: '6月龄',
        //   textTime: '2019-10-04'
        // },
        // {
        //   babyId: 3,
        //   name: '袁明轩',
        //   sex: 1,
        //   birthday: '2019-07-04',
        //   age: '3月龄',
        //   textTime: '2019-10-04'
        // },
        // {
        //   babyId: 4,
        //   name: '袁明轩',
        //   sex: 1,
        //   birthday: '2019-07-04',
        //   age: '3月龄',
        //   textTime: '2019-10-04'
        // }
      ],
      type: 1 //封装列表页面展示类型，1为明日体检列表，2为改期列表，3为逾期列表
    }

  },
  onRequest(page) {
    let that = this;
    console.log("||||||||||||||||")
    console.log(timeperiod)
    http.request({
      url: "baby/tomorrowexaminationbabyslist",
      method: 'POST',
      data: JSON.stringify({
        "param": timeperiod, "page": page, "size":  config.pageSize
      }),
      success: function(res) {
        let len = res.length;

        if (page == 1) {
          if (len < config.pageSize) {
            let h = 135 * len + 10;
            that.setData({
              'listData.pageHeight': h
            })
          }
          if (len == 0) {
            that.setData({
              'listData.noDataState': true

            })
            return
          }
        } else if (len == 0) {
          that.setData({
            'listData.dataFinish': true
          })
          return
        }
        if (len < config.pageSize) {
          that.setData({
            'listData.dataFinish': true
          })
        }
        var newData, result_data, newpagesize, add_size;
        newData = []
        for (var key in res) {
          newData.push(res[key])
          newData.push(res[key])
          newData.push(res[key])
          newData.push(res[key])
          newData.push(res[key])
          newData.push(res[key])
          newData.push(res[key])
          newData.push(res[key])
          newData.push(res[key])
          newData.push(res[key])
        }
        var oldData = that.data.listData.list;
        if (page === 1) {
          add_size = 0
        } else {
          add_size = 10
          console.log("__________laqu_______________")
        }
        newpagesize = that.data.pagesize + add_size
        result_data = oldData.concat(newData)
        page++
        that.setData({
          'listData.list': result_data,
          'pagesize': newpagesize
        })
      }
    })
  },
  onLoad(param) {
    my.setNavigationBar({
      title: '明日通知人数 ('+param.num+')'
    });
    let h = 135 * config.pageSize;
    this.setData({
      'listData.scrollHeight': scrollHeight,
      'listData.pageHeight': h
    })
    page = 1
    this.onRequest(page)
  },
  toLower(e) {

    let that = this;
    this.onRequest(page);
  },
  //延后一天操作
  handleDelay(e) {
    console.log('dssd')
    dd.showToast({
      content: `${e.currentTarget.dataset.babyid}`,
      success: (res) => {

      },
    });
  }
})