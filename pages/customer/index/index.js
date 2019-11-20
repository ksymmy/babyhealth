import { HTTP } from '/util/http.js';
import { showText } from '/app.js';
import { config } from '/app.js';
let http = new HTTP(), page = 1;
var _my$getSystemInfoSync = my.getSystemInfoSync(), windowHeight = _my$getSystemInfoSync.windowHeight;
var scrollHeight = windowHeight - 110;
Page({
  data: {
    toUpper: 'toUpper',
    pageHeight: 1200,//scroll-view触底高度
    scrollHeight: 0,//最小scroll-view高度
    animationInfo: {},
    topPosition: 0,
    old: {
      scrolTop: 0,
    },
    oldheight: 0,//标签位置
    newheight: 0, //新窗口高度
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
    let h = 760 * 3;
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
        console.log(res);
        res=res.reverse();
        let len = res.length;
        let h2 = 0;
        if (page == 1) {
          let len1 = 0, len2 = 0;
          for (let i = 0; i < len; i++) {
            if (res[i].type = 0) {
              len1++;
            } else {
              len2++;
            }
          }
        
          let h = 760 * len1 + 660 * len2;
          that.setData({
            'pageHeight': h
          })

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
        if (len < 3) {
          that.setData({
            'dataFinish': true
          })
        }
        page++;
        var data = that.data.list;
        data = res.concat(data);
        that.setData({
          'list': data,
          'loadingState': false
        });
        
         if (page == 2) {
        let htop = this.data.pageHeight
        dd.pageScrollTo({
          scrollTop: htop
        })
        } else {
          that.data.topPosition = that.data.old.scrolTop
          that.$nextTick(function() {
            that.data.topPosition = that.data.oldheight
          });
        }

        // setTimeout(function() {
        //   if (page == 2) {
        //     let htop = that.data.pageHeight - 1000
        //       dd.pageScrollTo({
        //         scrollTop: htop
        //       })
        //     // that.setData({
        //     //   topPosition: htop
        //     // })
        //   }
        // }, 1000)

      },
      fail: function(res) {
        dd.alert({ content: JSON.stringify(res), buttonText: '好的' });
      }
    })
  },
  onScroll(e) {
    // let newH = e.detail.scrollHeight
    // if (this.newheight == 0) {
    //   this.newheight = newH
    // } else if (this.newheight != newH) {
    //   this.oldheight = newH - this.newheight
    //   this.newheight = newH
    //   console.log(this.newheight, this.oldheight)
    // }
    // this.old.scrolTop = e.detail.scrollTop

    // console.log(e.detail.scrollTop + 'sdsdfs');
  },
  toSignIn(e) {// 签到
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

    // this.setData({
    //   topPosition: htop
    // })
    // dd.navigateTo({
    //   url: '../apply-changeDate/apply-changeDate?examinationId=' + e.target.dataset.val,
    // });
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