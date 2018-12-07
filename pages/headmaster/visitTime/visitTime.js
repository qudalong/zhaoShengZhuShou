function getNowFormatDate(that) {
  var date = new Date();
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate;
  that.setData({
    date: currentdate
  });
}
function time(that) {
  var date = new Date();
  var seperator1 = ":";
  var hours = date.getHours();
  var minutes = date.getMinutes();
  if (minutes >= 1 && minutes <= 9) {
    minutes = "0" + minutes;
  }
  if (hours >= 0 && hours <= 9) {
    hours = "0" + hours;
  }
  var currentdate = hours + seperator1 + minutes ;
  that.setData({
    time: currentdate
  });
}

var url = getApp().globalData.url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: ''//今天
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    getNowFormatDate(that);//获取当前日期
    time(that);//获取当前时间
    var applyId = options.applyId;
    var parent = options.parent;
    wx.setNavigationBarTitle({
      title: parent
    });
    this.setData({
      applyId: applyId
    });
  },

  //参观日期
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    });
  },
  bindTiemChange: function (e) {
    this.setData({
      time: e.detail.value
    });
  },

  //确认安排
  arrange: function (e) {
    var that = this;
    var formId = e.detail.formId;
    var token = wx.getStorageSync('token');
    var applyId = that.data.applyId;//申请ID
    wx.request({
      url: url + 'enrolLeader/executeEnrolManagerTask.do',
      data: {
        i_apply_id: applyId, //申请ID
        i_action_state: 1,//执行标识(0 审核不通过/1 审核通过)
        dtm_visit_time: that.data.date +' '+ that.data.time//参观时间(当执行标识为1即审核通过时，参观时间不能为空)
      },
      method: 'POST',
      header: {
        token: token//
      },
      success: function (res) {
        if (res.data.rtnCode == 10000) {

          var datas = res.data.rtnData[0];
          //推送
          wx.request({
            url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + res.data.v_access_tocken,
            data: {
              "touser": wx.getStorageSync('openid'),
              "template_id": "05CKTq6TpCZwkIRTTDGTjJf5rySFrlzL9I9oQwhWnDo",
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
                  "value": datas.v_visit_time
                },
                "keyword4": {
                  "value": datas.i_age
                },
                "keyword5": {
                  "value": datas.v_parent_tel
                }
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



          console.log("安排完成");
          wx:wx.navigateTo({
            url: '../checkDetails/checkDetails?applyId=' + applyId
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