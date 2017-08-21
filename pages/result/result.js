var util = require('../../utils/util.js')

var app = getApp()

Page({

  data: {
    sResult: [],
    genderUrl:'../../images/',
    gender: ['unknown.png','male.png','female.png']
  },


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
          result[i].fields.earliest = result[i].fields.earliest.toLocaleString([], {month:'numeric',day:'2-digit', hour: '2-digit', minute: '2-digit' } );
          result[i].fields.latest = new Date(result[i].fields.latest);
          result[i].fields.latest = result[i].fields.latest.toLocaleString([], {month:'numeric',day:'2-digit', hour: '2-digit', minute: '2-digit' } );
          result[i].fields.post_time = new Date(result[i].fields.post_time);
          result[i].fields.post_time = Date.parse(result[i].fields.post_time) / 1000;
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
          result[i].fields.earliest = result[i].fields.earliest.toLocaleString([], {month:'numeric',day:'2-digit', hour: '2-digit', minute: '2-digit' } );
          result[i].fields.latest = new Date(result[i].fields.latest);
          result[i].fields.latest = result[i].fields.latest.toLocaleString([], {month:'numeric',day:'2-digit', hour: '2-digit', minute: '2-digit' } );
          result[i].fields.post_time = new Date(result[i].fields.post_time);
          result[i].fields.post_time = Date.parse(result[i].fields.post_time) / 1000;
          sResult.push(result[i].fields);
        }
      }
    }
    function sortNumber(a, b) {
      return b.post_time - a.post_time;
    }
    sResult = sResult.sort(sortNumber);
    app.globalData.sResult = sResult;
    this.setData({
      sResult: sResult
    })
  },
  detailTap: function (e) {
    var a = app.globalData.sResult;
    var b = parseInt(e.currentTarget.dataset.id);
    app.globalData.detailEvent = a[b];
    wx.navigateTo({
      url: '../resultDetail/resultDetail',
    })
  }
})