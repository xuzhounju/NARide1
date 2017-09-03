
var app = getApp()

Page({


  data: {
    array:'',
    placeArray: app.globalData.place,
    
  },


  onLoad: function (options) {
    var i = 0
    var rawArray = app.globalData.onGoingPost
    console.log(rawArray)
    for (i; i < rawArray.length; i++) {
      var d = new Date(rawArray[i].fields.post_time)
      rawArray[i].fields.post_time = d.toLocaleString([], { month: 'numeric', day: '2-digit', hour: '2-digit', minute: '2-digit' })

    }
    this.setData({
      array:rawArray
    })
  
  },

  detailTap: function (e) {
    app.globalData.detailSelfPostID = parseInt(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../detailSelfPost/detailSelfPost',
    })
  },

  
  onShareAppMessage: function () {
  
  }
})