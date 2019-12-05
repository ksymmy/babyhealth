import { HTTP } from '/util/http.js';
import { showText } from '/app.js';
import { config } from '/app.js';
let http = new HTTP(), page = 1;
var _my$getSystemInfoSync = my.getSystemInfoSync(), windowHeight = _my$getSystemInfoSync.windowHeight;
var scrollHeight = windowHeight-70;
var flg = false, newHeight = 0, oldHeight = 0, i = 0, start = 0, end = 0,  flag=true;

Page({
  data: {
    pageHeight: 1200,//scroll-view触底高度
    scrollHeight: 0,//最小scroll-view高度
    animationInfo: {},
    topPosition: 0,
    loadingState: false,
    list: [
      // {
      //   sendDate: '',
      //   sendTime: '',
      //   hospitalName: '',
      //   examinationId: '',
      //   title: '',
      //   context: '',
      //   type: '',
      //   signIn: '',
      //   createTime: '',
      //   newsTime: ''

      // }
    ],
  
  },
  onLoad(query) {
    page = 1;

    this.setData({
      ['list']: [],
      'scrollHeight': scrollHeight
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
  onShow() {
    var animation = dd.createAnimation({
      duration: 1000,
      timeFunction: 'ease-in-out',
    });

    this.animation = animation;

    animation.scale(0.8, 0.8).translate(35, -15).step();

    this.setData({
      animationInfo: animation.export()
    });
  },
  onRequest() {
    let that = this;
    this.setData({
      'loadingState': true
    })
    flg = false;
    http.request({
      url: "baby/remindNewsList",
      method: 'post',
      data: JSON.stringify({
        param: {},
        page: page,
        size: 20,
      }),
      success: (res) => {
        res = res.reverse();
        let len = res.length;
        page++;
        var data = that.data.list;
        data = res.concat(data);
        that.setData({
          'list': data,
          'loadingState': false
        });
        var listHeight = 0;
        //滚动到固定位置
        if (page == 2) {
          setTimeout(function() {
            dd.createSelectorQuery().select('#listcon').boundingClientRect().exec((rect) => {
              listHeight = rect[0].height;
              newHeight = rect[0].height;
              that.setData({
                pageHeight: listHeight ,
                topPosition: listHeight - 1
              });
              if (flag) {
                dd.pageScrollTo({
                  scrollTop: that.data.topPosition
                })
              }

            });
          }, 200)
        } else {
          dd.createSelectorQuery().select('#listcon').boundingClientRect().exec((rect) => {
            oldHeight = newHeight;
            newHeight = rect[0].height
            //console.log(newHeight + "-" + oldHeight)
            if (flag) {
              that.setData({
                topPosition: newHeight - oldHeight - 1
              });

              dd.pageScrollTo({
                scrollTop: newHeight - oldHeight
              })
            }
          });

        }
      },
      fail: function(res) {
        dd.alert({ content: JSON.stringify(res), buttonText: '好的' });
      },
      complete: function(res) {
        flg = true;
        that.setData({
          'loadingState': false
        })
      }
    })
  },

  //滑动结束
  touchEnd(e) {
    end = e.changedTouches[0].pageY;
    //console.log(JSON.stringify(e.changedTouches[0])+'scrollHeight:' + scrollHeight + ",end:" + end+",start="+start)
    //到顶部分页刷新     
    if (end <= scrollHeight & end - start > 0) {
      this.onRequest();
    }
    flag=true
  },
  touchStart(e) {
    flag=false
    start = e.changedTouches[0].pageY;
    // console.log(JSON.stringify(e.changedTouches[0]))
  },
  // 签到
  toSignIn(e) {
    let that = this;
    let inx = e.currentTarget.dataset.index;
    http.request({
      url: "baby/signIn?examinationId=" + e.target.dataset.val,
      method: 'GET',
      success: (res) => {
        let signx = 'list[' + inx + '].signIn'
        that.setData({
          [signx]: 1
        })
      },
      fail: function(res) {

      }
    })
  },
  toBBMgt() {//去宝宝管理页面
    dd.navigateTo({
      url: '../baby-mgt/baby-mgt'
    });
  },
  toApplyDate(e) {//去申请改期
    dd.navigateTo({
      url: '../apply-changeDate/apply-changeDate?examinationId=' + e.target.dataset.val,
    });
  },
  toConfirm(e) {// 确认可以按时体检
    let that = this;
    let inx = e.currentTarget.dataset.index;
    http.request({
      url: "baby/examinationConfirm?examinationId=" + e.target.dataset.val,
      method: 'GET',
      success: (res) => {
        let confirmx = 'list[' + inx + '].confirm'
        that.setData({
          [confirmx]: 1
        })
      },
      fail: function(res) {

      }
    })
  }
});