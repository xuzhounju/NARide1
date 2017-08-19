// terms.js
var app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gender:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      gender: app.globalData.userInfo.gender
    })
    var that = this
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
          }
        })


      }
    })
  },

  agreeButton: function(e){
    wx.navigateBack({

    })
  },
  onShareAppMessage: function () {
  
  }
})