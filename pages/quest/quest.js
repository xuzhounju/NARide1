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
    if (e.detail.value.eDate <= e.detail.value.lDate) {
      var earlist = new Date(e.detail.value.eDate + ' ' + e.detail.value.eTime)
      console.log('E:', earlist)
      earlist = earlist.getTime() / 1000.0
      var latest = new Date(e.detail.value.lDate + ' ' + e.detail.value.lTime)
      latest = latest.getTime() / 1000.0
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
          wx.navigateTo({
            url: '../questResult/questResult',
          })
        }
      })
    } 
  },
  onShareAppMessage: function () {

  }
})