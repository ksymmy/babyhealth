import { HTTP } from '/util/http.js';
let http = new HTTP();
var userInfo, arrIdType, arrIndex = 0, hylbIndex = 0, hylbArray = [], dataId;// 会员信息  证件类型  证件类型下标 
Page({
  data: {
    userInfo: {},
    arrIdType: [],
    arrIndex: 0,
    hylbIndex: 0,
    hylbArray: [],
  }, 
  onLoad(e) {
    dataId = e.id;
  }, 
  onShow() {
    this.onReload();
  }, 
  async onReload() {
    dd.showLoading({
      content: '加载中',
    });
    userInfo, arrIdType, arrIndex = 0, hylbIndex = 0, hylbArray = [];
    userInfo = await this.getModel();
    await this.modelReload();
    dd.hideLoading();
  }, 
  getModel() {
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
  }, 
  modelReload() {
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
});
