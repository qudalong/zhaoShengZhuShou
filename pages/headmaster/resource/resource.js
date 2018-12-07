var url = getApp().globalData.url; //url+'
Page({

  data: {
    array: [{
      name: '民办园',
      status: 0
    }, {
      name: '公办园',
      status: 0
    }, {
      name: '惠普园',
      status: 0
    }],
    array2: [{
      name: '规范化',
      status: 0
    }, {
      name: '区级',
      status: 0
    }, {
      name: '省级',
      status: 0
    }, {
      name: '市级',
      status: 0
    }, {
      name: '办园许可证',
      status: 0
    }],
    i_enrol_id: '', //招生ID
    v_kindergarten_nature: '', //幼儿园性质
    v_kindergarten_level: '' //幼儿园评级
  },

  //点击单个园
  swichItem: function(e) {
    var that = this;
    var index = e.target.dataset.current;
    var a = that.data.array;
    //选择反选
    if (a[index].status == 1) {
      for (var i in a) {
        a[i].status = 0;
      }
      a[index].status = 0;
      that.setData({
        v_kindergarten_nature: ''
      });
    } else if (a[index].status == 0) {
      for (var i in a) {
        a[i].status = 0;
      }
      a[index].status = 1;
      that.setData({
        v_kindergarten_nature: e.currentTarget.dataset.text
      });
    }

    this.setData({
      array: this.data.array
    });

  },
  swichItem2: function(e) {
    var that = this;
    var index = e.target.dataset.current;
    var a = that.data.array2;
    that.setData({
      currentTab2: e.target.dataset.current,
      // v_kindergarten_level: e.currentTarget.dataset.text
    });

    //选择反选
    if (a[index].status == 1) {
      for (var i in a) {
        a[i].status = 0;
      }
      a[index].status = 0;
      that.setData({
        v_kindergarten_level: '',
        currentTab2:8
      });
    } else if (a[index].status == 0) {
      for (var i in a) {
        a[i].status = 0;
      }
      a[index].status = 1;
      that.setData({
        v_kindergarten_level: e.currentTarget.dataset.text
      });
    }
    this.setData({
      array2: this.data.array2
    });


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var i_enrol_id = options.i_enrol_id;
    that.setData({
      i_enrol_id: i_enrol_id
    });


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
        console.log(res.data.rtnData[0])
        if (res.data.rtnCode == 10000) {
          var datas = res.data.rtnData[0];
          //查找位置
          for (var i in that.data.array) {
            if (that.data.array[i].name == datas.v_kindergarten_nature) {
              that.data.array[i].status = 1;
              break;
            }
          }
          for (var j in that.data.array2) {
            if (that.data.array2[j].name == datas.v_kindergarten_level) {
              that.data.array2[j].status = 1;
              var b=j;
              break;
            }
          }
          that.setData({
            allInfo: datas,
            v_kindergarten_nature: datas.v_kindergarten_nature,
            v_kindergarten_level: datas.v_kindergarten_level,
            array: that.data.array,
            array2: that.data.array2,
            currentTab2:b
          });
        } else {
          console.log('查询幼儿园园所招生宣传页面信息失败');
        }
      }
    });
  },

  request: function() {
    var that = this;
    wx.request({
      url: url + 'enrolLeader/saveEnrolKindergartenInfoOne.do',
      data: {
        v_open_code: wx.getStorageSync('openid'), //微信唯一标识
        i_enrol_id: that.data.i_enrol_id, //招生ID
        v_kindergarten_nature: that.data.v_kindergarten_nature, //幼儿园性质
        v_kindergarten_level: that.data.v_kindergarten_level //幼儿园评级
      },
      method: 'POST',
      header: {
        token: wx.getStorageSync('token') // 默认值
      },
      success: function(res) {
        if (res.data.rtnCode == 10000) {
          wx.showToast({
            title: '保存成功',
            duration:500
          });
        } else {
          console.log('幼儿园信息保存失败');
        }
      }
    });
  },

  // 保存
  save: function() {
    var that = this;
    that.request(); //保存
  },

  //下一步
  next: function() {
    var that = this;
    that.request(); //保存
    wx.navigateTo({
      url: '/pages/headmaster/education/education?i_enrol_id=' + that.data.i_enrol_id
    });
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

  }
})