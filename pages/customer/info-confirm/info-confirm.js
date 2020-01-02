
Page({
  data: {
    person: 0//父母选择序号，0为父亲，1为母亲
  },

  onLoad(query) {
    // 页面加载
  },

  changeChoice: function(e) {
    this.setData({
      'person': e.target.dataset.key
    })
  },
  formSubmit: function(e) {
    if (e.detail.value.phone == '' || !this.phoneCheck(e.detail.value.phone)) {
      dd.showToast({
        type: 'warn',
        content: '请核对手机号',
        duration: 2000
      });
      return;
    }

  },
  phoneCheck: function(tel) {
    var strTemp = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
    if (strTemp.test(tel)) {
      return true;
    }
    return false;
  },
});