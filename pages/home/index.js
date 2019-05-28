const {$Message} = require('../../dist/base/index');
//获取应用实例
const app = getApp()

Page({
  data: {
    deviceHeight: null,
    class: 'success',
    visible: false,
    data: {
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
        }
      ]
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

  onLoad: function() {
    this.getSystemInfo();
    this.getModuleList();
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


  // 下拉刷新
  onRefresh: function() {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    console.log("下拉刷新");

    // 隐藏导航栏加载框
    wx.hideNavigationBarLoading();
    // 停止下拉动作
    wx.stopPullDownRefresh();


    // var that = this;
    // wx.request({
    //   url: 'https://xxx/?page=0',
    //   method: "GET",
    //   header: {
    //     'content-type': 'application/text'
    //   },
    //   success: function (res) {
    //     that.setData({
    //       moment: res.data.data
    //     });
    //     console.log(that.data.moment);
    //     // 隐藏导航栏加载框
    //     wx.hideNavigationBarLoading();
    //     // 停止下拉动作
    //     wx.stopPullDownRefresh();
    //   }
    // })
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  getMore: function() {
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })

    console.log("下拉加载");
    wx.hideLoading();
    // // 页数+1
    // page = page + 1;
    // wx.request({
    //   url: 'https://xxx/?page=' + page,
    //   method: "GET",
    //   // 请求头部
    //   header: {
    //     'content-type': 'application/text'
    //   },
    //   success: function (res) {
    //     // 回调函数
    //     var moment_list = that.data.moment;
    //     const oldData = that.data.moment;
    //     that.setData({
    //       moment: oldData.concat(res.data.data)
    //     })
    //     // 隐藏加载框
    //     wx.hideLoading();
    //   }
    // })

  },



  //获取首页数据，进行加载
  getModuleList: function() {
    //获取token
    let token = wx.getStorageSync('token');
    console.log(token);
    //将token放在请求头中。进行请求获取
    wx.request({
      url: app.urlConfig.basePath + '/api/home/list',
      method: "POST",
      header: {
        'content-type': 'application/json', // 默认值
        'authorization': token
      },
      success(res) {
        console.log(res.data.code);
        if (res.data.code == 200) {
          console.log("success");
        } else if (res.data.code == 207 || res.data.code == 206) {
          console.log(res.data.msg);
          app.globalData.errorMessage = res.data.msg;
          //清除token
          wx.removeStorageSync("token");
          wx.redirectTo({
            url: '../index/index',
          })
        } else {
          console.log("服务器失败");
        }
      },
      fail() {
        console.log("请求失败");
      }
    })

  }
})