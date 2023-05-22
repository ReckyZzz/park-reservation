// pages/demo1/demo1.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      msg:"hello world",
      isChecked:false,
      gender:"",
      userInfo: {},
      testFor:{
        name1:"123",
        name2:"456"
      },
      /*list:[
        {
          id:0,
          name:"苹果"
        },
        {
          id:1,
          name:"菠萝"
        },
        {
          id:2,
          name:"桃子"
        }
      ],*/
      person:[
        {
          id:1,
          name:"zhang",
          car:"云A75544"
        },
        {
          id:2,
          name:"Li",
          car:"闽A12345"
        }
      ],
      number:0,
      list:[],
      markers:[]
  },

  // 定义全局map变量
  fmap: null,

  navigate(){
    let plugin = requirePlugin('routePlan');
    let key = 'PSYBZ-MGBKG-BU2QH-I7YB4-OOBEV-KUF36';  //使用在腾讯位置服务申请的key
    let referer = '停车预约系统';   //调用插件的app的名称
    let endPoint = JSON.stringify({  //终点
      'name': '北京西站',
      'latitude': 39.894806,
      'longitude': 116.321592
    });
    wx.navigateTo({
      url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&navigation=1' + '&endPoint=' + endPoint
    });
  },

  getPhoneNumber(e){
    console.log(e);
  },

  pay(){
    wx.requestPayment({
      nonceStr: '',
      signType:'MD5',
      package: '',
      paySign: '',
      timeStamp: '',
    })
  },

  getUserProfile(e){
    wx.getUserProfile({
      desc: '完善资料',
      success: (res) =>{
        this.setData({
          userInfo:res.userInfo
        })
      }
    })
    console.log(this.data.userInfo);
  },

  handleInput(e){
    this.setData({
      number:e.detail.value
    })
  },
  handleTap(e){
    const parameter = e.target.dataset.parameter
    this.setData({
      number:Number(this.data.number) + parameter
    })
  },
  handleRadio(e){
    let gender = e.detail.value;
    if(gender == "male"){
      gender = "男";
    }
    if(gender == "female"){
      gender = "女";
    }
    this.setData({
      gender:gender
    })
  },
  handleCheck(e){
    let testGender = e.detail.value;
    this.setData({
      testGender:testGender
    })
  },
  nearby_search:function(){
    var _this = this;
    // 调用接口
    qqmapsdk.search({
       keyword: 'kfc',  //搜索关键词
       location: '39.980014,116.313972',  //设置周边搜索中心点
       success: function (res) { //搜索成功后的回调
         var mks = []
         for (var i = 0; i < res.data.length; i++) {
           mks.push({ // 获取返回结果，放到mks数组中
             title: res.data[i].title,
             id: res.data[i].id,
             latitude: res.data[i].location.lat,
             longitude: res.data[i].location.lng,
             iconPath: "/icon/home.png", //图标路径
             width: 20,
             height: 20
           })
         }
         _this.setData({ //设置markers属性，将搜索结果显示在地图中
           markers: mks
         })
       },
       fail: function (res) {
         console.log(res);
       },
       complete: function (res){
         console.log(res);
       }
   });
 },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 实例化API核心类
    /*qqmapsdk = new QQMapWX({
      key: 'PSYBZ-MGBKG-BU2QH-I7YB4-OOBEV-KUF36' // 必填
    });
    qqmapsdk.search({
      keyword: '福州大学',
      success: (res) => {
        console.log(res);
        this.data.list=res.data;
        console.log(this.data.list);
      },
      fail: function (res) {
          console.log(res);
      },
      complete: function (res) {
          //console.log(res);
      }
    });*/
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 获取canvas
    /*wx.createSelectorQuery().select('#fengMap').node().exec((res) => {
      const canvas = res[0].node;
      this.canvas = canvas

      wx.createSelectorQuery().select("#temp").node().exec((tempRes) => {
        const tmpCanvas = tempRes[0].node;

        const fmapID = "10347";

        const mapOptions = {
          //必要，地图容器
          canvas: canvas,
          // 必要，2d画布
          tempCanvas: tmpCanvas,
          // 地图默认旋转角度
          defaultControlsPose: 90,
          // 地图默认倾斜角
          defaultTiltAngle: 60,
          //必要，地图应用名称，通过蜂鸟云后台创建
          appName: '蜂鸟研发SDK_2_0',
          //必要，地图应用密钥，通过蜂鸟云后台获取
          key: '57c7f309aca507497d028a9c00207cf8',
        };

        //初始化地图对象
        this.fmap = new fengmap.FMMap(mapOptions);

        //打开Fengmap服务器的地图数据和主题
        this.fmap.openMapById(fmapID, function (error) {
          //打印错误信息
          // console.log(error);
        });

        //地图加载完成事件
        this.fmap.on('loadComplete', () => {
          console.log('地图加载完成');
        })
      })
    })*/
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 调用接口
    /*qqmapsdk.search({
      keyword: '福州大学',
      success: (res) => {
        console.log(res);
        this.data.list=res.data;
        console.log(this.data.list);
      },
      fail: function (res) {
          console.log(res);
      },
      complete: function (res) {
          //console.log(res);
      }
    });*/
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