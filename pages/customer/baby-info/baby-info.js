
Page({
  data: {
      name:'',//姓名
      sex:'',//性别
      dateText:'',//日期选择
      fatherName:'',//
      fatherTel:'',
      motherName:'',
      motherTel:'',
      addr:''
  },
  onLoad(query) {
    // 页面加载
    this.setData({//给日期一个默认系统时间
      dateText: this.curDate()//系统默认日期
    })
  },
  saveBaby(){
    dd.navigateBack();
  },
  //系统当前日期
  curDate(){
    var dateObj = new Date(); //表示当前系统时间的Date对象
    var year = dateObj.getFullYear(); //当前系统时间的完整年份值
    var month = dateObj.getMonth()+1; //当前系统时间的月份值
    var date = dateObj.getDate(); //当前系统时间的月份中的日
    return `${year}-${month}-${date}`
  },
  datePicker(){
    dd.datePicker({
        format: 'yyyy-MM-dd',
        currentDate: this.curDate(),
        success: (res) => {
          if(res.error){//用户取消操作
            this.setData({
              dateText: this.curDate()
            })
          }else{           
           this.setData({
              dateText: res.date
           })
          }
          
        }
      });
  }


});