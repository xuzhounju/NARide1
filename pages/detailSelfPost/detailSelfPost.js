// detailSelfPost.js
var app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeArray: ['Amherst', 'BDL Airport', 'Boston', 'Logan Airport', 'NYC'],
    detailPost:'',
    purpose:['招客','搭车'],
    purposeID: 1,
    earliest:'',
    latest:'',
    userInfo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo:app.globalData.userInfo,
      detailPost: app.globalData.onGoingPost[app.globalData.detailSelfPostID] 
    })
    console.log(this.data.detailPost)
    var etime = new Date(this.data.detailPost.fields.earliest)
    var ltime = new Date(this.data.detailPost.fields.latest)
    this.setData({
      earliest: etime.toLocaleString(),
      latest: ltime.toLocaleString()
    })
    if (this.data.detailPost.fields.driver){
      this.setData({
        purposeID:0
      })
    }
  },

  
})