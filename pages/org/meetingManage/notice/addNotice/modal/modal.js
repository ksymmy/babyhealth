Page({
  data: {
    modalOpened: true,
    templateName: '',
  },
  onLoad() { },
  openModal() {
    this.setData({
      modalOpened: true,
    });
  },
  onModalClick() {
    if (!this.data.templateName) {
      dd.showToast({
        type: 'none',
        content: '模板名称不能为空',
        duration: 1000
      });
      return
    }
    this.setData({
      modalOpened: false,
    });
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      templateName: this.data.templateName,
    });
    prevPage.saveAsTemplate();
    setTimeout(() => { dd.navigateBack() }, 500);
  },
  onModalClose() {
    this.setData({
      modalOpened: false,
      templateName: ''
    });
    console.log('onModalClose' + this.data.templateName)
  },
  handleTemplateInput(e) {
    this.setData({
      templateName: e.detail.value,
    });
  },
});
