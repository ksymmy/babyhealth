import list from '/components/list';

Page({
  ...list,
  data: {
    listData: {
      onItemTap: 'handleListItemTap',
      header: 'list1',
      data: [
        {
          title: '标题文字',
          extra: '基本使用'
        }
      ]
    },
  },
  handleListItemTap(e) {
    dd.showToast({
      content: `第${e.currentTarget.dataset.index}个Item`,
      success: (res) => {

      },
    });
  }
})