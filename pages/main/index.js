const {
  $Message
} = require('../../dist/base/index');
//获取应用实例
const app = getApp()

Page({
  data: {
    deviceHeight: null,
    class: 'success',
    visible: false,
    data: {
      'classify': '这里是分类啊',
      'list': [{
          'id': '1',
          'title': '迅雷',
          'color': 'success',
          'content': '这里是迅雷描述'
        },
        {
          'id': '2',
          'title': '百度云',
          'color': 'primary',
          'content': '这里是百度云描述'
        },
        {
          'id': '3',
          'title': '麻花影视',
          'color': 'dark-primary',
          'content': '这里是麻花影视描述'
        },
        {
          'id': '4',
          'title': '漫画岛',
          'color': 'success',
          'content': '这里是漫画岛描述'
        },
        {
          'id': '5',
          'title': '微信',
          'color': 'success',
          'content': '这里是微信的描述'
        }
      ]
    }
  },

  getSystemInfo: function() {
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

  clickToUseFunction: function(e) {
    console.log(e)
    console.log(e.currentTarget.id);
    console.log(app.urlConfig.basePath)

    this.setData({
      visible: true
    });

  },

  handleOk: function() {
    console.log("点击了ok");
    this.setData({
      visible: false
    });
  },

  handleClose: function() {
    console.log("点击了取消");
    this.setData({
      visible: false
    });
  },

})