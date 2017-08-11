// detailQuestResult.js
var util = require('../../utils/util.js')

var app = getApp()

Page({
  data: {
    eventDetail: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var result = app.detailQuestEvent;
    this.setData({
      eventDetail: result
    })
  },
})