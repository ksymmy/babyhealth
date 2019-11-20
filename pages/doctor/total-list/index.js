import msglist from '/util/msglist';
import { HTTP } from '/util/http.js';
import { config } from '/app.js';
let http = new HTTP(), page = 1;
var _my$getSystemInfoSync = my.getSystemInfoSync(), windowHeight = _my$getSystemInfoSync.windowHeight;
var scrollHeight = windowHeight - 160;
Page({
  ...msglist,
  data: {
    listData: {
      toLower: 'toLower',//触底函数
      showDetail: 'cancelManage',//取消儿童管理
      pageHeight: 1200,//scroll-view触底高度
      scrollHeight: 0,//最小scroll-view高度
      dataFinish: false,//数据加载完全
      noDataState: false,//无数据状态
      loadingState: false,//加载状态
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
    topActiveTab: 0,//上方tab选中序号
    activeTab: [0, 0],//下方tab选中序号
    inputValue: '',
    age: '',
    year: '',
    flag: true
  },
  onLoad(param) {
    dd.setNavigationBar({
      title: '总管理人数 (' + param.num + ')'
    });
    let h = 135 * config.pageSize + 10;
    this.setData({
      'listData.scrollHeight': scrollHeight,
      'listData.pageHeight': h
    })
    this.onSearch();
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
  onSearch: function() {
    page = 1;
    this.setData({
      ['listData.noDataState']: false,
      ['listData.dataFinish']: false,
      ['listData.list']: [],
    })
    this.onRequest();
  },
  onRequest() {
    this.setData({
      'flag': false
    })
    var that = this;
    let len = 0;
    this.setData({
      'listData.loadingState': true
    })
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
        let len = res.length;

        if (page == 1) {
          if (len < config.pageSize) {
            let h = 135 * len + 10;
            that.setData({
              'listData.pageHeight': h
            })
          }
          if (len == 0) {
            that.setData({
              'listData.noDataState': true,
              'listData.loadingState': false,
              'listData.pageHeight': scrollHeight
            })
            return
          }
        } else if (len == 0) {
          that.setData({
            'listData.dataFinish': true,
             'listData.loadingState': false
          })
          return
        }
        if (len < config.pageSize) {
          that.setData({
            'listData.dataFinish': true
          })
        }
        page++;
        var data = that.data.listData.list;
        data = data.concat(res);
        var listIndex = 'listData.list';
        that.setData({
          [listIndex]: data,
          'listData.loadingState': false
        });
        dd.hideKeyboard();
      },
      fail: function(res) {
        dd.alert({ content: JSON.stringify(res), buttonText: '好的' });
      },
      complete: function(res) {
        that.setData({
          'flag': true
        });
      }
    })
  },
  bindKeyInput(e) {
    this.setData({
      inputValue: e.detail.value,
    });
  },
  //上方tab选项切换
  handleTopTabClick(e) {
    let index = e.currentTarget.dataset.index;
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
    //index为选择序号，value为选中的值
    var newIndex = 'activeTab[' + this.data.topActiveTab + ']'
    this.setData({
      [newIndex]: index,
    });
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
  /*下拉 */
  toLower(e) {
    console.log('下拉+' + page)
    let that = this;
    if (this.data.flag) {
      this.onRequest();
    }

  },
  cancelManage(e) {
    let baby = e.currentTarget.dataset.val, result = [];
    http.request({
      url: 'baby/babyparentinfo?babyid=' + baby.babyId,
      success: res => {
        result = [
          {
            name: '姓名',
            value: baby.name
          },
          {
            name: '性别',
            value: baby.sex == 1 ? '男' : baby.sex == 2 ? '女' : ''
          },
          {
            name: '出生日期',
            value: baby.birthday
          },
          {
            name: '体检',
            value: baby.age == 1 ? '满月' : baby.age + '月龄'
          },
          {
            name: '体检日期',
            value: baby.textTime
          },
          {
            name: '逾期',
            value: ''
          },
          {
            name: '父亲',
            value: res.fatherName,
            extraText: res.fatherMobile,
            state: {
              value: (res.fatherActive && res.fatherActive == 1) ? 1 : 0
            }
          },
          {
            name: '母亲',
            value: res.motherName,
            extraText: res.motherMobile,
            state: {
              value: (res.motherActive && res.motherActive == 1) ? 1 : 0
            }
          }
        ]
        dd.navigateTo({
          url: `/pages/doctor/cancel-manage/index?babyId=` + baby.babyId + `&list=` + JSON.stringify(result)
        })
      }
    })
  }
})