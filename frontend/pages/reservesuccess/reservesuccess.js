// pages/reservesuccess/reservesuccess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parkDetail:{},
    spaceName:'',
    carId:'',
    distance:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var carId = wx.getStorageSync('carId');
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.emit('acceptDataFromOpenedPage',null);
    eventChannel.on('acceptDataFromOpenedPage',(data)=>{
      this.setData({
        parkDetail:data.data.parkDetail,
        carId:carId,
        distance:data.data.distance,
        spaceName:data.data.spaceName,
      })
    })
  },

  toIndex(){
    wx.switchTab({
      url: '../index/index',
    })
  },

  toPark(){
    /*var fromLatitude = wx.getStorageSync('latitude');
    var fromLongitude = wx.getStorageSync('longitude');*/
    var toLatitude = this.data.parkDetail.latitude;
    var toLongitude = this.data.parkDetail.longitude;
    var parkname = this.data.parkDetail.parkName;
    //var _this = this;
    let plugin = requirePlugin('routePlan');
    let key = 'PSYBZ-MGBKG-BU2QH-I7YB4-OOBEV-KUF36';  //使用在腾讯位置服务申请的key
    let referer = '停车预约系统';   //调用插件的app的名称
    let startPoint = JSON.stringify({
      'name': '当前位置',
      'latitude': 26.074064,
      'longitude': 119.29721
    })
    let endPoint = JSON.stringify({
      'name': parkname,
      'latitude': toLatitude,
      'longitude': toLongitude
    })
    wx.navigateTo({
      url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&navigation=1' + '&startPoint=' + startPoint + '&endPoint=' + endPoint
    });
  },

  toMap(){
    var parkId = this.data.parkDetail.parkId;
    var price = this.data.parkDetail.price;
    var mapId = this.data.parkDetail.mapId;
    var openId = wx.getStorageSync('openid');
    wx.navigateTo({
      url: '../../bigPackage/pages/reservemap/reservemap',
      events:{
        acceptDataFromOpenedPage:()=>{
          //console.log(parkId)
        }
      },
      success:(res)=>{
        res.eventChannel.emit('acceptDataFromOpenedPage',{
          data:{
            parkId:parkId,
            price:price,
            mapId:mapId,
            openId:openId
          }
      })}
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