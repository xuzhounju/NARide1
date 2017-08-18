var util = require('../../utils/util.js')

var app = getApp()

Page({

  data: {
    sResult: [],
    genderUrl:'../../images/',
    gender: ['unknown.png','male.png','female.png']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var result = app.globalData.searchResult;
    var sResult = [];
    var placeArray = app.globalData.place;
    if (app.globalData.searchTap == 0) {
      for (var i = 0; i < result.length; i++) {
        if (result[i] && !result[i].fields.driver) {
          result[i].fields.departure = placeArray[result[i].fields.departure - 1];
          result[i].fields.arrival = placeArray[result[i].fields.arrival - 1];
          result[i].fields.earliest = new Date(result[i].fields.earliest);
          result[i].fields.earliest = result[i].fields.earliest.toLocaleString();
          result[i].fields.latest = new Date(result[i].fields.latest);
          result[i].fields.latest = result[i].fields.latest.toLocaleString();
          sResult.push(result[i].fields);
        }
      }
    } 
    else if (app.globalData.searchTap == 1) {
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
    }
    sResult = sResult.reverse();
    app.globalData.sResult = sResult;
    this.setData({
      sResult: sResult
    })
  },
  detailTap: function (e) {
    var a = app.globalData.sResult;
    console.log(parseInt(e.currentTarget.dataset.id));
    var b = parseInt(e.currentTarget.dataset.id);
    app.globalData.detailEvent = a[b];
    console.log(app.globalData.detailQuestEvent);
    wx.navigateTo({
      url: '../resultDetail/resultDetail',
    })
  }
})