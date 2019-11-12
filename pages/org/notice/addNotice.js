import { HTTP } from '/util/http.js';
import { config } from '/app.js';
let http = new HTTP();
Page({
  data: {
    noticeInfo: [],
    fileInfos: [],
    id:'',
    handerUrl: '',
    meetingId: '',
    spaceId: '',
  },
  onLoad(options) {
    let that=this;
     this.setData({
      id: options.id,
      handerUrl: getApp().globalData.handerUrl,
    })
  },
  async onReady(){
    let that=this;
    console.log(this.data.id);
    if(this.data.id == undefined){
     http.request({
      url: 'orgNotice/getId',
      method: 'GET',
      success: (res) => {
          //页面显示
         that.setData({
            id: res,
         });
      }
      })
      }else{
        http.request({
          url: 'orgNotice/getNoticeInfoById?noticeId='+this.data.id,
          method: 'GET',
          success: (res) => {
              //页面显示
            that.setData({
                noticeInfo: res,
            });
          }
        })
      }
    //附件
      dd.showLoading({content: '加载中',});
      await this.requestFile();
      await this.requestSpaceId();
      dd.hideLoading();
  },
  requestFile(){
    let that=this;
    //附件
    return new Promise((resolve, reject) => {
    http.request({
      url:  'file/getlist?recordid=' + this.data.id,
      success: (res) => {
        for (var i = 0; i < res.length; i++) {
            res[i].fileSize_b = that.byte(res[i].fileSize);
            res[i].extension_b = '/image/fileicon/' + res[i].extension + '.png';
          }
        //页面显示
        this.setData({
            fileInfos: res,
        });
        resolve(res);
      }
    }) 
    })   
  },
  requestSpaceId(){
    let that=this;
    //获取spaceId
    return new Promise((resolve, reject) => {
      http.request({
        url: 'file/getSpace?corpId=' + dd.corpId,
        success: res => {
          that.setData({
            spaceId: res
          })
          resolve(res);
        }
      })
    })
  },
  previewFileInDingTalk(e) {
    let entity = e.currentTarget.dataset.entity;
    dd.showLoading({ content: '请稍后', });
    dd.getAuthCode({
      success: res => {
        http.request({
          url: 'file/grant?grantType=download&corpId=' + dd.corpId + '&authCode=' + res.authCode + '&fileids=' + entity.fileId,
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
      }
    })
  },
  uploadFile() {
    dd.showLoading({ content: '请稍后', });
    var that = this, spaceId = this.data.spaceId;
    dd.getAuthCode({
      success: res => {
        //授权
        http.request({
          url: 'file/grant?grantType=add&corpId=' + dd.corpId + '&authCode=' + res.authCode,
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
                  url: 'file/uploadDingTalk?app=社管通/通知公告/附件&type=2&recordId=' + that.data.id,
                  method: 'post',
                  data: JSON.stringify(res.data),
                  success: res => {
                    dd.showToast({ content: '上传成功' });
                    that.requestFile();
                  }
                })
                
              },
              fail: (err) => {
                console.log(err);
              }
            })

          }
        })
      }
    })
  },
  requestFiles() {
    http.request({
      url: 'file/getlist?recordid=' + this.data.id,
      success: res => {
        this.setData({
          fileInfos: res
        })
      }
    })
  },
  //提交表单
   bindFormSubmit(e) {
     let that=this;
     if(!e.detail.value.title)
     return dd.showToast({content: '标题不能为空',icon: 'false',duration: 2000 });
     if(!e.detail.value.context)
     return dd.showToast({content: '内容不能为空',icon: 'false',duration: 2000 });
    // 请求
    http.request({
      url: 'orgNotice/saveNotice',
      method: 'POST',
      data: JSON.stringify({'id':e.detail.value.id,'type':e.detail.value.type,'title':e.detail.value.title,'context':e.detail.value.context,'state':e.buttonTarget.dataset.state}),
      success: (res) => {
          if(e.buttonTarget.dataset.state == 0){
             dd.showToast({content: '保存成功',icon: 'true',duration: 2000 });
          }else{
              dd.showToast({content: '发布成功',icon: 'true',duration: 2000 });
          }
           setTimeout(() => {
              dd.navigateBack();
            }, 1000);
         
        
        }
      })
  },
  clearFile(e){
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
              that.requestFile();
            }
          })
        }
      }
    });

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
  
})