const {$Message} = require('../../dist/base/index');
//获取应用实例
const app = getApp()

Page({
  data: {
    deviceHeight: null,
    class: 'success',
    visible: false,
    dataList: [],
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

  onLoad: function() {
    this.getSystemInfo();
    this.getModuleList(this.data.paginate.page);
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


  // // 下拉刷新
  // onRefresh: function() {
  //   // 显示顶部刷新图标
  //   wx.showNavigationBarLoading();
  //   console.log("下拉刷新");
  //   this.getModuleList(1);
  //   // 隐藏导航栏加载框
  //   wx.hideNavigationBarLoading();
  //   // 停止下拉动作
  //   wx.stopPullDownRefresh();
  // },


  /**
   * 页面上拉触底事件的处理函数
   */
  getMore: function() {
    if(this.data.paginate.hasNext){
      console.log("下拉加载，下拉加载下拉加载，下拉加载下拉加载，下拉加载下拉加载，下拉加载");
      // 显示加载图标
      // wx.showLoading({
      //   title: '玩命加载中',
      // })
      this.getModuleList(this.data.paginate.page + 1);
      // wx.hideLoading();
    }
    
  },

  //获取首页数据，进行加载
  getModuleList: function(currentPage) {
    //获取token
    let token = wx.getStorageSync('token');
    console.log("---->"+currentPage);
    const _this = this;
    
    //将token放在请求头中。进行请求获取
    wx.request({
      url: app.urlConfig.basePath + '/api/home/list',
      data: {
        'page': currentPage,
        'pageSize': this.data.paginate.pageSize,
        'query':{}
      },
      method: "POST",
      header: {
        'content-type': 'application/json', // 默认值
        'authorization': token
      },
      success(res) {
        if (res.data.code == 200) {
          console.log("success");
          if (currentPage === 1) {
            _this.setData({
              dataList: res.data.voList,
              paginate: {
                page: res.data.paginate.page,
                pageSize: res.data.paginate.perPage,
                hasNext: res.data.paginate.hasNext
              }
            })
          }else{
            _this.setData({
              dataList: [..._this.data.dataList, ...res.data.voList],
              paginate: {
                page: res.data.paginate.page,
                pageSize: res.data.paginate.perPage,
                hasNext: res.data.paginate.hasNext
              }
            })
            wx.hideLoading();
          }
        } else if (res.data.code == 207 || res.data.code == 206) {
          //失败
          app.globalData.errorMessage = res.data.msg;
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