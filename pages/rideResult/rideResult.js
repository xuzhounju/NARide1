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
        result[i].fields.departure = placeArray[result[i].fields.departure];
        result[i].fields.arrival = placeArray[result[i].fields.arrival];
        result[i].fields.earliest = new Date(result[i].fields.earliest);
        result[i].fields.earliest = result[i].fields.earliest.toLocaleString();
        result[i].fields.latest = new Date(result[i].fields.latest);
        result[i].fields.latest = result[i].fields.latest.toLocaleString();
        sResult.push(result[i].fields);
      }
    }
    this.setData({
      sResult: sResult
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})