var _my$getSystemInfoSync = my.getSystemInfoSync(),
  windowWidth = _my$getSystemInfoSync.windowWidth;

Component({
  props: {
    className: '',
    activeCls: '',
    tabBarUnderlineColor: '#108ee9',
    // 选中选项卡下划线颜色
    tabBarActiveTextColor: '#108ee9',
    // 选中选项卡字体颜色
    tabBarInactiveTextColor: '#333333',
    // 未选中选项卡字体颜色
    tabBarBackgroundColor: '#ffffff',
    // 选项卡背景颜色
    showPlus: false,
    swipeable: true,
    activeTab: 0,
    // 当前激活tab
    animation: true,
    tabBarCls: '',
    // tabbar的自定义样式class
    duration: 500,
    popShow: false,
    showMask: true,
    popList: [],
    flag: false
  },
  data: {
    windowWidth: windowWidth,
    tabWidth: 0.2,
    autoplay: false,
    animation: false,
    version: my.SDKVersion
  },
  didMount: function didMount() {
    var _this$props = this.props,
      tabs = _this$props.tabs,
      animation = _this$props.animation;
    if (tabs.length == 1) {
      this.setData({
        flag: true
      })
    }

    this.setData({
      tabWidth: tabs.length > 4 ? 0.2 : 1 / tabs.length,
      animation: animation,
      autoplay: true
    });
  },
  didUpdate: function didUpdate(prevProps) {
    var tabs = this.props.tabs;
    if (tabs.length == 1) {
      this.setData({
        flag: true
      })
    }

    if (prevProps.tabs.length !== tabs.length) {
      this.setData({
        tabWidth: tabs.length > 4 ? 0.2 : 1 / tabs.length
      });
    }
  },
  methods: {
    handleSwiperChange: function handleSwiperChange(e) {
      var current = e.detail.current;
      var currentVal = this.props.tabs[current];
      if (this.props.onChange) {
        this.props.onChange(
          current,
          currentVal
        );
      }
    },
    handleTabClick: function handleTabClick(e) {
      var index = e.target.dataset.index;
      var val = this.props.tabs[index];
      if (this.props.onTabClick) {
        this.props.onTabClick(
          index,
          val
        );
      }
    },
    handlePlusClick: function handlePlusClick() {
      if (this.props.onPlusClick) {
        this.props.onPlusClick();
      }
    },
    onMaskClick: function onMaskClick() {
      if (this.props.onMaskClick) {
        this.props.onMaskClick();
      }
    },
    onPopClick: function onPopClick(e) {
      var chooseNum = e.target.dataset.value
      if (this.props.onPopClick) {
        this.props.onPopClick({
          chooseNum: chooseNum
        });
      }

    },

  }
});