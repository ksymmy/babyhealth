import msglist from '/util/msglist';
import { HTTP } from '/util/http.js';
let http = new HTTP();
var timeperiod;
var page;
var _my$getSystemInfoSync = my.getSystemInfoSync(),
  windowHeight = _my$getSystemInfoSync.windowHeight;
var scrollHeight = windowHeight - 160;

Page({
  ...msglist,
  data: {
    pagesize: 10,
    //展示数据，请求时更改
    listData: {
      toLower: 'toLower',
      pageHeight: 1200,
      scrollHeight: 0,
      list: [],
      dataFinish: false,//数据加载完全
      noDataState: false,//无数据状态
      loadingState: false,//加载状态
      type: 3 //封装列表页面展示类型，1为明日体检列表，2为改期列表，3为逾期列表
    },
    //tab选项内容，badgeText为数字，没有请无需加badgeType，badgeText
    tabs: [
      {
        title: '全部',
        value: '',
        // badgeType: 'text',
        // badgeText: '22',
      },
      {
        title: '满月',
        value: 1,
        // badgeType: 'text',
        // badgeText: '5',
      },
      {
        title: '3月',
        value: 3,
        // badgeType: 'text',
        // badgeText: '6',
      },
      {
        title: '6月',
        value: 6,
        // badgeType: 'text',
        // badgeText: '3',
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
    ],
    popList: [{ title: 'DING 0 次', value: 0 }, { title: 'DING 1 次', value: 1 }, { title: 'DING 2 次', value: 2 }, { title: '3次及以上', value: 3 }, { title: '全部', value: '' }],//筛选条件
    activeTab: 0,//当前选中tab序号
    position: 'bottomRight',//弹出方向
    popshow: false,//弹出
    showMask: true,//遮罩层
  },
  firstRequest() {
    let that = this;
    let len = 0;
    this.setData({
      'listData.loadingState': true
    })
    http.request({
      url: "baby/overduelist",
      method: 'POST',
      data: JSON.stringify({
        "param": timeperiod, "page": 1, "size": 10
      }),
      success: function(res) {
        page = 1;
        len = res.length;
        if (len == 0) {
          that.setData({
            'listData.noDataState': true,
            'listData.pageHeight': scrollHeight,
            'listData.dataFinish': false,
            'listData.loadingState': false
          })
          return
        } else if (len < that.data.pagesize) {
          that.setData({
            'listData.pageHeight': 135 * len,
            'listData.dataFinish': true,
            'listData.noDataState': false
          })

        }

        var all_data
        all_data = []
        for (var key in res) {
          all_data.push(res[key])
        }
        that.setData({
          'listData.list': all_data,
          'listData.loadingState': false
        })
      }
    })


  },
  onLoad(query) {
    var overduestart = query.overduestart,overdueend = query.overdueend;
    var that = this;
    var url_data
    if(String(overdueend)==="undefined"){
      url_data = "overdueStart="+overduestart
    }else{
      url_data = "overdueStart="+overduestart+"&overdueEnd="+overdueend
    }
    http.request({
      url:'baby/overduelistcount?'+url_data,
      method:"GET",
      // data:JSON.stringify({
      //   "overdueStart":overduestart,"overdueEnd":overdueend
      // }),
      success:function(res){
        let new_data = []
        let old_data = that.data["tabs"]
        let item_index = 0
        for (var old_data_item_key in that.data["tabs"]){
          item_index++
          var all_num=0;
          for(var new_data_item_key in res){
            if(old_data[old_data_item_key]['value']===res[new_data_item_key].examinationType&&String(old_data[old_data_item_key]['value'])!==""){
            old_data[old_data_item_key]["badgeType"]="text"
            old_data[old_data_item_key]["badgeText"]=res[new_data_item_key]["cnt"]
            }else if(String(old_data[old_data_item_key]['value'])===""){
              all_num = all_num + res[new_data_item_key]["cnt"]

            }
          }
          if(String(old_data[old_data_item_key].value)==""&&all_num!==0){
            old_data[old_data_item_key]["badgeType"]="text"
            old_data[old_data_item_key]["badgeText"]=all_num
          }
        }
        that.setData({
          "tabs":old_data
        })
      }
    })
    let titleStr = "逾期 "
    if (!isNaN(overdueend)) {
      titleStr += overduestart + "~" + overdueend + " 天"

    } else {
      titleStr += overduestart + " 天以上"
    }
    dd.setNavigationBar({
      title: titleStr
    });

    this.setData({
      'listData.scrollHeight': scrollHeight,
      'listData.pageHeight': 135 * this.data.pagesize,
    })

    if (overdueend == "undefined" && overduestart != "undefined") {
      timeperiod = { "overdueStart": overduestart }
    } else if (overdueend != "undefined" && overduestart != "undefined") {
      // console.log('fffffffffffff')
      timeperiod = { "overdueStart": overduestart, "overdueEnd": overdueend }
    }
    // console.log(timeperiod)
    this.firstRequest()
  },
  onRequest() {
    let that = this;
    page++;
    this.setData({
      'listData.loadingState': true
    })
    http.request({
      url: "baby/overduelist",
      method: "POST",
      data: JSON.stringify({
        "param": timeperiod, "page": page, "size": 10
      }),
      success: function(res) {
        page++
        if (res.length < that.data.pagesize) {
          that.setData({
            'listData.dataFinish': true,
          })
        }
        var newData, result_data, newpagesize;
        newData = []
        for (var key in res) {
          newData.push(res[key])
        }
        var oldData = that.data.listData.list;
        newpagesize = that.data.pagesize + 10
        result_data = oldData.concat(newData)
        that.setData({
          'listData.loadingState': false,
          'listData.list': result_data
          // 'pagesize':newpagesize
        })
      }
    })
  },
  toLower(e) {
    let that = this;
    this.onRequest();
  },
  //tab选项切换
  handleTabClick(index, value) {
    timeperiod["examinationType"] = value.value
    this.firstRequest()
    this.setData({
      activeTab: index,
    });
  },
  //tab选项切换
  handleTabChange(index, value) {
    timeperiod["examinationType"] = value.value
    this.firstRequest()
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
    timeperiod["dingTimes"] = chooseNum
    if (String(chooseNum) === "") {
      delete timeperiod["dingTimes"];
    }
    this.setData({
      popshow: false,
    });
    this.firstRequest()


  },
  //全部ding
  allDing() {
    console.log("111")
  }
})