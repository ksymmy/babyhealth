import { HTTP } from '/util/http.js';
let http = new HTTP();
Page({
  data: {
      name:'',//姓名
      sex:'',//性别
      birthday:'',//日期选择
      fatherName:'',//
      fatherMobile:'',
      motherName:'',
      motherMobile:'',
      address:''
  },
  onLoad(query) {
    // 页面加载
    // this.setData({//给日期一个默认系统时间
    //   dateText: this.curDate()//系统默认日期
    // })
  },
  formSubmit: function(e) {
    if (e.detail.value.name=='') {
      dd.showToast({
          type: 'warn',
          content: '姓名不能为空',
          duration: 2000
      });
      return;
    }
    if (e.detail.value.sex=='') {
      dd.showToast({
          type: 'warn',
          content: '性别不能为空',
          duration: 2000
      });
      return;
    }
    if (e.detail.value.birthday=='') {
      dd.showToast({
          type: 'warn',
          content: '出生日期不能为空',
          duration: 2000
      });
      return;
    }
    if (e.detail.value.fatherName=='') {
      dd.showToast({
          type: 'warn',
          content: '父亲姓名不能为空',
          duration: 2000
      });
      return;
    }
    if (e.detail.value.fatherMobile=='') {
      dd.showToast({
          type: 'warn',
          content: '父亲联系电话不能为空',
          duration: 2000
      });
      return;
    }
    if (e.detail.value.motherName=='') {
      dd.showToast({
          type: 'warn',
          content: '母亲姓名不能为空',
          duration: 2000
      });
      return;
    }
    if (e.detail.value.motherMobile=='') {
      dd.showToast({
          type: 'warn',
          content: '母亲手机号不能为空',
          duration: 2000
      });
      return;
    }
    http.request({
      url: "baby/addBabyInfo",
      method: 'post',
      data: JSON.stringify(e.detail.value),
      success: (res) => {
        dd.showToast({
            type: 'success',
            content: '保存成功',
            duration: 1000,
            success: () => {
              dd.navigateBack(); 
            },
        });
      },
      fail: function(res) {
        // dd.alert({ content: JSON.stringify(res), buttonText: '好的' });
      }
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
  datePicker(){
    dd.datePicker({
        format: 'yyyy-MM-dd',
        currentDate: this.curDate(),
        success: (res) => {
          if(typeof(res.date)!="undefined"){        
            this.setData({
              birthday: res.date
            })
          }
        }
      });
  }


});