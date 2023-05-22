// pages/FMNavigationBase/index.js

import { fengmap } from '../../utils/fengmap.miniprogram.min.js';
var app = getApp();
Page({
  data: {
    mapLoaded: false, //地图是否加载完成
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
  // 定义路径规划对象
  naviAnalyser: null,
  /**
   * 定义点击次数变量
   * 第一次获取起点，第二次获取终点，获取终点之后用户必须再次点击计算路线按钮才能开始拾取新的起点和终点
   */
  clickCount: 0,
  // 判断起点是否是同一处坐标
  lastCoord: null,
  // 起终点坐标
  coords: [],
  // 定义markert图层数组
  layers: [],
  //搜索分析类
  searchAnalyser: null,

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    // 获取canvas
    wx.request({
      url: app.globalData.serverName + '/getOrdersToday',
      data:{
        parkId:2
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
    wx.createSelectorQuery().select('#fengMap').node().exec((res) => {
      const canvas = res[0].node;
      this.canvas = canvas

      wx.createSelectorQuery().select("#temp").node().exec((tempRes) => {
        const tmpCanvas = tempRes[0].node;

        const fmapID = "1387381076270104577";

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
          appName: '停车预约系统',
          //必要，地图应用密钥，通过蜂鸟云后台获取
          key: 'a11fc5a264ed23106380a94b1cdd45fe',
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
          this.searchAnalyser = new fengmap.FMSearchAnalyser(this.fmap);
          this.setModelColorByType();
          this.setData({
            mapLoaded: true
          })

          /**
           * fengmap.FMNaviAnalyser 是可分析最短路径、最快路径并返回分析结果的路径类
           */
          this.naviAnalyser = new fengmap.FMNaviAnalyser(this.fmap);

        })

        /**
         * 地图点击事件
         * 第一次点击选取为起点，第二次点击选取为终点，再次点击路径规划按钮重新选取起点、终点
         */
        this.fmap.on('mapClickNode', (event) => {
          if (event.target && event.target.nodeType == fengmap.FMNodeType.MODEL && this.naviAnalyser) {
            //封装点击坐标，模型中心点坐标
            const coord = {
              x: event.target.mapCoord.x,
              y: event.target.mapCoord.y,
              groupID: event.target ? event.target.groupID : 1
            };
            //第一次点击
            if (this.clickCount === 0) {
              //记录点击坐标
              this.lastCoord = coord;
              //设置起点坐标
              this.coords[0] = coord;

              //添加起点imageMarker
              this.addMarker(coord, 'start');
            } else if (this.clickCount === 1) {
              //第二次点击，添加终点并画路线
              //判断起点和终点是否相同
              if (this.lastCoord.x === coord.x && this.lastCoord.y === coord.y) {
                return;
              }

              //设置终点坐标
              this.coords[1] = coord;
              //添加终点imageMarker
              this.addMarker(coord, 'end');

              //设置完起始点后，调用此方法画出导航线
              this.drawNaviLine();
            } else {
              //第三次点击，重新开始选点进行路径规划
              //重置路径规划
              this.resetNaviRoute();

              //记录点击坐标
              this.lastCoord = coord;
              //设置起点坐标
              this.coords[0] = coord;
              //添加起点imageMarker
              this.addMarker(coord, 'start');
            }
            this.clickCount++;
          }
        });
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
   * 画导航线
   */
  drawNaviLine() {

    //根据已加载的fengmap.FMMap导航分析，判断路径规划是否成功
    const analyzeNaviResult = this.naviAnalyser.analyzeNavi(this.coords[0].groupID, this.coords[0], this.coords[1].groupID, this.coords[1], fengmap.FMNaviMode.MODULE_SHORTEST);
    if (fengmap.FMRouteCalcuResult.ROUTE_SUCCESS != analyzeNaviResult) {
      return;
    }

    //获取路径分析结果对象，所有路线集合
    let results = this.naviAnalyser.getNaviResults();

    //初始化线图层
    let line = new fengmap.FMLineMarker();
    for (let i = 0; i < results.length; i++) {
      let result = results[i];
      //楼层id
      let gid = result.groupId;
      //路径线点集合
      let points = result.getPointList();

      let points3d = [];
      points.forEach(function (point) {
        points3d.push({
          //x坐标点
          'x': point.x,
          //y坐标点
          'y': point.y,
          //线标注高度
          'z': 1
        });
      });

      /**
       * fengmap.FMSegment点集，一个点集代表一条折线
       */
      let seg = new fengmap.FMSegment();
      seg.groupId = gid;
      seg.points = points3d;
      line.addSegment(seg);
    }

    //配置线型、线宽、透明度等
    let lineStyle = {
      //设置线的宽度
      lineWidth: 6,
      //设置线的透明度
      alpha: 0.8,
      //设置线的类型为导航线
      lineType: fengmap.FMLineType.FMARROW,
      //设置线动画,false为动画
      noAnimate: true
    };

    //画线
    this.fmap.drawLineMark(line, lineStyle);
  },

  /**
   * 重置路径规划
   */
  resetNaviRoute() {
    //清空导航线
    this.clearNaviLine();
    //清空起点、终点marker
    this.deleteMarker();
    //重置地图点击次数
    this.clickCount = 0;
    //重置上一次点击坐标对象
    this.lastCoord = null;
  },

  /**
   * 清空导航线
   */
  clearNaviLine() {
    //清空导航线
    this.fmap.clearLineMark();
  },

  /**
   * 添加起点终点marker
   * coord: 模型中心点坐标
   * type: start-起点坐标， end-终点坐标
   */
  addMarker(coord, type) {
    //获取目标点层
    let group = this.fmap.getFMGroup(coord.groupID);
    //创建marker，返回当前层中第一个imageMarkerLayer,如果没有，则自动创建
    let layer = group.getOrCreateLayer('imageMarker');
    //判断该楼层layer是否存在，清除marker时需要将所有楼层marker都清除
    let isExistLayer = this.layers.some(function (item, index, array) {
      return item.groupID === coord.groupID;
    });
    if (!isExistLayer) {
      this.layers.push(layer);
    }
    let markerUrl = '';
    if (type === 'start') {
      markerUrl = '../../../icon/start.png';
    } else {
      markerUrl = '../../../icon/end.png';
    }
    //图标标注对象，默认位置为该楼层中心点
    let im = new fengmap.FMImageMarker(this.fmap, {
      x: coord.x,
      y: coord.y,
      //设置图片路径
      url: markerUrl,
      //设置图片显示尺寸
      size: 32,
      //marker标注高度
      height: 2
    });
    //添加imageMarker
    layer.addMarker(im);
  },

  /**
   * 清空图片marker事件
   */
  deleteMarker() {
    //删除layer上所有Marker
    this.layers.forEach(function (layer, index) {
      if (layer) {
        layer.removeAll();
      }
    });
  },
})
