import custlist from '/util/custlist';
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
          name: '父亲',
          value: '袁一明',
          extraText:'15300001699',
          state: {
            value: 0
          }
        }
        ,
        {
          name: '父亲',
          value: '爱美丽',
           extraText:'15300001692',
          state: {
            value: 1
          }
        }
      ],
      btnText: '取消逾期提醒'
    },
  },
  /*取消逾期提醒*/
  handleBtnTapTap(e) {
    dd.showToast({
      content: `55555`,
      success: (res) => {

      },
    });
  },
  /*Ding操作*/
  handleDingItemTap(e) {
    dd.showToast({
      content: `${e.currentTarget.dataset.value}`,
      success: (res) => {

      },
    });
  }

})