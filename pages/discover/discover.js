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
        var new_articles=[]
        var nowTime = new Date().getTime()
        for(var i=0;i<articles.length;i++){
          console.log('expire time :', articles[i].expire_time)
          if (app.timeStringToNumber(articles[i].expire_time)<nowTime){
            console.log('remove one expired article')
          }else{
            new_articles.push(articles[i])
          }
        }
        that.setData({
          articles:new_articles
        })
        wx.setStorage({
          key: 'articles',
          data: new_articles,
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



})