import msglist from '/util/msglist';
import { HTTP } from '/util/http.js';
import { config } from '/app.js';
let http = new HTTP(), page = 1;
Page({
  ...msglist,
  data: {
    listData: {
      list: [
      //   {
      //   name: '任慕瑶',
      //   sex: 0,
      //   birthday: '2019-06-30',
      //   age: '3月龄',
      //   textTime: '2019-09-30',
      //   overTime: 14,
      //   dingNum: 3
      // }
      ],
      // type: 3 //封装列表页面展示类型，1为明日体检列表，2为改期列表，3为逾期列表
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
    inputValue: '',
    age: '',
    year: ''
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
  onShow() {
    page = 1;
    this.setData({
      duesrecs: []
    })
    this.onRequest();
  },
  onSearch: function() {
    page = 1;
    this.setData({
      ['listData.list']: [],
    });
    this.onRequest();
  },
  onRequest() {
    let that = this;
    http.request({
      url: "baby/allbabyslist",
      method: 'post',
      data: JSON.stringify({
        param: {
          name: that.data.inputValue,
          age: that.data.age,
          year: that.data.year,
        },
        page: page,
        size: config.pageSize,
      }),
      success: (res) => {
        if (res.length == 0) {
          return
        }
        page++;
        var data = that.data.listData.list;
        data = data.concat(res);
        var listIndex = 'listData.list';
        that.setData({
          [listIndex]: data,
        });

        console.log(that)

      },
      fail: function(res) {
        dd.alert({ content: JSON.stringify(res), buttonText: '好的' });
      }
    })
  },
  bindKeyInput(e) {
    this.setData({
      inputValue: e.detail.value,
    });
  },
  //上方tab选项切换
  handleTopTabClick(index, value) {
    this.setData({
      topActiveTab: index,
      [index ? 'age' : 'year']: ''
    });
  },
  //上方tab选项切换
  handleTopTabChange(index, value) {
    this.setData({
      topActiveTab: index,
      [index ? 'age' : 'year']: ''
    });
  },
  //下方tab选项切换
  handleTabClick(index, value) {
    var newIndex = 'activeTab[' + this.data.topActiveTab + ']'
    this.setData({
      [newIndex]: index,
    });
    console.log(value)
    if (!isNaN(value.title)) {//年份
      this.setData({
        ['age']: '',
        ['year']: value.value
      })
    } else {
      this.setData({
        ['age']: value.value,
        ['year']: ''
      })
    }
    this.onSearch();
  },
  //下方tab选项切换
  handleTabChange(index, value) {
    var newIndex = 'activeTab[' + this.data.topActiveTab + ']'
    this.setData({
      [newIndex]: index,
    });
    console.log(value)
    if (!isNaN(value.title)) {//年份
      this.setData({
        ['age']: '',
        ['year']: value.value
      })
    } else {
      this.setData({
        ['age']: value.value,
        ['year']: ''
      })
    }
    this.onSearch();
  },
})