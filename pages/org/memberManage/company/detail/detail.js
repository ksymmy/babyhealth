import { HTTP } from '/util/http.js';
let http = new HTTP();
var currentDate;
var address;
var userInfo;
var orgType, arrOrgType, arrOrgTypeIndex;
var industry, arrIndustry, arrIndustryIndex;
var area ,areaProIndex , areaCityIndex, areaCountyIndex,oldValue;
var hylbIndex = 0,hylbArray = [];
Page({
  data: {
    focus: false,
    arrOrgType: [],
    arrIndustry: [],
    arrOrgTypeIndex: '',
    arrIndustryIndex: '',
    areaProArray:[],
    areaProCode: '',
    areaProIndex:0,
    areaCityArray: [],
    areaCityCode: '',
    areaCityIndex: 0,
    areaCountyArray: [],
    areaCountyCode: '',
    areaCountyIndex: 0,
    address: '',
    value: '',
  },
  onShow() {
    this.onReload();
  },
  async onReload() {
  dd.showLoading({content: '加载中',});
  await this.requestOrgType();
  await this.requestIndustry();
  await this.requestUserInfo();
  this.addressInit();
  },
  //省市县初始化
  async addressInit(){
    await this.requestArea();
    if(this.data.userInfo.provinceId != undefined && this.data.userInfo.provinceId != ""){
    await this.requestCity( this.data.userInfo.provinceId);
    var areaProArray=this.data.areaProArray;
    var user=this.data.userInfo;
    for(var i=0;i<areaProArray.length;i++){
      if(areaProArray[i].code == user.provinceId ){
        this.setData({
            areaProIndex: i,
            areaProCode : user.provinceId,
            value: [i],
            })
        area=areaProArray[i].name;
       }
      }
    await this.requestCounty(this.data.userInfo.cityId);
    var areaCityArray=this.data.areaCityArray;
    var areaCountyArray=this.data.areaCountyArray;
    for(var i=0;i<areaCityArray.length;i++){
      if(areaCityArray[i].code == user.cityId ){
        var value=this.data.value.concat(i);
      this.setData({
        areaCityIndex: i,
        areaCityCode:user.cityId,
        value:value,
        })
        area += areaCityArray[i].name;               
      }
    }
    for(var i=0;i<areaCountyArray.length;i++){
      if(areaCountyArray[i].code == user.countyId ){
        var value=this.data.value.concat(i);
      this.setData({
        areaCountyIndex: i,
        areaCountyCode: user.countyId,
        value:value,
        })
        area += areaCountyArray[i].name;                   
      }
    }
    }else{
    await this.requestCity( this.data.areaProArray[0].code);
    await this.requestCounty(this.data.areaCityArray[0].code);
  }
  this.setData({
      area:area,
    })
  areaProIndex=this.data.areaProIndex;
  areaCityIndex=this.data.areaCityIndex;
  areaCountyIndex=this.data.areaCountyIndex;
  oldValue=this.data.value;
  dd.hideLoading();
},
//省
requestArea(){
    return new Promise((resolve, reject) => {
    http.request({
      url: 'area/selectAreaByPCode?code=',
      success: (res) => {
          this.setData({
            areaProArray: res,
          });
          resolve(res);
      }
    });
  })
  },
  //市
  requestCity(code){
    return new Promise((resolve, reject) => {
      http.request({
        url: 'area/selectAreaByPCode?code='+code,
        success: (res) => {
          this.setData({
            areaCityArray: res,
          });  
          resolve(res); 
        }
      });
    });
  },
  //区
  requestCounty(code){
    return new Promise((resolve, reject) => {
      http.request({
        url: 'area/selectAreaByPCode?code='+code,
        success: (res) => {
          this.setData({
          areaCountyArray: res,
          });  
          resolve(res); 
        }
      });
    });
  },

  //请求机构类型缓存
  requestOrgType(){
    return new Promise((resolve, reject) => {
     http.request({
      url: '/dict/getDictListByCode',
      method: 'GET',
      data: {'code':'org_type'},
      success: (res) => {
         this.setData({
            arrOrgType: res,
         })
        resolve(res); 
      }
      })
    })
  },
  //请求所属行业缓存
  requestIndustry(){
    return new Promise((resolve, reject) => {
      http.request({
      url: '/dict/getDictListByCode',
      method: 'GET',
      data: {'code':'industry'},
      success: (res) => {
         this.setData({
            arrIndustry: res,
          })
        resolve(res);  
        }
      })
    })
  },
  // 请求会员信息
  requestUserInfo(){
    let that=this;
    return new Promise((resolve, reject) => {
     http.request({
      url: 'memberUserInfo/findInfo',
      method: 'POST',
      success: (res) => {
          var user= res;
          resolve(res); 
         if(user.orgType != null){
            for(var i=0;i<that.data.arrOrgType.length;i++){
              if(that.data.arrOrgType[i].id == user.orgType){
                  arrOrgTypeIndex = i;
              }
            }
          }else{
            arrOrgTypeIndex=0;
          }

          if(user.industry != null){
            for(var i=0;i<that.data.arrIndustry.length;i++){
              if(that.data.arrIndustry[i].id == user.industry){
                  arrIndustryIndex = i;
              }
            }
          }else{
            arrIndustryIndex=0;
          }
          
          
          if(user.establishDate == null){
            currentDate='2000-10-10'
          }else{
            currentDate =user.establishDate
          }
          that.setData({
                userInfo: res,
                arrOrgTypeIndex: arrOrgTypeIndex,
                arrIndustryIndex: arrIndustryIndex,
                currentDate: currentDate,
          })
        }
      })

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
    });
  },
  //机构类型
  bindOrgPickerChange(e) {
    this.setData({
      arrOrgTypeIndex: e.detail.value,
    });
  },
  //所属行业
   bindObiPickerChange(e) {
    this.setData({
    arrIndustryIndex: e.detail.value,
    });
  },
});
