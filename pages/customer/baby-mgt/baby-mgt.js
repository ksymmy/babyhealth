import { HTTP } from '/util/http.js';
let http = new HTTP();
Page({
  data: {
      curBaby:'0',//当前选中宝宝
      parentName:"", // 当前人姓名
      parentMobile:"", // 当前人手机号
      babyList:[]
  },
  onLoad(query) {
    
    
  },
  changeBaby(event){//baby信息切换
    this.setData({
      curBaby: event.target.dataset.index
    })
      //console.log(event.target.dataset.index);
  },
  addBaby(){
    console.log(11111);
    var fatherName = e.target.dataset.fatherName;
    var fatherMobile = e.target.dataset.fatherMobile;
    var motherName = e.target.dataset.motherName;
    var motherMobile = e.target.dataset.motherMobile; 
    if (fatherName == null || fatherName == '') {
      fatherName = parentName;
    }
    if (fatherMobile == null || fatherMobile == '') {
      fatherMobile = parentMobile;
    }
    if (motherName == null || motherName == '') {
      motherName = parentName;
    }
    if (motherMobile == null || motherMobile == '') {
      motherMobile = parentMobile;
    }
    var url = '../baby-info/baby-info?fatherName=' + fatherName + '&fatherMobile=' + fatherMobile + '&motherName=' + motherName + '&motherMobile=' + motherMobile;
    console.log(url);
    dd.navigateTo({
      url: url
    });
  },
  del(e){//删除baby
    dd.confirm({
      title: '温馨提示',
      content: '确认删除宝宝信息吗?',
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      success: (result) => {
        if (result.confirm){
          http.request({
            url: "baby/delBaby?babyId="+ e.target.dataset.val,
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
  onShow(){
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
            babyList: res.babyList
          })
      },
      fail: function(res) {
        // dd.alert({ content: JSON.stringify(res), buttonText: '好的' });
      }
    })
  },


});