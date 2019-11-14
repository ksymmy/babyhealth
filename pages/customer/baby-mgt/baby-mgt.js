Page({
  data: {
      curBaby:'0',//当前选中宝宝
      babyList:[
        {
          name:'张子萱',
          sex:2,//1-男，2-女
          birthday:'2018-04-30',
          signIn:[1,1,1,0,1,0,0,0,0],
          fatherName:'张一明',
          fatherTel:'15300001699'
        },
        {
          name:'张子墨',
          sex:1,//1-男，2-女
          birthday:'2018-09-30',
          signIn:[1,1,1,1,1,1,1,0,0],
          fatherName:'张一明',
          fatherTel:'15300001699'
        }
      ]

  },
  onLoad(query) {
    // 页面加载
    
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
  del(){//删除baby
      //后台删除，重新赋值babyList，自动渲染页面
  }


});