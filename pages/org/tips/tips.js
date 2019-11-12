Page({
  data: {
    tipInfo:'',
  },
  onLoad(e) {
    console.log('status='+e.status+',userType='+e.userType);
    if(e.status == 0){
      this.setData({
        tipInfo:'未审核，请联系管理员!'
      })
    }else if(e.status == 2){
      this.setData({
        tipInfo:'审核不通过，请联系管理员!'
      })
    }else if(e.status == 3){
      this.setData({
        tipInfo:'账号已停用，请联系管理员!'
      })
    }else if(e.status == 1){
      if(e.userType == 2){  //个人会员
        this.setData({
          tipInfo:'请完善个人基本信息!'
        })
      }else if(e.userType == 3){ //单位会员
        this.setData({
          tipInfo:'请完善企业基本信息!'
        })
      }
    }
  },

});



