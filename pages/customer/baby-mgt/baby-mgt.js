import { HTTP } from '/util/http.js';
let http = new HTTP();
Page({
  data: {
    curBaby: '0',//当前选中宝宝
    parentName: '', // 当前人姓名
    parentMobile: '', // 当前人手机号
    address: '',
    type: '',//0-从宝宝管理按钮进入，1-从家长关系查询页面中进入
    babyList: [],
    sex: 0//家长性别0-爸爸，1-妈妈
  },
  onLoad(e) {
    this.setData({
      type: e.type,
    })
  },
  changeBaby(event) {//baby信息切换
    this.setData({
      curBaby: event.target.dataset.index
    })
    //console.log(event.target.dataset.index);
  },
  addBaby(e) {
    var targetData = e.target.dataset.val;
    // var fatherName = targetData && targetData.fatherName ? targetData.fatherName : '';
    // var fatherMobile = targetData && targetData.fatherMobile ? targetData.fatherMobile : '';
    // var motherName = targetData && targetData.motherName ? targetData.motherName : '';
    // var motherMobile = targetData && targetData.motherMobile ? targetData.motherMobile : '';
    var address = targetData && targetData.address ? targetData.address : '';
    var fatherName = '';
    var fatherMobile = '';
    var motherName = '';
    var motherMobile = '';
    if (this.data.sex == 0) {
      fatherName = this.data.parentName;
      fatherMobile = this.data.parentMobile;
    } else {
      motherName = this.data.parentName;
      motherMobile = this.data.parentMobile;
    }
    // if (fatherName == null || fatherName == '') {
    //   fatherName = this.data.parentName;
    // }
    // if (fatherMobile == null || fatherMobile == '') {
    //   fatherMobile = this.data.parentMobile;
    // }
    // if (motherName == null || motherName == '') {
    //   motherName = this.data.parentName;
    // }
    // if (motherMobile == null || motherMobile == '') {
    //   motherMobile = this.data.parentMobile;
    // }
    var url = '../baby-info/baby-info?fatherName=' + fatherName + '&fatherMobile=' + fatherMobile + '&motherName=' + motherName + '&motherMobile=' + motherMobile + "&address=" + address;
    dd.navigateTo({
      url: url
    });
  },
  del(e) {//删除baby
    dd.confirm({
      title: '温馨提示',
      content: '确认删除宝宝信息吗?',
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      success: (result) => {
        if (result.confirm) {
          http.request({
            url: "baby/delBaby?babyId=" + e.target.dataset.val,
            method: 'post',
            success: (res) => {
              dd.showToast({
                type: 'success',
                content: '删除成功',
                duration: 1000,
                success: () => {
                  this.onRequest();
                },
              });
            },
            fail: function(res) {
              // dd.alert({ content: JSON.stringify(res), buttonText: '好的' });
            }
          })
        }
      },
    });

  },
  onShow() {
    // 页面加载
    this.onRequest();
  },
  onRequest() {
    let that = this;
    this.setData({
      'loadingState': true
    })
    http.request({
      url: "baby/myBabys",
      method: 'post',
      success: (res) => {
        this.setData({sex: res.sex})
        that.setData({
          parentName: res.parentName,
          parentMobile: res.parentMobile,
          address: res.address,
          babyList: res.babyList
        })
        //console.log('list===' + JSON.stringify(res.babyList))
        //判断来源并提示
        if (this.data.type == '1' && res.babyList.length != 0) {
          var babyName = '';
          for (var num = 0; num < res.babyList.length; num++) {
            //console.log('baby===' + JSON.stringify(res.babyList[num]))
            babyName = babyName + res.babyList[num].name + '，'
            //console.log('babyName===' + babyName)
          }
          babyName = babyName.substring(0, babyName.length - 1);
          dd.showToast({
            type: 'warn',
            content: '已关联数据：系统已经查询到“' + babyName +'”健康体检信息，已为您自动关联。',
            duration: 3000
          });
        }
      },
      fail: function(res) {
        // dd.alert({ content: JSON.stringify(res), buttonText: '好的' });
      }
    })
  },


});