//app.js
App({
  onLaunch: function() {
    //调用API从本地缓存中获取数据
    wx.clearStorage()  
    var that= this
    wx.request({
      url: 'https://Kunwang.us/all_places/',
      method:'GET',
      success: function (res) {
        console.log("places:",res.data)
        var places= []
        var places2=[]

        for (var i=0;i<(res.data.length);i++){
          var place={name:'',id:null}
          if (res.data[i].pk != 12){ 
            place.name=res.data[i].fields.name
            place.id=res.data[i].pk
            console.log(place)
            places2.push(place)
            places.push(place)
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
        places2.sort(function(a,b){
          return a.id-b.id
        })
        for(var i=0; i <places2.length;i++){
          places2[i]=places2[i].name
        }

        that.globalData.places = places
        that.globalData.place = places2
        console.log(places2)

      }
    })
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

  setOpenID: function(cb){
    this.globalData.openid = cb
  },

  globalData: {
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
    placeId:null
  }
})
