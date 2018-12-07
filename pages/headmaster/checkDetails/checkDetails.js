var url = getApp().globalData.url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[]//详情列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var applyId = options.applyId;//申请ID
    var token = wx.getStorageSync('token');
    console.log("审核结果报名id=" + applyId);
    wx.request({
      url: url + 'enrolLeader/selectEnrolMangerDetailInfo.do',
      data: {
        i_apply_id: applyId, //申请ID
      },
      method: 'POST',
      header: {
        token: token//
      },
      success: function (res) {
        console.log(res.data.rtnData)
        if (res.data.rtnCode == 10000) {
          that.setData({
            dataList: res.data.rtnData
          });
        }
      }
    });
  },

  visitime:function(e){
    var applyId = e.currentTarget.dataset.applyId;
    var parent = e.currentTarget.dataset.parent;
    
    wx.navigateTo({
      url: '../visitTime/visitTime?applyId=' + applyId + '&parent=' + parent
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