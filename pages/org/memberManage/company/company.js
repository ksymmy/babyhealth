import { HTTP } from '/util/http.js';
let http = new HTTP();

var userInfo, dataId, dateValue,
  areaProArray = [], areaProIndex = 0,
  areaCityArray = [], areaCityIndex = 0,
  areaCountyArray = [], areaCountyIndex = 0,
  jglxArray = [], jglxIndex = 0,
  sshyArray = [], sshyIndex = 0,
  hylbIndex = 0, hylbArray = [];
Page({
  data: {
    jglxArray: [],
    jglxIndex: 0,
    sshyArray: [],
    sshyIndex: 0,
    areaProArray: [],
    areaProIndex: 0,
    areaCityArray: [],
    areaCityIndex: 0,
    areaCountyArray: [],
    areaCountyIndex: 0,
    userInfo: {},
    dateValue: null,
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
    userInfo, areaProArray = [], areaProIndex = 0,
      areaCityArray = [], areaCityIndex = 0,
      areaCountyArray = [], areaCountyIndex = 0,
      jglxArray = [], jglxIndex = 0,
      sshyArray = [], sshyIndex = 0,
      hylbIndex = 0, hylbArray = [];

    var defaultArea = { id: "", name: "请选择" };
    areaProArray.push(defaultArea);
    areaCityArray.push(defaultArea);
    areaCountyArray.push(defaultArea);

    userInfo = await this.getModel();
    await this.modelReload();
    await this.areaProReload();
    await this.areaCityReload();
    await this.areaCountyReload();
    dd.hideLoading();
  }, getModel() {
    return new Promise((resolve, reject) => {
      console.log("执行实体查询");
      console.log(dataId);
      //获取表单信息
      http.request({
        url: 'memberUserInfo/findInfoById?id=' + dataId,
        success: (res) => {
          this.setData({
            userInfo: res,
          });
          console.log(res);
          resolve(res);
        }
      });
    });
  }, modelReload() {
    return new Promise((resolve, reject) => {
      console.log("执行数据绑定");
      if (userInfo != null && userInfo.establishDateStr != null) {
        dateValue = userInfo.establishDateStr;
        this.setData({
          dateValue: userInfo.establishDateStr
        });
      }

      //获取机构类型
      http.request({
        url: 'dict/getDictListByCode?code=org_type',
        success: (res) => {
          jglxArray = [];
          for (var i = 0; i < res.length; i++) {
            var row = res[i];
            if (userInfo != null && userInfo.orgType != null) {
              if (row.id == userInfo.orgType) {
                jglxIndex = i;
              }
            }
            var aa = { id: row.id, name: row.name };
            jglxArray.push(aa);
          }
          this.setData({
            jglxArray: jglxArray,
            jglxIndex: jglxIndex
          });
          console.log("机构类型绑定完成");
        }
      });

      //获取所属行业
      http.request({
        url: 'dict/getDictListByCode?code=industry',
        success: (res) => {
          sshyArray = [];
          for (var i = 0; i < res.length; i++) {
            var row = res[i];
            if (userInfo != null && userInfo.industry != null) {
              if (row.id == userInfo.industry) {
                sshyIndex = i;
              }
            }
            var aa = { id: row.id, name: row.name };
            sshyArray.push(aa);
          }
          this.setData({
            sshyArray: sshyArray,
            sshyIndex: sshyIndex
          });
          console.log("所属行业绑定完成");
        }
      });

      //获取会员职位
      http.request({
        url: 'dict/getDictListByCode?code=enterprise_member_job',
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
  }, areaProReload() {
    return new Promise((resolve, reject) => {
      console.log("执行行政区划省级绑定划绑定");
      http.request({
        url: 'area/selectAreaByPCode?code=',
        success: (res) => {
          for (var i = 0; i < res.length; i++) {
            var row = res[i];
            if (userInfo != null && (userInfo.provinceId != null && userInfo.provinceId != "")) {
              if (row.code == userInfo.provinceId) {
                areaProIndex = i + 1;//增加请选择下标
              }
            }
            var aa = { id: row.code, name: row.name };
            areaProArray.push(aa);
          }
          this.setData({
            areaProArray: areaProArray,
            areaProIndex: areaProIndex,
          });
          resolve(null);
        }
      });

    });
  }, areaCityReload() {
    return new Promise((resolve, reject) => {
      console.log("执行行政区划市级绑定划绑定");
      if (userInfo != null && (userInfo.provinceId != null && userInfo.provinceId != "")) {
        //行政区划-市级
        http.request({
          url: 'area/selectAreaByPCode?code=' + userInfo.provinceId,
          success: (res) => {
            for (var i = 0; i < res.length; i++) {
              var row = res[i];
              if (userInfo != null && userInfo.cityId != null) {
                if (row.code == userInfo.cityId) {
                  areaCityIndex = i + 1;
                }
              }
              var aa = { id: row.code, name: row.name };
              areaCityArray.push(aa);
            }
            this.setData({
              areaCityArray: areaCityArray,
              areaCityIndex: areaCityIndex,
            });
            resolve(null);
          }
        });
      } else {
        this.setData({
          areaCityArray: areaCityArray,
          areaCityIndex: areaCityIndex,
        });
        resolve(null);
      }
    });
  }, areaCountyReload() {
    return new Promise((resolve, reject) => {
      console.log("执行行政区划县区绑定划绑定");
      if (userInfo != null && (userInfo.cityId != null && userInfo.cityId != "")) {
        //行政区划-县区
        http.request({
          url: 'area/selectAreaByPCode?code=' + userInfo.cityId,
          success: (res) => {
            for (var i = 0; i < res.length; i++) {
              var row = res[i];
              if (userInfo != null && userInfo.cityId != null) {
                if (row.code == userInfo.countyId) {
                  areaCountyIndex = i + 1;
                }
              }
              var aa = { id: row.code, name: row.name };
              areaCountyArray.push(aa);

            }
            this.setData({
              areaCountyArray: areaCountyArray,
              areaCountyIndex: areaCountyIndex,
            });
            resolve(null);
          }
        });
      } else {
        this.setData({
          areaCountyArray: areaCountyArray,
          areaCountyIndex: areaCountyIndex,
        });
        resolve(null);
      }
    });
  },
  //机构类型
  bindJglxPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      jglxIndex: e.detail.value,
    });
  },
  //所属行业
  bindSshyPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      sshyIndex: e.detail.value,
    });
  },
  //行政区划省级
  bindareaProChange(e) {
    areaCityArray = [];
    areaCountyArray = [];
    var defaultArea = { id: "", name: "请选择" };
    areaCityArray.push(defaultArea);
    areaCountyArray.push(defaultArea);
    var code = this.data.areaProArray[e.detail.value].id;
    console.log('picker发送选择改变，携带值为', e.detail.value);
    //行政区划
    if (e.detail.value == "") {
      this.setData({
        areaProIndex: e.detail.value,
        areaCityArray: areaCityArray,
        areaCityIndex: 0,
        areaCountyArray: areaCountyArray,
        areaCountyIndex: 0,
      });
    } else {
      http.request({
        url: 'area/selectAreaByPCode?code=' + code,
        success: (res) => {
          for (var i = 0; i < res.length; i++) {
            var row = res[i];
            var aa = { id: row.code, name: row.name };
            areaCityArray.push(aa);
          }
          this.setData({
            areaProIndex: e.detail.value,
            areaCityArray: areaCityArray,
            areaCityIndex: 0,
            areaCountyArray: areaCountyArray,
            areaCountyIndex: 0,
          });
        }
      });
    }
  },
  //行政区划市级
  bindareaCityChange(e) {
    areaCountyArray = [];
    var defaultArea = { id: "", name: "请选择" };
    areaCountyArray.push(defaultArea);
    var code = this.data.areaCityArray[e.detail.value].id;
    //行政区划
    if (e.detail.value == "") {
      this.setData({
        areaCityIndex: e.detail.value,
        areaCountyArray: areaCountyArray,
        areaCountyIndex: 0
      });
    } else {
      http.request({
        url: 'area/selectAreaByPCode?code=' + code,
        success: (res) => {
          for (var i = 0; i < res.length; i++) {
            var row = res[i];
            var aa = { id: row.code, name: row.name };
            areaCountyArray.push(aa);
          }
          this.setData({
            areaCityIndex: e.detail.value,
            areaCountyArray: areaCountyArray,
            areaCountyIndex: 0
          });
        }
      });
    }
    console.log('picker发送选择改变，携带值为', this.data.areaCityArray);
  },
  bindareaCountyChange(e) {
    this.setData({
      areaCountyIndex: e.detail.value
    });
  },
  //成立时间
  chooseDate() {
    var now = Date.now();
    var year = new Date(now).getFullYear()
    var month = new Date(now).getMonth() + 1
    var day = new Date(now).getDate()
    var currentDate = year + "-" + month + "-" + day;
    var maxDate = year + "-" + month + "-" + day;
    if (dateValue != null) {
      currentDate = dateValue;
    }
    console.log(now);
    dd.datePicker({
      currentDate: currentDate,
      endDate: maxDate,
      success: (res) => {
        this.setData({ dateValue: res.date });
      },
    });
  }, bingHylb(e) {
    this.setData({
      hylbIndex: e.detail.value,
    });
  }, onSubmit(e) {
    var dataJson = e.detail.value;
    // console.log(dataJson);
    if (!dataJson.creditCode) {
      dd.showToast({ content: '统一社会信用代码不能为空！', icon: 'false', duration: 2000 });
      return false;
    } else {
      if (dataJson.creditCode.length != 18) {
        dd.showToast({ content: '统一社会信用代码格式错误！', icon: 'false', duration: 2000 });
        return false;
      }
    }

    if (!dataJson.enterpriseName) {
      dd.showToast({ content: '单位名称不能为空！', icon: 'false', duration: 2000 });
      return false;
    }

    if (!dataJson.orgType) {
      dd.showToast({ content: '机构类型不能为空！', icon: 'false', duration: 2000 });
      return false;
    }

    if (!dataJson.industry) {
      dd.showToast({ content: '所属行业不能为空！', icon: 'false', duration: 2000 });
      return false;
    }

    if (!dataJson.provinceId) {
      dd.showToast({ content: '省份不能为空！', icon: 'false', duration: 2000 });
      return false;
    }

    if (!dataJson.cityId) {
      dd.showToast({ content: '城市不能为空！', icon: 'false', duration: 2000 });
      return false;
    }
    if (!dataJson.countyId) {
      dd.showToast({ content: '县区不能为空！', icon: 'false', duration: 2000 });
      return false;
    }

    if (!dataJson.detail) {
      dd.showToast({ content: '详细地址不能为空！', icon: 'false', duration: 2000 });
      return false;
    }

    if (dataJson.enterprisePostalCode) {
      var postalCodeTest = /^[1-9][0-9]{5}$/.test(dataJson.enterprisePostalCode);
      if (!postalCodeTest) {
        dd.showToast({ content: '邮政编码格式错误！', icon: 'false', duration: 2000 });
        return false;
      }
    } 
    // else {
    //   dd.showToast({ content: '邮政编码不能为空！', icon: 'false', duration: 2000 });
    //   return false;
    // }

    if (!dataJson.establishDateStr) {
      dd.showToast({ content: '成立日期不能为空！', icon: 'false', duration: 2000 });
      return false;
    }

    if (dataJson.enterprisePhone) {
      var phoneTest = /^[1][3,4,5,7,8][0-9]{9}$/.test(dataJson.enterprisePhone);
      if (!phoneTest) {
        dd.showToast({ content: '手机号码格式错误！', icon: 'false', duration: 2000 });
        return false;
      }
    } else {
      dd.showToast({ content: '手机号码不能为空！', icon: 'false', duration: 2000 });
      return false;
    }

    if (dataJson.enterpriseEmail) {
      //座机
      var mailTest = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(dataJson.enterpriseEmail);
      if (!mailTest) {
        dd.showToast({ content: '邮箱格式错误！', icon: 'false', duration: 2000 });
        return false;
      }
    } else {
      dd.showToast({ content: '邮箱不能为空！', icon: 'false', duration: 2000 });
      return false;
    }
    dd.showLoading({
      content: '加载中',
    });
    http.request({
      url: 'memberUserInfo/saveUnit',
      method: 'POST',
      data: JSON.stringify(dataJson),
      success: (res) => {
        dd.showToast({
          content: '保存成功！', icon: 'false', duration: 1000,
          mask: true, success: (result) => {
            dd.hideLoading();
            dd.navigateBack();
          }
        });
      }
    });

  }
});




