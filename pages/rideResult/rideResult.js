// rideResult.js
// questResult.js
var util = require('../../utils/util.js')

var app = getApp()

Page({

  data: {
    sResult: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var result = app.searchResult;
    var sResult = [];
    var placeArray = ['Amherst', 'BDL Airport', 'Boston', 'Logan Airport', 'NYC'];
    for (var i = 0; i < result.length; i++) {
      if (result[i] && result[i].fields.driver) {
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
    app.sResult = sResult;
    this.setData({
      sResult: sResult
    })
  },
  detailTap: function (e) {
    console.log(app.sResult);
    var a = app.sResult;
    console.log(parseInt(e.currentTarget.dataset.id));
    var b = parseInt(e.currentTarget.dataset.id);
    console.log(a[b]);
    app.detailRideEvent = a[b];
    console.log(app.detailQuestEvent);
    wx.navigateTo({
      url: '../detailRideResult/detailRideResult',
    })
  }
})