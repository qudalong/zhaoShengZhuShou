var url = getApp().globalData.url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,// tab切换  
    allList:[],//日榜
    monthList:[],//月榜
    totalList:[]//总榜
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var token=wx.getStorageSync('token');
    //获取系统信息 
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });  

    that.request();//接口请求

  },

  request:function(){
    var that=this;
    wx.request({
      url: url + 'enrolLeader/selectEnrolKindergartenViewRanking.do',
      data: {
        i_view_type: parseInt(that.data.currentTab) + 1, //1日榜/2 周榜/3 总榜
        // i_view_type:3 //1日榜/2 周榜/3 总榜
      },
      method: 'POST',
      header: {
        token: wx.getStorageSync('token')//
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.rtnCode == 10000) {
          that.setData({
            start_date: res.data.v_activity_start_date.split(" ")[0],
            end_date: res.data.v_activity_end_date.split(" ")[0],
            i_activity: res.data.i_activity_is_end,
            allList: res.data.rtnData
          });
        }
      }
    });
  },

  //访问幼儿园
  toPublic: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../publicity/publicity?id=' + id
    });
  },

  //滑动切换tab 
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
    that.request();//接口请求
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
    that.request();//接口请求
  }, 

//  活动说明
  toExplain:function(){
    wx:wx.navigateTo({
      url: "../explain/explain"
    })
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