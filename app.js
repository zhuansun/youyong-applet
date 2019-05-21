import urlConfig from './etc/config'

//app.js
App({

  //为了确保token被捕获之后，不会恶意请求。 需要在生成token的时候，加上ip吧。
  //只有通过小程序的App.onLaunch才可以生成token
  //加上ip限制的话，就会有一个问题，如果用户在使用期间切换了网络，需要提醒用户： 检测到您的网络发生变化，为了您的安全，请重新登陆


  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    wx.getSystemInfo({
      success(res) {
        console.log(res.brand)
        console.log(res.model)
        console.log(res.pixelRatio)
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        console.log(res.language)
        console.log(res.version)
        console.log(res.platform)
      }
    })


    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: urlConfig.basePath +'/api/user/sign/in', // 仅为示例，并非真实的接口地址
          data: {
            code: res.code
          },
          method: "POST",
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            if(res.code == 200){
              console.log("success");
            }else{
              console.log("fail");
            }
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {

              console.log("-----"+res)
              console.log(res)


              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
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
    userInfo: null
  },

   //声明urlConfig，以便于在后续所有页面都能使用
  urlConfig, 
})