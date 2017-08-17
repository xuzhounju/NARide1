//request.js
var util = require('../../utils/util.js')

var app = getApp()
Page({
  data: {
    currentNavtab: "0",
    nowDate: '',
    endDate: '',
    placeArray: ['Amherst', 'BDL Airport', 'Boston', 'Logan Airport', 'NYC'],
    userInfo: {},
    departure: 0,
    arrival: 1,
    eDate: '',
    eTime: '',
    lDate: '',
    lTime: ''
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  },


  bindDeparturePickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      departure: e.detail.value
    })
  },

  bindarrivalPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      arrival: e.detail.value
    })
  },

  bindEDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      eDate: e.detail.value
    })
  },
  bindETimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      eTime: e.detail.value
    })
  },

  bindLDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      lDate: e.detail.value
    })
  },
  bindLTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      lTime: e.detail.value
    })
  },

  formSubmit: function (e) {
    var event = e.detail.value
    if (event.eDate.length > 0 && event.eTime.length > 0 && event.lDate.length > 0 && event.lTime.length > 0) {
      if (e.detail.value.eDate <= e.detail.value.lDate) {
        var timeNow = new Date();
        var nowTime = new Date(timeNow.getTime() - 2 * 60 * 1000);
        nowTime = Math.floor(nowTime.getTime() / 1000.0);
        var rawE = e.detail.value.eDate + ' ' + e.detail.value.eTime
        var earlist = new Date(rawE.replace(/-/g, "/"))
        console.log('E:', earlist)
        earlist = earlist.getTime() / 1000.0
        var rawL = e.detail.value.lDate + ' ' + e.detail.value.lTime
        var latest = new Date(rawL.replace(/-/g, "/"))
        latest = latest.getTime() / 1000.0
        if (earlist < latest && earlist > nowTime) {
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
              app.searchResult = res.data;
              app.searchTap = 0;
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
      wx.showModal({
        title: '提示',
        content: '请填写必要信息！',
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
        url: 'https://kunwang.us/list/' + nowTime + '/' + latestTime + '/' + departure + '/' + arrival + '/', //仅为示例，并非真实的接口地址 //仅为示例，并非真实的接口地址
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          app.searchResult = res.data;
          app.searchTap = 0;
          wx.navigateTo({
            url: '../result/result',
          })
        }
      })
  },
  onShareAppMessage: function () {

  }
})