var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parkList:[],
    orderList1:[],
    orderList2:[],
    orderList2:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: app.globalData.serverName + '/parkList',
      data:{},
      method: 'POST',
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:(res)=>{
        this.setData({
          parkList:res.data.data
        })
      },
      fail:(res)=>{
        console.log(res);
      }
    })
    wx.request({
      url: app.globalData.serverName + '/getOrdersToday',
      data:{
        parkId:2
      },
      method: 'POST',
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:(res)=>{
        this.setData({
          orderList2:res.data.data
        })
      },
      fail:(res)=>{
        console.log(res);
      }
    })
  },

  toDetail(e){
    //console.log('detail');
    var parkId = e.currentTarget.dataset.id;
    var all = this.data.parkList;
    var parkInfo = {};
    for(var i=0;i<all.length;i++){
      if(all[i].parkId==parkId){
        parkInfo = all[i];
      }
    }
    wx.navigateTo({
      url: '../managedetail/managedetail',
      events:{
        acceptDataFromOpenedPage:()=>{
          //console.log(parkId)
        }
      },
      success:(res)=>{
        res.eventChannel.emit('acceptDataFromOpenedPage',{
          data:{
            parkInfo:parkInfo,
          }
      })}
    })
  },

  toSpace(e){
    var parkId = e.currentTarget.dataset.id;
    var all = this.data.parkList;
    var parkInfo = {};
    for(var i=0;i<all.length;i++){
      if(all[i].parkId==parkId){
        parkInfo = all[i];
      }
    }
    wx.navigateTo({
      url: '../../bigPackage/pages/managespace/managespace',
      events:{
        acceptDataFromOpenedPage:()=>{
          //console.log(parkId)
        }
      },
      success:(res)=>{
        res.eventChannel.emit('acceptDataFromOpenedPage',{
          data:{
            parkId:parkInfo.parkId,
            mapId:parkInfo.mapId,
            openId:wx.getStorageSync('openid'),
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