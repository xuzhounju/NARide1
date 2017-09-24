// pages/campus/campus.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cId:null,
    campusArray: [{name:"所有地区",id:1},{name:"UMass周边",id:2},{name:"UConn周边",id:3}],
    preference: app.globalData.preference
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    if(app.globalData.preference){
      for (var i in this.data.campusArray) {
        console.log(i)
        if(app.globalData.preference == this.data.campusArray[i].id){
          this.setData({
            cId: i
          })
        }
      }
    }else{
      this.setData({
        cId:0
      })
    }
    
  },

  bindCampusPickerChange:function(e){
    this.setData({
      cId: e.detail.value,

      preference: this.data.campusArray[e.detail.value].id
    })
  },

  formSubmit: function (e) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    var mydata = e.detail.value
    if(this.data.preference>1){
      mydata.preference = this.data.preference
    }
    mydata.weixin = app.globalData.weixin

    if (mydata.phone) {
      mydata.phone = app.globalData.phone
    } else {
      mydata.phone = ''
    }
    mydata.email = app.globalData.email
    if (app.globalData.userInfo) {
      mydata.gender = app.globalData.userInfo.gender
      mydata.nickName = app.globalData.userInfo.nickName
      mydata.avatarUrl = app.globalData.userInfo.avatarUrl
    } else {
      mydata.gender = 0
      mydata.nickName = "未知"
      mydata.avatarUrl = 'http://server.myspace-shack.com/d23/b74dba9d-ec33-446d-81d3-7efd254f1b85.png'

    }
    
    if (app.globalData.monitor_place_from) {
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
      success: function (res) {
        var js_code = res.code
        wx.request({
          url: 'https://kunwang.us/user/' + js_code + '/',
          data: mydata,
          method: "POST",
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            wx.hideLoading()
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
            app.globalData.preference = mydata.preference
            app.onLaunch()
            app.globalData.newProfile = true
            wx.showModal({
              title: '提示',
              content: notice,
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  if (flag) {
                    wx.switchTab({
                      url: '../index/index'
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