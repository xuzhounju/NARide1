//app.js
App({
  onLaunch: function() {
    //调用API从本地缓存中获取数据
    wx.clearStorage()  
  },

  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },

  setOpenID: function(cb){
    this.globalData.openid = cb
  },

  globalData: {
    userInfo: null,
    openid:null,
    searchResult: null,
    sResult:null,
    onGoingPost: null,
    detailSelfPostID: null,
    detailEvent: null,
    detailRideEvent: null,
    weixin:'',
    phone:'',
    email:'',
    place: ['Amherst', 'BDL Airport', 'Boston', 'Logan Airport', 'NYC','Mount Holyoke College','Smith College'],
    searchTab:null,
    currentTap:0,
    newProfile: false
  }
})
