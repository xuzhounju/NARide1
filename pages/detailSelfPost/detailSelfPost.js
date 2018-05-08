// detailSelfPost.js
var app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeArray: app.globalData.place,
    detailPost:'',
    purpose:'',
    purposeID: 1,
    earliest:'',
    latest:'',
    userInfo:'',
    pNumber:'',
    memo:'',
    departure:'',
    arrival:'',
    poster:null,
    driver:null,
    pk:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      userInfo:app.globalData.userInfo,
      detailPost: app.globalData.onGoingPost[app.globalData.detailSelfPostID], 
      placeArray: app.globalData.place,
      pk:app.globalData.onGoingPost[app.globalData.detailSelfPostID].pk,
      purpose: app.globalData.onGoingPost[app.globalData.detailSelfPostID].fields.purpose

    })

    console.log('selfdata',this.data.detailPost)
    var etime = new Date(this.data.detailPost.fields.earliest)
    var ltime = new Date(this.data.detailPost.fields.latest)
    this.setData({
      earliest: etime.toLocaleString([], { month: 'numeric', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      latest: ltime.toLocaleString([], { month: 'numeric', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      pNumber: this.data.detailPost.fields.pNumber,
      memo: this.data.detailPost.fields.memo,
      driver:this.data.detailPost.fields.driver,
    })
    
    if (this.data.detailPost.fields.departure != 12){
      var alag = 0;
      var dlag = 0;
      if (this.data.detailPost.fields.arrival == 36) {
        alag = 3
      };
      if (this.data.detailPost.fields.arrival > 36) {
        alag = 4
      };
      if (this.data.detailPost.fields.departure == 36) {
        dlag = 3
      }
      if (this.data.detailPost.fields.departure > 36) {
        dlag = 4
      }
      this.setData({
        departure: this.data.placeArray[this.data.detailPost.fields.departure - 1-dlag],
        arrival: this.data.placeArray[this.data.detailPost.fields.arrival - 1-alag]
      })
    }else{
      this.setData({
        departure: this.data.detailPost.fields.purpose,
        arrival:''
      })
    }

    var poster
    if (app.globalData.userInfo) {
      poster = [0, app.globalData.userInfo.gender, app.globalData.userInfo.nickName, app.globalData.userInfo.avatarUrl, app.globalData.email, app.globalData.weixin, app.globalData.phone, 0]
    } else {
      poster = [0, 0, "未知", 'http://server.myspace-shack.com/d23/b74dba9d-ec33-446d-81d3-7efd254f1b85.png', app.globalData.email, app.globalData.weixin, app.globalData.phone, 0]
    }
    this.setData({
      poster:poster
    })
    console.log('data:',this.data)
    if (this.data.detailPost.fields.driver){
      this.setData({
        purposeID:0
      })
    }
  },

  deletePost: function(e){
    var that =this
    wx.showModal({
      title: '警告',
      content: '确定要删除此信息？',
      showCancel: true,
      success:function(res){
        if(res.confirm){
          wx.showLoading({
            title: '加载中',
          })
          app.globalData.newProfile = true

          var mydata = that.data.detailPost.fields
          mydata.removed = true
          var etime = new Date(that.data.detailPost.fields.earliest)
          var ltime = new Date(that.data.detailPost.fields.latest)
          var post_pk = that.data.detailPost.pk
          mydata.earliest = etime.getTime() / 1000.0
          mydata.latest = ltime.getTime() / 1000.0

          wx.request({
            url: 'https://kunwang.us/entry/' + post_pk + '/' + app.globalData.openid + '/',
            data: mydata,
            method: "POST",
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              wx.hideLoading()

              wx.showModal({
                title: '提示',
                content: '提交成功！',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    wx.switchTab({
                      url: '../profile/profile'
                    })
                    
                  }
                }
              })
            }
          })
        }
      }
    })

  },


  formSubmit: function (e) {
    var formId = e.detail.formId
    console.log('formId:',formId)
    var that = this
    wx.showModal({
      title: '警告',
      content: '确定修改信息？',
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          app.globalData.newProfile = true
          wx.showLoading({
            title: '加载中',
          })
          var mydata = that.data.detailPost.fields
          mydata.pNumber  = that.data.pNumber
          mydata.memo = that.data.memo
          var etime = new Date(that.data.detailPost.fields.earliest)
          var ltime = new Date(that.data.detailPost.fields.latest)
          var post_pk = that.data.detailPost.pk
          mydata.earliest = etime.getTime() / 1000.0
          mydata.latest = ltime.getTime() / 1000.0
          mydata.formId = formId

          wx.request({
            url: 'https://kunwang.us/entry/' + post_pk + '/' + app.globalData.openid + '/',
            data: mydata,
            method: "POST",
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              wx.hideLoading()

              wx.showModal({
                title: '提示',
                content: '提交成功！',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    wx.switchTab({
                      url: '../profile/profile'
                    })
                  }
                }
              })
            }
          })
        }
      }
    })

  },

  minusCount: function(e){
    if (this.data.pNumber > 1 ){
      this.setData({
        pNumber: this.data.pNumber - 1
      })
    }
   
  },
  addCount: function (e) {
    if (this.data.pNumber <6 ) {
      this.setData({
        pNumber: this.data.pNumber + 1
      })
    }

  },

  bindKeyInput:function(e){
    this.setData({
      memo: e.detail.value
    })
  },
  
  onShareAppMessage: function () {
    // this.data.purpose = 
    var text = JSON.stringify(this.data)
    console.log(text)
    var user = this.data
    var title = ''
    if (user.driver) {
      title = title + '寻乘客：'
    } else {
      title = title + '寻司机：'
    }

    if (user.purpose.length == 0) {
      title = title + user.departure + '到' + user.arrival + '; 日期：' + user.earliest



    } else {
      title = title + user.purpose + "; 日期：" + user.earliest


    }

    return {
      title: title,
      path: 'pages/resultDetail/resultDetail?text=' + text,

      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
    wx.switchTab({
      url: '../index/index'
    })
  }

  
})