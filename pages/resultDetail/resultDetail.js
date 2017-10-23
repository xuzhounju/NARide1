var util = require('../../utils/util.js')

var app = getApp()

Page({
  data: {
    eventDetail:'',
    removed:false,
    posted:false
  },

  onLoad: function (options) {
    if(options.text=== undefined){
      this.setData({
        eventDetail: app.globalData.detailEvent
      })
      console.log('data',this.data.eventDetail)
      
    } else {
      if(wx.showLoading){
        wx.showLoading({
          title: '加载中',
        })
      }
   
     
      wx.login({
        success: function (res) {
          var js_code = res.code;//调用登录接口获得的用户的登录凭证code
          wx.request({
            url: 'https://kunwang.us/user/' + js_code,
            method: 'GET',
            success: function (res) {
              if (res.data[0].fields.username){
                app.globalData.openid = res.data[0].fields.username
              }
              
              if(wx.hideLoading){
                wx.hideLoading()

              }
            }
          
          })
        }
      })
      var that=this
      var text=options.text
      this.setData({
        eventDetail: JSON.parse(text)
      })
      console.log('pk', that.data.eventDetail.pk)
      wx.request({
        url: 'https://kunwang.us/entry/'+that.data.eventDetail.pk+'/',
        method:'GET',
        success:function(res){
          console.log('res:',res)
          if (res.data[0].fields.removed){
            wx.showModal({
              title: '提示',
              content: '此贴已被删除',
              showCancel:false,
              success: function(res){
                if(res.confirm){
                  wx.switchTab({
                    url: '../index/index'
                  })
                }
              }
            })
          }
      
        }
      })
    }
    
  
    console.log(this.data.eventDetail)
  },
  phoneCall: function (e){

    if (this.data.eventDetail.poster[6]){
      wx.makePhoneCall({
        phoneNumber: this.data.eventDetail.poster[6].toString()
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '该用户未填写手机号',
        showCancel: false
      })
    }
  
  },

  copyWechat: function (e){
    var that =this
    if(this.data.eventDetail.poster[5].length>0){
      wx.setClipboardData({
        data: that.data.eventDetail.poster[5],
        success: function (res) {
          wx.getClipboardData({
            success: function (res) {
              wx.showModal({
                title: '提示',
                content: '微信号已复制到粘贴板！',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    if (app.globalData.openid){
                      that.setData({
                        posted: true
                      })
                    }
                  

                  }
                }
              })
            }
          })
        }
      })
    }else{
      wx.showModal({
        title:'提示',
        content:'该用户未填写微信号',
        showCancel:false
      })
    }

  },

  confirm: function (e) {
    console.log("confirm")
    let formId = e.detail.formId;

    this.task_notify()

    app.dealFormIds(formId); //处理保存推送码
    this.setData({
      posted: false
    })
    wx.switchTab({
      url: '../index/index'
    })
  },

  reset: function (e) {
    let formId = e.detail.formId;

    app.dealFormIds(formId); //处理保存推送码
    this.setData({
      posted: false
    })
    wx.switchTab({
      url: '../index/index'
    })
  },


  task_notify:function(){
    var that = this
    wx.request({
      url: 'https://kunwang.us/task_notify/' + this.data.eventDetail.pk + '/' + app.globalData.openid + '/',
      method: "GET",
      success:function(res){
        
        
      }
    })
    
    
  },


  // dealFormIds: function (formId) {

  //   let data = {
  //     formId: formId,
  //     expire_time: parseInt(new Date().getTime() / 1000) + 604800 //计算7天后的过期时间时间戳
  //   }

  //   wx.request({
  //     url: 'https://kunwang.us/weixintoken/' + app.globalData.openid + '/',
  //     data: data,
  //     method: "POST",
  //     header: {
  //       'content-type': 'application/x-www-form-urlencoded'
  //     },
  //   })
  // },

  onShareAppMessage: function () {
    var text = JSON.stringify(this.data.eventDetail)
    console.log(text)
    var user = this.data.eventDetail
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
