import msglist from '/util/msglist';
import {HTTP} from '/util/http.js';
let http = new HTTP();
Page({
  ...msglist,
  data: {
    //展示数据，请求时更改
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
      },
      {
        name: '袁明轩',
        sex: 1,
        birthday: '2019-07-04',
        age: '3月龄',
        textTime: '2019-10-04',
        overTime: 14,
        dingNum: 0
      },
      {
        name: '袁明轩',
        sex: 1,
        birthday: '2019-07-04',
        age: '3月龄',
        textTime: '2019-10-04',
        overTime: 14,
        dingNum: 0
      },
      {
        name: '袁明轩',
        sex: 1,
        birthday: '2019-07-04',
        age: '3月龄',
        textTime: '2019-10-04',
        overTime: 14,
        dingNum: 0
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
    //tab选项内容，badgeText为数字，没有请无需加badgeType，badgeText
    tabs: [
      {
        title: '全部',
        badgeType: 'text',
        badgeText: '22',
      },
      {
        title: '满月',
        badgeType: 'text',
        badgeText: '5',
      },
      {
        title: '3月',
        badgeType: 'text',
        badgeText: '6',
      },
      {
        title: '6月',
        badgeType: 'text',
        badgeText: '3',
      },
      { title: '8月' },
      { title: '12月' },
      { title: '18月' },
      { title: '24月' },
      { title: '30月' },
      { title: '36月' }
    ],
    popList: [{ title: 'DING 0 次', value: 0 }, { title: 'DING 1 次', value: 1 }, { title: 'DING 2 次', value: 2 }, { title: '3次及以上', value: 3 },],//筛选条件
    activeTab: 0,//当前选中tab序号
    position: 'bottomRight',//弹出方向
    popshow: false,//弹出
    showMask: true,//遮罩层
  },
  onLoad(query){
    var overduestart = query.overduestart,
        overdueend = query.overdueend;
    var that = this;
    var timeperiod;
    if(overdueend=="undefined"&&overduestart!="undefined"){
      timeperiod={"overdueStart":overduestart}
    }else if(overdueend!="undefined"&&overduestart!="undefined"){
      // console.log('fffffffffffff')
      timeperiod={"overdueStart":overduestart,"overdueEnd":overdueend}
    }
    // console.log(timeperiod)
    http.request({
      url:"baby/overduelist",
      method:'POST',
      data:JSON.stringify({
        "param":timeperiod,"page":1,"size":10
      }),
      success:function(res){
        console.log(res)
        var all_data
        all_data = []
        for(var key in res){
            all_data.push(res[key])
        }
        that.setData({
          // 'listData.list':all_data
        })
      }
    })
  },
  //tab选项切换
  handleTabClick({ index }) {
    console.log(index)
    this.setData({
      activeTab: index,
    });
  },
  //tab选项切换
  handleTabChange({ index }) {
    console.log("8888888888888888888")
    this.setData({
      activeTab: index,
    });
  },
  //筛选点击
  handlePlusClick() {
    this.setData({
      popshow: !this.data.popshow,
    });
  },

  //遮罩层关闭
  onMaskClick() {
    this.setData({
      popshow: false,
    });
  },
  //筛选条件点击
  onPopClick({ chooseNum }) {
    this.setData({
      popshow: false,
    });
    console.log(chooseNum)
  },
  //全部ding
  allDing() {
    console.log("111")
  }
})