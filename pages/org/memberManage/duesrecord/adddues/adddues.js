import { HTTP } from '/util/http.js';
let http = new HTTP();
Page({
  data: {
    userid: '',//会员id
    memType: '',//会员类型
    job: '',//会员职务-->获取会费标准
    money: 0,//会费标准
    payyear: 1,//缴费方式
    paymoney: 0,//缴费金额
    startdate: '',//开始日期
    enddate: '',//结束日期
    paydate: '',//缴费日期
    objectArray: [],
    arrIndex: 0,
    yearArray: [{
      id: 1,
      name: '1年'
    }, {
      id: 2,
      name: '2年'
    }, {
      id: 3,
      name: '3年'
    }, {
      id: 4,
      name: '4年'
    }, {
      id: 5,
      name: '5年'
    }],
    yearIndex: 0,
    currentDate: '',
    maxEndDate: '',//最后一次结束日期
  },
  chooseDate(e) {
    let id = e.currentTarget.id;
    if (id === 'startdate' && this.data.maxEndDate) {
      return
    } else if (id === 'enddate') {
      return
    }
    dd.datePicker({
      currentDate: this.data.currentDate,
      success: (res) => {
        if (!res.date) {
          return
        }
        if (id === 'startdate') {
          if (this.data.enddate && !this.compareDate(res.date, this.data.enddate)) {
            dd.showToast({ content: '开始时间不能大于结束时间' })
            return
          }
          this.setData({
            startdate: res.date,
            enddate: this.dateToString(this.datePlusYear(this.stringToDate(res.date), this.data.payyear)),
          });
        } else if (id === 'enddate') {
          if (this.data.startdate && !this.compareDate(this.data.startdate, res.date)) {
            dd.showToast({ content: '结束时间不能小于开始时间' })
            return
          }
          this.setData({ enddate: res.date });
        } else if (id === 'paydate') {
          this.setData({ paydate: res.date });
        }
      },
    });
  },
  onLoad: function(e) {
    dd.showLoading({
      content: '加载中',
    });
    let that = this;
    if (!this.data.currentDate) {
      var now = Date.now();
      var year = new Date(now).getFullYear()
      var month = new Date(now).getMonth() + 1
      var day = new Date(now).getDate()
      this.setData({
        currentDate: year + "-" + month + "-" + day
      })
    }
    http.request({
      url: "memberUserInfo/queryMemByCorpId",
      success: (data) => {
        that.setData({
          objectArray: data
        })
        if (data.length) {
          http.request({
            url: "memberUserInfo/queryDuesStand?type=" + data[0]['job'],
            success: (res) => {
              if (null == res.money) {
                dd.showToast({ content: '会员职务' + res.jobName + '的会费标准未设置' });
                res.money = '';
              }
              that.setData({
                money: res.money,
                paymoney: that.data.payyear * res.money,
                userid: data[0]['id'],
                job: data[0]['job'],
                memType: data[0]['user_type']
              })
            }
          })
          http.request({
            url: 'duesrecord/getMaxEndDate?userId=' + data[0]['id'],
            success: res => {
              that.setData({
                maxEndDate: res,
                startdate: res ? res : '',
                enddate: res ? that.dateToString(that.datePlusYear(that.stringToDate(res), that.data.payyear)) : '',
              })
            },
            complete: res => {
              dd.hideLoading();
            }
          })
        }
      },
      fail: res => {
        dd.hideLoading();
        dd.alert({ content: JSON.stringify(res), buttonText: '好的' });
      }
    });
  },
  bindObjPickerChange(e) {
    let that = this,
      mem = this.data.objectArray[e.detail.value];
    this.setData({
      arrIndex: e.detail.value,
      userid: mem.id,
      job: mem.job,
      memType: mem.user_type,
    });

    http.request({
      url: "memberUserInfo/queryDuesStand?type=" + that.data.job,
      success: (res) => {
        if (null == res.money) {
          dd.showToast({ content: '会员职务' + res.jobName + '的会费标准未设置' });
          res.money = '';
        }
        that.setData({
          money: res.money,
          paymoney: that.data.payyear * res.money,
        })
      }
    })
    http.request({
      url: 'duesrecord/getMaxEndDate?userId=' + mem['id'],
      success: res => {
        that.setData({
          maxEndDate: res,
          startdate: res ? res : '',
          enddate: res ? that.dateToString(that.datePlusYear(that.stringToDate(res), that.data.payyear)) : ''
        })
      }
    })
  },
  bindYearPickerChange(e) {
    let yearArr = this.data.yearArray;
    this.setData({
      yearIndex: e.detail.value,
      payyear: yearArr[e.detail.value]['id'],
      paymoney: yearArr[e.detail.value]['id'] * this.data.money,
    });
    this.setData({
      startdate: this.data.maxEndDate ? this.data.maxEndDate : this.data.startdate,
      enddate: this.dateToString(this.datePlusYear(this.stringToDate(this.data.maxEndDate ? this.data.maxEndDate : this.data.startdate), this.data.payyear)),
    })
  },
  saveDues: function() {
    const param = {
      userId: this.data.userid,
      years: this.data.payyear,
      money: this.data.payyear * this.data.money,
      startDate: this.data.startdate,
      endDate: this.data.enddate,
      payDate: this.data.paydate
    }

    if (!param.userId) {
      dd.showToast({ content: '缴款单位或个人不能为空' });
      return;
    }

    if (!this.data.money) {
      dd.showToast({ content: '收费标准不能为空' });
      return;
    }

    if (!param.startDate || !param.endDate) {
      dd.showToast({ content: '会员期限不能为空' });
      return;
    }
    if (!param.payDate) {
      dd.showToast({ content: '缴费日期不能为空' });
      return;
    }

    http.request({
      url: "duesrecord/add",
      method: 'post',
      data: JSON.stringify(param),
      success: (res) => {
        dd.showToast({ content: '保存成功', mask: true, duration: 1000 });
        setTimeout(function() {
          dd.navigateBack();
        }, 1000)
      },
      fail: (res) => {
        dd.alert({ content: JSON.stringify(res), buttonText: '好的' });
      }
    })
  },
  //比较日期大小
  compareDate(date1, date2) {
    var arys1 = new Array();
    var arys2 = new Array();
    if (date1 != null && date2 != null) {
      arys1 = date1.split('-');
      var sDate = new Date(arys1[0], parseInt(arys1[1] - 1), arys1[2]);
      arys2 = date2.split('-');
      var eDate = new Date(arys2[0], parseInt(arys2[1] - 1), arys2[2]);
      if (sDate > eDate) {
        return false;
      } else {
        return true;
      }
    }
  },
  stringToDate: function(dateStr, separator) {
    if (!separator) {
      separator = "-";
    }
    // dateStr = dateStr.replace(/-/g, '/'); // "2010/08/01";

    var dateArr = dateStr.split(separator);
    var year = parseInt(dateArr[0]);
    var month;
    //处理月份为04这样的情况                         
    if (dateArr[1].indexOf("0") == 0) {
      month = parseInt(dateArr[1].substring(1));
    } else {
      month = parseInt(dateArr[1]);
    }
    var day = parseInt(dateArr[2]);
    var date = new Date(year, month - 1, day);
    return date;
  },
  dateToString: function(date) {
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString();
    var day = (date.getDate()).toString();
    if (month.length == 1) {
      month = "0" + month;
    }
    if (day.length == 1) {
      day = "0" + day;
    }
    var dateTime = year + "-" + month + "-" + day;
    return dateTime;
  },
  datePlusYear: function(date, plusYear) {
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString();
    var day = (date.getDate()).toString();
    if (month.length == 1) {
      month = "0" + month;
    }
    if (day.length == 1) {
      day = "0" + day;
    }
    return new Date(year + plusYear, month - 1, day - 1);
  },
});
