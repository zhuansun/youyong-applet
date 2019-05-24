import urlConfig from '../../etc/config'
const {
  $Message
} = require('../../dist/base/index');
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    current: 'tab1',
    visible_sheet: false,
    //小程序没有refs，所以只能用动态布尔值控制关闭
    toggle: false,
    actions: [
      {
        name: '删除',
        color: '#ed3f14'
      }
    ],
  },


  handleCancel() {
    this.setData({
      visible_sheet: false,
      toggle: this.data.toggle ? false : true
    });
    console.log(this.data.toggle, 111111111)
  },

  handleClickItem() {
    const action = [...this.data.actions];
    action[0].loading = true;

    this.setData({
      actions: action
    });

    setTimeout(() => {
      action[0].loading = false;
      this.setData({
        visible_sheet: false,
        actions: action,
        toggle: this.data.toggle ? false : true
      });

    }, 2000);
  },

  actionsTap() {
    this.setData({
      visible_sheet: true
    });
  },

  onLoad: function() {
    //1.取出token

    let token = wx.getStorageSync('token');

    console.log(token);

  },

  handleChange({ detail }) {
    this.setData({
      current: detail.key
    });
  }


})