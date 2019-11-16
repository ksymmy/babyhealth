import { config } from '/app.js';

/**
 * params属性如下:
 * 
 * url:
 * method:
 * data:
 * timeout:
 * dataType:
 * success:成功回调
 * fail:失败回调
 * complete:完成时调
 */

class HTTP {
  request(params) {
    dd.getStorage({
      key: 'userInfo', success: (r) => {
        dd.showLoading({ content: '加载中...' });
        dd.httpRequest({
          url: encodeURI(config.api_base_url + params.url),
          method: params.method || 'GET',
          data: params.data,
          timeout: params.timeout || 10000,
          dataType: params.dataType || 'json',
          headers: {
            'corpid': dd.corpId,
            'userid': r.data ? r.data.userid : '',
            'Content-Type': 'application/json',
          },
          success: (res) => {
            if (res.data.code == "0000" && params.success) {
              params.success(res.data.data);
            } else if (["0001"].indexOf(res.data.code) > -1) {
              // 关闭当前所有页面，跳转到首页
              dd.reLaunch({
                url: '/pages/index/index'
              })
            } else if (["9999", "4444"].indexOf(res.data.code) > -1) {
              this._show_msg('网络异常，请重试');
            } else {
              this._show_msg(res.data.message);
            }
          },
          fail: (res) => {
            // this._show_msg('网络异常，请重试');
            if (params.fail) params.fail(res);
          },
          complete: (res) => {
            dd.hideLoading();
            if (params.complete) params.complete(res);
          }
        })
      }
    });
  }

  _show_msg(msg) {
    dd.showToast({
      content: msg
    });
  }
}

class UUID {
  uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    }).replace(/-/g, '');
  }
}

export { HTTP }
export { UUID }