var url = getApp().globalData.url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: []//详情列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var applyId = options.applyId;//申请ID
    that.setData({
      applyId: applyId
    });

    that.request();

  },

  request: function () {
    var that = this;
    wx.request({
      url: url + 'enrolLeader/selectEnrolMangerDetailInfo.do',
      data: {
        i_apply_id: that.data.applyId, //申请ID
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
        }
      }
    });
  },


  //安排时间
  visitime: function (e) {
    var that=this;
    var parent = e.currentTarget.dataset.parent;
    wx.navigateTo({
      url: '../visitTime/visitTime?applyId=' + that.data.applyId + '&parent=' + parent
    })
  },


  //拒绝
  noPass: function (e) {
    var that = this;
    console.log('form发生了submit事件，携带数据为：', e.detail.formId);
    var formId = e.detail.formId;
    wx.request({
      url: url + 'enrolLeader/executeEnrolManagerTask.do',
      data: {
        i_apply_id: that.data.applyId, //申请ID
        i_action_state: 0,//执行标识(0 审核不通过/1 审核通过)
        dtm_visit_time:''
      },
      method: 'POST',
      header: {
        token: wx.getStorageSync('token')//
      },
      success: function (res) {
        console.log("拒绝返回信息：")
        console.log(res.data)
        if (res.data.rtnCode == 10000) {
          var datas = res.data.rtnData[0];
          //推送
          wx.request({
            url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + res.data.v_access_tocken,
            data: {
              "touser": wx.getStorageSync('openid'),
              "template_id": "05CKTq6TpCZwkIRTTDGTjAHV26r5TG5opivhr-vjqD8",
              "page": "pages/headmaster/checkDetails/checkDetails?applyId=" + that.data.applyId,
              "form_id": formId,
              "data": {
                "keyword1": {
                  "value": datas.v_student_name
                },
                "keyword2": {
                  "value": datas.v_state
                },
                "keyword3": {
                  "value": datas.i_age
                },
                "keyword4": {
                  "value": datas.v_parent_tel
                }
                // "keyword5": {
                //   "value": datas.v_grade_name
                // }
              },
            },
            method: 'POST',
            header: {
              token: wx.getStorageSync('token')
            },
            success: function (res) {
              console.log('推送成功')
            }
          });



          wx: wx.navigateTo({
            url: '../recruitStudent/recruitStudent?applyId=' + that.data.applyId
          })
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