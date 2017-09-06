//post.js
var util = require('../../utils/util.js')

var app = getApp()
Page({
  data: {
    identity: [
      { name: '我是司机', value: 0, checked: 'true' },
      { name: '我是乘客', value: 1 },
    ],
    nowDate: '2017-01-01',
    endDate: '2018-12-30',
    placeArray: app.globalData.place,

    numArray:[1,2,3,4,5,6],
   
    userInfo:{},
    departure: 0,
    arrival:1,
    eDate:'',
    eTime:'12:00',
    lDate:'',
    lTime:'12:00', 
    pNumber: 1, 
    memo:'',
    text: '',
    agree: true,
    loadingHidden: true,
    checkedID:0

  },


  onLoad: function(){
    console.log("onload")
    var d = new Date(Date.now()+24*60*60*1000)
    var year = d.getFullYear()
    var month =d.getMonth()+1

    if (month<10){
      month='0'+month
    }
   
    var day =d.getDate()
  
    if(day<10){
      day='0'+day
    }



    this.setData({
      eDate: year + '-' + month + '-' + day,
      lDate: year + '-' + month + '-' + day,

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
      eDate: e.detail.value,
      lDate: e.detail.value
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

  radioChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      checkedID: e.detail.value
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
    var omit=''
    if(event.eDate.length>0&&event.eTime.length>0&&event.lTime.length>0){
      var rawE = e.detail.value.eDate + ' ' + e.detail.value.eTime
      var earlist = new Date(rawE.replace(/-/g, "/"))
      earlist = earlist.getTime() / 1000.0
      var rawL = e.detail.value.eDate + ' ' + e.detail.value.lTime
      var latest = new Date(rawL.replace(/-/g, "/"))
      latest = latest.getTime() / 1000.0
      var nowT =Date.now()/1000.0
      if(nowT > earlist){
        wx.showModal({
          title: '提示',
          content: '请确认最早时间晚于现在！',
          showCancel: false
        })
        return
      }
      var mydata = e.detail.value;
      mydata.earliest = earlist;
      mydata.latest = latest;
      mydata.departure = parseInt(mydata.departure) + 1;
      mydata.arrival = parseInt(mydata.arrival) + 1;
      mydata.pNumber = this.data.pNumber
      console.log("formId:",e.detail.formId)
      if(parseInt(that.data.checkedID)==0){
        mydata.driver = true
      } else{
        mydata.driver = false
      }
      console.log('driver:',mydata.driver)

      if (earlist <= latest && (app.globalData.weixin.length > 0 || parseInt(app.globalData.phone) )) {

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
            console.log(res.statusCode)
            that.setData({
              loadingHidden: true
            })
            var notice
            if(res.statusCode==403){
              notice = '你已超过一天可允许的发帖量（10次），请明日再发!'
            }else{
              notice = '提交成功！' 
              app.globalData.newProfile = true 
            }
            wx.showModal({
              title: '提示',
              content: notice ,
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
      } else  if (earlist>latest){
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
      if (event.eDate.length ==0){omit=omit+' 日期'}
      if (event.eTime.length==0){omit=omit+' 最早时间'}
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
      identity: [
        { name: '我是司机', value: 0, checked: 'true' },
        { name: '我是乘客', value: 1 },
      ],
      departure: 0,
      arrival: 1,
      eDate: '',
      eTime: '12:00',
      lDate: '',
      lTime: '12:00',
      pNumber: 1,
      memo: '',
      text: '',
      agree: true,
      loadingHidden: true,
    })
    this.onLoad()
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