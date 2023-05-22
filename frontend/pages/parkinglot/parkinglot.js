var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showparkinglots:[],
    allparkinglots:[],
    keywords:'',
    orderDetail:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var parkinglots = [];
    qqmapsdk = new QQMapWX({
      key:'PSYBZ-MGBKG-BU2QH-I7YB4-OOBEV-KUF36'
    });
    wx.request({
      url: app.globalData.serverName + '/availableList',
      data:{
      },
      method: 'GET',
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:(res) => {
        if(res.data.code == 0){
          parkinglots = res.data.data;
          var string = "";
          for(var key=0;key<parkinglots.length;key++){
            string += parkinglots[key].latitude + "," + parkinglots[key].longitude + ";";
          }
          string = string.substring(0,string.lastIndexOf(";"));//对字符串进行截取
          qqmapsdk.calculateDistance({
            mode: 'driving',
            from:{
              latitude:26.074064,
              longitude:119.29721
            },
            to:string,
            success:(res)=>{
              for(var i=0;i<res.result.elements.length;i++){
                parkinglots[i].distance = res.result.elements[i].distance;
              }
              parkinglots.sort(function(a,b){return a.distance-b.distance});
              _this.setData({
                showparkinglots:parkinglots,
                allparkinglots:parkinglots
              })
            },
            fail:(error)=>{
              console.log(error);
              console.log(string);
            }
          })
        }
      }
    })
    wx.request({
      url: app.globalData.serverName + '/getOrderToday',
      data:{
        openId:wx.getStorageSync('openid'),
      },
      method: 'GET',
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:(res) => {
        if(res.data.code == 0){
          //有订单
          this.setData({
            orderDetail:res.data.data
          })
          //console.log(res.data.data);
        }
        else{
          //无订单
          //console.log(res.data.message);
        }
      }
    })
    
  },

  toDetail(parkId){
    var orderDetail = this.data.orderDetail;
    var id = parkId.currentTarget.dataset.parkid;
    var distance = {};
    var parkDetail = {};
    var parkinglots=this.data.allparkinglots;
    for(var key = 0;key<parkinglots.length;key++){
      if(parkinglots[key].parkId == id){
        parkDetail = parkinglots[key];
        distance = parkDetail.distance;
      }
    }
    //console.log(parkDetail);
    wx.navigateTo({
      url: '../parkingdetail/parkingdetail',
      events:{
        acceptDataFromOpenedPage:(parkId)=>{
          //console.log(parkId)
        }
      },
      success:(res)=>{
        res.eventChannel.emit('acceptDataFromOpenedPage',{
          data:{
            distance:distance,
            parkId:id,
            parkDetail:parkDetail,
            orderDetail:orderDetail
          }
        })}
    })
  },

  search(e){
    //console.log(e.detail.value);
    var keyword = e.detail.value;
    var all = this.data.allparkinglots;
    var _this = this;
    var show = [];
    for(var key = 0;key < all.length;key++){
      if(all[key].parkName.indexOf(keyword) != -1 || all[key].address.indexOf(keyword) != -1){
        show.push(all[key]);
        //console.log(all[key]);
      }
    }
    _this.setData({
      showparkinglots:show
    })
    //console.log(e.detail.value);
  },

  reset(){
    var all = this.data.allparkinglots;
    this.setData({
      keywords:'',
      showparkinglots:all
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.request({
      url: app.globalData.serverName + '/getOrderToday',
      data:{
        openId:wx.getStorageSync('openid'),
      },
      method: 'GET',
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:(res) => {
        if(res.data.code == 0){
          //有订单
          this.setData({
            orderDetail:res.data.data
          })
          //console.log(res.data.data);
        }
        else{
          //无订单
          this.setData({
            orderDetail:res.data.data
          })
          //console.log(res.data.message);
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
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