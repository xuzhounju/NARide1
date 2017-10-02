// pages/discover/discover.js
var app =getApp()
Page({


  data: {
    articles:[]
  },


  onLoad: function (options) {
    var aim=''
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.getStorage({
      key: 'articles',
      success: function(res) {
        that.setData({
          articles:res.data
        })
        aim='unsent/'
        console.log(aim)
        that.getNewArticles(aim)
        that.removeExpiredArticles()
        wx.hideLoading()
      },

      fail: function(res){
        console.log('no article stored')
        aim='unsent/'
        that.getNewArticles(aim)
        that.removeExpiredArticles()
        wx.hideLoading()
      }
    })

   

  },

  getNewArticles:function(aim){
    console.log('aim:',aim)
    var that =this;
    wx.request({
      url: 'https://kunwang.us/article/'+aim+ app.globalData.openid + '/',
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        var articles = []
        for (var i = 0; i < res.data.length; i++) {
          articles.push(res.data[i].fields)
        }
        that.setData({
          articles: that.data.articles.concat(articles)
        })

        wx.setStorage({
          key: 'articles',
          data: that.data.articles,
        })
      }
    })
  },

  removeExpiredArticles:function(){
    var that =this
    wx.getStorage({
      key: 'articles',
      success: function(res) {
        var articles = res.data
        console.log(articles)
        var nowTime = new Date().getTime()
        for(var i=0;i<articles.length;i++){
          if (app.timeStringToNumber(articles.expire_time)<nowTime){
            articles.splice(i,1)
            console.log('remove one expired article')
          }
        }
        that.setData({
          articles:articles
        })
        wx.setStorage({
          key: 'articles',
          data: articles,
        })
      },
    })
  },

  detailTap:function(e){
    app.globalData.article = this.data.articles[e.currentTarget.dataset.idx]
    console.log('article', app.globalData.article)
    wx,wx.navigateTo({
      url: '../article/article',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },



  onShareAppMessage: function () {
  
  }
})