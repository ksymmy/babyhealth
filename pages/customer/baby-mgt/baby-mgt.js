import lodash from 'lodash';
Page({
  data: {
      animationInfo: {}
  },
  onShow(){
    var animation = dd.createAnimation({
      duration: 1000,
      timeFunction: 'ease-in-out',
    });

    this.animation = animation;

    animation.scale(0.8,0.8).translate(35,-15).step();

    this.setData({
      animationInfo:animation.export()
    });

  }

});