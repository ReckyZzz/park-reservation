var app = getApp();
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    latitude: null,
    longitude: null,
  },
  onShow(){
    let userInfo = wx.getStorageSync('userInfo');
    let hasUserInfo = wx.getStorageSync('hasUserInfo');
    this.setData({
      hasUserInfo:hasUserInfo,
      userInfo:userInfo,
    })
    wx.request({
      url: app.globalData.serverName + '/getCarId',
      data:{
        openId:wx.getStorageSync('openid')
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
          wx.setStorageSync('hasCarId', true);
          wx.setStorageSync('carId', res.data.data);
        }
      },
      fail:(res)=>{
        console.log(res);
      }
    })
  },
  onLoad() {
    wx.request({
      url: app.globalData.serverName + '/resetOrders',
      data:{},
      method: 'POST',
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:(res)=>{
        if(res.data.code == 0){
          //console.log(res.data.message);
        }
      },
      fail:(res)=>{
        console.log(res);
      }
    })
  },
  login(){
    wx.login({
      success: res => {
        //console.log(res);
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
                    wx.setStorageSync('hasCarId', true);
                    wx.setStorageSync('carId', res.data.data);
                  }
                },
                fail:(res)=>{
                  console.log(res);
                },
              })
              wx.setStorageSync('openid', res.data.openid);
            },
            fail:(res)=>{
              console.log(res);
            }
          });
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
  getLocation(){
    /*let openid = wx.getStorageSync('openid')
    wx.getLocation({
      type: 'wgs84',
      altitude:true,
      success:(res) => {
        this.setData({
          latitude:res.latitude,
          longitude:res.longitude
        })
        wx.setStorageSync('latitude', res.latitude);
        wx.setStorageSync('longitude', res.longitude);
      }
    })
    wx.request({
      url: app.globalData.serverName + '/setLocation',
      data:{
        openId:openid,
        latitude:wx.getStorageSync('latitude'),
        longitude:wx.getStorageSync('longitude')
      },
      method: 'POST',
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:(res) => {
        /*console.log(res)
        if(res.data.code == 0){
          console.log(res.data.message);
        }
        else{
          console.log(res.data.message);
        }*/
      /*}
    })*/
    wx.setStorageSync('latitude', 26.074064);
    wx.setStorageSync('longitude', 119.29721);
    wx.navigateTo({
      url: '../parkinglot/parkinglot',
      /*success:(res)=>{
        console.log(res);
      }*/
    })
  }
})
