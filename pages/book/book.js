// pages/book/book.js
var app =getApp()
Page({
  data: {

  
      numArray: [1, 2, 3, 4, 5, 6],
      nowDate: '2017-01-01',
      endDate: '2018-12-30',

      placeArray: app.globalData.places,
      userInfo: {},
      departure: 1,
      arrival: 2,
      eDate: '',
      eTime: '00:00',
      lDate: '',
      lTime: '23:59',
      pNumber: 1,
      aId: 1,
      dId: 0,
      formNumber: 1,
      dName:'',
      aName:'',
      fromTime:null,
      toTime:''
    
  },

  onLoad: function(e){
    
    this.setData({
      placeArray: app.globalData.places,

    })
    this.setBooked()
  
  },

  setBooked:function(e){
    var placeArray = this.data.placeArray
    if (app.globalData.monitor_place_from) {
      this.setData({
        fromTime: new Date(app.globalData.monitor_time_from).toLocaleString([], { month: 'numeric', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        toTime: new Date(app.globalData.monitor_time_to).toLocaleString([], { month: 'numeric', day: '2-digit', hour: '2-digit', minute: '2-digit' })
      })
      for (var i in placeArray) {
        if (placeArray[i].id == app.globalData.monitor_place_from) {
          console.log(placeArray[i].name)
          this.setData({
            dName: placeArray[i].name
          })
        }
        if (placeArray[i].id == app.globalData.monitor_place_to) {
          this.setData({
            aName: placeArray[i].name
          })
        }
      }

    }else{
      this.setData({
        aName: '',
        dName:''
      })
    }
  },

  onShow: function (options) {
 
    var eDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
    var lDate = new Date(Date.now() + 48 * 60 * 60 * 1000)
    

    console.log(this.data.placeArray)
    function formTime(d){
      var year = d.getFullYear()
      var month = d.getMonth() + 1

      if (month < 10) {
        month = '0' + month
      }

      var day = d.getDate()

      if (day < 10) {
        day = '0' + day
      }

      return year + '-' + month + '-' + day

    }
    




      this.setData({

        eDate: formTime(eDate),
        lDate: formTime(lDate),

      })
      console.log(this.data.placeArray)

  
  },

  bindDeparturePickerChange: function (e) {
    this.setData({
      dId: e.detail.value,
      departure: this.data.placeArray[e.detail.value].id
    })
    console.log(this.data.placeArray[e.detail.value])

  },

  bindarrivalPickerChange: function (e) {
    this.setData({
      aId: e.detail.value,

      arrival: this.data.placeArray[e.detail.value].id
    })
    console.log(this.data.placeArray[e.detail.value])
  },


  bindEDateChange: function (e) {

    this.setData({
      eDate: e.detail.value,
    })
  },
 

  bindLDateChange: function (e) {
    this.setData({
      lDate: e.detail.value
    })
  },

  addForm: function (e) {
    var formNumber = this.data.formNumber
    this.setData({
      formNumber: formNumber + 1
    })

    let formId = e.detail.formId;
    app.dealFormIds(formId); //处理保存推送码
  },

  formSubmit:function(e){
    var that =this
    let formId = e.detail.formId;
    app.dealFormIds(formId); //处理保存推送码

    function stringToTime(date) {
      var d = new Date(date.replace(/-/g, "/"))
      return d.getTime() / 1000.0
    }
    var mydata = e.detail.value;
    mydata.monitor_time_from = stringToTime(this.data.eDate +' '+ this.data.eTime )
    mydata.monitor_time_to = stringToTime(this.data.lDate+' '+this.data.lTime)
    mydata.monitor_place_from = this.data.departure
    mydata.monitor_place_to = this.data.arrival
    if (app.globalData.userInfo) {
      mydata.gender = app.globalData.userInfo.gender
      mydata.nickName = app.globalData.userInfo.nickName
      mydata.avatarUrl = app.globalData.userInfo.avatarUrl
    } else {
      mydata.gender = 0
      mydata.nickName = "未知"
      mydata.avatarUrl = 'http://server.myspace-shack.com/d23/b74dba9d-ec33-446d-81d3-7efd254f1b85.png'
     
    }

    if (app.globalData.preference) {
      mydata.preference = app.globalData.preference
    }

    mydata.weixin = app.globalData.weixin
    if (mydata.phone){
      mydata.phone = app.globalData.phone
    }else{
      mydata.phone  = ''
    }
    mydata.email = app.globalData.email
    console.log('mydata:',mydata)
    this.book(mydata)




  },

  book:function(mydata){
    wx.showLoading({
      title: '加载中',
    })
    var that =this 
    wx.login({
      success: function (res) {
        var js_code = res.code
        wx.request({
          url: 'https://kunwang.us/user/' + js_code + '/',
          data: mydata,
          method: "POST",
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            
            wx.hideLoading()
            var notice
            var flag = false
            if (res.statusCode == 400) {
              notice = '请填写正确信息'
            } else {
              notice = '提交成功！'
              flag = true
              app.globalData.newProfile = true
              
              if (mydata.monitor_time_from){
                app.globalData.monitor_place_from = mydata.monitor_place_from
                app.globalData.monitor_place_to = mydata.monitor_place_to
                mydata.monitor_time_from = new Date(mydata.monitor_time_from * 1000)
                mydata.monitor_time_to = new Date(mydata.monitor_time_to * 1000)
                app.globalData.monitor_time_from = mydata.monitor_time_from.toISOString()
                app.globalData.monitor_time_to = mydata.monitor_time_to.toISOString()
              }else{
                app.globalData.monitor_place_from = null
                app.globalData.monitor_place_to = null
                app.globalData.monitor_time_from = null
                app.globalData.monitor_time_to = null
              }
             
              that.setBooked()

            }

            app.globalData.newProfile = true
            wx.showModal({
              title: '提示',
              content: notice,
              showCancel: false,
              success: function (res) {

              }
            })



          }
        })


      }
    })
  },


  formReset:function(e){
    this.setData({
      departure: 1,
      arrival: 2,
      aId: 1,
      dId: 0,
      formNumber: 1,
    })
    var mydata={}
 
    if (app.globalData.userInfo) {
      mydata.gender = app.globalData.userInfo.gender
      mydata.nickName = app.globalData.userInfo.nickName
      mydata.avatarUrl = app.globalData.userInfo.avatarUrl
    } else {
      mydata.gender = 0
      mydata.nickName = "未知"
      mydata.avatarUrl = 'http://server.myspace-shack.com/d23/b74dba9d-ec33-446d-81d3-7efd254f1b85.png'

    }
    if (app.globalData.preference) {
      mydata.preference = app.globalData.preference
    }

    mydata.weixin = app.globalData.weixin
    if (mydata.phone) {
      mydata.phone = app.globalData.phone
    } else {
      mydata.phone = ''
    }
    mydata.email = app.globalData.email
    console.log('mydata:', mydata)
    this.book(mydata)



  }

  
 

})