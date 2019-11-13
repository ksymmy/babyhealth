import msglist from '/util/msglist';
Page({
  ...msglist,
  data: {
    listData: {
      delayOne: 'handleDelay',
      list: [{
        babyId: 1,
        name: '任慕瑶',
        sex: 0,
        birthday: '2019-06-30',
        age: '3月龄',
        textTime: '2019-09-30'
      },
      {
        babyId: 2,
        name: '任慕瑶',
        sex: 0,
        birthday: '2019-04-04',
        age: '6月龄',
        textTime: '2019-10-04'
      },
      {
        babyId: 3,
        name: '袁明轩',
        sex: 1,
        birthday: '2019-07-04',
        age: '3月龄',
        textTime: '2019-10-04'
      },
      {
        babyId: 4,
        name: '袁明轩',
        sex: 1,
        birthday: '2019-07-04',
        age: '3月龄',
        textTime: '2019-10-04'
      }],
      type: 1 //封装列表页面展示类型，1为明日体检列表，2为改期列表，3为逾期列表
    }

  },
  //延后一天操作
  handleDelay(e) {
    console.log('dssd')
    dd.showToast({
      content: `${e.currentTarget.dataset.babyid}`,
      success: (res) => {

      },
    });
  }
})