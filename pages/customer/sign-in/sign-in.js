// import { HTTP } from '/util/http.js';
// import { config } from '/app.js';
// let http = new HTTP();

Page({
  data: {

  },

  onLoad(query) {
    // 页面加载
  },
  toSignedIn(){
    dd.navigateTo({
      url: '../signed-in/signed-in'
    });
  },
  toBBMgt(){//去宝宝管理页面
    dd.navigateTo({
      url: '../baby-mgt/baby-mgt'
    });
  },

});