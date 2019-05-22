import urlConfig from '../../etc/config'
const {
  $Message
} = require('../../dist/base/index');
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    
  },


  onLoad: function() {
    //1.取出token

let token = wx.getStorageSync('token');

    console.log(token);
    
  },


})