var url = getApp().globalData.url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      id:''//招生id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 
    var that=this;
    var enrolId = options.enrolId;
    var token = wx.getStorageSync('token');
    var openid = wx.getStorageSync('openid');
    console.log('openid==' + openid);
    if (enrolId){
     enrolId = enrolId;
    }else{
      enrolId=''
    }
    wx.request({
      url: url + 'enrolParent/selectApplyViews.do',
      data: {
        openId: openid,
        enrolId: enrolId//招生id
      },
      method: 'GET',
      header: {
        token: token// 默认值
      },
      success: function (res) {
        if (res.data.rtnCode == 10000) {
          wx.setNavigationBarTitle({
            title: res.data.rtnData[0].schoolName+'-分享榜',
          })
          that.setData({
            allInfo: res.data.rtnData
          });
          console.log(res.data.rtnData)
        } else {
          console.log('查询幼儿园园所招生宣传页面信息失败');
        }
      }
    });
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
  
  }
})