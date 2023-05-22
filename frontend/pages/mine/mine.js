var app = getApp();
Page({
  data: {
    hasUserInfo:false,
    userInfo:{},
    hasCarId:false,
    carId:'',
    modalName:''
  },

  onLoad: function (options) {
    
  },

  onShow: function () {
    let hasCarId = wx.getStorageSync('hasCarId')
    let userInfo = wx.getStorageSync('userInfo');
    let carId = wx.getStorageSync('carId');
    let hasUserInfo = wx.getStorageSync('hasUserInfo');
    this.setData({
      hasUserInfo:hasUserInfo,
      userInfo:userInfo,
      hasCarId:hasCarId,
      carId:carId
    })
  },

  showUnbind(){
    this.setData({
      modalName:'unbind'
    })
  },

  hideModal(){
    this.setData({
      modalName:''
    })
  },

  unbindCar(){
    var openid = wx.getStorageSync('openid');
    if(openid == ''){
      this.setData({
        modalName:'pleaseLogin'
      })
    }
    else{
      wx.setStorageSync('hasCarId', false);
      wx.setStorageSync('carId', '');
      this.setData({
        carId:'',
        hasCarId:false
      })
      wx.request({
        url: app.globalData.serverName + '/unbindCar',
        data:{
          openId:wx.getStorageSync('openid')
        },
        method: 'POST',
        header:{
          'content-type': 'application/x-www-form-urlencoded'
        },
        success:(res)=>{
          if(res.data.code == 0){
            this.setData({
              modalName:'unbindSuccess'
            })
          }
        }
      });
    }
  },

  toBind(){
    var openid = wx.getStorageSync('openid');
    if(openid == ''){
      this.setData({
        modalName:'pleaseLogin'
      })
    }
    else{
      wx.navigateTo({
       url: '../bindcar/bindcar',
      })
    }
  },

  toOrder(){
    var openid = wx.getStorageSync('openid');
    if(openid == ''){
      this.setData({
        modalName:'pleaseLogin'
      })
    }
    else{
     wx.navigateTo({
        url: '../myorder/myorder',
      })
    }
  },

  toUpload(){
    var openid = wx.getStorageSync('openid');
    if(openid == ''){
      this.setData({
        modalName:'pleaseLogin'
      })
    }
    else{
      wx.navigateTo({
        url: '../upload/upload',
      })
    }
  },

  toManage(){
    var openid = wx.getStorageSync('openid');
    if(openid == ''){
      this.setData({
        modalName:'pleaseLogin'
      })
    }
    else{
     wx.navigateTo({
        url: '../manage/manage',
      })
    }
  },

  login(){
    wx.login({
      success: res => {
        if(res.code){
          wx.request({
            url: app.globalData.serverName + '/login',
            data:{
              code:res.code
            },
            method: 'POST',
            header:{
              'content-type': 'application/x-www-form-urlencoded'
            },
            success:(res)=>{
              wx.request({
                url: app.globalData.serverName + '/getCarId',
                data:{
                  openId:res.data.openid
                },
                method: 'POST',
                header:{
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success:(res)=>{
                  if(res.data.code == 1){
                    wx.setStorageSync('hasCarId', false);
                  }
                  else if(res.data.code == 0){
                    this.setData({
                      hasCarId:true,
                      carId:res.data.data
                    })
                    wx.setStorageSync('hasCarId', true);
                    wx.setStorageSync('carId', res.data.data);
                  }
                },
                fail:(res)=>{
                  console.log(res);
                },
              })
              wx.setStorageSync('openid', res.data.openid);
            }
          })
        } else{
          console.log(res.errMsg);
        }
      }
    })
    wx.getUserProfile({
      desc: '完善资料',
      success: (res) =>{
        wx.setStorageSync('userInfo', res.userInfo);
        wx.setStorageSync('hasUserInfo', true);
        this.setData({
          userInfo:res.userInfo,
          hasUserInfo:true
        })
      }
    })
  },
})