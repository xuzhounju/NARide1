// pages/article/article.js
var app =getApp()
Page({


  data: {
    article:null,
   
  },


  onLoad: function (options) {
    this.setData({
      article: app.globalData.article,
     
    })


  },

  
  onShareAppMessage: function () {
  
  }
})