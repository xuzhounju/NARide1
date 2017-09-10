// ride.js
var util = require('../../utils/util.js')

var app = getApp()
Page({
  data: {
    identity: [
      { name: '我是司机', value: 0, checked: 'true' },
      { name: '我是乘客', value: 1 },
    ],
    numArray: [1, 2, 3, 4, 5, 6],
    identityValue: 0,
    nowDate: '2017-01-01',
    endDate: '2018-12-30',
    
    placeArray: app.globalData.place,
    userInfo: {},
    departure: 0,
    arrival: 1,
    eDate: '',
    eTime: '00:00',
    lDate: '',
    lTime: '23:59',
    pNumber:1,
  },



  onShow: function () {
    var d = new Date(Date.now() + 24 * 60 * 60 * 1000)
    var year = d.getFullYear()
    var month = d.getMonth() + 1

    if (month < 10) {
      month = '0' + month
    }
  
    var day = d.getDate()

    if (day < 10) {
      day = '0' + day
    }

  



    this.setData({
      eDate: year + '-' + month + '-' + day,
      lDate: year + '-' + month + '-' + day,

    })
  },

  onLoad: function () {
    var that = this
    app.globalData.searchTap = 0;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  },

  radioChange: function (e) {
    app.globalData.searchTap = e.detail.value
  },

  bindDeparturePickerChange: function (e) {
    this.setData({
      departure: e.detail.value
    })
  },

  bindarrivalPickerChange: function (e) {
    this.setData({
      arrival: e.detail.value
    })
  },

  bindEDateChange: function (e) {

    this.setData({
      eDate: e.detail.value,
      lDate:e.detail.value
    })
  },
  bindETimeChange: function (e) {
    this.setData({
      eTime: e.detail.value
    })
  },

  bindLTimeChange: function (e) {
    this.setData({
      lTime: e.detail.value
    })
  },

  bindPNumberPickerChange: function (e) {
    this.setData({
      pNumber: parseInt(e.detail.value) + 1
    })
  },

  formSubmit: function (e) {
    var event = e.detail.value
    var omit = ''
    app.globalData.perferN = this.data.pNumber;
    if (event.eDate.length > 0 && event.eTime.length > 0  && event.lTime.length > 0) {
      if (e.detail.value.eTime <= e.detail.value.lTime) {
        var timeNow = new Date();
        var nowTime = new Date(timeNow.getTime() - 2 * 60 * 1000);
        nowTime = Math.floor(nowTime.getTime() / 1000.0);
        var rawE = e.detail.value.eDate + ' ' + e.detail.value.eTime
        var earlist = new Date(rawE.replace(/-/g, "/"))
        earlist = earlist.getTime() / 1000.0
        var rawE = e.detail.value.eDate + ' ' + e.detail.value.lTime
        var latest = new Date(rawE.replace(/-/g, "/"))
        latest = latest.getTime() / 1000.0
        if (earlist <= latest && earlist > nowTime) {
          var mydata = e.detail.value;
          mydata.earliest = earlist;
          mydata.latest = latest;
          mydata.departure = parseInt(mydata.departure) + 1;
          mydata.arrival = parseInt(mydata.arrival) + 1;
          wx.request({
            url: 'https://kunwang.us/list/' + mydata.earliest + '/' + mydata.latest + '/' + mydata.departure + '/' + mydata.arrival + '/', //仅为示例，并非真实的接口地址 //仅为示例，并非真实的接口地址
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              app.globalData.searchResult = res.data;
              wx.navigateTo({
                url: '../result/result',
              })
            }
          })
        } 
        else {
          wx.showModal({
            title: '提示',
            content: '请确认最早时间晚于现在！',
            showCancel: false
          })
        }
      }
      else {
        wx.showModal({
          title: '提示',
          content: '请确认最晚时间晚于最早时间！',
          showCancel: false
        })
      }
    }
    else {
      if(event.eDate.length == 0){omit = omit + ' 日期' }
      if (event.eTime.length == 0) { omit = omit + ' 最早时间' }
      if (event.lTime.length == 0) { omit = omit + ' 最晚时间' }
      wx.showModal({
        title: '提示',
        content: '请填写:'+omit+'!',
        showCancel: false
      })
    }
  },
  justLook: function () {
    var nowTime = new Date();
    var latestTime = new Date(nowTime.getTime() + 2 * 30 * 24 * 3600 * 1000);
    nowTime = Math.floor(nowTime.getTime() / 1000.0);
    latestTime = Math.floor(latestTime.getTime() / 1000.0);
    var departure = 0;
    var arrival = 0;
    wx.request({
      url: 'https://kunwang.us/list/' + nowTime + '/' + latestTime + '/' + departure + '/' + arrival + '/', 
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        app.globalData.searchResult = res.data;
        app.globalData.searchTap = 1;
        wx.navigateTo({
          url: '../result/result',
        })
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: 'title',
      desc: '自定义分享描述',
      path:'pages/index/index?id=4',
      imageUrl: 'http://server.myspace-shack.com/d23/b74dba9d-ec33-446d-81d3-7efd254f1b85.png',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }

  }
})