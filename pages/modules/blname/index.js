const {
  $Message
} = require('../../../dist/base/index');
//获取应用实例
const app = getApp()

Page({
  data: {
    deviceHeight: null,
    dataList: [],
    lodding: false,
    gameName: null,
    count: null

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
    this.getSystemInfo();
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
  copyToClipboard: function(e) {

  console.log(e.currentTarget.dataset['index'])

    const _this = this;
    console.log(e.currentTarget.dataset['index']);
    wx.setClipboardData({
      data: e.currentTarget.dataset['index'],
      complete(res) {
        wx.hideToast();
        $Message({
          content: "已经复制到剪切板",
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

  startGenerate: function() {
    console.log("开始生成");

    this.setData({
      lodding: true
    })

    const _this = this;
    const token = wx.getStorageSync('token');
    //将token放在请求头中。进行请求获取
    wx.request({
      url: app.urlConfig.basePath + "/blank/name/generate",
      method: "POST",
      data: {
        "name": _this.data.gameName,
        "count": _this.data.count
      },
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
        } else if (res.data.code == 207 || res.data.code == 206) {
          //失败
          app.globalData.errorMessage = res.data.msg;
          wx.removeStorageSync("token");
          wx.redirectTo({
            url: '../../index/index',
          })
        } else {
          console.log("服务器失败");
          $Message({
            content: res.data.msg,
            type: 'error'
          });
        }
        _this.setData({
          lodding: false
        })
      },
      fail() {
        _this.setData({
          lodding: false
        })
        $Message({
          content: "请求失败",
          type: 'error'
        });
      }
    })
  },

  inputGameName: function(e) {
    console.log(e.detail.detail.value)
    this.setData({
      gameName: e.detail.detail.value
    })
  },

  inputBlankCount: function(e) {
    this.setData({
      count: e.detail.detail.value
    })
  },

})