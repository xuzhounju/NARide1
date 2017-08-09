// ride.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    drivers:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var keyList = wx.getStorageInfoSync().keys
    console.log(keyList)
    var driverList = []
    var i
    var that =this
    for ( i =0; i<keyList.length;i++){
      wx.getStorage({
        key: keyList[i],
        success: function(res) {
          driverList.push(res.data)
          that.setData({
            drivers: driverList,
          })
        }
      })
    }
   
  
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
    var keyList = wx.getStorageInfoSync().keys
    console.log(keyList)
    var driverList = []
    var i
    var that = this
    for (i = 0; i < keyList.length; i++) {
      wx.getStorage({
        key: keyList[i],
        success: function (res) {
          driverList.push(res.data)
          that.setData({
            drivers: driverList,
          })
        }
      })
    }
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
    this.setData({
      keys: wx.getStorageInfoSync().keys,
    })
    console.log(this.data.keys)

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