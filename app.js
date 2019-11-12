App({
  onLaunch(options) {
    console.log('App Launch', options);
    console.log('getSystemInfoSync', dd.getSystemInfoSync());
    console.log('SDKVersion', dd.SDKVersion);
  },

  login(){
    return new Promise(function (resolve,reject){
      dd.getAuthCode({
        success: function(res) {
          dd.httpRequest({
            url: config.api_base_url+'loginApi/login',//登录请求
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
              var userInfo = res.data.data;
              console.log('userInfo',userInfo);
              setStorage(userInfo);
              if(res.data.code == "0000"){
                resolve(res);
              }else{
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
    console.log('App Show');
  },

  onHide() {
    console.log('App Hide');
  },
  globalData: {
    hasLogin: false,
    // handerUrl: "http://localhost:8080/",
    handerUrl: "http://ksymmy.vaiwan.com/",
    // handerUrl: "http://lijianping.vaiwan.com/",
  },
});

function setStorage(userInfo){
  //把userToken放入本地缓存中
  dd.setStorageSync({
    key: "token",
    data: userInfo.token,
  });
  //把初始用户类型放入本地缓存中
  dd.setStorageSync({
    key: "userType",
    data: userInfo.userType,
  });
  //把当前用户类型放入本地缓存中
  dd.setStorageSync({
    key: "curUserType",
    data: userInfo.curUserType,
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