var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parkDetail:{},
    distance:{},
    modalName:'',
    hasOrderHere:false,
    otherOrder:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.emit('acceptDataFromOpenedPage',{});
    eventChannel.on('acceptDataFromOpenedPage',(data)=>{
      this.setData({
        parkId:data.data.parkId,
        distance:data.data.distance,
        parkDetail:data.data.parkDetail,
        otherOrder:data.data.orderDetail
      })
      wx.request({
        url: app.globalData.serverName + '/getOrderHereToday',
        data:{
          openId:wx.getStorageSync('openid'),
          parkId:data.data.parkId
        },
        method: 'GET',
        header:{
          'content-type': 'application/x-www-form-urlencoded'
        },
        success:(res) => {
          if(res.data.code == 0){
            //有订单
            this.setData({
              hasOrderHere:true
            })
            //console.log(res.data.data);
          }
          else{
            //无订单
            this.setData({
              hasOrderHere:false
            })
            //console.log(res.data.message);
          }
        }
      })
    })
    /*wx.request({
      url: app.globalData.serverName + '/getParkById',
      data:{
        parkId:parkId
      },
      method: 'GET',
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:(res) => {
        if(res.data.code == 0){
          this.setData({
            parkDetail:res.data.data
          })
          //console.log(res.data.data);
        }
        else{
          console.log(res.data.message);
        }
      }
    })*/
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    /*if(this.data.parkDetail.parkId != null){
      wx.request({
        url: app.globalData.serverName + '/getParkById',
        data:{
          parkId:this.data.parkDetail.parkId
        },
        method: 'GET',
        header:{
          'content-type': 'application/x-www-form-urlencoded'
        },
        success:(res) => {
          if(res.data.code == 0){
            this.setData({
              parkDetail:res.data.data
            })
            //console.log(res.data.data);
          }
          else{
            console.log(res.data.message);
          }
        }
      })
      wx.request({
        url: app.globalData.serverName + '/getOrderHereToday',
        data:{
          openId:wx.getStorageSync('openid'),
          parkId:this.data.parkDetail.parkId
        },
        method: 'GET',
        header:{
          'content-type': 'application/x-www-form-urlencoded'
        },
        success:(res) => {
          if(res.data.code == 0){
            //有订单
            this.setData({
              hasOrderHere:true
            })
            //console.log(res.data.data);
          }
          else{
            //无订单
            this.setData({
              hasOrderHere:false
            })
            //console.log(res.data.message);
          }
        }
      })
    }*/
  },

  toPark(){
    /*var fromLatitude = wx.getStorageSync('latitude');
    var fromLongitude = wx.getStorageSync('longitude');*/
    var toLatitude = this.data.parkDetail.latitude;
    var toLongitude = this.data.parkDetail.longitude;
    var parkname = this.data.parkDetail.parkName;
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

  toReserve(){
    var hasCarId = wx.getStorageSync('hasCarId');
    if(hasCarId == false){
      this.setData({
        modalName:'DialogModal'
      })
    }
    else{
      var parkId = this.data.parkDetail.parkId;
      var price = this.data.parkDetail.price;
      var mapId = this.data.parkDetail.mapId;
      var distance = this.data.distance;
      var parkDetail = this.data.parkDetail;
      var openId = wx.getStorageSync('openid');
      wx.navigateTo({
        url: '../../bigPackage/pages/map/map',
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
              openId:openId,
              distance:distance,
              parkDetail:parkDetail,
            }
        })}
      })
    }
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

  hideModal() {
    this.setData({
      modalName: null
    })
  },

  toBind(){
    wx.navigateTo({
      url: '../bindcar/bindcar',
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.hideModal();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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