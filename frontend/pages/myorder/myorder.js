var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[],
    toBeUsedOrders:[],
    usingOrders:[],
    finishedOrders:[],
    canceledOrders:[],
    showOrders:[],
    TabCur: 0,
    scrollLeft:0,
    tabNames:[{name:'全部'},{name:'待使用'},{name:'使用中'},{name:'已完成'},{name:'已取消'}],
  },

  orderId:{},
  tempOrders:[],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var openId = wx.getStorageSync('openid');
    var orders = [];
    var toBeUsedOrders = [];
    var usingOrders = [];
    var finishedOrders = [];
    var canceledOrders = [];
    wx.request({
      url: app.globalData.serverName + '/getOrdersByUser',
      data:{
        openId:openId
      },
      method: 'GET',
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:(res) => {
        if(res.data.code == 0){
          //有订单
          orders = res.data.data;
          //console.log(orders);
          for(let i=0;i<orders.length;i++){
            switch (orders[i].status){
              case 0:
                toBeUsedOrders.push(orders[i]);
                break;
              case 1:
                usingOrders.push(orders[i]);
                break;
              case 2:
                finishedOrders.push(orders[i]);
                break;
              case 3:
                canceledOrders.push(orders[i]);
                break;
            }
          }
          this.setData({
            orders:orders,
            toBeUsedOrders:toBeUsedOrders,
            usingOrders:usingOrders,
            finishedOrders:finishedOrders,
            canceledOrders:canceledOrders,
            showOrders:orders
          })
        }
      }
    })
    //console.log(this.data.tabNames)
  },

   /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    /*this.onLoad();
    console.log(this.tempOrders);
    console.log(!this.tempOrders.length == 0);
    if(!this.tempOrders.length == 0){
      this.setData({
        showOrders:this.tempOrders
      })
    }*/
    var openId = wx.getStorageSync('openid');
    var orders = [];
    var toBeUsedOrders = [];
    var usingOrders = [];
    var finishedOrders = [];
    var canceledOrders = [];
    var showOrders = [];
    wx.request({
      url: app.globalData.serverName + '/getOrdersByUser',
      data:{
        openId:openId
      },
      method: 'GET',
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:(res) => {
        if(res.data.code == 0){
          //有订单
          orders = res.data.data;
          //console.log(orders);
          for(let i=0;i<orders.length;i++){
            switch (orders[i].status){
              case 0:
                toBeUsedOrders.push(orders[i]);
                break;
              case 1:
                usingOrders.push(orders[i]);
                break;
              case 2:
                finishedOrders.push(orders[i]);
                break;
              case 3:
                canceledOrders.push(orders[i]);
                break;
            }
          }
          //console.log(this.tempOrders.length == 0);
          //console.log(this.tempOrders);
          //console.log(this.tempOrders.length == 0);
          if(this.tempOrders.length == 0){
            showOrders = orders;
            /*this.setData({
              orders:orders,
              toBeUsedOrders:toBeUsedOrders,
              usingOrders:usingOrders,
              finishedOrders:finishedOrders,
              canceledOrders:canceledOrders,
              showOrders:orders
            })*/
          }
          else{
            showOrders = this.tempOrders
            /*this.setData({
              orders:orders,
              toBeUsedOrders:toBeUsedOrders,
              usingOrders:usingOrders,
              finishedOrders:finishedOrders,
              canceledOrders:canceledOrders,
              showOrders:this.tempOrders
            })*/
          }
        }
        //console.log(showOrders);
        this.setData({
          orders:orders,
          toBeUsedOrders:toBeUsedOrders,
          usingOrders:usingOrders,
          finishedOrders:finishedOrders,
          canceledOrders:canceledOrders,
          showOrders:showOrders,
        })
      }
    })
  },

  tabSelect(e) {
    //console.log(e.target.dataset.id);
    var switchOrders = [];
    switch (e.target.dataset.id){
      case 0:
        switchOrders = this.data.orders
        break;
      case 1:
        switchOrders = this.data.toBeUsedOrders
        break;
      case 2:
        switchOrders = this.data.usingOrders
        break;
      case 3:
        switchOrders = this.data.finishedOrders
        break;
      case 4:
        switchOrders = this.data.canceledOrders
        break;
    }
    //console.log(switchOrders);
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60,
      showOrders:switchOrders
    })
  },

  toPark(e){
    wx.request({
      url: app.globalData.serverName + '/getParkById',
      data:{
        parkId:e.currentTarget.dataset.parkid
      },
      method: 'GET',
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:(res) => {
        if(res.data.code == 0){
          var parkDetail = res.data.data;
          var toLatitude = parkDetail.latitude;
          var toLongitude = parkDetail.longitude;
          var parkname = parkDetail.parkName;
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
          //console.log(res.data.data);
        }
        else{
          console.log(res.data.message);
        }
      }
    })
    //console.log(e.currentTarget.dataset.parkid);
  },

  toMap(e){
    wx.request({
      url: app.globalData.serverName + '/getParkById',
      data:{
        parkId:e.currentTarget.dataset.parkid
      },
      method: 'GET',
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:(res) => {
        if(res.data.code == 0){
          var parkDetail = res.data.data;
          var parkId = parkDetail.parkId;
          var price = parkDetail.price;
          var mapId = parkDetail.mapId;
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
        }
      }
    })
  },

  toDetail(e){
    this.tempOrders = this.data.showOrders;
    var orderId = e.currentTarget.dataset.id;
    //console.log(e.currentTarget.dataset.id);
    wx.navigateTo({
      url: '../orderdetail/orderdetail',
      events:{
        acceptDataFromOpenedPage:()=>{
          //console.log(parkId)
        }
      },
      success:(res)=>{
        res.eventChannel.emit('acceptDataFromOpenedPage',{
          data:{
            orderId:orderId,
          }
      })}
    })
  },

  hideModal() {
    this.setData({
      modalName: null
    })
  },

  showCancel(e){
    this.orderId = e.currentTarget.dataset.id;
    this.setData({
      modalName: 'showCancel'
    })
  },

  cancelOrder(){
    wx.request({
      url: app.globalData.serverName + '/cancelOrder',
      data:{
        orderId:this.orderId
      },
      method: 'GET',
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:(res)=>{
        if(res.data.code == 0){
          //console.log(res.data);
          this.setData({
            modalName: 'success'
          })
          this.onLoad();
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