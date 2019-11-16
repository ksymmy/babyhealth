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

  },
  /*Ding操作*/
  handleDingItemTap(e) {
    dd.createDing({
      users: ["manager9778","145747316320902437","294118325321603293","012224366432353450"], //默认选中用户工号列表；类型: Array<String>
      corpId: "dinge3e211ad45c983df35c2f4657eb6378f", // 类型: String
      alertType: 0, // 钉发送方式 0:电话, 1:短信, 2：应用内；类型 Number
      alertDate: { "format": "yyyy-MM-dd HH:mm", "value": "2019-08-29 08:25" }, // 非必选，定时发送时间, 非定时DING不需要填写
      type: 1,// 附件类型 1：image, 2：link；类型: Number
      text: '1465jkh',  // 正文
      bizType: 0, // 业务类型 0：通知DING；1：任务；2：会议；
      success: function(res) {
        console.log('success')
      },
      fail: function(err) {
        console.log(err)
      }
    })
  }

})