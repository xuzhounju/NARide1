// detailSelfPost.js
var app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeArray: app.globalData.place,
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

  deletePost: function(e){
    var mydata = this.data.detailPost.fields
    mydata.removed = true
    var etime = new Date(this.data.detailPost.fields.earliest)
    var ltime = new Date(this.data.detailPost.fields.latest)
    var post_pk = this.data.detailPost.pk
    mydata.earliest = etime.getTime()/1000.0
    mydata.latest = ltime.getTime()/1000.0
    console.log(mydata)

    wx.request({
      url: 'https://kunwang.us/entry/'+post_pk+'/'+app.globalData.openid+'/',
      data: mydata,
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.showModal({
          title: '提示',
          content: '提交成功！',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.navigateBack({
              })
            }
          }
        })
      }
    })
  }

  
})