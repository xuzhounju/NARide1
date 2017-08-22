//post.js
var util = require('../../utils/util.js')

var app = getApp()
Page({
  data: {
    nowDate: '',
    endDate: '',
    placeArray: app.globalData.place,

    numArray:[1,2,3,4,5,6],
   
    userInfo:{},
    departure: 0,
    arrival:1,
    eDate:'',
    eTime:'',
    lDate:'',
    lTime:'', 
    pNumber: 1, 
    memo:'',
    text: '',
    agree: true,
    loadingHidden: true
  },
  onLoad: function(){

    var that = this
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  },


  bindPNumberPickerChange: function (e) {
    this.setData({
      pNumber: parseInt(e.detail.value)+1

    })

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
      eDate: e.detail.value
    })
  },
  bindETimeChange: function (e) {
    this.setData({
      eTime: e.detail.value
    })
  },

  bindLDateChange: function (e) {
    this.setData({
      lDate: e.detail.value
    })
  },
  bindLTimeChange: function (e) {
    this.setData({
      lTime: e.detail.value
    })
  },

  formSubmit: function (e) {
    var that =this
    var event=e.detail.value
    if (this.data.agree == false){
      wx.showModal({
        title: '提示',
        content: '不同意免责申明则无法发布信息',
        showCancel: false
      })
      return
    }


    if(app.globalData.onGoingPost.length>4){
      wx.showModal({
        title: '提示',
        content: '不能同时发布超过五条进行中的信息，请删除现有信息后再试',
        showCancel: false
      })

      return
    }
    //if (app.global.)
    var omit=''
    if(event.eDate.length>0&&event.eTime.length>0&&event.lDate.length>0&&event.lTime.length>0){
      var rawE = e.detail.value.eDate + ' ' + e.detail.value.eTime
      var earlist = new Date(rawE.replace(/-/g, "/"))
      earlist = earlist.getTime() / 1000.0
      var rawL = e.detail.value.lDate + ' ' + e.detail.value.lTime
      var latest = new Date(rawL.replace(/-/g, "/"))
      latest = latest.getTime() / 1000.0
      var mydata = e.detail.value;
      mydata.earliest = earlist;
      mydata.latest = latest;
      mydata.departure = parseInt(mydata.departure) + 1;
      mydata.arrival = parseInt(mydata.arrival) + 1;
      mydata.pNumber = this.data.pNumber
      if(parseInt(mydata.driver)== 1){
        mydata.driver = true
      } else{
        mydata.driver = false
      }

      if (earlist < latest && (app.globalData.weixin.length > 0 || parseInt(app.globalData.phone) )) {

        this.setData({
          loadingHidden: false
        })
        
        wx.request({
          url: 'https://kunwang.us/new/' + app.globalData.openid + '/', 

          data: mydata,


          method: "POST",

          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            that.setData({
              loadingHidden: true
            })
            wx.showModal({
              title: '提示',
              content: '提交成功！',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.switchTab({
                    url: '../index/index'
                  })

                }
              }
             
            })
           
          }
        })
      } else  if (earlist>=latest){
        wx.showModal({
          title: '提示',
          content: '请确认最晚时间晚于最早时间！',
          showCancel: false
        })
      } else if (app.globalData.weixin.length == 0 && ! parseInt(app.globalData.phone)) {
        wx.showModal({
          title: '提示',
          content: '请填写微信号或者手机号，便于其他用户联系！',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../first/first',
              })
            }
          }
        })
      }
    }else{
      if (event.eDate.length ==0){omit=omit+' 最早日期'}
      if (event.eTime.length==0){omit=omit+' 最早时间'}
      if (event.lDate.length == 0) { omit = omit + ' 最晚日期' }
      if (event.lTime.length == 0) { omit = omit + ' 最晚时间' }


      wx.showModal({
        title: '提示',
        content: '请填写:'+omit+ '!',
        showCancel: false
      })
    }
 
  },
    
  formReset: function () {
    this.setData({
      departure: 0,
      arrival: 1,
      eDate: '',
      eTime: '',
      lDate: '',
      lTime: '',
      pNumber: 1,
      memo: '',
      text:''
    })
  },

  clickTerm: function(e){
    wx.navigateTo({
      url: '../terms/terms',
    })
  },

  agreeTerm: function(e){
    if(e.detail.value.length==0){
      this.setData({
        agree: false
      })
    }else{
      this.setData({
        agree: true
      })
    }
  },

  onShareAppMessage: function () {

  }


})