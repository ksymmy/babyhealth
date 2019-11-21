Page({
  data: {},
  onLoad() {
    setTimeout(() => {
      getApp().login().then((userInfo) => {
        dd.redirectTo({
          url: userInfo.admin ? '/pages/doctor/index/index' : '/pages/customer/index/index',
        });
      });
    }, 1000);
  },
});
