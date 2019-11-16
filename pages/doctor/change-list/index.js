import msglist from '/util/msglist';
import { HTTP } from '/util/http.js';
import { config } from '/app.js';
let http = new HTTP(), page = 1;
Page({
  ...msglist,
  data: {
    listData: {
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
    }
  },
  onLoad() {
    page = 1;
    this.setData({
      ['listData.list']: [],
    });
    this.onRequest();
  },
  onRequest() {
    let that = this;
    http.request({
      url: "baby/changedatebabyslist",
      method: 'post',
      data: JSON.stringify({
        param: {},
        page: page,
        size: config.pageSize,
      }),
      success: (res) => {
        if (res.length == 0) {
          return
        }
        page++;
        var data = that.data.listData.list;
        data = data.concat(res);
        var listIndex = 'listData.list';
        that.setData({
          [listIndex]: data,
        });
      },
      fail: function(res) {
        dd.alert({ content: JSON.stringify(res), buttonText: '好的' });
      }
    })
  },
})