const {
  $Message
} = require('../../../dist/base/index');
//获取应用实例
const app = getApp()

Page({
  data: {
    deviceHeight: null,
    dataList: [],
    data: {},
    diasbleBtn: false
  },

  getSystemInfo: function() {
    const _this = this;
    wx.getSystemInfo({
      success(res) {
        _this.setData({
          deviceWidth: res.windowWidth,
          deviceHeight: res.windowHeight,
        })
      }
    })
  },

  onLoad: function(options) {
    this.setData({
      diasbleBtn: false
    })
    this.getSystemInfo();
    console.log(options.module_id);
    this.getModuleDetail(options.module_id);
  },

  /**
   * 点击某一个模块，开始使用模块
   */
  getModuleDetail: function(moduleId) {
    const _this = this;
    const token = wx.getStorageSync('token');
    //将token放在请求头中。进行请求获取
    wx.request({
      url: app.urlConfig.basePath + "/api/module/detail",
      method: "POST",
      data: {
        'id': moduleId
      },
      header: {
        'content-type': 'application/json', // 默认值
        'authorization': token
      },
      success(res) {
        if (res.data.code == 200) {
          console.log(res.data.vo)
          console.log(res.data.vo.url)
          _this.getModuleData(res.data.vo.url)
        } else if (res.data.code == 207 || res.data.code == 206) {
          //失败
          app.globalData.errorMessage = res.data.msg;
          wx.removeStorageSync("token");
          wx.redirectTo({
            url: '../../index/index',
          })
        } else {
          console.log("服务器失败");
        }
      },
      fail() {
        console.log("服务器失败");
      }
    })
  },

  getModuleData: function(url) {
    const _this = this;
    const token = wx.getStorageSync('token');
    //将token放在请求头中。进行请求获取
    wx.request({
      url: app.urlConfig.basePath + url,
      method: "POST",
      header: {
        'content-type': 'application/json', // 默认值
        'authorization': token
      },
      success(res) {
        if (res.data.code == 200) {
          console.log("success");
          _this.setData({
            data: res.data.vo
          })
        } else if (res.data.code == 207 || res.data.code == 206) {
          //失败
          app.globalData.errorMessage = res.data.msg;
          wx.removeStorageSync("token");
          wx.redirectTo({
            url: '../../index/index',
          })
        } else {
          console.log("服务器失败");
        }
      },
      fail() {

      }
    })
  },


  //复制账号到剪切板
  copyAccountToClipboard: function() {
    const _this = this;
    console.log(_this.data.data.account);
    wx.setClipboardData({
      data: _this.data.data.account,
      complete(res) {
        wx.hideToast();
        $Message({
          content: "账号已经复制到剪切板",
          type: 'success'
        });
      }
    })
  },

  //复制密码到剪切板
  copyPasswordToClipboard: function() {
    const _this = this;
    console.log(_this.data.data.password);
    wx.setClipboardData({
      data: _this.data.data.password,
      complete(res) {
        wx.hideToast();
        $Message({
          content: "密码已经复制到剪切板",
          type: 'success'
        });
      }
    })
  },


  getRecentTenAccount: function(){
    console.log("互殴最近十条只能怪好");
    const _this = this;
    const token = wx.getStorageSync('token');
    //将token放在请求头中。进行请求获取
    wx.request({
      url: app.urlConfig.basePath + "/xlei/account/history",
      method: "POST",
      header: {
        'content-type': 'application/json', // 默认值
        'authorization': token
      },
      success(res) {
        if (res.data.code == 200) {
          console.log("success");
          _this.setData({
            dataList: res.data.voList
          })
          _this.setData({
            diasbleBtn: true
          })
        } else if (res.data.code == 207 || res.data.code == 206) {
          //失败
          app.globalData.errorMessage = res.data.msg;
          wx.removeStorageSync("token");
          wx.redirectTo({
            url: '../../index/index',
          })
        } else {
          console.log("服务器失败");
        }
      },
      fail() {

      }
    })
  }
})