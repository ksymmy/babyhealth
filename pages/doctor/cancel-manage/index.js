import custlist from '/util/custlist';
import { HTTP } from '/util/http.js';
let http = new HTTP();
Page({
  ...custlist,
  data: {
    listData: {
      babyId: '',
      dingTap: 'handleDingItemTap',
      btnTap: 'handleBtnTapTap',
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
        //   name: '父亲',
        //   value: '袁一明',
        //   extraText:'15300001699',
        //   state: {
        //     value: 0
        //   }
        // }
        // ,
        // {
        //   name: '父亲',
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
          dd.navigateBack();
        }, 1000)
      }
    })

  },
  handleDingItemTap(e) {
    dd.showToast({
      content: `${e.currentTarget.dataset.value}`,
      success: (res) => {

      },
    });
  }

})