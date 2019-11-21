import { HTTP } from '/util/http.js';
let http = new HTTP();
Page({
  data: {
    curBaby: '0',//当前选中宝宝
    parentName: "", // 当前人姓名
    parentMobile: "", // 当前人手机号
    address: "",
    babyList: []
  },
  onLoad(query) {


  },
  changeBaby(event) {//baby信息切换
    this.setData({
      curBaby: event.target.dataset.index
    })
    //console.log(event.target.dataset.index);
  },
  addBaby(e) {

    var targetData = e.target.dataset.val;
    var fatherName = targetData ? targetData.fatherName : null;
    var fatherMobile = targetData ? targetData.fatherMobile : null;
    var motherName = targetData ? targetData.motherName : null;
    var motherMobile = targetData ? targetData.motherMobile : null;
    var address = targetData ? targetData.address : null;
    if (fatherName == null || fatherName == '') {
      fatherName = this.data.parentName;
    }
    if (fatherMobile == null || fatherMobile == '') {
      fatherMobile = this.data.parentMobile;
    }
    if (motherName == null || motherName == '') {
      motherName = this.data.parentName;
    }
    if (motherMobile == null || motherMobile == '') {
      motherMobile = this.data.parentMobile;
    }
    if (address == null || address == '') {
      address = this.data.address;
    }
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
        that.setData({
          parentName: res.parentName,
          parentMobile: res.parentMobile,
          address: res.address,
          babyList: res.babyList
        })
      },
      fail: function(res) {
        // dd.alert({ content: JSON.stringify(res), buttonText: '好的' });
      }
    })
  },


});