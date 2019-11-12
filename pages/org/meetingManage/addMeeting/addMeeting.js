import { HTTP, UUID } from '/util/http.js';
let http = new HTTP();
let uuid = new UUID();
Page({
  data: {
    insert: false,//新增/修改
    photo: '',
    handerUrl: '',
    meetingId: '',// 先生产id,用于上传
    corpid: '',
    objectArray: [],
    arrIndex: 0,
    meetingtype: '',
    meetingStart: '',
    meetingEnd: '',
    enrollStart: '',
    enrollEnd: '',
    state: 0,
    meetingInfo: {},
    files: [],
    spaceId: '',
  },
  bindObjPickerChange(e) {
    this.setData({
      arrIndex: e.detail.value,
      // meetingtype:this.data.objectArray[e.detail.value].id
    });
  },
  onLoad(e) {
    let that = this;
    if (!this.data.corpid) {
      this.setData({
        corpid: e.orgId
      })
    }

    if ('true' == e.insert) {
      that.setData({
        meetingInfo: {}
      })
    }

    http.request({
      url: "dict/getDictListByCode?code=meeting_type",
      success: (data) => {
        that.setData({
          objectArray: data,
          insert: e.insert,
          meetingId: uuid.uuid(),
          handerUrl: getApp().globalData.handerUrl,
        })
        if (e.meetingInfo) {
          let entity = JSON.parse(e.meetingInfo);
          that.setData({
            meetingInfo: entity
          })
          // console.log(that.data.meetingInfo);
          let obj = that.data.objectArray;
          for (let inx = 0; inx < obj.length; inx++) {
            if (obj[inx]['id'] == entity.type) {
              that.setData({
                arrIndex: inx,
                meetingId: entity.id
              })
              that.requestFiles();
              return false;
            }
          }
          // dd.setNavigationBarTitle({
          //   title: '修改会议'
          // })
        }

      }
    });
    http.request({
      url: 'file/getSpace?corpId=' + dd.corpId,
      success: res => {
        that.setData({
          spaceId: res
        })
      }
    })
  },
  requestFiles() {
    let that = this;
    http.request({
      url: 'file/getlist?type=1&recordid=' + this.data.meetingId,
      success: res => {
        for (var i = 0; i < res.length; i++) {
          res[i].fileSize_b = that.byte(res[i].fileSize);
          res[i].extension_b = '/image/fileicon/' + res[i].extension + '.png';
        }
        that.setData({
          files: res
        })
      }
    })
  },
  chooseDate(e) {
    let id = e.currentTarget.id, that = this;
    var now = Date.now();
    var year = new Date(now).getFullYear()
    var month = new Date(now).getMonth() + 1
    var day = new Date(now).getDate()
    var hour = new Date(now).getHours()
    var mm = new Date(now).getMinutes();
    var currentDate = year + "-" + month + "-" + day + " " + hour + ":" + mm;

    dd.datePicker({
      format: 'yyyy-MM-dd HH:mm',
      currentDate: currentDate,
      success: (res) => {
        if (!res.date) {
          return
        }
        let entity = that.data.meetingInfo;
        if (id === 'meetingStart') {
          if (entity.meetingEnd && !that.compareTime(res.date, entity.meetingEnd)) {
            dd.showToast({ content: '会议开始时间不能大于会议结束时间' })
            return
          }
          if (entity.enrollEnd && that.compareTime(res.date, entity.enrollEnd)) {
            dd.showToast({ content: '会议开始时间不能小于报名时间' })
            return
          }
          entity.meetingStart = res.date;
          that.setData({
            meetingInfo: entity,
          })
        } else if (id === 'meetingEnd') {
          if (entity.meetingStart && !that.compareTime(entity.meetingStart, res.date)) {
            dd.showToast({ content: '会议结束时间不能小于会议开始时间' })
            return
          }
          entity.meetingEnd = res.date;
          that.setData({
            meetingInfo: entity,
          })
        } else if (id === 'enrollStart') {
          if (entity.enrollEnd && !that.compareTime(res.date, entity.enrollEnd)) {
            dd.showToast({ content: '报名开始时间不能大于报名结束时间' })
            return
          }
          if (entity.meetingStart && that.compareTime(entity.meetingStart, res.date)) {
            dd.showToast({ content: '报名时间不能大于会议开始时间' })
            return
          }
          entity.enrollStart = res.date;
          that.setData({
            meetingInfo: entity,
          })
        } else if (id === 'enrollEnd') {
          if (entity.enrollStart && !that.compareTime(entity.enrollStart, res.date)) {
            dd.showToast({ content: '报名结束时间不能小于报名开始时间' })
            return
          }
          if (entity.meetingStart && that.compareTime(entity.meetingStart, res.date)) {
            dd.showToast({ content: '报名时间不能大于会议开始时间' })
            return
          }
          entity.enrollEnd = res.date;
          that.setData({
            meetingInfo: entity,
          })
        }
      },
    });
  },
  // bindTextAreaBlur: function(e) {
  //   console.log(e.detail.value)
  // },
  formSubmit: function(e) {
    let insert = this.data.insert === 'true';
    let param = e.detail.value, that = this;
    param.type = this.data.objectArray[this.data.arrIndex].id;
    param.id = insert ? this.data.meetingId : that.data.meetingInfo.id;
    param.orgId = this.data.corpid;
    param.state = insert ? e.buttonTarget.dataset.state : e.buttonTarget.dataset.state > this.data.meetingInfo.state ? e.buttonTarget.dataset.state : this.data.meetingInfo.state;
    if (!param.name) {
      that.showToastMsg('会议名称不能为空')
      return
    }
    if (!param.meetingStart || !param.meetingEnd) {
      that.showToastMsg('会议时间不能为空')
      return
    }
    if (!param.enrollStart || !param.enrollEnd) {
      that.showToastMsg('报名时间不能为空')
      return
    }
    if (!param.address) {
      that.showToastMsg('会议地点不能为空')
      return
    }
    if (!param.sponsor) {
      that.showToastMsg('主办方不能为空')
      return
    }
    if (!param.context) {
      that.showToastMsg('会议内容不能为空')
      return
    }
    if (!param.canParticipateIds) {
      that.showToastMsg('参会人员不能为空')
      return
    }

    http.request({
      url: insert ? 'meeting/add' : 'meeting/update',
      method: 'post',
      data: JSON.stringify(param),
      success: (res) => {
        that.showToastMsg(insert ? '保存成功' : '修改成功');
        that.timeOutFun(() => { dd.navigateBack() });
        // that.formReset();
      }
    })
  },
  formReset: function() {
    // console.log('reset form')
  },
  showToastMsg: msg => {
    dd.showToast({
      mask: true,
      duration: 1000,
      content: msg
    })
  },
  previewFileInDingTalk(e) {
    dd.showLoading({ content: '请稍后', });
    let entity = e.currentTarget.dataset.entity;
    http.request({
      url: 'file/grant?grantType=download&corpId=' + dd.corpId + '&fileids=' + entity.fileId,
      success: rel => {
        dd.hideLoading();
        // 预览文件
        dd.previewFileInDingTalk({
          corpId: dd.corpId,
          spaceId: entity.spaceId,
          fileId: entity.fileId,
          fileName: entity.fileName,
          fileSize: entity.fileSize,
          fileType: entity.extension,
        })
      }
    })
  },
  uploadFile() {
    dd.showLoading({ content: '请稍后', });
    var that = this, spaceId = this.data.spaceId;
    //授权
    http.request({
      url: 'file/grant?grantType=add&corpId=' + dd.corpId,
      success: rel => {
        dd.hideLoading();
        //上传
        dd.uploadAttachmentToDingTalk({
          image: { multiple: true, compress: false, max: 9, spaceId: spaceId },
          space: { spaceId: spaceId, isCopy: 1, max: 9 },
          file: { spaceId: spaceId, max: 9 },
          types: ["photo", "camera", "file"],//PC端仅支持["photo","file","space"] "photo", "camera", "file", "space"
          success: (res) => {
            http.request({
              url: 'file/uploadDingTalk?app=社管通/会议管理/创建会议&type=1&recordId=' + that.data.meetingId,
              method: 'post',
              data: JSON.stringify(res.data),
              success: res => {
                dd.showToast({ content: '上传成功' });
                that.requestFiles();
              }
            })
          },
          fail: (err) => {
            dd.alert({
              content: JSON.stringify(err)
            })
          }
        })
      }
    })

    // var that = this;
    // dd.chooseImage({
    //   sizeType: ["compressed"],//original
    //   sourceType: ['camera', 'album'],
    //   count: 1,
    //   success: res => {
    //     const path = (res.filePaths && res.filePaths[0]) || (res.apFilePaths && res.apFilePaths[0]);
    //     that.setData({
    //       photo: res.filePaths[0]
    //     })
    //     console.log({ content: `内容：${res.filePaths}` });
    //     for (let i = 0; i < res.filePaths.length; i++) {
    //       dd.uploadFile({
    //         url: that.data.handerUrl + 'file/upload',
    //         fileType: 'image',
    //         fileName: 'file',
    //         filePath: res.filePaths[i],
    //         formData: {
    //           recordId: that.data.meetingId,
    //           app: '社管通/创建会议',
    //           type: 1,
    //         },
    //         success: res => {
    //           dd.showToast({ content: '上传成功' });
    //           that.requestFiles();
    //         },
    //         fail: function(res) {
    //           dd.alert({ title: `上传失败：${JSON.stringify(res)}` });
    //         },
    //       });
    //     }
    //   },
    // });
  },
  deleteFile(e) {
    dd.confirm({
      title: '温馨提示',
      content: '确定删除该附件吗?',
      confirmButtonText: '确认',
      cancelButtonText: '返回',
      success: (result) => {
        if (result.confirm) {
          let entity = e.currentTarget.dataset.entity, that = this;
          http.request({
            url: 'file/deleteFile',
            method: 'post',
            data: JSON.stringify(entity),
            success: res => {
              dd.showToast({ content: '删除成功' });
              that.requestFiles();
            }
          })
        }
      }
    });
  },
  timeOutFun: (callback, timeout) => {
    timeout = timeout || 1000;
    setTimeout(callback, timeout)
  },

  //判断日期，时间大小
  compareTime: (beginTime, endTime) => {
    if (beginTime.length > 0 && endTime.length > 0) {
      var beginTimeTemp = beginTime.split(" ");
      var endTimeTemp = endTime.split(" ");

      var arrBeginDate = beginTimeTemp[0].split("-");
      var arrEndDate = endTimeTemp[0].split("-");

      var arrbeginTime = beginTimeTemp[1].split(":");
      var arrendTime = endTimeTemp[1].split(":");

      var allBeginDate = new Date(arrBeginDate[0], arrBeginDate[1], arrBeginDate[2], arrbeginTime[0], arrbeginTime[1], 0);
      var allEndDate = new Date(arrEndDate[0], arrEndDate[1], arrEndDate[2], arrendTime[0], arrendTime[1], 0);

      if (allBeginDate.getTime() >= allEndDate.getTime()) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }

  },
  complexChoose() {
    let that = this;
    var entity = that.data.meetingInfo;
    dd.complexChoose({
      title: "选择参会人员",            //标题
      multiple: true,            //是否多选
      limitTips: "人员数量超过上限",          //超过限定人数返回提示
      maxUsers: 1000,            //最大可选人数
      pickedUsers: entity.canParticipateIds ? entity.canParticipateIds.split(',') : [],            //已选用户
      pickedDepartments: [],          //已选部门
      disabledUsers: [],            //不可选用户
      disabledDepartments: [],        //不可选部门
      requiredUsers: [],            //必选用户（不可取消选中状态）
      requiredDepartments: [],        //必选部门（不可取消选中状态）
      permissionType: "GLOBAL",          //可添加权限校验，选人权限，目前只有GLOBAL这个参数
      responseUserOnly: false,        //返回人，或者返回人和部门
      success: function(res) {
        if (res.selectedCount) {
          var canParticipateIds = '', canParticipateNames = '';
          for (var i = 0; i < res.users.length; i++) {
            canParticipateIds += res.users[i].userId + ',';
            canParticipateNames += res.users[i].name + ',';
          }
          entity.canParticipateIds = canParticipateIds.substr(0, canParticipateIds.length - 1);
          entity.canParticipateNames = canParticipateNames.substr(0, canParticipateNames.length - 1);
          that.setData({
            meetingInfo: entity,
          })
        }
      },
      fail: function(err) {
        dd.alert({
          content: JSON.stringify(err)
        })
      }
    })
  },
  byte: function(limit) {
    var size = "";
    if (limit < 0.1 * 1024) {                            //小于0.1KB，则转化成B
      size = limit.toFixed(2) + "B"
    } else if (limit < 0.1 * 1024 * 1024) {            //小于0.1MB，则转化成KB
      size = (limit / 1024).toFixed(2) + "KB"
    } else if (limit < 0.1 * 1024 * 1024 * 1024) {        //小于0.1GB，则转化成MB
      size = (limit / (1024 * 1024)).toFixed(2) + "MB"
    } else {                                            //其他转化成GB
      size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB"
    }

    var sizeStr = size + "";                        //转成字符串
    var index = sizeStr.indexOf(".");                    //获取小数点处的索引
    var dou = sizeStr.substr(index + 1, 2)            //获取小数点后两位的值
    if (dou == "00") {                                //判断后两位是否为00，如果是则删除00                
      return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
    }
    return size;
  },
  imageOnError: function(e) {
    var index = e.currentTarget.dataset.index;
    var img = 'files[' + index + '].extension';
    this.setData({
      [img]: '/image/fileicon/file.png'
    })
  }
});
