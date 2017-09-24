//app.js
App({
  onLaunch: function() {
    //调用API从本地缓存中获取数据
    var that= this
    // wx.getLocation({
    //   type: 'wgs84',
    //   success: function (res) {
    //     var latitude = res.latitude
    //     var longitude = res.longitude
    //     var accuracy = res.accuracy
    //     console.log('latitude:',latitude)
    //     console.log('longitude:', longitude)
    //     console.log('accuracy:', accuracy)

    //   }
    // })
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        console.log("local openid:",res.data)
        this.globalData.openid = res.data
      },
      fail: function(res){
        console.log("fail")
      }
    })
    wx.login({
      success: function (res) {
        var js_code = res.code;//调用登录接口获得的用户的登录凭证code
        wx.request({
          url: 'https://kunwang.us/user/' + js_code,
          method: 'GET',
          success: function (res) {
            that.globalData.openid = res.data[0].fields.username
            that.globalData.onGoingPost = res.data[1]
            if (res.data[0].fields.gender == -1) {
              that.globalData.firstLogin = true
              wx.navigateTo({
                url: '../terms/terms',
              })
            }
            that.globalData.weixin = res.data[0].fields.weixin
            that.globalData.phone = res.data[0].fields.phone
            that.globalData.email = res.data[0].fields.email
            that.globalData.preference = res.data[0].fields.preference
            if (that.globalData.preference) {
              that.globalData.regions = [1]
              that.globalData.regions.push(that.globalData.preference)
            }else{
              that.globalData.regions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            }

            wx.request({
              url: 'https://Kunwang.us/all_places/',
              method: 'GET',
              success: function (res) {
                console.log("places:", res.data)

                var places = []
                var places2 = []
                var pks = []
                console.log(that.globalData.regions)
                for (var i = 0; i < (res.data.length); i++) {
                  var place = { name: '', id: null }
                  if (res.data[i].pk != 12 && ! (that.globalData.regions.indexOf(res.data[i].fields.region[0])===-1)) {
                    console.log(res.data[i].fields.region[0])
                    place.name = res.data[i].fields.name
                    place.id = res.data[i].pk
                    pks.push(res.data[i].pk)
                    console.log(place)
                    places2.push(place)
                    places.push(place)
                  }else{
                    
                    place.name = res.data[i].fields.name
                    place.id = res.data[i].pk
                    places2.push(place)
                   
                  }
                }

                places.sort(function (a, b) {
                  var nameA = a.name.toUpperCase(); // ignore upper and lowercase
                  var nameB = b.name.toUpperCase(); // ignore upper and lowercase
                  if (nameA < nameB) {
                    return -1;
                  }
                  if (nameA > nameB) {
                    return 1;
                  }

                  // names must be equal
                  return 0;
                })
                places2.sort(function (a, b) {
                  return a.id - b.id
                })
                for (var i = 0; i < places2.length; i++) {
                  places2[i] = places2[i].name
                }
                pks.push(12)
                that.globalData.validPk = pks
                that.globalData.places = places
                that.globalData.place = places2
                console.log(places2)
                if (getCurrentPages().length != 0) {
                  getCurrentPages()[getCurrentPages().length - 1].onShow()
                }

              }
            })
          }

          
        })
      }
     


    })

  },

  onShow:function(){
    console.log('app.onshow', this.globalData.places.length)
    if (this.globalData.places.length==0){
      this.onLaunch()
    }
  },

  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },

  dealFormIds: function (formId) {

    let data = {
      formId: formId,
      expire_time: parseInt(new Date().getTime() / 1000) + 604800 //计算7天后的过期时间时间戳
    }

    wx.request({
      url: 'https://kunwang.us/weixintoken/' + this.globalData.openid + '/',
      data: data,
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
    })
  },


 

  globalData: {
    badNet:false,
    userInfo:null,
    openid:null,
    searchResult: null,
    sResult:null,
    onGoingPost: null,
    detailSelfPostID: null,
    detailEvent: null,
    detailRideEvent: null,
    weixin:'',
    phone:'',
    email:'',
    place:[],
    searchTab:null,
    currentTap:0,
    currentTap_post:0,
    perferN:null,
    newProfile: false,
    gloabalFomIds:[],
    places:[],
    placeId:null,
    regions:[1,2,3,4,5,6,7,8,9,10],
    monitor_place_from:null,
    monitor_place_to:null,
    monitor_time_from:null,
    monitor_time_to:null,
    preference:null,
    validPk:[]
  }
})
