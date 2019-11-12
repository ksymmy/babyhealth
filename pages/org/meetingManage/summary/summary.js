import { HTTP } from '/util/http.js';
let http = new HTTP();
Page({
  data: {
    meetingId: '',
    files: [],
  },
  onLoad: function(e) {
    dd.showLoading({ content: '加载中', });
    let that = this;
    if (!this.data.meetingId) {
      this.setData({
        meetingId: e.meetingId,
      })
    }
    return new Promise(function(resolve, reject) {
      http.request({
        url: 'file/getlist?type=2&recordid=' + that.data.meetingId,
        success: res => {
          for (var i = 0; i < res.length; i++) {
            res[i].fileSize_b = that.byte(res[i].fileSize);
            res[i].extension_b = '/image/fileicon/' + res[i].extension + '.png';
          }
          that.setData({
            files: res,
          })
        },
        complete: res => {
          dd.hideLoading();
        }
      })
      resolve(null)
    }).then(function(data) {
      //获取spaceId
      http.request({
        url: 'file/getSpace?corpId=' + dd.corpId,
        success: res => {
          that.setData({
            spaceId: res
          })
        }
      })
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
              url: 'file/uploadDingTalk?app=社管通/会议管理/会议纪要&type=2&recordId=' + that.data.meetingId,
              method: 'post',
              data: JSON.stringify(res.data),
              success: res => {
                dd.showToast({ content: '上传成功' });
                that.onLoad();
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
              that.onLoad();
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
});
