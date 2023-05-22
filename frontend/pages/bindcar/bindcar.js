var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    hasUserInfo: false,
    carId:'',
    openId:{},
    modalName:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo');
    var hasUserInfo = wx.getStorageSync('hasUserInfo');
    var openId = wx.getStorageSync('openid');
    this.setData({
      userInfo:userInfo,
      hasUserInfo:hasUserInfo,
      openId:openId
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
              wx.setStorageSync('openid', res.data.openid);
            },
            fail:(res)=>{
              console.log(res);
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

  formSubmit(e){
    if(this.isVehicleNumber(e.detail.value.carId)){
      wx.request({
        url: app.globalData.serverName + '/bindCar',
        data:{
          openId:this.data.openId,
          carId:e.detail.value.carId
        },
        method: 'POST',
        header:{
          'content-type': 'application/x-www-form-urlencoded'
        },
        success:(res)=>{
          wx.setStorageSync('hasCarId', true);
          wx.setStorageSync('carId', e.detail.value.carId);
          wx.navigateBack({
            delta: 1,
          })
        },
        fail:(res)=>{
          console.log(res);
        }
      })
    }
    else{
      this.setData({
        modalName:'Modal'
      })
    }
  },

  //车牌号验证方法
  isVehicleNumber(vehicleNumber){
    var xreg=/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;
    var creg=/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
    if(vehicleNumber.length == 7){
      return creg.test(vehicleNumber);
    } else if(vehicleNumber.length == 8){
      return xreg.test(vehicleNumber);
    } else{
      return false;
    }
  },

  hideModal(){
    this.setData({
      modalName:''
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})