import msglist from '/util/msglist';
Page({
  ...msglist,
  data: {
    listData: {
      list: [{
        name: '任慕瑶',
        sex: 0,
        birthday: '2019-06-30',
        age: '3月龄',
        textTime: '2019-09-30',
        overTime: 14,
        dingNum: 3
      },
      {
        name: '任慕瑶',
        sex: 0,
        birthday: '2019-04-04',
        age: '6月龄',
        textTime: '2019-10-04',
        overTime: 14,
        dingNum: 2
      },
      {
        name: '袁明轩',
        sex: 1,
        birthday: '2019-07-04',
        age: '3月龄',
        textTime: '2019-10-04',
        overTime: 14,
        dingNum: 1
      },
      {
        name: '袁明轩',
        sex: 1,
        birthday: '2019-07-04',
        age: '3月龄',
        textTime: '2019-10-04',
        overTime: 14,
        dingNum: 0
      }],
      type: 3 //封装列表页面展示类型，1为明日体检列表，2为改期列表，3为逾期列表
    },
    tabs: [
      {
        title: '全部',
        badgeType: 'text',
        badgeText: '6',
      },
      {
        title: '选项二',
        badgeType: 'dot',
      },
      { title: '3 Tab' },
      { title: '4 Tab' },
      { title: '5 Tab' },
    ],
    activeTab: 2,
  },
   handleTabClick({ index }) {
    this.setData({
      activeTab: index,
    });
  },
  handleTabChange({ index }) {
    this.setData({
      activeTab: index,
    });
  },
  handlePlusClick() {
    my.alert({
      content: 'plus clicked',
    });
  },
})