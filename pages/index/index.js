// index.js
var util = require('../../utils/util.js')

var app=getApp()
Page({

  data: {
    navTab: ["全部", "我是司机", "我是乘客"],
    currentNavtab: "0",
    userInfo:'',
    genderUrl: '../../images/',
    gender: ['unknown.png', 'male.png', 'female.png']
  },

  onLoad: function (options) {
    var that = this
    var nowTime = new Date();
    var latestTime = new Date(nowTime.getTime() + 2 * 30 * 24 * 3600 * 1000);
    nowTime = Math.floor(nowTime.getTime() / 1000.0);
    latestTime = Math.floor(latestTime.getTime() / 1000.0);
    var departure = 0;
    var arrival = 0;
    var sResult = [];
    wx.request({
      url: 'https://kunwang.us/list/' + nowTime + '/' + latestTime + '/' + departure + '/' + arrival + '/', //仅为示例，并非真实的接口地址 //仅为示例，并非真实的接口地址
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
            result[i].fields.earliest = result[i].fields.earliest.toLocaleString();
            result[i].fields.latest = new Date(result[i].fields.latest);
            result[i].fields.latest = result[i].fields.latest.toLocaleString();
            sResult.push(result[i].fields);
          }
        }
        sResult = sResult.reverse();
        app.globalData.sResult = sResult;
        that.setData({
          sResult: sResult
        })
      }
    })
    
    

    wx.login({
      success: function (res) {
        var js_code = res.code;//调用登录接口获得的用户的登录凭证code
        console.log(js_code)
        wx.request({
          url: 'https://kunwang.us/user/' + js_code,
          method: 'GET',
          success: function (res) {
            console.log('res.data[0].fields=', res.data)
            app.globalData.openid = res.data[0].fields.username
            if (res.data[0].fields.gender == -1) {
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
  },

})

