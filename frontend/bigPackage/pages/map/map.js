import { fengmap } from '../../utils/fengmap.miniprogram.min.js';
var app = getApp();
Page({
  data: {
    //停车场ID
    parkId:'',
    //价格
    price:0.0,
    //地图Id
    mapId:'',
    //已被预约的车位FID
    reservedList:[],
    //用户ID
    openId:null,
    //用户车牌
    carId:null,
    //距离
    distance:null,
    //停车位信息
    parkDetail:{},
  },
  // 定义全局map变量
  fmap: null,
  // 判断当前是否点击的是poi,控制点击公共设施的时候只弹出公共设施的信息框
  clickedPOI: false,
  // 点击事件ID
  eventID: null,
  // 定义选中模型
  selectedModel: null,
  //搜索分析类
  searchAnalyser: null,
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    var carId = wx.getStorageSync('carId');
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.emit('acceptDataFromOpenedPage',null);
    eventChannel.on('acceptDataFromOpenedPage',(data)=>{
      this.setData({
        parkId:data.data.parkId,
        price:data.data.price,
        mapId:data.data.mapId,
        openId:data.data.openId,
        carId:carId,
        distance:data.data.distance,
        parkDetail:data.data.parkDetail
      })
      wx.request({
        url: app.globalData.serverName + '/getOrdersToday',
        data:{
          parkId:data.data.parkId
        },
        method: 'GET',
        header:{
          'content-type': 'application/x-www-form-urlencoded'
        },
        success:(res) => {
          if(res.data.code == 0){
            this.setData({
              reservedList:res.data.data
            })
          }
          else{
            this.setData({
              reservedList:[]
            })
          }
        }
      })
    })
    // 获取canvas
    wx.createSelectorQuery().select('#fengMap').node().exec((res) => {
      const canvas = res[0].node;
      this.canvas = canvas
      //console.log("得到画布成功");
      
      wx.createSelectorQuery().select("#temp").node().exec((tempRes) => {
        const tmpCanvas = tempRes[0].node;

        const fmapID = this.data.mapId;

        const mapOptions = {
          //必要，地图容器
          canvas: canvas,
          // 必要，2d画布
          tempCanvas: tmpCanvas,
          // 地图默认旋转角度
          defaultControlsPose: 90,
          // 地图默认倾斜角
          defaultTiltAngle: 60,
          //地图初始显示比例尺级别
          defaultMapScaleLevel:21,
          //必要，地图应用名称，通过蜂鸟云后台创建
          appName: '停车预约系统',
          //必要，地图应用密钥，通过蜂鸟云后台获取
          key: 'a11fc5a264ed23106380a94b1cdd45fe',
          //设置主题名称
          defaultThemeName:'1389909501901873153',
          //显示为二维
          //defaultViewMode:fengmap.FMViewMode.MODE_2D,
        };

        //初始化地图对象
        this.fmap = new fengmap.FMMap(mapOptions);
        //console.log("初始化地图成功");
        //打开Fengmap服务器的地图数据和主题
        this.fmap.openMapById(fmapID, function (error) {
          //打印错误信息
          console.log(error);
        });
        //地图加载完成事件
        this.fmap.on('loadComplete', () => {
          console.log('地图加载完成');
          //为已被预约的车位改变颜色
          this.searchAnalyser = new fengmap.FMSearchAnalyser(this.fmap);
          this.setModelColorByType();
        })
        //地图点击事件
        this.fmap.on('mapClickNode', (event) => {
          if (!event.nodeType) {
            if (this.selectedModel) {
              this.selectedModel.selected = false;
            }
          }
          //地图模型
          const target = event.target;
          if (!target) {
            return;
          }

          let info = '';

          //筛选点击类型,打印拾取信息
          switch (target.nodeType) {
            //地面模型
            /*case fengmap.FMNodeType.FLOOR:
              if (this.clickedPOI && event.eventInfo.eventID === this.eventID) return;
              info = `地图位置坐标：x:${event.eventInfo.coord.x}，y:${event.eventInfo.coord.y}`;
              if (this.selectedModel) {
                this.selectedModel.selected = false;
              }
              //弹出信息框
              wx.showModal({
                title: '拾取对象类型：地图',
                content: info,
                showCancel: false,
              })
              break;*/

            //model模型
            case fengmap.FMNodeType.MODEL:
              if (this.clickedPOI && event.eventInfo.eventID === this.eventID) {
                this.clickedPOI = false;
                return;
              }
              //过滤类型不为停车位的模型
              if (target.typeID != 200401) {
                //其他操作
                return;
              }
              //console.log(target);
              var FID = target.FID;
              var spaceName = target.name;
              var cordX = target.mapCoord.x;
              var cordY = target.mapCoord.y;
              var reserved = target.reserved;
              var price = this.data.price;
              if(reserved === true){
                info = `停车位名称：${spaceName} 状态：已被预约`
              }
              else{
                info = `停车位名称：${spaceName} 状态：未被预约 价格：${price}元/每小时`
              }
              this.selectedModel = target;

              //弹出信息框
              wx.showModal({
                title: '车位预约',
                content: info,
                showCancel: true,
                confirmText: reserved ? '' : '预约车位' ,
                confirmColor:'#39b54a',
                success:(res)=>{
                  if(res.confirm){
                    //console.log('预约');
                    wx.request({
                      url: app.globalData.serverName + '/newOrder',
                      data:{
                        openId:this.data.openId,
                        carId:this.data.carId,
                        modelId:FID,
                        parkId:this.data.parkId,
                        cordX:cordX,
                        cordY:cordY,
                        spaceName:spaceName
                      },
                      method: 'GET',
                      header:{
                        'content-type': 'application/x-www-form-urlencoded'
                      },
                      success:(res) => {
                        if(res.data.code == 0){
                          //跳转到reservesuccess
                          //console.log('预定成功');
                          wx.navigateTo({
                            url: '../../../pages/reservesuccess/reservesuccess',
                            events:{
                              acceptDataFromOpenedPage:()=>{}
                            },
                            success:(res)=>{
                              res.eventChannel.emit('acceptDataFromOpenedPage',{
                                data:{
                                  parkDetail:this.data.parkDetail,
                                  spaceName:spaceName,
                                  distance:this.data.distance,
                                }
                            })}
                          })
                        }
                        else{
                          console.log(res.data.message);
                        }
                      }
                    })
                  }
                  else if(res.cancel){
                    //console.log('取消');
                  }
                }
              })
              break;

            //公共设施、图片标注模型
            /*case fengmap.FMNodeType.FACILITY:
            case fengmap.FMNodeType.IMAGE_MARKER:
              this.clickedPOI = true;
              this.eventID = event.eventInfo.eventID;
              info = `地图位置坐标：x: ${event.eventInfo.coord.x}，y: ${event.eventInfo.coord.y}`;
              if (this.selectedModel) {
                this.selectedModel.selected = false;
              }
              //弹出信息框
              wx.showModal({
                title: '拾取对象类型：公共设施',
                content: info,
                showCancel: false,
              })
              break;*/
          }
        })

        //过滤是否可触发点击事件mapClickNode方法的地图元素，返回true为可触发
        this.fmap.pickFilterFunction = function (event) {
          //如设置点击墙模型或道路模型时不高亮
          if (event.typeID === 300000 || event.typeID === 200110) {
            return false;
          }
          return true;
        };
      })
    })
  },

  setModelColorByType(){
    var reservedList = this.data.reservedList;
    var sortRes = [];//搜索结果
    var request = new fengmap.FMSearchRequest();//搜寻类型为停车位的模型
    request.typeID = 200401;//停车位类型ID
    request.nodeType = fengmap.FMNodeType.MODEL;
    this.searchAnalyser.query(request,(result)=>{
      sortRes = result;
      //console.log(sortRes);
    })
    if(sortRes.length > 0){//有搜索结果
      for(var i=0;i<sortRes.length;i++){
        var item = sortRes[i];
        var model = item.target;
        var _color = '#FF4500';
        for(var j=0;j<reservedList.length;j++){
          if(model.FID == reservedList[j].modelId){
            model.setColor(_color);
            model['reserved'] = true;
          }
        }
        //console.log(model);
        //model.setColor(_color);
      }
    }
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
})