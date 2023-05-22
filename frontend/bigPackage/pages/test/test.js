import { fengmap } from '../../utils/fengmap.miniprogram.min.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  // 定义全局map变量
  fmap: null,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 获取canvas
    wx.createSelectorQuery().select('#fengMap').node().exec((res) => {
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
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (this.fmap) {
      this.fmap.dispose();
      this.fmap = null;
    }
  },
  // 手指触摸动作开始
  touchStart(e) {
    this.canvas.dispatchTouchEvent({
      ...e,
      type: 'touchstart'
    })
  },
  // 手指触摸后移动
  touchMove(e) {
    this.canvas.dispatchTouchEvent({
      ...e,
      type: 'touchmove'
    })
  },
  // 手指触摸动作结束
  touchEnd(e) {
    this.canvas.dispatchTouchEvent({
      ...e,
      type: 'touchend'
    })
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