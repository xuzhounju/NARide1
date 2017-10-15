
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
    hasMessage:app.globalData.hasMessage
  },
  //事件处理函数

  onShow: function(){
    this.setData({
      hasMessage: app.globalData.hasMessage
    })
    console.log('hasMess:',this.data.hasMessage)
    if (app.globalData.newProfile){
      this.onLoad()
      app.globalData.newProfile = false
    }
  },
  
  onLoad: function () {
    if (app.globalData.userInfo){
      this.setData({
        loadingHidden: false,
        genderID: parseInt(app.globalData.userInfo.gender)
      })
    }else{
      this.setData({
        loadingHidden: false,
        genderID: 0
      })
    }
   
    var that = this
    //调用应用实例的方法获取全局数据


        wx.request({
          url: 'https://kunwang.us/user/' + app.globalData.openid+'/a',
          method: 'GET',
          success: function (res) {
            console.log(res)
            var i = 0
            var rawArray = res.data[1]
            app.globalData.onGoingPost = res.data[1]
            
            app.globalData.weixin = res.data[0].fields.weixin
            app.globalData.phone = res.data[0].fields.phone
            app.globalData.email = res.data[0].fields.email
            app.globalData.monitor_place_from = res.data[0].fields.monitor_place_from
            app.globalData.monitor_place_to = res.data[0].fields.monitor_place_to
            app.globalData.monitor_time_from = res.data[0].fields.monitor_time_from
            app.globalData.monitor_time_to = res.data[0].fields.monitor_time_to



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

  showBook:function(e){
    wx.navigateTo({
      url: '../book/book',
    })
  },
  checkMessage(e) {
    console.log(e)
    wx.navigateTo({
      url: '../message/message',
    })
  },

  showCampus: function(e){
    wx.navigateTo({
      url: '../campus/campus',
    })
  }

 
})
