var util = require('../../utils/util.js')

var app = getApp()

Page({
  data: {
    eventDetail: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var result = app.globalData.detailEvent;
    this.setData({
      eventDetail: result
    })
  },
  phoneCall: function (e){
    wx.makePhoneCall({
      phoneNumber: app.globalData.detailEvent.poster[6]
    })
  },

  copyWechat: function (e){
    wx.setClipboardData({
      data: app.globalData.detailEvent.poster[5],
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
          }
        })
      }
    })
  }
})
