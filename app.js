App({
  onLaunch(options) {
    console.log('App Launch', options);
    this.login().then(function(userInfo) {
      console.log(userInfo);
      dd.redirectTo({
        url: userInfo.admin ? '/pages/doctor/index/index' : '/pages/customer/index/index',
      });
    });
  },
  login() {
    return new Promise(function(resolve, reject) {
      dd.getAuthCode({
        success: function(res) {
          dd.httpRequest({
            url: config.api_base_url + 'babyservice/login',//登录请求
            method: 'POST',
            dataType: 'json',
            headers: {
              'token': t.data,//从前端缓存取
            },
            data: {
              authCode: res.authCode,
              corpId: dd.corpId,
            },
            success: function(res) {
              if (res.data.code == "0000") {
                setStorage(res.data.data);
                resolve(res.data.data);
              } else {
                reject('error');
              }
            },
            fail: function(err) {
              console.log(err);
            },
          })
        },
        fail: function(err) {
          console.log(err);
        },
      });
    })
  },

  onShow() {
  },

  onHide() {
  },
  globalData: {
    hasLogin: false,
    handerUrl: "http://ksymmy.vaiwan.com/",
  },
});

function setStorage(userInfo) {
  // 把userInfo放入本地缓存中
  dd.setStorageSync({
    key: "userInfo",
    data: userInfo,
  });
}

let t = dd.getStorageSync({ key: 'token' });
const config = {
  api_base_url: getApp().globalData.handerUrl,
  pageSize: 10, //页面分页条数,
  ossEndpoint: 'http://npo-test.oss-cn-shanghai.aliyuncs.com/',
};
export {
  config
}