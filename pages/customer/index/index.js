// import { HTTP } from '/util/http.js';
// import { config } from '/app.js';
// let http = new HTTP();

Page({
  data: {

  },
  onLoad(query) {
    // 页面加载
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