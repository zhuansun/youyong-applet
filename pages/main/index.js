import urlConfig from '../../etc/config'
const {
  $Message
} = require('../../dist/base/index');
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    deviceHeight:null
  },

test: function(e) {
  console.log(e.currentTarget.id)
  console.log("-------");
},

  getSystemInfo() {
    const _this = this;
    wx.getSystemInfo({
      success(res) {
        console.log(res.model)
        console.log(res.pixelRatio)
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        console.log(res.language)
        console.log(res.version)
        console.log(res.platform)

        _this.setData({
          deviceWidth: res.windowWidth,
          deviceHeight: res.windowHeight,
        })
      }
    })
  },

  onLoad: function() {
    //1.取出token

    let token = wx.getStorageSync('token');

    console.log(token);

    this.getSystemInfo();

  },

})