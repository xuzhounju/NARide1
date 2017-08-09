// first.js
var app =getApp()
Page({

  data: {
    weixin:'',
    phone:'',
    email:''
  },
  onLoad: function () {
    var that = this
    wx.login({
      success: function (res) {
        var js_code = res.code;//调用登录接口获得的用户的登录凭证code
        console.log(js_code)
        wx.request({
          url: 'https://kunwang.us/user/' + js_code,
          method: 'GET',
          success: function (res) {
            if (res.data.gender != -1) {
              that.setData({
                weixin: res.data[0].fields.weixin,
                phone: res.data[0].fields.phone,
                email: res.data[0].fields.email
              })

            }
          }
        })
      }
    })

  },

  formSubmit: function (e) {
    var mydata = e.detail.value
    mydata.gender = app.globalData.userInfo.gender
    mydata.nickName = app.globalData.userInfo.nickName
    mydata.avatarUrl = app.globalData.userInfo.avatarUrl
    console.log(mydata)
    wx.login({
      success: function(res){
        var js_code = res.code
        if (mydata.weixin.length > 0 && mydata.email.length > 0) {
          console.log("联系信息：", mydata)
          wx.request({
            url: 'https://kunwang.us/user/'+js_code+'/',
            data: mydata,
            method: "POST",
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              console.log(res.data)
            }
          })
        } else {
          console.log("请填写必要联系信息")
        } 
      }
    })
      

  }



})