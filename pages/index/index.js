//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    openid: '',
    count:'',
    array:'',
    placeArray: ['Amherst', 'BDL Airport', 'Boston', 'Logan Airport', 'NYC'],

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
            var i=0
            var rawArray =res.data[1]
            app.globalData.onGoingPost = res.data[1]
            for(i;i<rawArray.length;i++){
              var d = new Date(rawArray[i].fields.post_time)
              rawArray[i].fields.post_time = d.toLocaleString()
      
            }
            that.setData({
              count: res.data[0].fields.count,
              array: rawArray
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

  detailTap: function(e){
    console.log(parseInt(e.currentTarget.dataset.id))
    app.globalData.detailSelfPostID = parseInt(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../detailSelfPost/detailSelfPost',
    })
  },

  onShow:function(){
    this.onLoad()

  },

   onShareAppMessage: function () {

  }
})
