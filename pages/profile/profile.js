
var app = getApp()
Page({
  data: {
    userInfo: {},
    openid: '',
    count:'',
    placeArray: app.globalData.place,
    weixin:'',
    phone:'',
    loadingHidden: true,
    gender: ['未知', '男', '女'],
    genderID:'',
  },
  //事件处理函数

  onShow: function(){
    if (app.globalData.newProfile){
      this.onLoad()
      app.globalData.newProfile = false
    }
  },
  
  onLoad: function () {

    this.setData({
      loadingHidden: false,
      genderID: parseInt(app.globalData.userInfo.gender)
    })
    var that = this
    //调用应用实例的方法获取全局数据


    wx.login({
      success: function (res) {
        var js_code = res.code;//调用登录接口获得的用户的登录凭证code
        wx.request({
          url: 'https://kunwang.us/user/' + js_code,
          method: 'GET',
          success: function (res) {
           
            var i = 0
            var rawArray = res.data[1]
            app.globalData.onGoingPost = res.data[1]
            
            app.globalData.weixin = res.data[0].fields.weixin
            app.globalData.phone = res.data[0].fields.phone
            app.globalData.email = res.data[0].fields.email
            that.setData({
              count: res.data[0].fields.count,
              weixin: app.globalData.weixin,
              phone: app.globalData.phone,
              email: app.globalData.email,
              userInfo: app.globalData.userInfo,
              loadingHidden:true
            })
            

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
  },

 
  showHistory: function(e){
    wx.navigateTo({
      url: '../history/history',
    })
  },

 
})
