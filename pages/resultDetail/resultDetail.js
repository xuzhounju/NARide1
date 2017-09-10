var util = require('../../utils/util.js')

var app = getApp()

Page({
  data: {
    eventDetail: ''
  },

  onLoad: function (options) {
    var result = app.globalData.detailEvent;
    this.setData({
      eventDetail: result
    })
    console.log(this.data.eventDetail)
  },
  phoneCall: function (e){
   
    this.task_notify()
    wx.makePhoneCall({
      phoneNumber: app.globalData.detailEvent.poster[6].toString()
    })
  },

  copyWechat: function (e){
    this.task_notify()
    wx.setClipboardData({
      data: app.globalData.detailEvent.poster[5],
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showModal({
              title: '提示',
              content: '微信号已复制到粘贴板！',
              showCancel: false
            })
          }
        })
      }
    })
  },
  task_notify:function(){
    if (app.globalData.userInfo.nickName.length > 0) {
      wx.request({
        url: 'https://kunwang.us/task_notify/' + this.data.eventDetail.pk + '/' + app.globalData.openid + '/',
        method: "GET"
      })
    }
    
  },

  onShareAppMessage: function () {
 
  }
})
