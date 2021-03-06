import custlist from '/util/custlist';
import { HTTP } from '/util/http.js';
import ding from '/util/ding.js';
let http = new HTTP();
var examinationtype
var examid
Page({
  ...custlist,
  data: {
    listData: {
      dingTap: 'handleDingItemTap',
      btnTap: 'handleBtnTapTap',
      list: [
        {
          name: '姓名',
          value: '袁铭轩'
        },
        {
          name: '性别',
          value: '男'
        },
        {
          name: '出生日期',
          value: '2019-06-30'
        },
        {
          name: '体检',
          value: '3月龄'
        },
        {
          name: '体检日期',
          value: '2019-09-30'
        },
        {
          name: '逾期',
          value: '14天'
        },
        {
          name: '爸爸',
          value: '袁一明',
          extraText: '15300001699',
          state: {
            value: 0
          }
        }
        ,
        {
          name: '爸爸',
          value: '爱美丽',
          extraText: '15300001692',
          state: {
            value: 1
          }
        }
      ],
      btnText: '取消逾期提醒'
    },
  },
  onLoad(param) {
    this.setData({
      ['listData.list']: JSON.parse(param.list),
      babyId: param.babyId
    })
    examid = param.examid
    examinationtype = param.examinationtype
  },
  /*取消逾期提醒*/
  handleBtnTapTap(e) {
    dd.confirm({
      title: '温馨提示',
      content: '确认取消逾期提醒吗?',
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      success: (result) => {
        if (result.confirm) {
          http.request({
            url: "baby/cancelremind?examid=" + examid,
            method: "POST",
            success: function (res) {
              dd.showToast({
                content: '取消逾期成功',
                mask: true,
                duration: 1000,
                success: () => {
                  dd.navigateBack();
                },
              });

            }
          })
        }
      }
    })
  },
  /*Ding操作*/
  handleDingItemTap(e) {
    let mobile = `${e.currentTarget.dataset.value}`;
    if (!mobile || mobile == "undefind") {
      return
    }
    let users = [];
    dd.showLoading({
      content: '请稍后...'
    })

    http.request({
      url: 'hospitalnoticetemp/get',
      success: temp => {
        let inx = examinationtype;
        inx = inx ? inx : 'all';
        var text_template = temp['et' + inx];
        http.request({
          url: `baby/getuseridbbymobile?mobile=` + mobile,
          success: res => {
            if (res) {
              users.push(res);
            }
            var examid_list = []
            examid_list.push(examid)
            ding.createDing({
              users,
              corpId: dd.corpId,
              text: text_template,
              success: function (res) {
                http.request({
                  url: "baby/updatedingtimes?examIds=" + examid_list,
                  method: "POST",
                  success: function (res) {
                    //返回到逾期列表并刷新
                    let pages = getCurrentPages();
                    let prevPage = pages[pages.length - 2];
                    prevPage.onSearch();
                    dd.navigateBack();
                  }
                })
              }
            });
          },
          complete: res => {
            dd.hideLoading();
          }
        })
      },
      complete: data => {
        dd.hideLoading();
      }
    });
  }
})