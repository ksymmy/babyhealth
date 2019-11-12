import { HTTP } from '/util/http.js';
import { config } from '/app.js';
let http = new HTTP();
Page({
  data: {
    noticeInfo: {},
    fileInfos: [],
    id:'',
    handerUrl: '',
    meetingId: ''
  },
  onLoad(options) {
    let that=this;
     this.setData({
      id: options.id,
      handerUrl: getApp().globalData.handerUrl,
    })
   
  },
  onShow(){
    let that=this;
    if(!this.data.id){
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
      url: 'orgNotice/getNoticeInfoById',
      method: 'GET',
      data: {'noticeId': this.data.id},
      success: (res) => {
          //页面显示
         that.setData({
            noticeInfo: res,
         });
      }
      })
      //附件
      http.request({
      url:  'file/getlist?recordid=' + this.data.id,
      success: (res) => {
        for (var i = 0; i < res.length; i++) {
            res[i].fileSize_b = that.byte(res[i].fileSize);
            res[i].extension_b = '/image/fileicon/' + res[i].extension + '.png';
          }
          //页面显示
         that.setData({
            fileInfos: res,
         });
        }
      })
    }
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
  },byte: function(limit) {
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