//post.js
var util = require('../../utils/util.js')

var app = getApp()
Page({
  data: {
    navTab: ["普通拼车","特殊用车"],
    currentNavtab: app.globalData.currentTap_post,
    
    identity: [
      { name: '我是司机', value: 0, checked: 'true' },
      { name: '我是乘客', value: 1 },
    ],
    nowDate: '2017-01-01',
    endDate: '2018-12-30',
    placeArray: app.globalData.place,

    numArray:[1,2,3,4,5,6],
    posted:false,
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
    checkedID:0,
    formNumber:1,
    lastData:''
  },


  onLoad: function(){
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
    console.log(e)
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
    var mydata = e.detail.value;
    if (that.data.currentNavtab==0){
      var rawE = e.detail.value.eDate + ' ' + e.detail.value.eTime
        
      var rawL = e.detail.value.eDate + ' ' + e.detail.value.lTime
      mydata.purpose=''
       
    }else{
      if(mydata.purpose.length==0){
        wx.showModal({
          title: '警告',
          content: '用途不能为空',
          showCancel: false
        })
        return
      }
      var rawE = e.detail.value.eDate + ' ' + '00:00'
      var rawL = e.detail.value.lDate + ' ' + '00:00'
      mydata.arrival = app.globalData.place.length
      mydata.departure = app.globalData.place.length 
      mydata.pNumber=0

    }
    var earlist = new Date(rawE.replace(/-/g, "/"))
    earlist = earlist.getTime() / 1000.0
    var latest = new Date(rawL.replace(/-/g, "/"))
    latest = latest.getTime() / 1000.0
    var nowT = Date.now() / 1000.0
    if(nowT > earlist){
      wx.showModal({
        title: '提示',
        content: '请确认最早时间晚于现在！',
        showCancel: false
      })
      return
    }

    let formId = e.detail.formId;
    that.dealFormIds(formId); //处理保存推送码
    mydata.earliest = earlist;
    mydata.latest = latest;
    mydata.departure = parseInt(mydata.departure) + 1;
    mydata.arrival = parseInt(mydata.arrival) + 1;
    mydata.pNumber = this.data.pNumber
    if(parseInt(that.data.checkedID)==0){
      mydata.driver = true
    } else{
      mydata.driver = false
    }
    console.log('driver:',mydata.driver)

    if (earlist <= latest && (app.globalData.weixin.length > 0 || parseInt(app.globalData.phone) )) {

      this.setData({
        loadingHidden: false,
        lastData:mydata
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
            that.setData({
              posted:true
            })
          }
          wx.showModal({
            title: '提示',
            content: notice ,
            showCancel: false,
         
             
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
      formNumber:1,

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

  switchTab:function(e){
    this.setData({
      currentNavtab: e.currentTarget.dataset.idx
    });
    app.globalData.currentTap = this.data.currentNavtab_post;
  },



  addForm:function(e){
    var formNumber = this.data.formNumber
    this.setData({
      formNumber:formNumber+1
    })

    let formId = e.detail.formId;
    this.dealFormIds(formId); //处理保存推送码
  },

  confirm:function(e){
    let formId = e.detail.formId;
    this.dealFormIds(formId); //处理保存推送码
    this.setData({
      posted:false
    })
    wx.switchTab({
      url: '../index/index'
    })
  },

  dealFormIds: function (formId) {
    
    let data = {
      formId: formId,
      expire_time: parseInt(new Date().getTime() / 1000) + 604800 //计算7天后的过期时间时间戳
    }
    
    wx.request({
      url: 'https://kunwang.us/weixintoken/'+app.globalData.openid+'/',
      data: data,
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
    })
  },
  onShareAppMessage: function () {
    var user= this.data.lastData
    var title=''
    if (user.driver){
      title=title+'寻乘客：'
    }else{
      title=title+'寻司机：'
    }
    if (user.purpose.length==0){
      title = title + this.data.placeArray[user.departure - 1] + '到' + this.data.placeArray[user.arrival - 1] + ';日期：' + user.eDate
    }else{
      title = title + user.purpose + ";日期：" + user.eDate
    }

    return {
      title: title,
      path: 'pages/index/index?id=3',
      imageUrl:'http://server.myspace-shack.com/d23/b74dba9d-ec33-446d-81d3-7efd254f1b85.png',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }





  }


})