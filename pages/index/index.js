// index.js
var util = require('../../utils/util.js')

var app = getApp()
Page({

  data: {
    navTab: ["../../images/all_c.png", "../../images/driver.png", "../../images/pass.png", "../../images/rank.png"],
    originTab: ["../../images/all", "../../images/driver", "../../images/pass", "../../images/rank"],
    currentNavtab: app.globalData.currentTap,
    userInfo: '',
    genderUrl: '../../images/',
    gender: ['unknown.png', 'male.png', 'female.png'],
    loadingHidden: true,
    filter: true,
    placeArray: '',
    placeArray_d:'',
    aId: 0,
    dId:0,
    filterAid: 0,
    filterDid:0,
    rankId: 1,
    rankArray: ["按出发时间", "按发帖时间"],
    color1:"green",
    color2:"black",
    hasMessage: false
  },

  onShow: function (options) {
    if(app.globalData.finishLaunch){
      app.takeMessage()
    }
    this.setData({
      loadingHidden: false,
      currentNavtab: app.globalData.currentTap,
      hasMessage:app.globalData.hasMessage
     
    })
    
    var that = this
    var nowTime = new Date();
    var latestTime = new Date(nowTime.getTime() + 3 * 30 * 24 * 3600 * 1000);
    nowTime = Math.floor(nowTime.getTime() / 1000.0);
    latestTime = Math.floor(latestTime.getTime() / 1000.0);
    var departure = 0;
    var arrival = 0;
    var sResult = [];
    wx.request({
      url: 'https://kunwang.us/list/' + nowTime + '/' + latestTime + '/' + departure + '/' + arrival + '/',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var places = []
        var places_d=[]
        places.push({ name: "目的地", id: 0 })
        places_d.push({ name: "出发地", id: 0 })
        for (var i = 0; i < app.globalData.places.length; i++) {
          places.push(app.globalData.places[i])
          places_d.push(app.globalData.places[i])

        }
        places.push({ name: "特殊用车", id: 12 })
        places_d.push({ name: "特殊用车", id: 12 })
        that.setData({
          placeArray: places,
          placeArray_d: places_d
        })
        var result = res.data;
        var placeArray = app.globalData.place;
        for (var i = 0; i < result.length; i++) {
          if (result[i] && !(app.globalData.validPk.indexOf(result[i].fields.departure)===-1) && !(app.globalData.validPk.indexOf(result[i].fields.arrival)===-1)) {
            var filterAid = result[i].fields.arrival
            var filterDid = result[i].fields.departure
            if (result[i].fields.departure != 12) {
              result[i].fields.departure = placeArray[result[i].fields.departure - 1];
              result[i].fields.arrival = placeArray[result[i].fields.arrival - 1];
            }
            else {
              console.log(result[i].fields)
              result[i].fields.departure = result[i].fields.purpose
              result[i].fields.arrival = ""
            }
          
           
            result[i].fields.e = app.timeStringToNumber(result[i].fields.earliest)
            result[i].fields.earliest = app.timeStringToShortString(result[i].fields.earliest)
           
            result[i].fields.latest = app.timeStringToShortString(result[i].fields.latest )

          
            result[i].fields.post_time = app.timeStringToNumber(result[i].fields.post_time)/1000
            result[i].fields.pk = result[i].pk
            if (that.data.filterDid == 12 || that.data.filterAid==12){
              if(filterDid==12){
                sResult.push(result[i].fields);

              }
            }else if (that.data.filterAid == 0 &&that.data.filterDid==0) {
              sResult.push(result[i].fields);
            } else if (that.data.filterAid == 0) {
              if (filterDid == that.data.filterDid){
                sResult.push(result[i].fields);
              }
              
            } else if (that.data.filterDid == 0 ){
              if (filterAid == that.data.filterAid) {
                sResult.push(result[i].fields);
              }
            }else{
              if (filterDid == that.data.filterDid && filterAid == that.data.filterAid){
                sResult.push(result[i].fields);
              }
            }
          }
        }

        function sortNumber(a, b) {
          if (that.data.rankId == 0) {
            return a.e - b.e
          }
          else {
            return b.post_time - a.post_time;
          }
        }
        sResult = sResult.sort(sortNumber);
        app.globalData.sResult = sResult;
        var currentN = that.data.currentNavtab;
        var result = app.globalData.sResult;
        if (currentN == 1) {
          var temp = [];
          for (var i = 0; i < result.length; i++) {
            if (!result[i].driver) {
              temp.push(result[i])
            }
          }
          that.setData({
            sResult: temp,
            loadingHidden: true
          })
        }
        else if (currentN == 2) {
          var temp = [];
          for (var i = 0; i < result.length; i++) {
            if (result[i].driver) {
              temp.push(result[i])
            }
          }
          that.setData({
            sResult: temp,
            loadingHidden: true
          })
        }
        else {
          that.setData({
            sResult: result,
            loadingHidden: true
          })
        }
      },

    })





    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
    console.log('onshow end:',app.globalData.places)
  },

  switchTab: function (e) {
    var tab=[]
    for(var i=0;i<4;i++){
      var url = this.data.originTab[i]
      if (i == e.currentTarget.dataset.idx){
        url=url+'_c'
      }
      url=url+'.png'
      tab.push(url)
    }
    this.setData({
      navTab:tab
    })
    console.log()
    if (e.currentTarget.dataset.idx == 3) {
      this.setData({
        currentNavtab: e.currentTarget.dataset.idx,
        filter: false
      })
      return
    }
    this.setData({
      filter: true,
      currentNavtab: e.currentTarget.dataset.idx
    });
    app.globalData.currentTap = this.data.currentNavtab;
    var currentN = this.data.currentNavtab;
    var result = app.globalData.sResult;
    if (currentN == 1) {
      var temp = [];
      for (var i = 0; i < result.length; i++) {
        if (!result[i].driver) {
          temp.push(result[i])
        }
      }
      this.setData({
        sResult: temp
      })
    }
    else if (currentN == 2) {
      var temp = [];
      for (var i = 0; i < result.length; i++) {
        if (result[i].driver) {
          temp.push(result[i])
        }
      }
      this.setData({
        sResult: temp
      })
    }
    else {
      this.setData({
        sResult: result
      })
    }
  },
  detailTap: function (e) {
    console.log(this.data.sResult)
    
    var a = this.data.sResult;
    var b = parseInt(e.currentTarget.dataset.id);
    app.globalData.detailEvent = a[b];
    var pk =a[b].pk
    console.log('pk:',pk)
    for (var i = 0; i < app.globalData.onGoingPost.length; i++) {
      if (pk == app.globalData.onGoingPost[i].pk){
        app.globalData.detailSelfPostID = i
        wx.navigateTo({
          url: '../detailSelfPost/detailSelfPost',
        })
        return
      }
      
    }
    wx.navigateTo({
      url: '../resultDetail/resultDetail',
    })
  },
  bindArrivalPickerChange: function (e) {
    if (this.data.placeArray_d[e.detail.value].id!=12){
      this.setData({
        aId: e.detail.value,
        filterAid: this.data.placeArray[e.detail.value].id,
      })
    }else{
      this.setData({
        aId: e.detail.value,
        filterAid: this.data.placeArray[e.detail.value].id,
        dId: e.detail.value,
        filterDid: this.data.placeArray_d[e.detail.value].id
      })

    }
   
    console.log(this.data.filterAid)
    this.onShow()

  },
  bindDeparturePickerChange: function (e) {
    if (this.data.placeArray_d[e.detail.value].id != 12) {
      this.setData({
        dId: e.detail.value,
        filterDid: this.data.placeArray_d[e.detail.value].id
      })
    } else {
      this.setData({
        aId: e.detail.value,
        filterAid: this.data.placeArray[e.detail.value].id,
        dId: e.detail.value,
        filterDid: this.data.placeArray_d[e.detail.value].id
      })

    }
    console.log(this.data.filterDid)
    this.onShow()

  },

  postRank:function(e){
    this.setData({
      rankId: 1,
      filter: true,
      color1: "green",
      color2: "black"
    })
    this.onShow()
  },

  departureRank:function(e){
    this.setData({
      rankId: 0,
      filter: true,
      color1:"black",
      color2:"green"
    })

    this.onShow()
  },
  rankMethod: function (e) {
    this.setData({
      rankId: e.detail.value,
      filter: true
    })
    console.log(this.data.rankId)

    this.onShow()
  },
  checkMessage(e){
    console.log(e)
    wx.navigateTo({
      url: '../message/message',
    })
  },

  onShareAppMessage: function () {

  }
})