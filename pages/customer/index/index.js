import { HTTP } from '/util/http.js';
import { showText } from '/app.js';
import { config } from '/app.js';
let http = new HTTP(),page = 1;
var _my$getSystemInfoSync = my.getSystemInfoSync(), windowHeight = _my$getSystemInfoSync.windowHeight;
var scrollHeight = windowHeight;
Page({
  data: {
      toUpper: 'toUpper',
      pageHeight: 1200,//scroll-view触底高度
      scrollHeight: 0,//最小scroll-view高度
      dataFinish: false,//数据加载完全
      noDataState: false,//无数据状态
      list: [
        {
          sendDate:'',
          sendTime:'',
          hospitalName:'',
          examinationId:'',
          title:'',
          context:'',
          type:'',
          signIn:'',
          createTime:'',
          newsTime:''

        }
      ],
     
  },
  onLoad(query) {
    let h = 135 * config.pageSize;
    this.setData({
      'scrollHeight': scrollHeight,
      'pageHeight': h
    })
    page = 1;
    this.setData({
      ['list']: [],
    });
    this.onRequest();
    // let that = this;

    // // 初始发送日期
    // var d = '2019-11-17';
    // this.setData({
    //   sendDate:showText(d)
    // })
    // // 初始发送时间
    //  var d = '10:00';
    // this.setData({
    //   sendTime:d
    // })
     
  },
  toUpper(e) {
    this.onRequest();
  },
  onRequest() {
    let that = this;
     this.setData({
      'loadingState': true
    })
    http.request({
      url: "baby/remindNewsList",
      method: 'post',
      data: JSON.stringify({
        param: {},
        page: page,
        size: 3,
      }),
      success: (res) => {
         let len = res.length;
        if (page == 1) {
          if (len < config.pageSize) {
            let h = 135 * len;
            that.setData({
              'pageHeight': h
            })
          }
          if (len == 0) {
            that.setData({
              'noDataState': true,
              'loadingState': false

            })
            return
          }
        } else if (len == 0) {
          that.setData({
            'dataFinish': true,
            'loadingState': false
          })
          return
        }
        if (len < config.pageSize) {
          that.setData({
            'dataFinish': true         
          })
        }
        page++;
        var data = that.data.list;
        data = res.concat(data);
        var listIndex = 'list';
        that.setData({
          [listIndex]: data,
          'loadingState': false
        });
      },
      fail: function(res) {
        dd.alert({ content: JSON.stringify(res), buttonText: '好的' });
      }
    })
  },
  toSignIn(e){// 签到
    http.request({
      url: "baby/signIn?examinationId=" + e.target.dataset.val,
      method: 'GET',
      success: (res) => {
        dd.showToast({
          type: 'success',
          content: '签到成功',
          duration: 2000
        });
        
      },
      fail: function(res) {
        
      }
    })
  },
  toBBMgt(){//去宝宝管理页面
    dd.navigateTo({
      url: '../baby-mgt/baby-mgt'
    });
  },
  toApplyDate(e){//去申请改期
    dd.navigateTo({
      url: '../apply-changeDate/apply-changeDate?examinationId=' + e.target.dataset.val,
    });
  },
  toConfirm(e){// 确认可以按时体检
    http.request({
      url: "baby/examinationConfirm?examinationId=" + e.target.dataset.val,
      method: 'GET',
      success: (res) => {
        dd.showToast({
          type: 'success',
          content: '确认成功',
          duration: 2000
        });
      },
      fail: function(res) {
        
      }
    })
  }
});