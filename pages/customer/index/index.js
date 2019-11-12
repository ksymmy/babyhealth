import { HTTP } from '/util/http.js';
import { config } from '/app.js';
let http = new HTTP();

let setIndexForAdmin = [
  // {
  //   icon: '/image/notice.png',
  //   title: '通知公告',
  //   entitle: 'Canvas',
  //   page: '../../../../pages/org/notice/notice',
  // },
  // {
  //   icon: '/image/member.png',
  //   title: '会员管理',
  //   entitle: 'Canvas',
  //   page: '../../../../pages/org/memberManage/memberManage',
  // },
  // {
  //   icon: '/image/meeting.png',
  //   title: '会议管理',
  //   entitle: 'Canvas',
  //   page: '../../../../pages/org/meetingManage/meetingManage',
  // },
  // {
  //   icon: '/image/new_user.png',
  //   title: '新用户审核',
  //   entitle: 'Canvas',
  //   page: '../../../../pages/org/userCheck/list',
  // },
  // {
  //   icon: '/image/view.png',
  //   title: '切换角色',
  //   entitle: 'Canvas',
  //   page: '../../../../pages/index/switchrole/switchrole',
  // },
];

let setIndexForMember = [
  // {
  //   icon: '/image/notice.png',
  //   title: '通知公告',
  //   entitle: 'Canvas',
  //   page: '../../../../pages/member/notice/notice',
  // },
  // {
  //   icon: '/image/meeting.png',
  //   title: '会议管理',
  //   entitle: 'Canvas',
  //   page: '../../../../../pages/member/meetingManage/list/list',
  // },
];

Page({
  data: {
    pageName: '/pages/index/index',
    pageInfo: {
      pageId: 0,
    },
    hidden: true,
    curIndex: 0,
    arr: {
      onItemTap: 'onGridItemTap',
      onChildItemTap: 'onChildItemTap',
      list: [],
    },
    tips:null,
    flag:null,//控制是否显示底部tag栏，0不显示，1显示
    indexIcon:"/image/menuiconx01.png",
    myIcon:"/image/menuicon03.png",
  },

  onShow() {
    // dd.showLoading({
    //   content: '加载中',
    // });
    setIndexForAdmin = [];
    setIndexForMember = [];
    getApp().login().then(function () {
      setIndex();
    });
  },
  onGridItemTap(e) {
    const curIndex = e.currentTarget.dataset.index;
    const childList = this.data.arr.list[curIndex];
    if (childList.subs) {
      this.setData({
        hidden: !this.data.hidden,
        curIndex,
      });
      this.createMaskShowAnim();
      this.createContentShowAnim();
    } else {
      this.onChildItemTap({
        currentTarget: {
          dataset: { page: childList.page },
        },
      });
    }
  },
  onChildItemTap(e) {
    const { page } = e.currentTarget.dataset;
    dd.navigateTo({
      url: `${page}/${page}`,
    });
  },

  reApprove(){
    var thisPage = this;
    dd.confirm({
      title: '提示',
      content: '是否提交重新审核？',
      confirmButtonText:'确认',
      cancelButtonText:'返回',
      success:(result)=>{
        if(result.confirm){
          dd.httpRequest({
            url:config.api_base_url+'user/reApprove',
            method: 'POST',
            dataType: 'json',
            headers: {
              'token': dd.getStorageSync({ key: 'token' }).data,//从前端缓存取
            },
            success:function(){
              dd.alert({
                title:'提交成功！',
                buttonText:'确认',
              })
              //刷新页面
              thisPage.onShow();
            }
          })
        }
      }
    });
  },

  toMy(){
    dd.reLaunch ({
      url:'/pages/my/my-shzz'
    })
  },
});

function showToast(msg){
  dd.showToast({
    content:msg,
  })
}

