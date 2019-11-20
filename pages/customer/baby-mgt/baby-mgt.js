import { HTTP } from '/util/http.js';
let http = new HTTP();
Page({
  data: {
      curBaby:'0',//当前选中宝宝
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
    dd.navigateTo({
      url: '../baby-info/baby-info'
    });
  },
  del(e){//删除baby
    dd.confirm({
      title: '温馨提示',
      content: '确认删除宝宝信息吗？',
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      success: (result) => {
        http.request({
          url: "baby/delBaby?babyId="+ e.target.dataset.val,
          method: 'post',
          success: (res) => {
              this.onRequest();
          },
          fail: function(res) {
            // dd.alert({ content: JSON.stringify(res), buttonText: '好的' });
          }
        })
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
          // that.setData({
          //   babyList: res
          // })
      },
      fail: function(res) {
        // dd.alert({ content: JSON.stringify(res), buttonText: '好的' });
      }
    })
  },


});