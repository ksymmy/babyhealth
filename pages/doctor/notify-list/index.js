import msglist from '/util/msglist';
import {HTTP} from '/util/http.js';

let http = new HTTP();
let timeperiod = {}
var page;
Page({
  ...msglist,
  data: {
    pagesize:10,
    listData: {
      toLower:'toLower',
      delayOne: 'handleDelay',
      list: [
      //   {
      //   babyId: 1,
      //   name: '任慕瑶',
      //   sex: 0,
      //   birthday: '2019-06-30',
      //   age: '3月龄',
      //   textTime: '2019-09-30'
      // },
      // {
      //   babyId: 2,
      //   name: '任慕瑶',
      //   sex: 0,
      //   birthday: '2019-04-04',
      //   age: '6月龄',
      //   textTime: '2019-10-04'
      // },
      // {
      //   babyId: 3,
      //   name: '袁明轩',
      //   sex: 1,
      //   birthday: '2019-07-04',
      //   age: '3月龄',
      //   textTime: '2019-10-04'
      // },
      // {
      //   babyId: 4,
      //   name: '袁明轩',
      //   sex: 1,
      //   birthday: '2019-07-04',
      //   age: '3月龄',
      //   textTime: '2019-10-04'
      // }
      ],
      type: 1 //封装列表页面展示类型，1为明日体检列表，2为改期列表，3为逾期列表
    }

  },
  onRequest(page){
    let that = this;
    console.log("||||||||||||||||")
    console.log(timeperiod)
    http.request({
      url:"baby/tomorrowexaminationbabyslist",
      method:'POST',
      data:JSON.stringify({
        "param":timeperiod,"page":page,"size":10
      }),
      success:function(res){
        
        var newData,result_data,newpagesize,add_size;
        newData=[]
        console.log(res)
        for(var key in res){
            newData.push(res[key])
            // newData.push(res[key])
            // newData.push(res[key])
            // newData.push(res[key])
            // newData.push(res[key])
            // newData.push(res[key])
            // newData.push(res[key])
            // newData.push(res[key])
            // newData.push(res[key])
            // newData.push(res[key])
        }
        if(page===1){
          add_size=0
          result_data=newData
        }else{
          var oldData = that.data.listData.list;
          add_size=10
          result_data = oldData.concat(newData)
        }
        newpagesize = that.data.pagesize+add_size
        page++
        that.setData({
          'listData.list':result_data,
          'pagesize':newpagesize
        })
      }
    })
  },
  onLoad(){
    page=1
    this.onRequest(page)
  },
  toLower(e){

    let that = this;
    this.onRequest(page);
  },
  //延后一天操作
  handleDelay(e) {
    let that = this
    let examid = e.currentTarget.dataset.id
    
    // dd.showToast({
    //   content: `${e.currentTarget.dataset.id}`,
    //   success: (res) => {

    //   },
    // });
    http.request({
    // url:"baby/delayoneday",
    url:"baby/delayoneday?examId="+examid,
    method:'POST',
    // data:JSON.stringify({
    //   "examId":examid
    // }),
    success:function(res){
      dd.showToast({
        content: '已延后',
        duration:'1000',
        success:function(res){
        },
        fail:function(res){
        },
        complete:function(res){
          dd.hideToast()
        }
      })
      page=1
      that.onRequest(page)
    },
    complete:function(res){
    }
  })

      
    
    
  }
})