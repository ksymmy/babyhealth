import msglist from '/util/msglist';
Page({
  ...msglist,
  data: {
    listData: {
      list: [{
        name: '任慕瑶',
        sex: 0,
        birthday: '2019-04-04',
        age: '6月龄',
        textTime: '2019-10-04',
        changeTime: '2019-10-09',
        result: '我家宝宝不在社区，我们下周来进行体检1。'
      },
      {
        name: '袁明轩',
        sex: 1,
        birthday: '2019-06-30',
        age: '3月龄',
        textTime: '2019-09-30',
        changeTime: '2019-10-09',
        result: '我家宝宝不在社区，我们下周来进行体检2。'
      },
      {
        name: '任慕瑶',
        sex: 0,
        birthday: '2019-04-04',
        age: '6月龄',
        textTime: '2019-10-04',
        changeTime: '2019-10-09',
        result: '我家宝宝不在社区，我们下周来进行体检3。'
      },
      {
        name: '袁明轩',
        sex: 1,
        birthday: '2019-06-30',
        age: '3月龄',
        textTime: '2019-09-30',
        changeTime: '2019-10-09',
        result: '我家宝宝不在社区，我们下周来进行体检4。'
      }],
      type: 2  //封装列表页面展示类型，1为明日体检列表，2为改期列表，3为逾期列表
    }

  } 
})