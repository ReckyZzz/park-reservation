const chooseLocation = requirePlugin('chooseLocation');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    location:null,
    modalName:'',
    imgList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  formSubmit(e){
    var name = e.detail.value.name;
    var capacity = e.detail.value.capacity;
    var price = e.detail.value.price;
    var img = "";
    if(this.data.imgList[0] == undefined){
      this.setData({
        modalName:'upload'
      })
    }
    else{
      img = this.data.imgList[0];
      //console.log(img);
    }
    if(this.data.location == null){
      this.setData({
        modalName:'choose'
      })
    }
    else if(name == "" || capacity == "" || price == ""){
      this.setData({
        modalName:'info'
      })
    }
    else{
      wx.uploadFile({
        filePath: img,
        name: 'file',
        url: app.globalData.serverName + '/upload',
        formData:{
          'user': wx.getStorageSync('userInfo').nickName
        },
        success:(res)=>{
          console.log('图片上传成功');
          wx.request({
            url: app.globalData.serverName + '/newPark',
            data:{
              parkName:name,
              longitude:this.data.location.longitude,
              latitude:this.data.location.latitude,
              address:this.data.location.address,
              maxCapacity:capacity,
              price:price
            },
            method: 'POST',
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
      })

    }
  },

  hideModal(){
    this.setData({
      modalName:''
    })
  },

  goBack(){
    this.setData({
      modalName:''
    })
    wx.navigateBack({
      delta: 1,
    })
  },

  ChooseImage() {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },

  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  
  DelImg(e) {
    wx.showModal({
      title: '提示',
      content: '确定要删除这张设计图吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
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