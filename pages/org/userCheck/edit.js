import { HTTP } from '/util/http.js';
let http = new HTTP();
var userInfo, hylbIndex = 0, hylbArray = [], dataId;
Page({
  data: {
    rylbIndex: 1,
    rylbItems: [
      { name: '工作人员', value: '1' },
      { name: '个人会员', value: '2' },
      { name: '单位会员', value: '3' }
    ],
    userInfo: {},
    typeShow: 1,
    chekcItems: [
      { name: '通过', value: '1', checked: true },
      { name: '不通过', value: '2' }
    ],
    hylbIndex: 0,
    hylbArray: []
  }, onLoad(e) {
    dataId = e.id;
  }, onShow() {
    this.onReload();
  }, async onReload() {
    dd.showLoading({
      content: '加载中',
    });
    userInfo, hylbIndex = 0, hylbArray = [];
    userInfo = await this.getModel();
    await this.modelReload();
    dd.hideLoading();
  }, getModel() {
    console.log("执行实体查询");
    console.log(dataId);
    return new Promise((resolve, reject) => {
      if (dataId != null) {
        //获取表单信息
        http.request({
          url: 'user/selectUserInfo?id=' + dataId,
          success: (res) => {
            this.setData({
              userInfo: res
            });
            resolve(res);
            console.log(res);
          }
        });
      } else {
        resolve(null);
      }
    });
  }, modelReload() {
    console.log("执行数据绑定");
    return new Promise((resolve, reject) => {
      var defaultArray = { id: null, name: "请选择" };
      hylbArray.push(defaultArray);
      this.setData({
        hylbIndex: 0,
        hylbArray: hylbArray,
      });
      resolve(null);
    });
  }, radioChange(e) {
    var check = e.detail.value;
    this.setData({
      typeShow: check
    });
    console.log('你选择的框架是：', e.detail.value);
  }, radioChangeYhlx(e) {
    var check = e.detail.value;
    var type = "person_member_job";
    if (check == 3) {
      type = "enterprise_member_job";
    }
    http.request({
      url: "dict/getDictListByCode?code=" + type,
      success: (res) => {
        hylbArray = [];
        for (var i = 0; i < res.length; i++) {
          var row = res[i];
          var aa = { id: row.id, name: row.name };
          hylbArray.push(aa);
        }
        this.setData({
          hylbIndex: 0,
          hylbArray: hylbArray,
        });
      }
    });
    this.setData({
      rylbIndex: check
    });
  }, changeHylb(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      hylbIndex: e.detail.value,
    });
  }, onSubmit(e) {
    var dataJson = e.detail.value;
    console.log('picker发送选择改变，携带值为', dataJson);

    if (dataJson.status == "1" && !dataJson.userType) {
      dd.showToast({ content: '用户类型不能为空！', icon: 'false', duration: 2000 });
      return false;
    }

    if (dataJson.status == "1" && dataJson.userType != "1" && !dataJson.job) {
      dd.showToast({ content: '会员职位不能为空！', icon: 'false', duration: 2000 });
      return false;
    }
    dd.showLoading({
      content: '加载中',
    });
    http.request({
      url: 'user/updateStatusAsRole',
      method: 'POST',
      data: JSON.stringify(dataJson),
      success: (res) => {
        dd.showToast({
          content: '审核成功！', icon: 'false', duration: 1000,
          mask: true, success: (result) => {
            dd.hideLoading();
            dd.navigateBack();
          }
        });
      }
    });
  }
})