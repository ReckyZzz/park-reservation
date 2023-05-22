import QRCode from '../../utils/weapp-qrcode.js'
const W = wx.getSystemInfoSync().windowWidth;
const rate = 750.0 / W;

// 300rpx 在6s上为 150px
const code_w = 250 / rate;

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderDetail:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.emit('acceptDataFromOpenedPage',null);
    eventChannel.on('acceptDataFromOpenedPage',(data)=>{
      wx.request({
        url: app.globalData.serverName + '/getOrderById',
        data:{
          orderId:data.data.orderId
        },
        method: 'GET',
        header:{
          'content-type': 'application/x-www-form-urlencoded'
        },
        success:(res)=>{
          if(res.data.code == 0){
            this.setData({
              orderDetail:res.data.data
            })
            if(res.data.data.status === 0){
              new QRCode('canvas',{
                text: app.globalData.serverName + '/getIn?orderId=' + this.data.orderDetail.orderId,
                width: code_w,
                height: code_w,
                colorDark: "#1CA4FC",
                colorLight: "white",
                correctLevel: QRCode.CorrectLevel.H,
              })
            }
            else if(res.data.data.status === 1){
              new QRCode('canvas',{
                text: app.globalData.serverName + '/getOut?orderId=' + this.data.orderDetail.orderId,
                width: code_w,
                height: code_w,
                colorDark: "#1CA4FC",
                colorLight: "white",
                correctLevel: QRCode.CorrectLevel.H,
              })
            }
          }
        }
      })
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