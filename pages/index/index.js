import urlConfig from '../../etc/config'
const {
  $Message
} = require('../../dist/base/index');
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    current: 0,
    hasLogin: false
  },

  toUse: function (e) {
    console.log("跳转到首页，准备使用了。。。。。。");
  },

  login: function(e) {
    //拿到用户的头像信息之后，紧接着请求服务器接口进行登陆
    wx.login({
      success: res => {
        const _this = this;
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: urlConfig.basePath + '/api/user/sign/in',
          data: {
            code: res.code
          },
          method: "POST",
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res.data.code);
            if (res.data.code == 200) {
              console.log("success");
              $Message({
                content: "登陆成功",
                type: 'success'
              });
              _this.setData({
                current: 2,
                hasLogin: true
              })
            } else {
              $Message({
                content: res.data.msg,
                type: 'error'
              });
            }
          }
        })
      }
    })
  },


  onLoad: function() {
    //1.判断是否有用户的头像信息，2.判断缓存中是否有token
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        current: 1
      })
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          current: 1
        })
      }
    } else {
      wx.getUserInfo({
        success: res => {
          console.log(res.userInfo);
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
            current: 1
          })
        }
      })
    }
  },


  getUserAvatarAndName: function(e) {
    console.log(e)
    console.log(app.urlConfig.basePath)
    console.log(e.detail.userInfo)
    if (e.detail.userInfo === undefined) {
      console.log("您没有授权")
    } else {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true,
        current: 1
      })
      $Message({
        content: "头像信息获取成功",
        type: 'success'
      });
    }
  }
})