var util = require('../../utils/util.js')

var app = getApp()

Page({
  data: {
    eventDetail:''
  },

  onLoad: function (options) {
    if(options.text=== undefined){
      this.setData({
        eventDetail: app.globalData.detailEvent
      })

    } else {
      wx.showLoading({
        title: '加载中',
      })
      wx.login({
        success: function (res) {
          var js_code = res.code;//调用登录接口获得的用户的登录凭证code
          wx.request({
            url: 'https://kunwang.us/user/' + js_code,
            method: 'GET',
            success: function (res) {
              app.globalData.openid = res.data[0].fields.username
              
              app.globalData.userInfo.nickName= res.data[0].fields.nickName

              wx.hideLoading()
            }
          })
        }
      })
      var text = options.text;
      this.setData({
        eventDetail: JSON.parse(text)
      })
    }
    
  
    console.log(this.data.eventDetail)
  },
  phoneCall: function (e){
   
    this.task_notify()
    wx.makePhoneCall({
      phoneNumber: this.data.eventDetail.poster[6].toString()
    })
  },

  copyWechat: function (e){
    this.task_notify()
    wx.setClipboardData({
      data: this.data.eventDetail.poster[5],
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
        method: "GET",
        success:function(res){
          if(res.statusCode==403){
            wx.showModal({
              title: '提示',
              content: '该分享贴已被删除！',
              showCancel: false,

            })
          }
        }
      })
    }
    
  },

  onShareAppMessage: function () {
 
  }
})
