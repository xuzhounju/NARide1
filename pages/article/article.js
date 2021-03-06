// pages/article/article.js
var app =getApp()
Page({


  data: {
    article:null,
   
  },


  onLoad: function (options) {
    if (options.text === undefined) {
      this.setData({
        article: app.globalData.article,

      })
    }else{
      var text = options.text
      this.setData({
        article: JSON.parse(text)
      })
    }
  


  },

  onShareAppMessage(){
    var text = JSON.stringify(this.data.article)
    if (text.length>700){
      wx.showModal({
        title: '提示',
        content: '文章太长无法转发',
      })
      return
    }
    return {
      title:'精彩活动',
      path: 'pages/article/article?text=' + text,

      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
    wx.switchTab({
      url: '../index/index'
    })
  }
})