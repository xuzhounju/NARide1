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
    if (app.globalData.userInfo){
      mydata.gender = app.globalData.userInfo.gender
      mydata.nickName = app.globalData.userInfo.nickName
      mydata.avatarUrl = app.globalData.userInfo.avatarUrl
    }else{
      mydata.gender = 0
      mydata.nickName = "未知"
      mydata.avatarUrl = 'http://server.myspace-shack.com/d23/b74dba9d-ec33-446d-81d3-7efd254f1b85.png'

    }
    if (app.globalData.monitor_place_from){
      mydata.monitor_place_from = app.globalData.monitor_place_from
      mydata.monitor_place_to = app.globalData.monitor_place_to
      function stringToTime(date) {
        var d = new Date(date)
        return d.getTime() / 1000.0
      }
      mydata.monitor_time_from = stringToTime(app.globalData.monitor_time_from)
      mydata.monitor_time_to = stringToTime(app.globalData.monitor_time_to)    
    }
    
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
            var notice
            var flag = false
            if (res.statusCode == 400) {
              notice = '请填写正确的联系方式!'
            } else {
              notice = '提交成功！'
              flag = true
              app.globalData.newProfile = true
            }
            app.globalData.weixin = mydata.weixin
            app.globalData.phone = mydata.phone
            app.globalData.email = mydata.email
            app.globalData.newProfile = true
            wx.showModal({
              title: '提示',
              content: notice,
              showCancel: false,
              success:function(res){
                if(res.confirm){
                  if (flag){
                    wx.switchTab({
                      url: '../post/post'
                    })
                  }
                  
      
                }
              }
            })
            

              
          }
        })
          
       
      }
    })
      

  }



})