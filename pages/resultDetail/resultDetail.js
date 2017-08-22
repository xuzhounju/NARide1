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
  },
  phoneCall: function (e){
    wx.makePhoneCall({
      phoneNumber: app.globalData.detailEvent.poster[6].toString()
    })
  },

  copyWechat: function (e){
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
  }
})
