// pages/patriarch/submitSuccess/submitSuccess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var v_sch_name = options.v_sch_name;
    var v_sch_tel = options.v_sch_tel;
    console.log(v_sch_name)
    wx.setNavigationBarTitle({
      title: v_sch_name
    });
    this.setData({
      v_sch_tel: v_sch_tel
    });
  
  },
  tel:function(){
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.v_sch_tel
    })
  },

  my:function(){
    // wx.navigateTo({
    //   url: '../my/my'
    // });
    // wx.navigateBack({
    //   delta:4
    // });
    wx.reLaunch({
      url: '/pages/patriarch/my/my?apply=1'
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