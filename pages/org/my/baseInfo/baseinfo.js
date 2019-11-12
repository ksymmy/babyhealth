import { HTTP } from '/util/http.js';
let http = new HTTP();

var orgInfo, dataId, dateValue,area,oldValue,
  areaProArray = [], areaProIndex,
  areaCityArray = [], areaCityIndex,
  areaCountyArray = [], areaCountyIndex,
  jglxArray = [], jglxIndex = 0,
  sshyArray = [], sshyIndex = 0;
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
    orgInfo: {},
    dateValue: null,
    isDisabled: "true", //控制页面是否允许维护 0：不允许；1：允许
    hidden: -999,
  }, 
  onLoad(e) {
    if (e.status) {
      this.setData({
        isDisabled: 1
      });
    }
  }, 
  onShow() {
    this.onReload();
  }, 
  async onReload() {
    dd.showLoading({
      content: '加载中',
    });
    orgInfo, 
    // areaProArray = [], areaProIndex = 0,
    //   areaCityArray = [], areaCityIndex = 0,
    //   areaCountyArray = [], areaCountyIndex = 0,
      jglxArray = [], jglxIndex = 0,
      sshyArray = [], sshyIndex = 0;

    // var defaultArea = { id: "", name: "请选择" };
    // areaProArray.push(defaultArea);
    // areaCityArray.push(defaultArea);
    // areaCountyArray.push(defaultArea);
 
    orgInfo = await this.getModel();
    await this.modelReload();
    await this.addressInit();
    // await this.areaProReload();
    // await this.areaCityReload();
    // await this.areaCountyReload();
    dd.hideLoading();
  }, 
  //省市县初始化
  async addressInit(){
    await this.requestArea();
    if(this.data.orgInfo.provinceId != undefined && this.data.orgInfo.provinceId != ""){
    await this.requestCity( this.data.orgInfo.provinceId);
    var areaProArray=this.data.areaProArray;
    var org=this.data.orgInfo;
    for(var i=0;i<areaProArray.length;i++){
      if(areaProArray[i].code == org.provinceId ){
        this.setData({
          areaProIndex: i,
          areaProCode : org.provinceId,
          value: [i],
        })
        area=areaProArray[i].name;
       }
    }
    await this.requestCounty(this.data.orgInfo.cityId);
    var areaCityArray=this.data.areaCityArray;
    var areaCountyArray=this.data.areaCountyArray;
    for(var i=0;i<areaCityArray.length;i++){
      if(areaCityArray[i].code == org.cityId ){
        var value=this.data.value.concat(i);
      this.setData({
        areaCityIndex: i,
        areaCityCode:org.cityId,
        value:value,
        })
        area += areaCityArray[i].name;               
      }
    }
    for(var i=0;i<areaCountyArray.length;i++){
      if(areaCountyArray[i].code == org.countyId ){
        var value=this.data.value.concat(i);
      this.setData({
        areaCountyIndex: i,
        areaCountyCode: org.countyId,
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
    console.log('code=',code);
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

  async addressBack(){
    
    await this.requestCity( this.data.areaProCode);
    await this.requestCounty(this.data.areaCityCode);
    this.setData({
       value:[this.data.areaProIndex,this.data.areaCityIndex,this.data.areaCountyIndex],
     })
  }, 



  getModel() {
    return new Promise((resolve, reject) => {
      console.log("执行实体查询");
      //获取表单信息
      http.request({
        url: 'orgInfoController/selectOrgInfo',
        success: (res) => {
          this.setData({
            orgInfo: res,
          });
          console.log(res);
          resolve(res);
        }
      });
    });
  }, 
  modelReload() {
    return new Promise((resolve, reject) => {
      console.log("执行数据绑定");
      if (orgInfo != null && orgInfo.establishDateStr != null) {
        dateValue = orgInfo.establishDateStr;
        this.setData({
          dateValue: orgInfo.establishDateStr
        });
      }
      //获取机构类型
      http.request({
        url: 'dict/getDictListByCode?code=org_type',
        success: (res) => {
          jglxArray = [];
          for (var i = 0; i < res.length; i++) {
            var row = res[i];
            if (orgInfo != null && orgInfo.orgType != null) {
              if (row.id == orgInfo.orgType) {
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
            if (orgInfo != null && orgInfo.industry != null) {
              if (row.id == orgInfo.industry) {
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
      resolve(null);
    });
  }, 
  areaProReload() {
    return new Promise((resolve, reject) => {
      console.log("执行行政区划省级绑定划绑定");
      http.request({
        url: 'area/selectAreaByPCode?code=',
        success: (res) => {
          for (var i = 0; i < res.length; i++) {
            var row = res[i];
            if (orgInfo != null && (orgInfo.provinceId != null && orgInfo.provinceId != "")) {
              if (row.code == orgInfo.provinceId) {
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
          resolve(res);
        }
      });
    });
  }, 
  areaCityReload() {
    return new Promise((resolve, reject) => {
      console.log("执行行政区划市级绑定划绑定");
      if (orgInfo != null && (orgInfo.provinceId != null && orgInfo.provinceId != "")) {
        //行政区划-市级
        http.request({
          url: 'area/selectAreaByPCode?code=' + orgInfo.provinceId,
          success: (res) => {
            for (var i = 0; i < res.length; i++) {
              var row = res[i];
              if (orgInfo != null && orgInfo.cityId != null) {
                if (row.code == orgInfo.cityId) {
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
  }, 
  // areaCountyReload() {
  //   return new Promise((resolve, reject) => {
  //     console.log("执行行政区划县区绑定划绑定");
  //     if (orgInfo != null && (orgInfo.cityId != null && orgInfo.cityId != "")) {
  //       //行政区划-县区
  //       http.request({
  //         url: 'area/selectAreaByPCode?code=' + orgInfo.cityId,
  //         success: (res) => {
  //           for (var i = 0; i < res.length; i++) {
  //             var row = res[i];
  //             if (orgInfo != null && orgInfo.cityId != null) {
  //               if (row.code == orgInfo.countyId) {
  //                 areaCountyIndex = i + 1;
  //               }
  //             }
  //             var aa = { id: row.code, name: row.name };
  //             areaCountyArray.push(aa);
  //           }
  //           this.setData({
  //             areaCountyArray: areaCountyArray,
  //             areaCountyIndex: areaCountyIndex,
  //           });
  //           resolve(null);
  //         }
  //       });
  //     } else {
  //       this.setData({
  //         areaCountyArray: areaCountyArray,
  //         areaCountyIndex: areaCountyIndex,
  //       });
  //       resolve(null);
  //     }
  //   });
  // },
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
  // bindareaProChange(e) {
  //   areaCityArray = [];
  //   areaCountyArray = [];
  //   var defaultArea = { id: "", name: "请选择" };
  //   areaCityArray.push(defaultArea);
  //   areaCountyArray.push(defaultArea);
  //   var code = this.data.areaProArray[e.detail.value].id;
  //   console.log('picker发送选择改变，携带值为', e.detail.value);
  //   //行政区划
  //   if (e.detail.value == "") {
  //     this.setData({
  //       areaProIndex: e.detail.value,
  //       areaCityArray: areaCityArray,
  //       areaCityIndex: 0,
  //       areaCountyArray: areaCountyArray,
  //       areaCountyIndex: 0,
  //     });
  //   } else {
  //     http.request({
  //       url: 'area/selectAreaByPCode?code=' + code,
  //       success: (res) => {
  //         for (var i = 0; i < res.length; i++) {
  //           var row = res[i];
  //           var aa = { id: row.code, name: row.name };
  //           areaCityArray.push(aa);
  //         }
  //         this.setData({
  //           areaProIndex: e.detail.value,
  //           areaCityArray: areaCityArray,
  //           areaCityIndex: 0,
  //           areaCountyArray: areaCountyArray,
  //           areaCountyIndex: 0,
  //         });
  //       }
  //     });
  //   }

  //   console.log('picker发送选择改变，携带值为', this.data.areaCityArray);
  // },
  //行政区划市级
  // bindareaCityChange(e) {
  //   areaCountyArray = [];
  //   var defaultArea = { id: "", name: "请选择" };
  //   areaCountyArray.push(defaultArea);
  //   var code = this.data.areaCityArray[e.detail.value].id;
  //   //行政区划
  //   if (e.detail.value == "") {
  //     this.setData({
  //       areaCityIndex: e.detail.value,
  //       areaCountyArray: areaCountyArray,
  //       areaCountyIndex: 0
  //     });
  //   } else {
  //     http.request({
  //       url: 'area/selectAreaByPCode?code=' + code,
  //       success: (res) => {
  //         for (var i = 0; i < res.length; i++) {
  //           var row = res[i];
  //           var aa = { id: row.code, name: row.name };
  //           areaCountyArray.push(aa);
  //         }
  //         this.setData({
  //           areaCityIndex: e.detail.value,
  //           areaCountyArray: areaCountyArray,
  //           areaCountyIndex: 0
  //         });
  //       }
  //     });
  //   }
  //   console.log('picker发送选择改变，携带值为', this.data.areaCityArray);
  // },
  // bindareaCountyChange(e) {
  //   this.setData({
  //     areaCountyIndex: e.detail.value
  //   });
  // },

  //显示与隐藏地址选择框
  adressOnShow(e){
    console.log('e:',e);
    if(this.data.isDisabled){
      return;
    }
   if(e.target.dataset.state == "0"){
     this.setData({
       hidden: 999,
     })
   }else if(e.target.dataset.state == "1"){
     this.setData({
       hidden: -999,
     })
     this.addressBack();
    //  this.setData({
    //    value:[this.data.areaProIndex,this.data.areaCityIndex,this.data.areaCountyIndex],
    //  })
     
   }else{
     if(this.data.areaCountyArray[areaCountyIndex] == undefined){
       this.setData({
        areaProCode: this.data.areaProArray[areaProIndex].code,
        areaProIndex: areaProIndex,
        areaCityCode: this.data.areaCityArray[areaCityIndex].code,
        areaCityIndex: areaCityIndex,
        areaCountyCode: '',
        areaCountyIndex: 0,
        area: this.data.areaProArray[areaProIndex].name+this.data.areaCityArray[areaCityIndex].name,
      })
     }else{
     this.setData({
      areaProCode: this.data.areaProArray[areaProIndex].code,
      areaProIndex: areaProIndex,
      areaCityCode: this.data.areaCityArray[areaCityIndex].code,
      areaCityIndex: areaCityIndex,
      areaCountyCode: this.data.areaCountyArray[areaCountyIndex].code,
      areaCountyIndex: areaCountyIndex,
      area: this.data.areaProArray[areaProIndex].name+this.data.areaCityArray[areaCityIndex].name+this.data.areaCountyArray[areaCountyIndex].name,
     })
     }
     this.setData({
       hidden: -999,
     })
   }
  },

  //改变地址信息
  adressOnChange(e){
    if(e.detail.value[0] != areaProIndex){
      this.onChangePro(e.detail.value[0]);
      areaProIndex = e.detail.value[0];
      return;
    }
    if(e.detail.value[1] != areaCityIndex){
      this.onChangeCity(e.detail.value[1]);
      areaCityIndex=e.detail.value[1];
      return;
    }
     if(e.detail.value[2] != areaCountyIndex){
      areaCountyIndex=e.detail.value[2];
      this.setData({
        value:[areaProIndex,areaCityIndex,e.detail.value[2]]
      })
      return;
    }
  },

  //改变省
  async onChangePro(e){
   await this.requestCity(this.data.areaProArray[e].code);
   await this.requestCounty(this.data.areaCityArray[0].code);
   this.setData({
     value:[e,0,0],
   })
   areaCityIndex=0;
   areaCountyIndex=0;
  },
  //改变市
  async onChangeCity(e){
   await this.requestCounty(this.data.areaCityArray[e].code);
   this.setData({
      value:[areaProIndex,e,0],
      })
      areaCountyIndex=0;
  },


  //成立时间
  chooseDate() {
    if(this.data.isDisabled){
      return;
    }
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
  }, 
  onSubmit(e) {
    if (this.data.isDisabled) {
      this.setData({
        isDisabled: "",
      });
      return false;
    }
    var dataJson = e.detail.value;
    if (!dataJson.creditCode.trim()) {
      dd.showToast({ content: '统一社会信用代码不能为空！', icon: 'false', duration: 2000 });
      return false;
    } else {
      if (dataJson.creditCode.trim().length != 18) {
        dd.showToast({ content: '统一社会信用代码格式错误！', icon: 'false', duration: 2000 });
        return false;
      }
    }

    if (!dataJson.corpName.trim()) {
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

    if (dataJson.postalCode) {
      var postalCodeTest = /^[1-9][0-9]{5}$/.test(dataJson.postalCode);
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

    if (dataJson.phone) {
      //座机
      var telephoneTest = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test(dataJson.phone);
      var phoneTest = /^[1][3,4,5,7,8][0-9]{9}$/.test(dataJson.phone);
      if (!telephoneTest && !phoneTest) {
        dd.showToast({ content: '联系电话格式错误！', icon: 'false', duration: 2000 });
        return false;
      }
    } else {
      dd.showToast({ content: '联系电话不能为空！', icon: 'false', duration: 2000 });
      return false;
    }

    if (dataJson.email) {
      //座机
      var mailTest = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(dataJson.email);
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
      url: 'orgInfoController/saveOrUpdate',
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




