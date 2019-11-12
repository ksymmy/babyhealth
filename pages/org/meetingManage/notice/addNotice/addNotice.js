import { HTTP } from '/util/http.js';
import animModal from '/util/items';
let http = new HTTP();
Page({
  ...animModal.animOp,
  data: {
    ...animModal.data,
    hidden: true,
    meetingId: '',
    title: '',
    context: '',
    sendNotice: 0,
    sendEmail: 0,
    sendDingMsg: 1,
    templateName: '',
    arrIndex: 0,
    objectArray: [],
    insert: false,//新增/修改
    noticeRec: {},
  },
  openModal() {
    if (!this.data.title) {
      dd.showToast({
        content: '通知标题不能为空'
      });
      return
    }
    if (!this.data.context) {
      dd.showToast({
        content: '通知内容不能为空'
      });
      return
    }
    if (!(this.data.sendEmail + this.data.sendNotice + this.data.sendDingMsg)) {
      dd.showToast({
        content: '发送发式不能为空'
      });
      return
    }
    // dd.navigateTo({
    //   url: 'modal/modal',
    // })
    this.createMaskShowAnim();
    this.createContentShowAnim();
    this.setData({
      hidden: !this.data.hidden,
    });
  },
  onModalBtnClick() {
    if (!this.data.templateName) {
      dd.showToast({
        type: 'none',
        content: '模板名称不能为空',
        duration: 1000
      });
      return
    }
    this.onModalCloseTap();
    this.saveAsTemplate();
  },
  onModalCloseTap() {
    this.createMaskHideAnim();
    this.createContentHideAnim();
    setTimeout(() => {
      this.setData({
        hidden: true,
      });
    }, 210);
  },
  handleTitleInput(e) {
    this.setData({
      title: e.detail.value,
    });
  },
  handleContextInput(e) {
    this.setData({
      context: e.detail.value,
    });
  },
  handleTemplateInput(e) {
    this.setData({
      templateName: e.detail.value,
    });
  },
  bindObjPickerChange(e) {
    let arrIndex = e.detail.value,
      objectArray = this.data.objectArray;
    let entity = this.data.noticeRec;
    entity.title = objectArray[arrIndex].title;
    entity.context = objectArray[arrIndex].context;

    this.setData({
      arrIndex: e.detail.value,
      title: objectArray[arrIndex].title,
      context: objectArray[arrIndex].context,
      sendNotice: objectArray[arrIndex].sendNotice,
      sendEmail: objectArray[arrIndex].sendEmail,
      sendDingMsg: objectArray[arrIndex].sendDingMsg,
      noticeRec: entity
    });
  },
  onLoad(e) {
    let that = this;
    http.request({
      url: "meetingnoticetemplate/list",
      success: (data) => {
        let first = {
          name: '不使用模板',
          title: '',
          context: '',
          sendEmail: 0,
          sendNotice: 0,
          sendDingMsg: 0,
        };
        data.unshift(first);
        that.setData({
          objectArray: data,
          insert: e.insert
        })
        if (that.data.insert == "true") {
          that.setData({
            meetingId: e.meetingId,
            noticeRec: {},
          })
        } else {
          let entity = JSON.parse(e.noticeRec);
          that.setData({
            noticeRec: entity,
            sendEmail: Number(entity.sendEmail),
            sendNotice: Number(entity.sendNotice),
            sendDingMsg: Number(entity.sendDingMsg),
          })
        }
      }
    });
  },
  onSendNotice: function(e) {
    this.setData({
      sendNotice: e.detail.value ? 1 : 0
    })
  },
  onSendEmail: function(e) {
    this.setData({
      sendEmail: e.detail.value ? 1 : 0
    })
  },
  onSendDingMsg: function(e) {
    this.setData({
      sendDingMsg: e.detail.value ? 1 : 0
    })
  },
  onSubmit: function(e) {
    let insert = this.data.insert === 'true',
      noticeRec = this.data.noticeRec;
    let param = e.detail.value, that = this;
    param.state = insert ? e.buttonTarget.dataset.state : e.buttonTarget.dataset.state > noticeRec.state ? e.buttonTarget.dataset.state : noticeRec.state;
    param.meetingId = insert ? this.data.meetingId : noticeRec.meetingId;
    param.sendEmail = this.data.sendEmail
    param.sendDingMsg = this.data.sendDingMsg
    param.sendNotice = this.data.sendNotice
    if (!insert) param.id = noticeRec.id
    if (!param.title) {
      dd.showToast({
        content: '通知标题不能为空'
      });
      return
    }
    if (!param.context) {
      dd.showToast({
        content: '通知内容不能为空'
      });
      return
    }
    if (!(param.sendEmail + param.sendNotice + param.sendDingMsg)) {
      dd.showToast({
        content: '发送发式不能为空'
      });
      return
    }
    dd.showLoading({ content: '保存中', });
    http.request({
      url: insert ? 'meetingnotice/add?corpId=' + dd.corpId : 'meetingnotice/update?corpId=' + dd.corpId,
      method: 'post',
      data: JSON.stringify(param),
      success: (res) => {
        dd.showToast({
          content: insert ? '保存成功' : '修改成功',
          mask: true,
          duration: 1000,
          success: () => {
            dd.hideLoading();
          }
        });
        that.onReset();
        setTimeout(function() { dd.navigateBack(); }, 1000)
      },
      fail: res => {
        dd.hideLoading();
      }
    })
  },
  onReset: function() {
    console.log('form发生了reset事件')
  },
  saveAsTemplate: function(e) {
    let that = this,
      param = {};
    param.name = this.data.templateName;
    param.title = this.data.title;
    param.context = this.data.context;
    param.sendEmail = this.data.sendEmail;
    param.sendDingMsg = this.data.sendDingMsg;
    param.sendNotice = this.data.sendNotice;

    http.request({
      url: 'meetingnoticetemplate/add',
      method: 'post',
      data: JSON.stringify(param),
      success: (res) => {
        dd.showToast({
          content: '模板保存成功',
          mask: true,
          duration: 1000
        });
      }
    })
  }
});
