//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          wx.request({
            url: this.globalData.url+'mobile/loginWeiXin.do',
            method: 'POST',
            data: {
              platform: 1,
              code: res.code
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              // console.log(res.data)
              if (res.data.rtnCode == 10000) {
                //本地存储openid
                wx.setStorageSync('openid', res.data.rtnData[0].openid);
                wx.setStorageSync('sessionid', res.data.rtnData[0].sessionid);
                wx.setStorageSync('token', res.data.token);
              } else {
              }
            }
          });
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
            
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log(res.userInfo)
              wx.setStorageSync('avatarUrl', res.userInfo.avatarUrl);
              wx.setStorageSync('nickName', res.userInfo.nickName);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    });


  },
  globalData: {
    userInfo: null,
    url: 'http://192.168.32.106:8081/lbt-xcx-server/'//郭煜
    // url: 'http://192.168.32.102:8080/lbt-xcx-server/'//梁培
    // url: 'http://192.168.32.208:6057/lbt-xcx-server/'//张涛
    // url: 'https://xcx.lebeitong.com/test/'//内网
    // url: 'https://xcx.lebeitong.com/'//外网
  }
})