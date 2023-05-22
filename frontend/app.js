// app.js
App({
  onLaunch() {
    /*wx.setTabBarItem({
      index: 0,
      "text": "首页",
      "iconPath": "https://img2020.cnblogs.com/blog/1918311/202105/1918311-20210522135249240-827856056.png",
      "selectedIconPath": "https://img2020.cnblogs.com/blog/1918311/202105/1918311-20210522135255913-1966315573.png"
    })
    wx.setTabBarItem({
      index: 1,
      "text": "我的",
      "iconPath": "https://img2020.cnblogs.com/blog/1918311/202105/1918311-20210522135324412-1651408697.png",
      "selectedIconPath": "https://img2020.cnblogs.com/blog/1918311/202105/1918311-20210522135334650-785155823.png"
    })
    // 展示本地存储能力
    /*const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)*/

    // 登录
    /*wx.login({
      success: res => {
        if(res.code){
          wx.request({
            url: 'http://localhost:8080/login',
            data:{
              code:res.code
            },
            method: 'POST',
            header:{
              'content-type': 'application/x-www-form-urlencoded'
            },
            success(res){
              wx.setStorageSync('openid', res.data.openid);
            }
          })
        } else{
          console.log(res.errMsg);
        }
      }
    })*/

    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
         	this.globalData.Custom = capsule;
        	this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
        	this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })
  },
  globalData: {
    serverName:'http://localhost:8080'
    // serverName:'http://106.12.128.96:8080'
    //serverName:'https://www.rachal.top'
  }
})
