import urlConfig from './etc/config'

//app.js
App({
  onLaunch: function () {
    const _this = this;
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              _this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (_this.userInfoReadyCallback) {
                _this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },


  onShow: function () {
    console.log("app.js ---onShow---");
  },
  onHide: function () {
    console.log("app.js ---onHide---");
  },
  globalData: {
    userInfo: null,
    errorMessage: null//用于当从其他页面跳转到登陆页面时，在登录页面显示错误信息
  },
   //声明urlConfig，以便于在后续所有页面都能使用
  urlConfig, 
})