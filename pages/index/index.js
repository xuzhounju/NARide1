// index.js
var util = require('../../utils/util.js')

var app = getApp()
Page({

  data: {
    navTab: ["全部", "我是司机", "我是乘客", "筛选"],
    currentNavtab: app.globalData.currentTap,
    userInfo: '',
    genderUrl: '../../images/',
    gender: ['unknown.png', 'male.png', 'female.png'],
    loadingHidden: true,
    filter:true,
    placeArray:'',
    dId:0,
    filterDId:0,
    rankId:0,
    rankArray:["按出发时间","按发帖时间"]
  },

  onShow: function (options) {
   
    this.setData({
      loadingHidden: false,
      currentNavtab: app.globalData.currentTap,
    })

    var that = this
    var nowTime = new Date();
    var latestTime = new Date(nowTime.getTime() + 3 * 30 * 24 * 3600 * 1000);
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
        var places = []
        places.push({ name: "显示全部", id: 0 })
        for (var i = 0; i < app.globalData.places.length; i++) {
          places.push(app.globalData.places[i])
        }
        places.push({ name: "特殊用车", id: app.globalData.places.length + 1 })
        that.setData({
          placeArray: places,
        })
        var result = res.data;
        var placeArray = app.globalData.place;
        for (var i = 0; i < result.length; i++) {
          if (result[i]) {
            var filterDId = result[i].fields.arrival
            if (result[i].fields.departure <= placeArray.length) {
              result[i].fields.departure = placeArray[result[i].fields.departure - 1];
              result[i].fields.arrival = placeArray[result[i].fields.arrival - 1];
            }
            else {
              console.log(result[i].fields)
              result[i].fields.departure = result[i].fields.purpose
              result[i].fields.arrival = ""
            }
            result[i].fields.earliest = new Date(result[i].fields.earliest);
            result[i].fields.e = result[i].fields.earliest.getTime()
            result[i].fields.earliest = result[i].fields.earliest.toLocaleString([], { month: 'numeric', day: '2-digit', hour: '2-digit', minute: '2-digit' });
            result[i].fields.latest = new Date(result[i].fields.latest);
            result[i].fields.latest = result[i].fields.latest.toLocaleString([], { month: 'numeric', day: '2-digit', hour: '2-digit', minute: '2-digit' });
            result[i].fields.post_time = new Date(result[i].fields.post_time);
            result[i].fields.post_time = Date.parse(result[i].fields.post_time) / 1000;
            result[i].fields.pk = result[i].pk
            if(that.data.filterDId==0){
              sResult.push(result[i].fields);
            }else{
              if (filterDId == that.data.filterDId){
                sResult.push(result[i].fields);
              }
            }
          }
        }

        function sortNumber(a, b) {
          if(that.data.rankId==0){
            return a.e - b.e
          }
          else{
            return b.post_time - a.post_time;
          }
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
    console.log()
    if (e.currentTarget.dataset.idx == 3) {
      this.setData({
        currentNavtab: e.currentTarget.dataset.idx,
        filter:false
      })
      return
    }
    this.setData({
      filter: true,
      currentNavtab: e.currentTarget.dataset.idx
    });
    app.globalData.currentTap = this.data.currentNavtab;
    var currentN = this.data.currentNavtab;
    var result = app.globalData.sResult;
    if (currentN == 1) {
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
  bindDeparturePickerChange: function (e) {
    this.setData({
      dId: e.detail.value,
      filterDId: this.data.placeArray[e.detail.value].id,
      filter:true
    })
    console.log(this.data.filterDId)
    this.onShow()

  },

  rankMethod:function(e){
    this.setData({
      rankId:e.detail.value,
      filter:true
    })
    console.log(this.data.rankId)

    this.onShow()
  },


  onShareAppMessage: function () {

  }
})