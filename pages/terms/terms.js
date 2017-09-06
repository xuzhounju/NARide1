// terms.js
var app = getApp()
Page({

  data: {
    gender: ''
  },

  onLoad: function (options) {
    this.setData({
      gender: app.globalData.userInfo.gender
    })
    var that = this
    if (app.globalData.firstLogin) {
      wx.showLoading({
        title: '加载中',
      })
      wx.login({
        success: function (res) {
          var js_code = res.code
          wx.request({
            url: 'https://kunwang.us/user/' + js_code + '/',
            data: that.data,
            method: "POST",
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              wx.hideLoading()
              app.globalData.firstLogin = false
            }
          })
        }
      })
    }
  },

  agreeButton: function (e) {
    wx.navigateBack({

    })
  },
  onShareAppMessage: function () {

  }
})