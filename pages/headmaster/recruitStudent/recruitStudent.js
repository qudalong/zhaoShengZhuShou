var url = getApp().globalData.url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab:0,
    dataList:[]//审核列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync('token');
    var openid = wx.getStorageSync('openid');

    //获取系统信息 
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    that.request();
    
  },

  request:function(){
    var that=this;
    wx.request({
      url: url + 'enrolLeader/selectEnrolMangerList.do',
      data: {
        v_open_code: wx.getStorageSync('openid'), //微信唯一标识
        i_sh_state: that.data.currentTab//审核标识(0 查询未审核列表/1 查询已审核列表)
      },
      method: 'POST',
      header: {
        token: wx.getStorageSync('token')//
      },
      success: function (res) {
        if (res.data.rtnCode == 10000) {
          that.setData({
            dataList: res.data.rtnData
          });
          console.log(res.data.rtnData)
        }
      }
    });
  },

  // 跳转
  detailInfo:function(e){
    var applyId = e.currentTarget.dataset.applyId;
    wx.navigateTo({
      url: '/pages/headmaster/checkDetails/checkDetails?applyId=' + applyId
    });
  },
  detailInfoNo:function(e){
    var applyId = e.currentTarget.dataset.applyId;
    wx.navigateTo({
      url: '/pages/headmaster/nocheckDetails/nocheckDetails?applyId=' + applyId
    });
  },

  //滑动切换tab 
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
    that.request();
  },
  //点击tab切换 

  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
    that.request();
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
    var that = this;
    that.request();//返回刷新页面
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