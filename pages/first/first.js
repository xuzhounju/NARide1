// first.js
var app =getApp()
Page({

  data: {
    weixin:'',
    phone:'',
    email:'',
    text:'',
    loadingHidden: true
  },
  onLoad: function () {
    var that = this
    that.setData({
      weixin:app.globalData.weixin,
      phone: app.globalData.phone,
      email: app.globalData.email
    })

  },

  formSubmit: function (e) {
    var that = this
    var mydata = e.detail.value
    mydata.gender = app.globalData.userInfo.gender
    mydata.nickName = app.globalData.userInfo.nickName
    mydata.avatarUrl = app.globalData.userInfo.avatarUrl
    this.setData({
      loadingHidden: false
    })
    wx.login({
      success: function(res){
        var js_code = res.code
        wx.request({
          url: 'https://kunwang.us/user/'+js_code+'/',
          data: mydata,
          method: "POST",
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            that.setData({
              loadingHidden: true
            })
            wx.showModal({
              title: '提示',
              content: '修改成功！',
              showCancel: false,
              success:function(res){
                if(res.confirm){
                  wx.switchTab({
                    url:'../index/index'
                  })
      
                }
              }
            })
            

              
          }
        })
          
       
      }
    })
      

  }



})