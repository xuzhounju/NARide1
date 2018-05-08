//kost.js
var util = require('../../utils/util.js')

var app = getApp()
Page({
  data: {
    //navTab: ["普通拼车","搬家练车","呼叫专车"],
    navTab: ["普通拼车", "搬家练车"],
    currentNavtab: app.globalData.currentTap_post,
    
    identity: [
      { name: '我是司机', value: 0, checked: 'true' },
      { name: '我是乘客', value: 1 },
    ],
    nowDate: '2017-01-01',
    endDate: '2018-12-30',
    placeArray: app.globalData.places,
    place: app.globalData.place,
    numArray:[1,2,3,4,5,6],
    posted:false,
    userInfo:{},
    departure: 1,
    arrival:2,
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
    lastData:null,
    pk:null,
    aId:1,
    dId:0,
    refresh:true
  },
  askAuth: function(){
    if (wx.getSetting) {
      console.log("new version")
      wx.getSetting({
        success(res) {
          console.log(res)
          if (!res.authSetting['scope.userInfo']) {
            wx.showModal({
              title: '提示',
              content: '尚未授权小程序获得头像昵称等信息，是否授权？',
              success(res) {
                if (res.confirm) {
                  wx.openSetting({
                    success: function (res) {
                      app.getUserInfo(function (userInfo) {

                      })
                      app.globalData.newProfile = true
                      var mydata = {}
                      if (app.globalData.userInfo) {
                        mydata.gender = app.globalData.userInfo.gender
                        mydata.nickName = app.globalData.userInfo.nickName
                        mydata.avatarUrl = app.globalData.userInfo.avatarUrl
                      }

                      mydata.weixin = app.globalData.weixin
                      mydata.phone = app.globalData.phone
                      mydata.email = app.globalData.email
                      console.log('info:', mydata)
                      wx.showLoading({
                        title: '加载中',
                      })
                      wx.request({
                        url: 'https://kunwang.us/user/' + app.globalData.openid + '/',
                        data: mydata,
                        method: "POST",
                        header: {
                          'content-type': 'application/x-www-form-urlencoded'
                        },
                        success: function (res) {
                          wx.hideLoading()
                        }
                      })

                    }
                  })

                }
              }
            })

          }
        }
      })
    } else {

    }
  },

  onLoad: function(){
    this.askAuth()   
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
      placeArray: app.globalData.places,
      place: app.globalData.place,

      eDate: year + '-' + month + '-' + day,
      lDate: year + '-' + month + '-' + day,

    })








  },

  onShow: function(){
   
    this.setData({
      placeArray: app.globalData.places,
      place: app.globalData.place,
      

    })

    if(this.data.refresh){
      this.setData({
        departure: app.globalData.places[0].id,
        arrival: app.globalData.places[1].id,
        aId: 1,
        dId: 0,
      })
    }else{
      this.setData({
        refresh: true
      })
    }

    console.log('departure:',this.data.departure)
    console.log('arrival:',this.data.arrival)

  },



  bindPNumberPickerChange: function (e) {
    this.setData({
      pNumber: parseInt(e.detail.value)+1

    })

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
      mydata.arrival=that.data.arrival
      mydata.departure=that.data.departure
      console.log('mydata:',mydata)
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
      mydata.arrival = app.globalData.campusCenter
      mydata.departure = 12 

    }
    var earlist = new Date(rawE.replace(/-/g, "/"))
    earlist = earlist.getTime() / 1000.0
    var latest = new Date(rawL.replace(/-/g, "/"))
    latest = latest.getTime() / 1000.0
    var nowT = Date.now() / 1000.0
    if (that.data.currentNavtab == 0 && nowT > earlist){
      wx.showModal({
        title: '提示',
        content: '请确认最早时间晚于现在！',
        showCancel: false
      })
      return
    }

    let formId = e.detail.formId;
    app.dealFormIds(formId); //处理保存推送码
    mydata.earliest = earlist;
    mydata.latest = latest;
    mydata.pNumber = this.data.pNumber
    if(parseInt(that.data.checkedID)==0){
      mydata.driver = true
    } else{
      mydata.driver = false
    }
    console.log('driver:',mydata.driver)

    if (earlist <= latest && (app.globalData.weixin.length > 0 || parseInt(app.globalData.phone) )) {
      function stringToTime(date) {
        var d = new Date(date)
        return d.getTime() / 1000.0
      }
      console.log('l:', app.globalData.onGoingPost.length)
      for(var i=0;i<app.globalData.onGoingPost.length;i++){
        app.globalData.detailSelfPostID = i
        var data = app.globalData.onGoingPost[i].fields
        var earliest = stringToTime(data.earliest)
        var lastest = stringToTime(data.earliest)
        console.log('ongoing time',earliest)
        if ((earliest - mydata.earliest) * (earliest - mydata.earliest)<=(2*60*60*2*60*60) && data.departure == mydata.departure && data.arrival == mydata.arrival) {

          wx.showModal({
            title: '提示',
            content: '你已发过相同内容帖子！是否跳转修改',
            success:function(res){
              if(res.confirm){
                wx.navigateTo({
                  url: '../detailSelfPost/detailSelfPost',
                })
              }
            }
          })
          return
        }

      }
 
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
         
          console.log(res.data)
          that.setData({
            loadingHidden: true,
            pk:res.data
          })
          var notice
          var flag
          if(res.statusCode==403){
            notice = '你已超过一天可允许的发帖量（10次），请明日再发!'
            flag=false
          }else{
            notice = '提交成功！' 
            app.globalData.newProfile = true 
            flag=true
            that.setData({
              refresh:false
            })
            
            app.onLaunch()
           
          }
          wx.showModal({
            title: '提示',
            content: notice ,
            showCancel: false,
            success:function(res){
              if (res.confirm && flag ){
                that.setData({
                  posted: true
                })
                wx.request({
                  url: 'https://kunwang.us/list/' + mydata.earliest + '/' + mydata.latest + '/' + mydata.departure + '/' + mydata.arrival + '/', //仅为示例，并非真实的接口地址 //仅为示例，并非真实的接口地址
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  success: function (res) {
                    var flag =true
                    var i = 0
                    while (i<res.data.length&&flag){
                      if(res.data[i].fields.driver!=mydata.driver){
                        flag=false 
                        app.globalData.searchResult = res.data;
                        if (mydata.driver){
                          app.globalData.searchTap = 0;
                        }else{
                          app.globalData.searchTap = 1;

                        }
                        wx.showModal({
                          title: '提示',
                          content: '已有符合您要求的帖子，是否前往查看？',
                          success:function(res){
                            if(res.confirm){
                              wx.navigateTo({
                                url: '../result/result',
                              })
                            }
                          }
                        })
                        
                      }
                      i=i+1
                    }
                    
                  }
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
    app.dealFormIds(formId); //处理保存推送码
  },

  confirm:function(e){
    let formId = e.detail.formId;
    app.dealFormIds(formId); //处理保存推送码
    this.setData({
      posted:false
    })
    wx.switchTab({
      url: '../index/index'
    })
  },

  
  onShareAppMessage: function () {
    this.setData({
      posted: false
    })
    var user= this.data.lastData
    if(this.data.lastData.length==0){
      wx.showModal({
        title: '提示',
        content: '此分享为空，请点击下方发布拼车后再分享至群',
        showCancel:false
      })
    }
    var title=''
    var eventDetail={}
    eventDetail.driver=user.driver
    if (user.driver){
      title=title+'寻乘客：'
    }else{
      title=title+'寻司机：'
    }
    if (user.purpose.length==0){
      title = title + this.data.place[user.departure - 1] + '到' + this.data.place[user.arrival - 1] + '; 日期：' + user.eDate
      eventDetail.arrival = this.data.place[user.arrival - 1] 
      eventDetail.departure = this.data.place[user.departure - 1]
     

    }else{
      title = title + user.purpose + "; 日期：" + user.eDate
      eventDetail.departure = user.purpose
      eventDetail.arrival=""
      
    }
    user.earliest = new Date(user.earliest*1000)
    user.latest = new Date(user.latest*1000)
    eventDetail.earliest = user.earliest.toLocaleString([], { month: 'numeric', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    eventDetail.latest = user.latest.toLocaleString([], { month: 'numeric', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    eventDetail.memo=user.memo
    eventDetail.pNumber = user.pNumber
    eventDetail.pk = this.data.pk
    eventDetail.purpose = user.purpose
    if (app.globalData.userInfo){
      eventDetail.poster = [0, app.globalData.userInfo.gender, app.globalData.userInfo.nickName, app.globalData.userInfo.avatarUrl, app.globalData.email, app.globalData.weixin, app.globalData.phone, 0]
    }else{
      eventDetail.poster = [0, 0, "未知", 'http://server.myspace-shack.com/d23/b74dba9d-ec33-446d-81d3-7efd254f1b85.png', app.globalData.email, app.globalData.weixin, app.globalData.phone, 0]
    }
    
    console.log('detail',eventDetail)
   
    var text=JSON.stringify(eventDetail)

    return {
      title: title,
      path: 'pages/resultDetail/resultDetail?text='+text,
     
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