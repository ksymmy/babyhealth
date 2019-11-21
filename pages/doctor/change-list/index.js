import msglist from '/util/msglist';
import { HTTP } from '/util/http.js';
import { config } from '/app.js';
let http = new HTTP(), page = 1;
var _my$getSystemInfoSync = my.getSystemInfoSync(), windowHeight = _my$getSystemInfoSync.windowHeight;
var scrollHeight = windowHeight-40;
Page({
  ...msglist,
  data: {
    listData: {
      toLower: 'toLower',
      pageHeight: 1200,//scroll-view触底高度
      scrollHeight: 0,//最小scroll-view高度
      dataFinish: false,//数据加载完全
      noDataState: false,//无数据状态
      list: [
        // {
        //   name: '任慕瑶',
        //   sex: 0,
        //   birthday: '2019-04-04',
        //   age: '6',
        //   textTime: '2019-10-04',
        //   changeTime: '2019-10-09',
        //   result: '我家宝宝不在社区，我们下周来进行体检1。'
        // }
      ],
      type: 2  //封装列表页面展示类型，1为明日体检列表，2为改期列表，3为逾期列表
    },
    flag: true
  },
  onLoad(param) {
    dd.setNavigationBar({
      title: '申请改期 (' + param.num + ')'
    });
    let h = 135 * config.pageSize;
    this.setData({
      'listData.scrollHeight': scrollHeight,
      'listData.pageHeight': h
    })
    page = 1;
    this.setData({
      ['listData.list']: [],
    });
    this.onRequest();
  },
  toLower(e) {
    if (this.data.flag) {
      this.onRequest();
    }
  },
  onRequest() {
    let that = this;
    this.setData({
      'listData.loadingState': true,
      'flag': false
    })
    http.request({
      url: "baby/changedatebabyslist",
      method: 'post',
      data: JSON.stringify({
        param: {},
        page: page,
        size: config.pageSize,
      }),
      success: (res) => {
        let len = res.length;
        if (page == 1) {
          if (len < config.pageSize) {
            let h = 135 * len;
            that.setData({
              'listData.pageHeight': h
            })
          }
          if (len == 0) {
            that.setData({
              'listData.noDataState': true,
              'listData.pageHeight': scrollHeight,
              'listData.loadingState': false

            })
            return
          }
        } else if (len == 0) {
          that.setData({
            'listData.dataFinish': true,
            'listData.loadingState': false
          })
          return
        }
        if (len < config.pageSize) {
          that.setData({
            'listData.dataFinish': true
          })
        }
        page++;
        var data = that.data.listData.list;
        data = data.concat(res);
        var listIndex = 'listData.list';
        that.setData({
          [listIndex]: data,
          'listData.loadingState': false
        });
      },
      fail: function(res) {
        dd.alert({ content: JSON.stringify(res), buttonText: '好的' });
      },
      complete: res => {
        that.setData({
          'flag': true
        });
      }
    })
  },
})