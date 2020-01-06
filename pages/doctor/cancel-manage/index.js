import custlist from '/util/custlist';
import { HTTP } from '/util/http.js';
import ding from '/util/ding.js';
let http = new HTTP();
Page({
  ...custlist,
  data: {
    listData: {
      babyId: '',
      dingTap: 'handleDingItemTap',
      btnTap: 'handleBtnTapTap',
      isDisable: false,
      list: [
        // {
        //   name: '姓名',
        //   value: '袁铭轩'
        // },
        // {
        //   name: '性别',
        //   value: '男'
        // },
        // {
        //   name: '出生日期',
        //   value: '2019-06-30'
        // },
        // {
        //   name: '体检',
        //   value: '3月龄'
        // },
        // {
        //   name: '体检日期',
        //   value: '2019-09-30'
        // },
        // {
        //   name: '逾期',
        //   value: '14天'
        // },
        // {
        //   name: '爸爸',
        //   value: '袁一明',
        //   extraText:'15300001699',
        //   state: {
        //     value: 0
        //   }
        // }
        // ,
        // {
        //   name: '爸爸',
        //   value: '爱美丽',
        //   extraText:'15300001699',
        //   state: {
        //     value: 1
        //   }
        // }
      ],
      btnText: '取消儿童管理',
    },
  },
  onLoad(param) {
    this.setData({
      ['listData.list']: JSON.parse(param.list),
      babyId: param.babyId
    })
  },
  handleBtnTapTap(e) {
    let that = this;
    dd.confirm({
      title: '温馨提示',
      content: '确认取消儿童管理吗?',
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      success: (result) => {
        if (result.confirm) {
          that.setData({
            'listData.isDisable': true
          })
          http.request({
            url: 'baby/cancelbaby?id=' + that.data.babyId,
            method: 'post',
            success: res => {
              dd.showToast({
                content: '取消管理成功',
                mask: true,
                duration: 1000
              });
              setTimeout(() => {
                let pages = getCurrentPages();
                let prevPage = pages[pages.length - 2];
                that.setData({
                  'listData.isDisable': false
                })
                prevPage.onSearch();
                dd.navigateBack();
              }, 1000)
            }
          })
        }
      },
    });
  },
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
      url: `baby/getuseridbbymobile?mobile=` + mobile,
      success: res => {
        if (res) {
          users.push(res);
        }
        ding.createDing({
          users,
          corpId: dd.corpId,
          text: ''
        });
      },
      complete: res => {
        dd.hideLoading();
      }
    })
  }
})