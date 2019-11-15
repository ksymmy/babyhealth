import custlist from '/util/custlist';
Page({
  ...custlist,
  data: {
    listData: {
      dingTap: 'handleDingItemTap',
      btnTap: 'handleBtnTapTap',
      list: [
        {
          name: '姓名',
          value: '袁铭轩'
        },
        {
          name: '性别',
          value: '男'
        },
        {
          name: '出生日期',
          value: '2019-06-30'
        },
        {
          name: '体检',
          value: '3月龄'
        },
        {
          name: '体检日期',
          value: '2019-09-30'
        },
        {
          name: '逾期',
          value: '14天'
        },
        {
          name: '父亲',
          value: '袁一明',
          extraText: '15300001699',
          state: {
            value: 0
          }
        }
        ,
        {
          name: '父亲',
          value: '爱美丽',
          extraText: '15300001692',
          state: {
            value: 1
          }
        }
      ],
      btnText: '取消逾期提醒'
    },
  },
  /*取消逾期提醒*/
  handleBtnTapTap(e) {
    dd.createDing({
      users: ["18555116187"], //默认选中用户工号列表；类型: Array<String>
      corpId: "dinge3e211ad45c983df35c2f4657eb6378f", // 类型: String
     alertType: 2, // 钉发送方式 0:电话, 1:短信, 2：应用内；类型 Number
    alertDate: {"format":"yyyy-MM-dd HH:mm", "value":"2019-08-29 08:25"}, // 非必选，定时发送时间, 非定时DING不需要填写
    type: 1,// 附件类型 1：image, 2：link；类型: Number
    
    // 非必选
    // 附件信息
    attachment: {
       images: ["https://www.baidu.com/img/bd_logo1.png?where=super"], // 图片附件, type=1时, 必选；类型: Array<String>
       image: "https://www.baidu.com/img/bd_logo1.png?where=super", // 链接附件, type=2时, 必选；类型: String    
       title: "这是一个测试", // 链接附件, type=2时, 必选；类型: String
       url: "https://www.baidu.com/", // 链接附件, type=2时, 必选；类型 String
       text: "测试发钉成功" // 链接附件, type=2时, 必选；类型: String
    },
    
    text: '',  // 正文
    bizType :0, // 业务类型 0：通知DING；1：任务；2：会议；
   
    // 任务信息
    // bizType=1的时候选填
    taskInfo: {    
       ccUsers: ['100', '101'],// 抄送用户列表, 工号，类型: Array<String>
       deadlineTime: {"format":"yyyy-MM-dd HH:mm", "value":"2015-05-09 08:00"}, // 任务截止时间    
       taskRemind: 30 // 任务提醒时间, 单位分钟；支持参数: 0：不提醒；15：提前15分钟；60：提前1个小时；180：提前3个小时；1440：提前一天；类型: Number
    },
   
    // 日程信息
    // bizType=2的时候选填
    confInfo: {      
       bizSubType: 0,  // 子业务类型如会议: 0:预约会议, 1:预约电话会议, 2:预约视频会议；类型: Number (注: 目前只有会议才有子业务类型)；
       location: '某某会议室', // 会议地点(非必选)，类型: String    
       startTime: {"format":"yyyy-MM-dd HH:mm", "value":"2015-05-09 08:00"},// 会议开始时间  
       endTime: {"format":"yyyy-MM-dd HH:mm", "value":"2015-05-09 08:00"},// 会议结束时间    
       remindMinutes: 30, // 会前提醒。单位分钟；1:不提醒, 0:事件发生时提醒, 5:提前5分钟, 15:提前15分钟, 30:提前30分钟, 60:提前1个小时, 1440:提前一天
       remindType: 2 // 会议提前提醒方式；0:电话, 1:短信, 2:应用内；类型: Number
    },
   
      success: function(res) {
        console.log('success')
      },
      fail: function(err) {
        console.log(err)
      }
    })
  },
  /*Ding操作*/
  handleDingItemTap(e) {

  }

})