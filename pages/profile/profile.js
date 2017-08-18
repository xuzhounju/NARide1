//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    openid: '',
    count:'',
    array:'',
    placeArray: app.globalData.place,
    weixin:'',
    phone:'',
    loadingHidden: true
  },
  //事件处理函数
  
  onShow: function () {
    console.log('onLoad')
    this.setData({
      loadingHidden: false
    })
    var that = this
    //调用应用实例的方法获取全局数据


    wx.login({
      success: function (res) {
        var js_code = res.code;//调用登录接口获得的用户的登录凭证code
        console.log(js_code)
        wx.request({
          url: 'https://kunwang.us/user/' + js_code,
          method: 'GET',
          success: function (res) {
            console.log('res.data[0].fields=', res.data)
           
            var i = 0
            var rawArray = res.data[1]
            app.globalData.onGoingPost = res.data[1]
            for (i; i < rawArray.length; i++) {
              var d = new Date(rawArray[i].fields.post_time)
              rawArray[i].fields.post_time = d.toLocaleString()

            }
            app.globalData.weixin = res.data[0].fields.weixin
            app.globalData.phone = res.data[0].fields.phone
            app.globalData.email = res.data[0].fields.email
            that.setData({
              weixin: app.globalData.weixin,
              phone: app.globalData.phone,
              email: app.globalData.email,
              userInfo: app.globalData.userInfo,
              array: rawArray,
              loadingHidden:true
            })
            

          }
        })
      }
    })

  },

  bindMessageButtonTap: function(e){
    wx.navigateTo({
      url: '../first/first',
    })
  },

  detailTap: function(e){
    console.log(parseInt(e.currentTarget.dataset.id))
    app.globalData.detailSelfPostID = parseInt(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../detailSelfPost/detailSelfPost',
    })
  },


   onShareAppMessage: function () {

  }
})
