
/**
 * 发送DING通知:
 */

function createDing(params) {
  if (!(params.users instanceof Array) || !params.corpId) {
    return
  }
  dd.createDing({
    users: params.users, //默认选中用户工号列表；类型: Array<String>
    corpId: params.corpId, // 类型: String
    alertType: params.alertType || 2, // 钉发送方式 0:电话, 1:短信, 2：应用内；类型 Number
    // alertDate: {}, // 非必选，定时发送时间, 非定时DING不需要填写
    type: 1,// 附件类型 1：image, 2：link；类型: Number
    text: params.text || '',  // 正文
    bizType: 0, // 业务类型 0：通知DING；1：任务；2：会议；
    success: function(res) {
      console.log('success' + res)
    },
    fail: function(err) {

    }
  })
}

export default {
  createDing
}