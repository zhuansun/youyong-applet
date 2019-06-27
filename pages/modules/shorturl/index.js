const {
  $Message
} = require('../../../dist/base/index');
//获取应用实例
const app = getApp()

Page({
  data: {
    deviceHeight: null,
    shortUrl: null,
    lodding: false,
    longUrl: null,
    type: null,
    typeArray: [{
        id: 1,
        name: "百度短连接"
      },
      {
        id: 2,
        name: "新浪短连接"
      }
    ],
    inputTypeName: null

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


  //复制到剪切板
  copyToClipboard: function() {
    const _this = this;
    console.log(_this.data.shortUrl);
    wx.setClipboardData({
      data: _this.data.shortUrl,
      complete(res) {
        wx.hideToast();
        $Message({
          content: "已经复制到剪切板",
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
      url: app.urlConfig.basePath + "/short/url",
      method: "POST",
      data: {
        "longUrl": _this.data.longUrl,
        "type": _this.data.type
      },
      // data: {
      //   "longUrl": "https://blog.csdn.net/qq_24821203",
      //   "type": 1
      // },
      header: {
        'content-type': 'application/json', // 默认值
        'authorization': token
      },
      success(res) {
        if (res.data.code == 200) {
          console.log("success", res.data.vo);
          _this.setData({
            shortUrl: res.data.vo
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

  inputLongUrl: function(e) {
    console.log(e.detail.detail.value)
    this.setData({
      longUrl: e.detail.detail.value
    })
  },

  inputType: function(e) {
    console.log(e.detail.value)
    const _this = this;
    this.setData({
      type: _this.data.typeArray[e.detail.value].id,
      inputTypeName: _this.data.typeArray[e.detail.value].name
    })
  },


})