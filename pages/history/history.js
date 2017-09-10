
var app = getApp()

Page({


  data: {
    array:'',
    placeArray: app.globalData.place,
    
  },


  onShow: function (options) {
  
    var rawArray = []
    console.log(rawArray)
    console.log(app.globalData.onGoingPost)
    for (var i = 0; i < app.globalData.onGoingPost.length; i++) {
      rawArray.push([app.globalData.onGoingPost[i].fields.departure, app.globalData.onGoingPost[i].fields.arrival, app.globalData.onGoingPost[i].fields.post_time, app.globalData.onGoingPost[i].driver, app.globalData.onGoingPost[i].fields.purpose])
      var d = new Date(rawArray[i][2])
      console.log(d)
      rawArray[i][2] = d.toLocaleString([], { month: 'numeric', day: '2-digit', hour: '2-digit', minute: '2-digit' })

    }

    console.log(app.globalData.onGoingPost)

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