const chooseLocation = requirePlugin('chooseLocation');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    location:null,
    parkInfo:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.emit('acceptDataFromOpenedPage',null);
    eventChannel.on('acceptDataFromOpenedPage',(data)=>{
      this.setData({
        parkInfo:data.data.parkInfo
      })
    });
  },

   /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const location = chooseLocation.getLocation();
    if(location != null){
      this.setData({
        location:location
      })
      //console.log(location);
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 页面卸载时设置插件选点数据为null，防止再次进入页面，geLocation返回的是上次选点结果
    chooseLocation.setLocation(null);
  },

  formSubmit(e){
    var parkId = this.data.parkInfo.parkId;
    var parkName = e.detail.value.parkName;
    var parkCapacity = e.detail.value.parkCapacity;
    var maxCapacity = e.detail.value.maxCapacity;
    var price = e.detail.value.price;
    var mapId = e.detail.value.mapId;
    var latitude = {};
    var longitude = {};
    var address = {};
    if(this.data.location == null){//未选择地址
      latitude = this.data.parkInfo.latitude;
      longitude = this.data.parkInfo.longitude;
      address = this.data.parkInfo.address;
    }
    else{//选择了地址
      latitude = this.data.location.latitude;
      longitude = this.data.location.longitude;
      address = this.data.location.address;
    }
    if(parkName == "" || parkCapacity == "" || price == "" || maxCapacity == "" || price == "" || mapId == ""){
      console.log("有信息为空")
      this.setData({
        modalName:'info'
      })
    }
    else{
      console.log("信息正确 请求服务器");
      wx.request({
        url: app.globalData.serverName + '/updatePark',
        data:{
          parkId:parkId,
          parkName:parkName,
          longitude:longitude,
          latitude:latitude,
          address:address,
          parkCapacity:parkCapacity,
          maxCapacity:maxCapacity,
          price:price,
          mapId:mapId
        },
        method: 'GET',
        header:{
          'content-type': 'application/x-www-form-urlencoded'
        },
        success:(res)=>{
          if(res.data.code == 0){
            this.setData({
              modalName:'success'
            })
          }
        }
      })
    }
  },

  toChoose(){
    const key = 'PSYBZ-MGBKG-BU2QH-I7YB4-OOBEV-KUF36'; //使用在腾讯位置服务申请的key
    const referer = '停车预约系统';   //调用插件的app的名称
    var location = {};
    if(this.data.location == null){
      location = JSON.stringify({
        latitude: 26.07421,
        longitude: 119.29647
      });
    }
    else{
      location = JSON.stringify({
        latitude: this.data.location.latitude,
        longitude: this.data.location.longitude
      });
    }
    //console.log(location);
    wx.navigateTo({
      url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer + '&location=' + location
    });
  },

  hideModal(){
    this.setData({
      modalName:''
    })
  },

  goBack(){
    wx.navigateBack({
      delta: 1,
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