function setIndex(){
  var pages = getCurrentPages()    //获取加载的页面
  var thisPage = pages[pages.length-1]    //获取当前页面的对象 
  console.log('thisPage',thisPage);
  dd.httpRequest({
    url:config.api_base_url+"user/selectUserInfoByToken",
    method: 'POST',
    dataType: 'json',
    headers: {
      'token': dd.getStorageSync({ key: 'token' }).data,//从前端缓存取
    },
    success:function(res){
      var jsonData = res.data.data;
      console.log('jsonData',jsonData);
      if(jsonData!=null){
        if(jsonData.userInfo!=null){
          if (jsonData.userInfo.status == 3) { //已停用
            thisPage.setData({
              tips:"账号已停用，请联系管理员",
              flag:0,
            })
          } else if (jsonData.userInfo.status == 2) {
            thisPage.setData({
              tips:"社会团体管理员审核不通过",
              flag:0,
            })
          } else {
            // if(jsonData.userInfo.userType == 0 || jsonData.userInfo.userType == 1){
            //   addSwitchRole ();
            // }
            if (jsonData.userInfo.curUserType == 0) { //当前用户类型是管理员
              if (!jsonData.isPerfectCorpInfo) { //未完善社会组织基本信息
                //跳转到社会组织基本信息维护页面
                dd.navigateTo({
                  url: '/pages/org/my/baseInfo/baseinfo?status=0',
                });
                thisPage.setData({
                  flag:0,
                })
              }else{
                setIndexForAdminPush();
                thisPage.setData({
                  arr: {
                    onItemTap: 'onGridItemTap',
                    onChildItemTap: 'onChildItemTap',
                    list: setIndexForAdmin
                  },
                  flag:1
                })
              }
            } else if (jsonData.userInfo.curUserType == 1) { //当前用户类型工作人员
              setIndexForAdminPush();
              thisPage.setData({
                arr: {
                  onItemTap: 'onGridItemTap',
                  onChildItemTap: 'onChildItemTap',
                  list: setIndexForAdmin
                },
                flag:1
              })
            } else if (jsonData.userInfo.curUserType == 2) { //当前用户类型个人会员
              if (jsonData.isPerfectPersonalInfo) {  //已完善个人信息
                setIndexForMemberPush();
                //跳转到社会组织会员首页
                thisPage.setData({
                  arr: {
                    onItemTap: 'onGridItemTap',
                    onChildItemTap: 'onChildItemTap',
                    list: setIndexForMember
                  },
                  flag:1
                })
              } else {  //未完善个人信息
                dd.navigateTo({
                  url:'/pages/member/my/baseInfo/personal/personal?status=0',
                });
                thisPage.setData({
                  flag:0,
                })
              }
            } else if (jsonData.userInfo.curUserType == 3) { //当前用户类型单位会员
              if (jsonData.isPerfectPersonalInfo) {  //已完善企业信息
                setIndexForMemberPush();
                //跳转到社会组织会员首页
                thisPage.setData({
                  arr: {
                    onItemTap: 'onGridItemTap',
                    onChildItemTap: 'onChildItemTap',
                    list: setIndexForMember
                  },
                  flag:1
                })
              } else {  //未完善企业信息
                //跳转到单位会员基本信息维护页面
                dd.navigateTo({
                  url: '/pages/member/my/baseInfo/company/company?status=0',
                });
                
                thisPage.setData({
                  flag:0
                })
              }
            } else if(jsonData.userInfo.userType == null){  //userType=null，管理员未分配角色,status一定是0
              thisPage.setData({
                tips:"请联系社会团体管理员审核！",
                flag:0
              })
            }
          }
        }else{
          thisPage.setData({
            tips:"系统错误！"
          })
        }
      }else{
        thisPage.setData({
          tips:"系统错误！"
        })
      }
    },
    fail:function(){
      thisPage.setData({
        tips:"系统错误！"
      })
    },
    // complete:function(){
    //   dd.hideLoading();
    // }
  })

  // function addSwitchRole () {
  //   setIndexForAdmin.push({
  //     icon: '/image/view.png',
  //     title: '切换角色',
  //     entitle: 'Canvas',
  //     page: '../../../../pages/index/switchrole/switchrole',
  //   },);
  //   setIndexForMember.push({
  //     icon: '/image/view.png',
  //     title: '切换角色',
  //     entitle: 'Canvas',
  //     page: '../../../../pages/index/switchrole/switchrole',
  //   },);
  // }

  function setIndexForAdminPush () {
    setIndexForAdmin.push(
      {
        icon: '/image/notice.png',
        title: '通知公告',
        entitle: 'Canvas',
        page: '../../../../pages/org/notice/notice',
      },
      {
        icon: '/image/member.png',
        title: '会员管理',
        entitle: 'Canvas',
        page: '../../../../pages/org/memberManage/memberManage',
      },
      {
        icon: '/image/meeting.png',
        title: '会议管理',
        entitle: 'Canvas',
        page: '../../../../pages/org/meetingManage/meetingManage',
      },
      {
        icon: '/image/new_user.png',
        title: '新用户审核',
        entitle: 'Canvas',
        page: '../../../../pages/org/userCheck/list',
      },
    )
  }

  function setIndexForMemberPush(){
    setIndexForMember.push(
      {
      icon: '/image/notice.png',
      title: '通知公告',
      entitle: 'Canvas',
      page: '../../../../pages/member/notice/notice',
      },
      {
        icon: '/image/meeting.png',
        title: '会议管理',
        entitle: 'Canvas',
        page: '../../../../../pages/member/meetingManage/list/list',
      },
    )
  }
}