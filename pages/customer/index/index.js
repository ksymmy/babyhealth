// import { HTTP } from '/util/http.js';
import { showText } from '/app.js';

Page({
  data: {
      sendDate:'',
      sendTime:''
  },
  onLoad(query) {
    // 初始发送日期
    var d = '2019-11-13';
    this.setData({
      sendDate:showText(d)
    })
    // 初始发送时间
     var d = '10:00';
    this.setData({
      sendTime:d
    })
     
  },
  toSignIn(){//点击可以，去签到页面
    dd.navigateTo({
      url: '../sign-in/sign-in'
    });
  },
  toBBMgt(){//去宝宝管理页面
    dd.navigateTo({
      url: '../baby-mgt/baby-mgt'
    });
  },
  toApplyDate(){//去申请改期
    dd.navigateTo({
      url: '../apply-changeDate/apply-changeDate'
    });
  }
});