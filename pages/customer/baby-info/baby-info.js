import { HTTP } from '/util/http.js';
let http = new HTTP();
Page({
  data: {
    name: '',//姓名
    sex: '',//性别
    birthday: '',//日期选择
    fatherName: '',//
    fatherMobile: '',
    motherName: '',
    motherMobile: '',
    address: '',
    signInList: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    canSignInList: [0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  onLoad(e) {
    // 页面加载
    this.setData({
        fatherName: e.fatherName,
        fatherMobile: e.fatherMobile,
        motherName: e.motherName,
        motherMobile: e.motherMobile,
        address: e.address,
    })
  },
  formSubmit: function(e) {
    if (e.detail.value.name == '') {
      dd.showToast({
        type: 'warn',
        content: '姓名不能为空',
        duration: 2000
      });
      return;
    }
    if (e.detail.value.sex == '') {
      dd.showToast({
        type: 'warn',
        content: '性别不能为空',
        duration: 2000
      });
      return;
    }
    if (e.detail.value.birthday == '') {
      dd.showToast({
        type: 'warn',
        content: '出生日期不能为空',
        duration: 2000
      });
      return;
    }
    if (e.detail.value.fatherName == '') {
      dd.showToast({
        type: 'warn',
        content: '父亲姓名不能为空',
        duration: 2000
      });
      return;
    }
    if (e.detail.value.fatherMobile == '') {
      dd.showToast({
        type: 'warn',
        content: '父亲联系电话不能为空',
        duration: 2000
      });
      return;
    }
    if (e.detail.value.motherName == '') {
      dd.showToast({
        type: 'warn',
        content: '母亲姓名不能为空',
        duration: 2000
      });
      return;
    }
    if (e.detail.value.motherMobile == '') {
      dd.showToast({
        type: 'warn',
        content: '母亲手机号不能为空',
        duration: 2000
      });
      return;
    }
    console.log(e.detail.value);
    http.request({
      url: "baby/addBabyInfo",
      method: 'post',
      data: JSON.stringify(e.detail.value),
      success: (res) => {
        dd.showToast({
          type: 'success',
          content: '保存成功',
          duration: 1000,
          success: () => {
            dd.navigateBack();
          },
        });
      },
      fail: function(res) {
        // dd.alert({ content: JSON.stringify(res), buttonText: '好的' });
      }
    })
  },
  //系统当前日期
  curDate() {
    var dateObj = new Date(); //表示当前系统时间的Date对象
    var year = dateObj.getFullYear(); //当前系统时间的完整年份值
    var month = dateObj.getMonth() + 1; //当前系统时间的月份值
    var date = dateObj.getDate(); //当前系统时间的月份中的日
    return `${year}-${month}-${date}`
  },
  changeState(e) {
    // let newEle = this.data.signInList[]
    if (this.data.birthday == '') {
       dd.showToast({
          type: 'warn',
          content: '请选择出生日期',
          duration: 1000
        });
        return;
    }
    let oldFlag = this.data.signInList[e.currentTarget.dataset.index];
    let newFlag = oldFlag == 1 ? 0 : 1
    if (this.data.canSignInList[e.currentTarget.dataset.index] == 1) {
       this.setData({
          ['signInList['+e.currentTarget.dataset.index+']']: newFlag
        })
    } else {
        dd.showToast({
          type: 'warn',
          content: '未到体检日期',
          duration: 1000
        });
    }
  },
  datePicker() {
    dd.datePicker({
      format: 'yyyy-MM-dd',
      currentDate: this.curDate(),
      success: (res) => {
        if (typeof (res.date) != "undefined") {
          this.setData({
            birthday: res.date
          })

           http.request({
            url: "baby/generateExaminationDates?birthday=" + res.date,
            method: 'GET',
            success: (res1) => {
              this.setData({
                  signInList: res1.signInList,
                  canSignInList: res1.signInList,
                  examinationDateList: res1.examinationDateList
              })
            },
            fail: function(res) {
              // dd.alert({ content: JSON.stringify(res), buttonText: '好的' });
            }
          })
        }
      }
    });
  }


});