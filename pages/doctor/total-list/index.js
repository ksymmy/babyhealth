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
    toptabs: [
      {
        title: '月龄',
        subTabs: [
          {
            title: '全部',
            value: ''
          },
          {
            title: '满月',
            value: 1
          },
          {
            title: '3月',
            value: 3
          },
          {
            title: '6月',
            value: 6
          },
          {
            title: '8月',
            value: 8
          },
          {
            title: '12月',
            value: 12
          },
          {
            title: '18月',
            value: 18
          },
          {
            title: '24月',
            value: 24
          },
          {
            title: '30月',
            value: 30
          },
          {
            title: '36月',
            value: 36
          }
        ]
      },
      {
        title: '年份',
        subTabs: [
          { title: '全部', value: '' },
          { title: '2019', value: 2019 },
          { title: '2018', value: 2018 },
          { title: '2017', value: 2017 },
          { title: '2016', value: 2016 }
        ]
      }
    ],
    topActiveTab: 0,
    activeTab: [0, 0],
  },
  onLoad() {
    /*获取当前年份最近四年*/
    let date = new Date;
    let y = date.getFullYear();
    let tabArr = [{ title: '全部', value: '' }]
    for (let i = 0; i < 4; i++) {
      let k = y - i;
      tabArr.push({ title: '' + k, value: k });
    }
    let newTabs = 'toptabs[1].subTabs';
    this.setData({
      [newTabs]: tabArr,
    });
  },
  //上方tab选项切换
  handleTopTabClick(index, value) {
    this.setData({
      topActiveTab: index,
    });
  },
  //上方tab选项切换
  handleTopTabChange(index, value) {
    this.setData({
      topActiveTab: index,
    });
  },
  //下方tab选项切换
  handleTabClick(index, value) {
    var newIndex = 'activeTab[' + this.data.topActiveTab + ']'
    this.setData({
      [newIndex]: index,
    });
    console.log(value)
  },
  //下方tab选项切换
  handleTabChange(index, value) {
    var newIndex = 'activeTab[' + this.data.topActiveTab + ']'
    this.setData({
      [newIndex]: index,
    });
    console.log(value)
  },
})