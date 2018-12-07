var url = getApp().globalData.url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:'',//报名详情
    id: ''//报名id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = options.id;//接收报名id
    console.log("接收报名id="+id);
    that.setData({
      id: id
    });
  //接口
    that.request();
  },

  request:function(){
    var that = this;
    var token = wx.getStorageSync('token');
    var openid = wx.getStorageSync('openid');
    wx.request({
      url: url + 'enrolParent/selectMyApplyDetail.do',
      data: {
        openId: openid, //微信唯一标识
        id: that.data.id, //报名id
      },
      method: 'GET',
      header: {
        token: token
      },
      success: function (res) {
        console.log(res.data.rtnData[0])
        if (res.data.rtnCode == 10000) {
          that.setData({
            detail: res.data.rtnData[0]
          });
          var phoneNumber = res.data.rtnData[0].v_sch_tel
          that.setData({
            phoneNumber: phoneNumber
          });
          // console.log(res.data.rtnData[0])
        } else {
        }
      }
    });
  },

//拨打电话
  bitphone: function () {
    var that=this;
    wx.makePhoneCall({
      phoneNumber: that.data.phoneNumber
    })
  },

  //访问幼儿园
  toPublic: function () {
    var that = this;
    wx.navigateTo({
      // url: '../publicity/publicity?id=' + that.data.id
      url: '../publicity/publicity?i_enrol_id=' + that.data.detail.i_enrol_id + '&class=' + that.data.detail.v_app_enrolGrade
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
    var that = this;
    that.request();
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