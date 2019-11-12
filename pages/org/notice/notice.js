import { HTTP } from '/util/http.js';
import { config } from '/app.js';
let http = new HTTP(), page = 1;
Page({
  data: {
    arrrOrgNotice: [],
    currentId:'',
    inputValue:'',
  },
  onLoad(){
    },
  onShow(){
      let that=this;
    page = 1;
    this.setData({
      arrrOrgNotice: []
    })
    this.onRequest();
  },
  onRequest() {
    dd.showLoading({
      content: '加载中',
    });
    let that = this;
    console.log('请求page:' + page)
    http.request({
      url: 'orgNotice/getNoticeInfo',
      method: 'post',
      data: JSON.stringify({
        param: { noticeId: that.data.inputValue },
        page: page,
        size: config.pageSize,
         //size: 5,
      }),
      success: (res) => {
        if (res.length == 0) {
          return
        }
        page++;
        var oldData = that.data.arrrOrgNotice;
        var newData = oldData.concat(res);
        that.setData({
          arrrOrgNotice: newData,
        })
        // dd.hideLoading();
      },
      fail: function(res) {
        dd.alert({ content: JSON.stringify(res), buttonText: '好的' });
      },
      complete: function() {
        dd.hideLoading();
        //that.stopPullDownRefresh();
      }
    })
  },
   onReachBottom(){
    this.onRequest();
  },
    addOrgNotice(e){
      dd.navigateTo({
        url:`./addNotice`
      })
      page = 1;
      this.setData({
        arrrOrgNotice: []
      })
      this.onRequest();
    },
    updateNotice(e){
        dd.navigateTo({
        url:`./addNotice?id=`+e.currentTarget.dataset.noticeId,
      })
      page = 1;
      this.setData({
        arrrOrgNotice: []
      })
      this.onRequest();
    },
    findOrgNotice(e){
      console.log(e);
      dd.navigateTo({
        url:`./findNotice/findNotice?id=`+e.currentTarget.dataset.noticeId,
      })
    },
    insertNotice(e){
      let that=this;
      dd.confirm({
      title: '温馨提示',
      content: '确定发布通知公告吗？',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      success: (result) => {
        if(result.confirm){
          http.request({
            url: 'orgNotice/publishNotice',
            method: 'GET',
            data: e.currentTarget.dataset,
            success: (res) => {
                //页面显示
              page = 1;
                that.setData({
                  arrrOrgNotice: []
                })
                that.onRequest();
              }
            })
          }else{ return;}
        },fail() {console.log('fail');return;},
      });
    },
    deleteNotice(e){
      let that=this;
      dd.confirm({
      title: '温馨提示',
      content: '确定删除该附件吗?',
      confirmButtonText: '确认',
      cancelButtonText: '返回',
      success: (result) => {
        if(result.confirm){
          http.request({
            url: 'orgNotice/deleteNotice',
            method: 'GET',
            data: e.currentTarget.dataset,
            success: (res) => {
                //页面显示
              page = 1;
              that.setData({
                arrrOrgNotice: []
              })
              that.onRequest();
              }
            })
          }else{ return;}
        },fail() {console.log('fail');return;},
      });
    },
    updateNoticeState(e){
      let that=this;
      dd.confirm({
      title: '温馨提示',
      content: '确定取消发布吗？',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      success({ confirm }) {
        if(confirm){
          http.request({
            url: 'orgNotice/publishNotice',
            method: 'GET',
            data: e.currentTarget.dataset,
            success: (res) => {
                //页面显示
                page = 1;
                that.setData({
                  arrrOrgNotice: []
                })
                that.onRequest();
              }
            })
          }else{ return;}
        },fail() {console.log('fail');return;},
      });
      
    },
    handleListItemTap(e) {
      var id=this.data.arrrNotice[e.currentTarget.dataset.index].id;
       const { page } = e.currentTarget.dataset;
        dd.navigateTo({
          url: `./noticeInfo?noticeId=`+id,
        });
      
    dd.showToast({
      content: `第${e.currentTarget.dataset.index}个Item`,
      success: (res) => {
      },
    });
  },
   handleSearch(e) {
    console.log('search', e.detail.value);
    this.setData({
      search: e.detail.value,
    });
  },
  clearSearch() {
    console.log('clear search', this.data.search);
    this.setData({
      search: '',
    });
  },
});


  