var url = getApp().globalData.url;
var WxParse = require('../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    desc:'0'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: url + 'enrolLeader/selectEnrolActivity.do',
      data: {},
      method: 'POST',
      header: {
        token: wx.getStorageSync('token')//
      },
      success: function (res) {
          console.log(res.data.rtnData);
        if (res.data.rtnCode == 10000) {
          var desc = res.data.rtnData[0].v_instruction;
          that.setData({
            all: res.data.rtnData[0],
            desc: WxParse.wxParse('desc', 'html', desc, that, 5)
          });
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