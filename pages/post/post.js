//post.js
var util = require('../../utils/util.js')

var app = getApp()
Page({
  data: {
    nowDate: '',
    endDate: '',
    placeArray: app.globalData.place,

    numArray:[0,1,2,3,4,5,6],
   
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
    agree: true
  },
  onLoad: function(){
    console.log('onLoad')
    // var d = Date.now()
    // var year = d.getFullYear()
    // var month = d.getMonth()
    // var day = d.getDate()
    // this.setDate({
    //   nowDate: year+'-'+month+'-'+day,
    //   endDate: (year+1)+'-'+(month+1)%12+day
    // })

    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
   

    // wx.connectSocket({
    //   url: 'wss://kunwang.us'
    // })

    // wx.onSocketOpen(function (res) {
    //   console.log('WebSocket连接已打开！')
    // })

    // wx.onSocketError(function (res) {
    //   console.log('WebSocket连接打开失败，请检查！')
    // })




  },


  bindPNumberPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      pNumber: e.detail.value
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
    if(event.eDate.length>0&&event.eTime.length>0&&event.lDate.length>0&&event.lTime.length>0){
      var rawE = e.detail.value.eDate + ' ' + e.detail.value.eTime
      var earlist = new Date(rawE.replace(/-/g, "/"))
      console.log('E:', earlist)
      earlist = earlist.getTime() / 1000.0
      var rawL = e.detail.value.lDate + ' ' + e.detail.value.lTime
      var latest = new Date(rawL.replace(/-/g, "/"))
      latest = latest.getTime() / 1000.0
      var mydata = e.detail.value;
      mydata.earliest = earlist;
      mydata.latest = latest;
      mydata.departure = parseInt(mydata.departure) + 1;
      mydata.arrival = parseInt(mydata.arrival) + 1;
      if(parseInt(mydata.driver)== 1){
        mydata.driver = true
      } else{
        mydata.driver = false
      }
      console.log('form发生了submit事件，携带数据为：', e.detail.value)

      if (earlist < latest && (app.globalData.weixin.length > 0 || app.globalData.phone.length > 0)) {

      
        
        wx.request({
          url: 'https://kunwang.us/new/' + app.globalData.openid + '/', //仅为示例，并非真实的接口地址

          data: mydata,


          method: "POST",

          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
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
        console.log('form发生了submit事件，携带数据为：', e.detail.value)
      } else  if (earlist>=latest){
        wx.showModal({
          title: '提示',
          content: '请确认最晚时间晚于最早时间！',
          showCancel: false
        })
      } else if (app.globalData.weixin.length == 0 && app.globalData.phone.length == 0) {
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
      wx.showModal({
        title: '提示',
        content: '请填写必要信息！',
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
    console.log('form发生了reset事件')
  },

  clickTerm: function(e){
    wx.navigateTo({
      url: '../terms/terms',
    })
  },

  agreeTerm: function(e){
    console.log("agree:",e.detail.value.length)
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