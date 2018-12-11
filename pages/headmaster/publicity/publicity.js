var url = getApp().globalData.url; //url+'
Page({


  data: {
    allInfo: ''
  },


  onLoad: function(options) {
    wx.showShareMenu({
      withShareTicket:true 
    });
    var that = this;
    var token = wx.getStorageSync('token');
    var openid = wx.getStorageSync('openid');
    wx.request({
      url: url + 'enrolLeader/selectEnrolKindergartenInfoAll.do.do',
      data: {
        v_open_code: openid, //微信唯一标识
      },
      method: 'POST',
      header: {
        token: token // 默认值
      },
      success: function(res) {
        console.log(res.data)
        if (res.data.rtnCode == 10000) {
          var a = res.data.rtnData[0];
          if (res.data.rtnData) {
            wx.setNavigationBarTitle({
              title: res.data.rtnData[0].v_kindergarten_name
            });
            if (a.v_kindergarten_familyday_photo) {
              var qinzi = a.v_kindergarten_familyday_photo.split(";");
            } else {
              var qinzi = [];
            }
            if (a.v_kindergarten_recipe_photo) {
              var shipu = a.v_kindergarten_recipe_photo.split(";");
            } else {
              var shipu = [];
            }
            if (a.v_kindergarten_handwork_photo) {
              var shougong = a.v_kindergarten_handwork_photo.split(";");
            } else {
              var shougong = [];
            }
            if (a.v_kindergarten_room_photo) {
              var jiaoyu = a.v_kindergarten_room_photo.split(";");
            } else {
              var jiaoyu = [];
            }
            that.setData({
              i_enrol_id: res.data.rtnData[0].i_enrol_id, //招生id
              allInfo: res.data.rtnData[0],
              ts: res.data.rtnData[0].v_kindergarten_feature.split(";"),
              jiaoyu: jiaoyu,
              qinzi: qinzi,
              shipu: shipu,
              shougong: shougong
            });

          }
          //查询分享次数
          console.log('查询分享次数')
          that.selectShareNum();
        } else {
          console.log('查询幼儿园园所招生宣传页面信息失败');
        }
      }
    });


  },

  //编辑
  editor: function() {
    wx.navigateTo({
      url: '../kindergartenInfo/kindergartenInfo'
    });
  },

  more: function(e) {
    var desc = e.currentTarget.dataset.desc;
    wx.navigateTo({
      url: '/pages/headmaster/intro/intro?desc=' + desc
    });
  },


  //查询分享次数
  selectShareNum: function() {
    var that = this;
    wx.request({
      url: url + 'enrolParent/selectShareNum.do',
      data: {
        enrolId: that.data.i_enrol_id //招生id
      },
      method: 'GET',
      header: {
        token: wx.getStorageSync('token') // 默认值
      },
      success: function(res) {
       
        console.log(res.data)
        if (res.data.rtnCode == 10000) {
          that.setData({
            selectShareNum: res.data.rtnData[0]+1 //分享次数
          });
        }
      }
    });
  },
  //查询分享次数
  updateShareNum: function() {
    var that = this;
    wx.request({
      url: url + 'enrolParent/updateShareNum.do',
      data: {
        enrolId: that.data.i_enrol_id //招生id
      },
      method: 'GET',
      header: {
        token: wx.getStorageSync('token') // 默认值
      },
      success: function(res) {
       
        console.log(res.data)
        if (res.data.rtnCode == 10000) {
          that.setData({
            selectShareNum: res.data.rtnData[0]+1 //分享次数
          });
        }
      }
    });
  },

  //预览图片
  previewImage: function (e) {
    var current = e.currentTarget.dataset.url;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.jiaoyu // 需要预览的图片http链接列表  
    })
  },
  previewImage2: function (e) {
    var current = e.currentTarget.dataset.url;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.qinzi // 需要预览的图片http链接列表  
    })
  },
  previewImage3: function (e) {
    var current = e.currentTarget.dataset.url;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.shipu // 需要预览的图片http链接列表  
    })
  },
  previewImage4: function (e) {
    var current = e.currentTarget.dataset.url;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.shougong // 需要预览的图片http链接列表  
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var that = this;
    var name = wx.getStorageSync('nickName');
    var url = wx.getStorageSync('avatarUrl');
    var id = wx.getStorageSync('openid');
    console.log("我是" + name )
    return {
      title: "我是" + name + ",我是第" + that.data.selectShareNum + "位分享的人",
      path: "/pages/patriarch/publicity/publicity?i_enrol_id=" + that.data.i_enrol_id + "&shareOpenId=" + id + "&shareNickName=" + name + "&sharePhoto=" + url + "&headmast=" + 1,

      success: function(res) {
        //分享次数+1并返回当前分享次数
        that.updateShareNum();
      }
    }
  }
})