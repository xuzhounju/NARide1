// index.js
var util = require('../../utils/util.js')

var app=getApp()
Page({

  data: {
    navTab: ["全部", "我是司机", "我是乘客"],
    currentNavtab: app.globalData.currentTap,
    userInfo:'',
    genderUrl: '../../images/',
    gender: ['unknown.png', 'male.png', 'female.png'],
    loadingHidden: true
  },

  onShow: function (options) {
    this.setData({
      loadingHidden: false,
      currentNavtab: app.globalData.currentTap
    })

    var that = this
    var nowTime = new Date();
    var latestTime = new Date(nowTime.getTime() + 2 * 30 * 24 * 3600 * 1000);
    nowTime = Math.floor(nowTime.getTime() / 1000.0);
    latestTime = Math.floor(latestTime.getTime() / 1000.0);
    var departure = 0;
    var arrival = 0;
    var sResult = [];
    wx.request({
      url: 'https://kunwang.us/list/' + nowTime + '/' + latestTime + '/' + departure + '/' + arrival + '/', 
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var result = res.data;
        var placeArray = app.globalData.place;
        for (var i = 0; i < result.length; i++) {
          if (result[i]) {
            result[i].fields.departure = placeArray[result[i].fields.departure - 1];
            result[i].fields.arrival = placeArray[result[i].fields.arrival - 1];
            result[i].fields.earliest = new Date(result[i].fields.earliest);
            result[i].fields.earliest = result[i].fields.earliest.toLocaleString([], {month:'numeric',day:'2-digit', hour: '2-digit', minute: '2-digit' } );
            result[i].fields.latest = new Date(result[i].fields.latest);
            result[i].fields.latest = result[i].fields.latest.toLocaleString([], {month:'numeric',day:'2-digit', hour: '2-digit', minute: '2-digit' } );
            result[i].fields.post_time = new Date(result[i].fields.post_time);
            result[i].fields.post_time = Date.parse(result[i].fields.post_time) / 1000;
            sResult.push(result[i].fields);
          }
        }

        function sortNumber(a, b) {
          return b.post_time - a.post_time;
        }
        sResult = sResult.sort(sortNumber);
        app.globalData.sResult = sResult;
        var currentN = that.data.currentNavtab;
        var result = app.globalData.sResult;
        if (currentN == 1) {
          var temp = [];
          for (var i = 0; i < result.length; i++) {
            if (!result[i].driver) {
              temp.push(result[i])
            }
          }
          that.setData({
            sResult: temp,
            loadingHidden: true
          })
        }
        else if (currentN == 2) {
          var temp = [];
          for (var i = 0; i < result.length; i++) {
            if (result[i].driver) {
              temp.push(result[i])
            }
          }
          that.setData({
            sResult: temp,
            loadingHidden: true
          })
        }
        else {
          that.setData({
            sResult: result,
            loadingHidden: true
          })
        }
      }
    })
    
    

    wx.login({
      success: function (res) {
        var js_code = res.code;//调用登录接口获得的用户的登录凭证code
        wx.request({
          url: 'https://kunwang.us/user/' + js_code,
          method: 'GET',
          success: function (res) {
            app.globalData.openid = res.data[0].fields.username
            app.globalData.onGoingPost = res.data[1]
            if (res.data[0].fields.gender == -1) {
              app.globalData.firstLogin = true
              wx.navigateTo({
                url: '../terms/terms',
              })
            }
            app.globalData.weixin = res.data[0].fields.weixin
            app.globalData.phone = res.data[0].fields.phone
            app.globalData.email = res.data[0].fields.email
            
     
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

  switchTab: function (e) {
    this.setData({
      currentNavtab: e.currentTarget.dataset.idx
    });
    app.globalData.currentTap = this.data.currentNavtab;
    var currentN = this.data.currentNavtab;
    var result = app.globalData.sResult;
    if(currentN == 1) {
      var temp = [];
      for (var i = 0; i < result.length; i++) {
        if (!result[i].driver) {
          temp.push(result[i])
        }
      }
      this.setData({
        sResult: temp
      })
    }
    else if (currentN == 2) {
      var temp = [];
      for (var i = 0; i < result.length; i++) {
        if (result[i].driver) {
          temp.push(result[i])
        }
      }
      this.setData({
        sResult: temp
      })
    }
    else {
      this.setData({
        sResult: result
      })
    }
  },
  detailTap: function (e) {
    var a = this.data.sResult;
    var b = parseInt(e.currentTarget.dataset.id);
    app.globalData.detailEvent = a[b];
    wx.navigateTo({
      url: '../resultDetail/resultDetail',
    })
  },

  searchTap:function(e){
    wx.switchTab({
      url: '../ride/ride',
    })
  },

  onShareAppMessage: function () {

  }
})

