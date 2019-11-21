import msglist from '/util/msglist';
import { HTTP } from '/util/http.js';
import ding from '/util/ding.js';
import { config } from '/app.js';
let http = new HTTP(), page = 1;
var _my$getSystemInfoSync = my.getSystemInfoSync(),
  windowHeight = _my$getSystemInfoSync.windowHeight;
var scrollHeight = windowHeight - 160;

Page({
  ...msglist,
  data: {
    timeperiod: {},//post 请求的查询条件: 例如 逾期时间起止,月龄,钉次数
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
    tabs: [{ title: '全部', value: '' },
    { title: '满月', value: 1 },
    { title: '3月', value: 3 },
    { title: '6月', value: 6 },
    { title: '8月', value: 8 },
    { title: '12月', value: 12 },
    { title: '18月', value: 18 },
    { title: '24月', value: 24 },
    { title: '30月', value: 30 },
    { title: '36月', value: 36 }],
    popList: [{ title: 'DING 0 次', value: 0 }, { title: 'DING 1 次', value: 1 }, { title: 'DING 2 次', value: 2 }, { title: '3次及以上', value: 3 }, { title: '全部', value: '' }],//筛选条件
    activeTab: 0,//当前选中tab序号
    position: 'bottomRight',//弹出方向
    popshow: false,//弹出
    showMask: true,//遮罩层,
    flag: true,
    onLoadFlag: true,//第一次加载
  },
  onLoad(query) {
    let overduestart = query.overduestart, overdueend = query.overdueend;
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
      'listData.pageHeight': 135 * config.pageSize,
      'timeperiod.overdueStart': !isNaN(overduestart) ? Number(overduestart) : '',
      'timeperiod.overdueEnd': !isNaN(overdueend) ? Number(overdueend) : ''
    })
    this.onTapRequest();
    this.onSearch();
  },
  onShow() {
    if (this.data.onLoadFlag) {
      this.setData({
        onLoadFlag: false
      })
      return
    }
    this.onTapRequest();
    this.onRequest();
  },
  //获取徽标数量
  onTapRequest() {
    var that = this, referer_list = [{ title: '全部', value: '' },
    { title: '满月', value: 1 },
    { title: '3月', value: 3 },
    { title: '6月', value: 6 },
    { title: '8月', value: 8 },
    { title: '12月', value: 12 },
    { title: '18月', value: 18 },
    { title: '24月', value: 24 },
    { title: '30月', value: 30 },
    { title: '36月', value: 36 }
    ]
    http.request({
      url: 'baby/overduelistcount?overdueStart=' + that.data.timeperiod.overdueStart + '&overdueEnd=' + that.data.timeperiod.overdueEnd,
      success: function(res) {
        let new_data = []
        let old_data = referer_list
        let item_index = 0
        for (var old_data_item_key in referer_list) {
          item_index++
          var all_num = 0;
          var value_if = true
          for (var new_data_item_key in res) {
            if (old_data[old_data_item_key]['value'] === res[new_data_item_key].examinationType && String(old_data[old_data_item_key]['value']) !== "") {
              value_if = false
              old_data[old_data_item_key]["badgeType"] = "text"
              old_data[old_data_item_key]["badgeText"] = res[new_data_item_key]["cnt"]
            } else if (String(old_data[old_data_item_key]['value']) === "") {
              all_num = all_num + res[new_data_item_key]["cnt"]
              value_if = false
            }
          }
          if (String(old_data[old_data_item_key]["value"]) == "" && all_num !== 0) {
            old_data[old_data_item_key]["badgeType"] = "text"
            old_data[old_data_item_key]["badgeText"] = all_num
          }
          if (value_if && old_data_item_key !== "0") {
            delete old_data[old_data_item_key]
          }
        }
        var result_tab = []
        for (var delete_item in old_data) {
          if (old_data[delete_item]) {
            result_tab.push(old_data[delete_item])
          }
        }
        that.setData({
          "tabs": result_tab
        })
      }
    })
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
    let that = this;
    this.setData({
      'listData.loadingState': true,
      'flag': false
    })
    http.request({
      url: "baby/overduelist",
      method: "post",
      data: JSON.stringify({
        param: this.data.timeperiod, page: page, size: config.pageSize
      }),
      success: function(res) {
        if (res.length) page++;
        var data = that.data.listData.list;
        data = data.concat(res);
        that.setData({
          ['listData.list']: data
        });
      },
      fail: function(res) {
        dd.alert({ content: JSON.stringify(res), buttonText: '好的' });
      },
      complete: function(res) {
        that.setData({
          'listData.loadingState': false,
          'flag': true
        });
      }
    })
  },
  //全部ding
  allDing() {
    let that = this;
    dd.showLoading({
      content: '请稍后...'
    })
    http.request({
      url: 'baby/overdueDingUserid?overdueStart' + that.data.timeperiod.overdueStart + '&overdueEnd' + that.data.timeperiod.overdueEnd
        + '&dingTimes=' + that.data.timeperiod.dingTimes + '&age=' + that.data.timeperiod.examinationType,
      success: function(res) {

        let users = res['users'];
        var text_template
        if (that.data.timeperiod.examinationType) {
          text_template = "家长你好！宝宝已经到" + that.data.timeperiod.examinationType + "月龄了，请您明天带上宝宝，到社区服务中心进行" + that.data.timeperiod.examinationType + "月龄体检，祝宝宝健康成长。"
        } else {
          text_template = "家长你好！宝宝已经到体检时间啦，请您明天带上宝宝，到社区服务中心进行体检，祝宝宝健康成长。"
        }
        var examid_list = res['examIds']
        ding.createDing({
          users,
          corpId: dd.corpId,
          text: text_template,
          success: function(res) {
            http.request({
              url: "baby/updatedingtimes?examIds=" + examid_list,
              method: "post",
              success: function(res) {
              }
            })
          },
          fail: function(res) {
          },
          complete: res => {
            dd.hideLoading();
          }
        });
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
            value: baby.age == 1 ? '满月' : (baby.age ? baby.age : '') + '月龄'
          },
          {
            name: '体检日期',
            value: baby.textTime
          },
          {
            name: '逾期',
            value: baby.overTime + '天'
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
          url: `/pages/doctor/cancel-remind/index?babyId=` + baby.babyId + '&examid=' + baby.id + '&examinationtype=' + baby.age + `&list=` + JSON.stringify(result)
        })
      }
    })
  },
  toLower(e) {
    if (this.data.flag) {
      this.onRequest();
    }
  },
  //tab选项切换
  handleTabClick(index, value) {
    this.setData({
      activeTab: index,
      'timeperiod.examinationType': value.value
    })
    this.onSearch();
  },
  //tab选项切换
  handleTabChange(index, value) {
    this.setData({
      activeTab: index,
      'timeperiod.examinationType': value.value
    })
    this.onSearch();
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
      'timeperiod.dingTimes': chooseNum
    })
    this.onSearch();
  }
})