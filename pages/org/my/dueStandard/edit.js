import { HTTP } from '/util/http.js';
let http = new HTTP();
var duesInfo, hylbIndex = 0, hylbArray = [], dataId;
Page({
  data: {
    hylbIndex: 0,
    hylbArray: [],
    duesInfo: {},
    rylbItems: [
      { name: '个人会员', value: '2' },
      { name: '单位会员', value: '3' }
    ]
  }, onLoad(e) {
    dataId = e.id;
  }, onShow() {
    this.onReload();
  }, async onReload() {
    dd.showLoading({
      content: '加载中',
    });
    duesInfo = null, hylbIndex = 0, hylbArray = [];
    duesInfo = await this.getModel();
    await this.modelReload();
    dd.hideLoading();
  }, getModel() {
    console.log("执行实体查询");
    console.log(dataId);
    return new Promise((resolve, reject) => {
      if (dataId != null) {
        //获取表单信息
        http.request({
          url: 'duesStandard/selectInfo?id=' + dataId,
          success: (res) => {
            this.setData({
              duesInfo: res
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
      if (duesInfo != null && duesInfo.type != null) {
        var newItem = null;
        if (duesInfo.type == '2') {
          newItem = [
            { name: '个人会员', value: '2', checked: true },
            { name: '单位会员', value: '3' }];
        } else {
          newItem = [
            { name: '个人会员', value: '2' },
            { name: '单位会员', value: '3', checked: true }];
        }
        this.setData({
          rylbItems: newItem
        });
        var type = "person_member_job";
        if (duesInfo.type == 3) {
          type = "enterprise_member_job";
        }
        http.request({
          url: "dict/getDictListByCode?code=" + type,
          success: (res) => {
            hylbArray = [];
            for (var i = 0; i < res.length; i++) {
              var row = res[i];
              if (duesInfo != null && duesInfo.job != null) {
                if (row.id == duesInfo.job) {
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
            resolve(null);
          }
        });
      } else {
        var defaultArray = { id: null, name: "请选择" };
        hylbArray.push(defaultArray);
        this.setData({
          hylbIndex: 0,
          hylbArray: hylbArray,
        });
        resolve(null);
      }
    });
  }, radioChange(e) {
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
          if (duesInfo != null && duesInfo.job != null) {
            if (row.id == duesInfo.job) {
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

      }
    });
  }, onSubmit(e) {
    // dd.showLoading({
    //   content: '加载中',
    // });
    console.log('e:',e);
    var dataJson = e.detail.value;
    if (!dataJson.type) {
      dd.showToast({ content: '用户类型不能为空！', icon: 'false', duration: 2000 });
      return false;
    }

    if (!dataJson.job) {
      dd.showToast({ content: '会员职位不能为空！', icon: 'false', duration: 2000 });
      return false;
    }

    if (!dataJson.money) {
      dd.showToast({ content: '会费不能为空！', icon: 'false', duration: 2000 });
      return false;
    } else {
      // var moneyTest = /^\d+(\.\d+)?$/.test(dataJson.money);
      var moneyTest = /^[+]{0,1}(\d+)$/.test(dataJson.money);
      if (!moneyTest || parseInt(dataJson.money) < 0) {
        dd.showToast({ content: '会费格式错误！', icon: 'false', duration: 2000 });
        return false;
      }
    }
    
    http.request({
      url: 'duesStandard/saveOrUpdate',
      method: 'POST',
      data: JSON.stringify(dataJson),
      success: (res) => {
        dd.showToast({
          content: '保存成功！', icon: 'false', duration: 1000,
          mask: true, success: (result) => {
            dd.navigateBack();
          }
        });
      },
    });
  }, changeHylb(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      hylbIndex: e.detail.value,
    });
  }
})