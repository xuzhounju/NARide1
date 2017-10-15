// pages/message/message.js
var app =getApp()
Page({


  data: {
    messages:[]
  },

  onLoad: function (options) {
    app.globalData.hasMessage = false
    var that = this
    wx.getStorage({
      key: 'messages',
      success: function(res) {
        console.log(res.data)
        res.data = that.clearMessage(res.data)
        for(var i=0; i<res.data.length;i++){
          res.data[i].read=true

        }
      
        wx.setStorage({
          key: 'messages',
          data: res.data,
        })
        that.setData({
          messages: res.data.reverse()
        })
        console.log('messages:', that.data.messages)

      },
    })
    
  },

  clearMessage:function(messages){
    var newMessages = []

    for(var i = 0; i< messages.length; i++){
      if (messages[i].fields.blocking == false && Date.now() - messages[i].time >7*24*60*60*1000){
        console.log('delete one message')
      }else{
        console.log('add 1 mess:',messages[i])
        newMessages.push(messages[i])
      }
    }
    console.log('newMess:',newMessages)
    return newMessages
  }


})