// first.js
var app =getApp()
Page({

  data: {
    weixin:'',
    phone:'',
    email:'',
    text:''
  },
  onLoad: function () {
    var that = this
    that.setData({
      weixin:app.weixin,
      phone: app.phone,
      email: app.email
    })

  },

  formSubmit: function (e) {
    var that = this
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
              wx.showModal({
                title: '提示',
                content: '修改成功！',
                showCancel: false,
                success:function(res){
                  if(res.confirm){
                    wx.navigateBack({
                      
                    })
                  }
                }
              })
            

              
            }
          })
          
        } else {
          wx.showModal({
            title: '提示',
            content: '请填写必要信息！',
            showCancel: false
          })
        } 
      }
    })
      

  }



})