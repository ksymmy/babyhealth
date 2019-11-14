// import lodash from 'lodash';
// import custlist from '/components/custlist';

Page({
  data: {
      dateText:''
  },
  onLoad(query) {
    // 页面加载
    this.setData({
      dateText: this.curDate()+' '+this.weekDay(new Date())//系统默认日期
    })
  },
  //系统当前日期
  curDate(){
    var dateObj = new Date(); //表示当前系统时间的Date对象
    var year = dateObj.getFullYear(); //当前系统时间的完整年份值
    var month = dateObj.getMonth()+1; //当前系统时间的月份值
    var date = dateObj.getDate(); //当前系统时间的月份中的日
    return `${year}-${month}-${date}`
  },
  //日期对应的星期
  weekDay(val){
     var dateObj = new Date(val); //选择日期对象
      var day = dateObj.getDay(); //选择日期中的星期值
     var weeks = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
     var week = weeks[day]; //根据星期值，从数组中获取对应的星期字符串
     return week;
  },
  //日期选择
  datePicker(){
      dd.datePicker({
        format: 'yyyy-MM-dd',
        currentDate: this.curDate(),
        success: (res) => {
          if(res.error){//用户取消操作
            this.setData({
                dateText: this.curDate()+' '+this.weekDay(new Date())//系统默认日期
            })
          }else{           
           this.setData({
              dateText: res.date+' '+this.weekDay(res.date)
           })
          }
          
        }
      });
  },
  saveApply(){
    dd.navigateBack({
      url: '../index/index'
    });
  }


});