import { HTTP } from '/util/http.js';
let http = new HTTP();
var userInfo, arrIdType, arrIndex = 0, hylbIndex = 0, hylbArray = [], dataId;// 会员信息  证件类型  证件类型下标 
Page({
  data: {
    focus: false,
    userInfo: {},
    arrIdType: [],
    arrIndex: 0,
    hylbIndex: 0,
    hylbArray: [],
    isDisabled: 0
  }, onLoad(e) {
    dataId = e.id;
    this.setData({
      isDisabled: e.isModify
    });
  }, onShow() {
    this.onReload();
  }, async onReload() {
    dd.showLoading({
      content: '加载中',
    });
    userInfo, arrIdType, arrIndex = 0, hylbIndex = 0, hylbArray = [];
    userInfo = await this.getModel();
    await this.modelReload();
    dd.hideLoading();
  }, getModel() {
    console.log("执行实体查询");
    console.log(dataId);
    return new Promise((resolve, reject) => {
      // 请求会员信息
      http.request({
        url: 'memberUserInfo/findInfoById?id=' + dataId,
        success: (res) => {
          this.setData({
            userInfo: res,
          })
          resolve(res);
          console.log(res);
        }
      })
    });
  }, modelReload() {
    console.log("执行数据绑定");
    return new Promise((resolve, reject) => {
      //请求证件类型缓存
      http.request({
        url: 'dict/getDictListByCode?code=id_type',
        success: (res) => {
          arrIdType = [];
          for (var i = 0; i < res.length; i++) {
            var row = res[i];
            if (userInfo != null && userInfo.idtype != null) {
              if (row.id == userInfo.idtype) {
                arrIndex = i;
              }
            }
            var aa = { id: row.id, name: row.name };
            arrIdType.push(aa);
          }
          this.setData({
            arrIndex: arrIndex,
            arrIdType: arrIdType,
          });
          console.log("证件类型绑定完成");
        }
      });

      //请求会员职务缓存
      http.request({
        url: 'dict/getDictListByCode?code=person_member_job',
        success: (res) => {
          hylbArray = [];
          for (var i = 0; i < res.length; i++) {
            var row = res[i];
            if (userInfo != null && userInfo.job != null) {
              if (row.id == userInfo.job) {
                hylbIndex = i;
              }
            }
            var aa = { id: row.id, name: row.name };
            hylbArray.push(aa);
          }
          this.setData({
            hylbIndex: hylbIndex,
            hylbArray: hylbArray,
          });
          console.log("会员职位绑定完成");
        }
      });
      resolve(null);
    });
  },
  bindObjPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      arrIndex: e.detail.value,
    });
  },
  //提交表单
  onSubmit(e) {
    var phome = e.detail.value.phome;
    var email = e.detail.value.email;
    if (!e.detail.value.name)
      return dd.showToast({ content: '姓名不能为空！', icon: 'false', duration: 2000 });
    if (!e.detail.value.idtype)
      return dd.showToast({ content: '证件类型不能为空！', icon: 'false', duration: 2000 });
    if (!e.detail.value.idnumber)
      return dd.showToast({ content: '证件号码不能为空！', icon: 'false', duration: 2000 });
    if (!phome)
      return dd.showToast({ content: '手机号码不能为空！', icon: 'false', duration: 2000 });
    if (!e.detail.value.email)
      return dd.showToast({ content: '邮箱不能为空！', icon: 'false', duration: 2000 });
    // //统一信用代码

    var phoneTest = /^[1][3,4,5,7,8][0-9]{9}$/.test(phome);
    if (!phoneTest) {
      dd.showToast({ content: '手机号码格式错误！', icon: 'false', duration: 2000 });
      return false;
    }

    var mailTest = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(email);
    if (!mailTest) {
      dd.showToast({ content: '邮箱格式错误！', icon: 'false', duration: 2000 });
      return false;
    }
    dd.showLoading({
      content: '加载中',
    });

    // 请求
    http.request({
      url: 'memberUserInfo/savePersonal',
      method: 'POST',
      data: JSON.stringify(e.detail.value),
      success: (res) => {
        dd.showToast({
          content: '保存成功！', icon: 'false', duration: 1000,
          mask: true, success: (result) => {
            dd.hideLoading();
            dd.navigateBack();
          }
        });
      }
    })
  },

  bringToFront(e) {
    const { value } = e.target.dataset;
    const list = this.data.list.concat();
    const index = list.indexOf(value);
    if (index !== -1) {
      list.splice(index, 1);
      list.unshift(value);
      this.setData({ list });
    }
  }, bingHylb(e) {
    this.setData({
      hylbIndex: e.detail.value,
    });
  }

});
