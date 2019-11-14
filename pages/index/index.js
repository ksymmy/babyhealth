Page({
  data: {},
  onLoad() {
    getApp().login().then(function(userInfo) {
      console.log(userInfo);
      dd.redirectTo({
        url: userInfo.admin ? '/pages/doctor/index/index' : '/pages/customer/index/index',
      });
    });
  },
});
