//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    openid: ''
  },
  //事件处理函数
  
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
  

    wx.login({
      success: function (res) {
        var js_code = res.code;//调用登录接口获得的用户的登录凭证code
        console.log(js_code)
        wx.request({
          url: 'https://kunwang.us/user/'+js_code,
          method: 'GET',
          success: function (res) {
            console.log('res.data[0].fields=', res.data)
            app.globalData.openid = res.data[0].fields.username
            if (res.data[0].fields.gender == -1){
              wx.navigateTo({
                url: '../first/first',
              })
             
            
            }
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

  bindMessageButtonTap: function(e){
    wx.navigateTo({
      url: '../first/first',
    })
  }
})
