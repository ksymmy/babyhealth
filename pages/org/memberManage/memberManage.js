Page({
  data: {},
  onLoad() {

  },
  onMembermManage(event) {
    dd.navigateTo({
      url: `list`,
    });
  },
  onDuesRecord(event) {
    dd.navigateTo({
      url: `duesrecord/duesrecord`,
    });
  },
  onDuesNotice(event) {
    dd.navigateTo({
      url: `duesnotice/duesnotice`,
    });
  }
});