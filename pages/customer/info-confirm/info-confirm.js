import { HTTP } from '/util/http.js';
let http = new HTTP();
Page({
  data: {
    person: 0//父母选择序号，0为爸爸，1为妈妈
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
    http.request({
      url: "user/updateUserInfo?mobile=" + e.detail.value.phone + "&sex=" + this.data.person,
      method: 'GET',
      success: (res) => {
        if (res == "ok") {
          //查询当前用户是否存在关联宝宝数据，并给予提示
          http.request({
            url: "baby/myBabys",
            method: 'post',
            success: (res) => {
              if (res.babyList.length != 0) {
                dd.redirectTo({
                  url: '../baby-mgt/baby-mgt?type=1'
                });
              } else {
                //未找到宝宝信息
                dd.confirm({
                  title: '温馨提示',
                  content: '未关联数据：系统未能查询到宝宝健康体检信息，是否立即添加宝宝信息？',
                  confirmButtonText: '是',
                  cancelButtonText: '否',
                  success: (result) => {
                    if (result.confirm) {
                      var fatherName = '';
                      var fatherMobile = '';
                      var motherName = '';
                      var motherMobile = '';
                      if (res.sex == 0) {
                        fatherName = res.parentName;
                        fatherMobile = res.parentMobile;
                      } else {
                        motherName = res.parentName;
                        motherMobile = res.parentMobile;
                      }
                      var address = res && res.address ? res.address : '';
                      //跳转到宝宝新增页面
                      var url = '../baby-info/baby-info?fatherName=' + fatherName + '&fatherMobile=' + fatherMobile + '&motherName=' + motherName + '&motherMobile=' + motherMobile + "&address=" + address;
                      dd.redirectTo({
                        url: url
                      });
                    }
                  },
                });
              }
            },
            fail: function(res) {
              // dd.alert({ content: JSON.stringify(res), buttonText: '好的' });
            }
          })
        } else {
          dd.showToast({
            type: 'warn',
            content: res,
            duration: 3000
          });
        }
        // dd.navigateTo({
        //   url: '../baby-mgt/baby-mgt'
        // });
      },
      fail: function(res) {

      }
    })
  },
  phoneCheck: function(tel) {
    var strTemp = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
    if (strTemp.test(tel)) {
      return true;
    }
    return false;
  },
});