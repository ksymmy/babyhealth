import msglist from '/util/msglist';
import { HTTP } from '/util/http.js';
import ding from '/util/ding.js';
let http = new HTTP();
var timeperiod;
var page;
var onload_if = false
var _my$getSystemInfoSync = my.getSystemInfoSync(),
  windowHeight = _my$getSystemInfoSync.windowHeight;
var scrollHeight = windowHeight - 160;

Page({
  ...msglist,
  data: {
    pagesize: 10,
    //展示数据，请求时更改
    listData: {
      showDetail: 'cancelRemind',
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
          // return
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
  //全部ding
  allDing() {
    // console.log(timeperiod)
    var url_path_data=""
    var item_index=0
    dd.showLoading({
          content: '请稍后...'
        })
    for(var url_key in timeperiod){
      if(item_index){
        url_path_data = url_path_data+"&"+url_key+"="+timeperiod[url_key]
      }else{
        url_path_data = "?"+url_key+"="+timeperiod[url_key]
      }
      item_index++
    }
    http.request({
      url:"baby/overdueDingUserid"+url_path_data,
      method:"GET",
      type:"json",
      // data:JSON.stringify({
      // timeperiod
      // }),
      success: function(res) {
        // console.log(res)
        dd.hideLoading();
        let users = res['users'];
        var text_template
        if (timeperiod.hasOwnProperty("examinationType")){
          text_template="家长你好！宝宝已经到"+timeperiod["examinationType"]+"月龄了，请您明天带上宝宝，到社区服务中心进行"+timeperiod["examinationType"]+"月龄体检，祝宝宝健康成长。"
        }else{
          text_template="家长你好！宝宝已经到体检时间啦，请您明天带上宝宝，到社区服务中心进行体检，祝宝宝健康成长。"
        }
        // console.log(timeperiod)
        var examid_list = res['examIds']
        // console.log("(((((((((((999999999999))))))")
        // http.request({
        //           url:"baby/updatedingtimes?examIds="+examid_list,
        //           method:"POST",
        //           // data:JSON.stringify({
        //           //   examIds:examid_list
        //           // }),
        //           success:function(res){
        //              console.log("&&&&&&&&7777777777777&&&&&&&&&")
        //           }
        //         })
        ding.createDing({
              users,
              corpId: dd.corpId,
              text: text_template,
              success:function(res){
                // console.log("ding success")
                // console.log(res)
                http.request({
                  url:"baby/updatedingtimes?examIds="+examid_list,
                  method:"POST",
                  // data:JSON.stringify({
                  //   examIds:examid_list
                  // }),
                  success:function(res){
                    //  console.log("&&&&&&&&7777777777777&&&&&&&&&")
                  }
                })
              },
              fail:function(res){
                
              }
            });
        // console.log(res)
      }
    })
  },
  cancelRemind(e) {
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
        var test = baby
        dd.navigateTo({
          url: `/pages/doctor/cancel-remind/index?babyId=` + baby.babyId +'&examid='+baby.id+'&examinationtype='+baby.age+ `&list=` + JSON.stringify(result)
        })
      }
    })
  },
  onShow(){
    if (onload_if){
      onload_if = false
      return
    }
    console.log("********88888888888888*********")
    this.firstRequest()
    if(timeperiod.hasOwnProperty("overdueEnd")){
      overdueEnd = timeperiod['overdueEnd']
    }else{
      var overdueEnd
    }
    this.onTapRequest(timeperiod["overdueStart"],overdueEnd)
  },
  onTapRequest(overduestart,overdueend){
    var that = this;
    var url_data
    var referer_list =[
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
    ]
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
        let old_data = referer_list
        let item_index = 0
        for (var old_data_item_key in referer_list){
          item_index++
          var all_num=0;
          var value_if = true
          for(var new_data_item_key in res){
            if(old_data[old_data_item_key]['value']===res[new_data_item_key].examinationType&&String(old_data[old_data_item_key]['value'])!==""){
            value_if = false
            old_data[old_data_item_key]["badgeType"]="text"
            old_data[old_data_item_key]["badgeText"]=res[new_data_item_key]["cnt"]
            }else if(String(old_data[old_data_item_key]['value'])===""){
              all_num = all_num + res[new_data_item_key]["cnt"]
              value_if = false
            }
          }
          
          if(String(old_data[old_data_item_key]["value"])==""&&all_num!==0){
            old_data[old_data_item_key]["badgeType"]="text"
            old_data[old_data_item_key]["badgeText"]=all_num
          }
          if(value_if&&old_data_item_key!=="0"){
            delete old_data[old_data_item_key]
          }
        }
        var result_tab = []
        for(var delete_item in old_data){
          // console.log(delete_item)
          // console.log(old_data[delete_item])
          if (old_data[delete_item]){
            result_tab.push(old_data[delete_item])
          }
          
        }
        that.setData({
          "tabs":result_tab
        })
      }
    })
  },
  onLoad(query) {
    onload_if = true
    var overduestart = query.overduestart,overdueend = query.overdueend;
    this.onTapRequest(overduestart,overdueend)
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


  }
})