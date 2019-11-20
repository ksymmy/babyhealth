// import lodash from 'lodash';
// import custlist from '/components/custlist';
import { HTTP } from '/util/http.js';
let http = new HTTP();

Page({
  data: {
      name:'',
      examinationType:'',
      examinationId:'',
      dateText:'',
      delayDate:'',
      delayReason:''
  },
  onLoad(query) {
    this.onRequest(query.examinationId);
    // 页面加载
    // this.setData({
    //   dateText: this.curDate()+' '+this.weekDay(new Date())//系统默认日期
    // })
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
          if(typeof(res.date)=="undefined"){//用户取消操作
            this.setData({
              delayDate:'',
              dateText: ''
            })
          }else{           
            this.setData({
              delayDate: res.date,
              dateText: res.date+' '+this.weekDay(res.date)
            })
          }
          
        }
      });
  },
  saveApply(){
    if (this.data.delayDate=='') {
         dd.showToast({
          type: 'warn',
          content: '申请日期不能为空',
          duration: 2000
        });
    } else {
      http.request({
        url: "baby/confirmDelay?examinationId=" + this.data.examinationId+'&delayDate='+this.data.delayDate+'&delayReason='+this.data.delayReason,
        method: 'GET',
        success: (res) => {
           dd.showToast({
            type: 'warn',
            content: '延期成功',
            duration: 2000
          });
          dd.navigateBack({
            url: '../index/index'
          });
        },
        fail: function(res) {
          // dd.alert({ content: JSON.stringify(res), buttonText: '好的' });
        }
      })
      
    }
    
  },
  onRequest(examinationId) {
    let that = this;
    http.request({
      url: "baby/applyDelay?examinationId=" + examinationId,
      method: 'post',
      success: (res) => {
        that.setData({
            name: res.name,
            examinationType: res.examinationType,
            examinationId: res.examinationId
        });
      },
      fail: function(res) {
        // dd.alert({ content: JSON.stringify(res), buttonText: '好的' });
      }
    })
  },


});