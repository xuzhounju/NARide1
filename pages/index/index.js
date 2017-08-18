// index.js
var util = require('../../utils/util.js')

var app=getApp()
Page({


  data: {
    navTab: ["全部", "我是司机", "我是乘客"],
    currentNavtab: "0",
    userInfo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    this.refresh();


    wx.login({
      success: function (res) {
        var js_code = res.code;//调用登录接口获得的用户的登录凭证code
        console.log(js_code)
        wx.request({
          url: 'https://kunwang.us/user/' + js_code,
          method: 'GET',
          success: function (res) {
            console.log('res.data[0].fields=', res.data)
            app.globalData.openid = res.data[0].fields.username
            if (res.data[0].fields.gender == -1) {
              wx.navigateTo({
                url: '../terms/terms',
              })
            }
            
            app.globalData.weixin = res.data[0].fields.weixin
            app.globalData.phone = res.data[0].fields.phone
            app.globalData.email = res.data[0].fields.email
     
          }
        })
      }
    })

    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  },

  switchTab: function (e) {
    this.setData({
      currentNavtab: e.currentTarget.dataset.idx
    });
  },
})

