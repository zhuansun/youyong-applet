const {$Message} = require('../../../dist/base/index');
//获取应用实例
const app = getApp()

Page({
  data: {
    deviceHeight: null,
    visible: false,
    dataList: [],
    data: {},
    paginate: {
      page: 1,
      pageSize: 20,
      hasNext: false
    }
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

  getModuleData: function (url) {
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
            visible: true,
            data: {
              title: "成功",
              context1: "账号: " + res.data.vo.account,
              context2: "密码: " + res.data.vo.password
            }
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
          _this.setData({
            visible: true,
            data: {
              title: "失败",
              context1: "今日的免费账号已被获取",
              context2: "明天再来试试吧"
            }
          })
        }
      },
      fail() {
        _this.setData({
          visible: true,
          data: {
            title: "失败",
            context1: "请求失败",
            context2: "请稍后再试"
          }
        })
      }
    })
  },



  handleOk: function() {
    console.log("点击了ok");
    this.setData({
      visible: false
    });
    const _this = this;
    wx.setClipboardData({
      data: this.data.data.context1 + this.data.data.context2 + this.data.data.context3,
      complete(res) {
        wx.hideToast();
        if(_this.data.data.title == "成功"){
          $Message({
            content: "已经复制到剪切板",
            type: 'success'
          });
        }
      }
    })

  },

  handleClose: function() {
    console.log("点击了取消");
    this.setData({
      visible: false
    });
  }
})