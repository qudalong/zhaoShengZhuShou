var url = getApp().globalData.url; //url+'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: true,
    array: ['爸爸', '妈妈', '爷爷', '奶奶', '外公', '外婆', '监护人', '其他'],
    array2: ['男', '女'],
    v_par_name: '', //家长姓名
    v_par_relation: '', //家长身份
    v_par_tel: '', //家长电话
    v_par_address: '', //家庭住址
    v_stu_name: '', //学生姓名
    i_stu_sex: '', //学生性别0:女 1:男
    v_stu_brithday: '' //学生生日
  },

  //选择位置位置
  chooseLocation: function(e) {
    var that = this
    wx.chooseLocation({
      success: function(res) {
        var address = res.address
        that.setData({
          hasLocation: true,
          v_par_address: address //详细地址
        })
      }
    })
  },

  //家长身份
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value,
      v_par_relation: this.data.array[e.detail.value]
    });
    this.ck();
  },
  //宝宝性别
  bindPickerChange2: function(e) {
    var sex;
    if (e.detail.value == 0) {
      sex = 1;
    } else {
      sex = 0;
    }
    this.setData({
      index2: e.detail.value,
      i_stu_sex: sex
    });
    this.ck();
  },

  //出生日期
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value,
      v_stu_brithday: e.detail.value
    });
    this.ck();
  },
  //家长姓名
  parName: function(e) {
    this.setData({
      v_par_name: e.detail.value
    })
    this.ck();
  },
  //家长电话
  parTel: function(e) {
    this.setData({
      v_par_tel: e.detail.value
    });
    this.ck();
  },
  //学生姓名
  stuName: function(e) {
    this.setData({
      v_stu_name: e.detail.value
    });
    this.ck();
  },

  onLoad: function(options) {
    var that = this;
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
      today: currentdate
    });


    var openid = wx.getStorageSync('openid');
    var token = wx.getStorageSync('token');
    wx.request({
      url: url + 'enrolParent/selectMyDetail.do',
      data: {
        openId: openid
      },
      method: 'GET',
   
      header: {
        token: token // 默认值
      },

      success: function (res) {
      
          console.log(res.data);
        if (res.data.rtnCode == 10000) {
          if (res.data.rtnData.length){
            that.setData({
              seleInfo: res.data.rtnData[0],
              v_stu_name: res.data.rtnData[0].v_stu_name, //学生姓名
              i_stu_sex: res.data.rtnData[0].i_stu_sex, //学生性别0:女 1:男
              v_stu_brithday: res.data.rtnData[0].v_stu_brithday, //学生生日
              v_par_name: res.data.rtnData[0].v_par_name, //家长姓名
              v_par_tel: res.data.rtnData[0].v_par_tel, //家长电话
              v_par_address: res.data.rtnData[0].v_par_address, //家庭住址
              v_par_relation: res.data.rtnData[0].v_par_relation //家长身份
            });
            that.ck();
          }
        } else {
          console.log('查询我的资料失败');
        }
      }
    });
  },

  //验证判断
  ck: function() {
    console.log("验证判断");
    var that = this;
    if (that.data.v_par_name.length >= 2 && that.data.v_par_relation && that.data.v_par_tel.length == 11 && that.data.v_stu_name.length >= 2 && (that.data.i_stu_sex == 0 || that.data.i_stu_sex == 1) && that.data.v_stu_brithday) {
      that.setData({
        disabled: false
      })
    } else {
      that.setData({
        disabled: true
      })
    }
  },

  //保存
  saveInfo: function() {
    var that = this;
    var token = wx.getStorageSync('token');
    var openid = wx.getStorageSync('openid');
    if (that.data.v_par_address) {
      var address = that.data.v_par_address;
    } else {
      var address = "";
    }
    wx.request({
      url: url + 'enrolParent/addMyDetail.do',
      data: {
        i_opp_id: openid, //微信唯一标识
        v_stu_name: that.data.v_stu_name, //学生姓名
        i_stu_sex: that.data.i_stu_sex, //学生性别0:女 1:男
        v_stu_brithday: that.data.v_stu_brithday, //学生生日
        v_par_name: that.data.v_par_name, //家长姓名
        v_par_tel: that.data.v_par_tel, //家长电话
        v_par_address: address, //家庭住址
        v_par_relation: that.data.v_par_relation //家长身份
      },
      method: 'POST',
      // header: {
      //   'content-type': 'application/json' // 默认值
      // },
      header: {
        token: token // 默认值
      },
      success: function(res) {
        if (res.data.rtnCode == 10000) {
          console.log('保存成功');
          wx.showToast({
            title: '保存成功'
          });
          // wx.navigateTo({
          //   url: '../my/my'
          // })
          wx.navigateBack({
            delta:1,
          })
        } else {
          wx.showToast({
            title: '保存失败',
            icon: 'none'
          });
          console.log('保存失败');
        }
      }
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