var url = getApp().globalData.url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getUserInfoFail:false,
    index: 1,
    identity: '园长',
    avatarUrl: '', //微信头像地址
    nickName: '', //微信头像名称
    applyList: [], //我的报名列表
    array: ['家长', '园长'] //园所角色
  },

  //picker
  bindPickerChange: function(e) {
    var that = this;
    that.setData({
      index: e.detail.value
    });
    wx.setStorageSync('identity', that.data.array[e.detail.value]);
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '努力加载中',
    })
    var that = this;
    var create = options.create;
    var apply = options.apply;

    //招生管理未审核条数
    that.noCk();
    //上次编辑时间
    that.updataTime();
    //查看次数
    that.selectEnrolViewNum();

    if (wx.getStorageSync('identity')) {
      var identity = wx.getStorageSync('identity');
      if (identity == "家长") {
        that.setData({
          index: 0
        });
      } else {
        that.setData({
          index: 1
        });
      }
      that.setData({
        identity: identity
      });
    }
    // 查看是否授权
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          //console.log('已经授权....................')
          wx.getUserInfo({
            success: function(res) {
              that.setData({
                avatarUrl: res.userInfo.avatarUrl,
                nickName: res.userInfo.nickName,
                getUserInfoFail: false
              });
              // wx.setStorageSync('avatarUrl', res.userInfo.avatarUrl);
              // wx.setStorageSync('nickName', res.userInfo.nickName);
            }
          })
        } else {
          //console.log('没有授权....................');
          that.setData({
            getUserInfoFail: true
          })
        }
      }
    });

    //查询我的报名
    var token = wx.getStorageSync('token');
    var openid = wx.getStorageSync('openid');
    that.myApply();

    //获取七牛上传Token
    wx.request({
      url: url + 'interface/dynamic/getUptoken.do',
      method: 'POST',
      data: {},
      header: {
        token: token
      },
      success: function(res) {
        console.log('uploadToken.....................')
        console.log(res)
        if (res.data.rtnCode == 10000) {
          wx.setStorageSync('baseUrl', res.data.rtnData[0].baseUrl);
          wx.setStorageSync('uploadToken', res.data.rtnData[0].uploadToken);
        } else {
          ////console.log(res.data.result)
        }
      }
    });


    //我要建园
    if (create) {
      //console.log('我要建园');
      that.setData({
        index: 1
      });
    }
    //我已报名
    if (apply) {
      //console.log('我要建园');
      that.setData({
        index: 0
      });
    }
    // wx.showToast({
    //   title: ''+that.data.index,
    // })
  },

  bindGetUserInfo: function (e) {
    var that = this;
    //此处授权得到userInfo
    //console.log('此处授权得到userInfo');
    //console.log(e.detail.userInfo);
    //接下来写业务代码
    wx.redirectTo({
      url: '/pages/patriarch/my/my',
    })
  },

  //我的报名
  myApply: function() {
    var that = this;
    wx.request({
      url: url + 'enrolParent/selectMyApply.do',
      data: {
        openId: wx.getStorageSync('openid') //微信唯一标识
      },
      method: 'GET',
      header: {
        token: wx.getStorageSync('token')
      },
      success: function(res) {
        //console.log('我的报名')
        //console.log(res.data)
        if (res.data.rtnCode == 10000) {
          that.setData({
            applyList: res.data.rtnData
          });
          //console.log(res.data.rtnData)
        } else {}
      }
    });
  },

  //未审核条数
  noCk: function() {
    var that = this;
    wx.request({
      url: url + 'enrolLeader/selectEnrolMangerList.do',
      data: {
        v_open_code: wx.getStorageSync('openid'), //微信唯一标识
        i_sh_state: 0 //审核标识(0 查询未审核列表/1 查询已审核列表)
      },
      method: 'POST',
      header: {
        token: wx.getStorageSync('token') //
      },
      success: function(res) {
        //console.log('未审核条数')
        //console.log(res.data)
        if (res.data.rtnCode == 10000) {
          if (res.data.rtnData) {
            that.setData({
              noCk: res.data.rtnData.length //未审核条数
            });
          }
        }
      }
    });
  },
  //上传编辑时间
  updataTime: function() {
    var that = this;
    wx.request({
      url: url + 'enrolLeader/selectEnrolLeaderLastUpdateTime.do',
      data: {
        v_open_code: wx.getStorageSync('openid'), //微信唯一标识
      },
      method: 'POST',
      header: {
        token: wx.getStorageSync('token') //
      },
      success: function(res) {
        wx.hideLoading();
        //console.log('上传编辑时间')
        //console.log(res.data)
        if (res.data.rtnCode == 10000) {
          that.setData({
            updataTime: res.data.rtnData[0].v_max_update_time
          });
        }
      }
    });
  },
  //查询幼儿园所查看次数
  selectEnrolViewNum: function() {
    var that = this;
    wx.request({
      url: url + 'enrolLeader/selectEnrolViewNum.do',
      data: {
        v_open_code: wx.getStorageSync('openid'), //微信唯一标识
      },
      method: 'POST',
      header: {
        token: wx.getStorageSync('token') //
      },
      success: function(res) {
        //console.log('查询幼儿园所查看次数')
        //console.log(res.data)
        if (res.data.rtnCode == 10000) {
          that.setData({
            v_view_num: parseInt(res.data.rtnData[0].v_view_num)
          });
        }
      }
    });
  },


  //报名详情
  applyDetail: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../applyDetals/applyDetals?id=' + id
    })
  },

  //我的报名
  myInfo: function() {
    wx.navigateTo({
      url: '/pages/patriarch/myInfo/myInfo'
    })
  },

  // 排行榜
  ranking: function() {
    wx.navigateTo({
      url: '../ranking/ranking'
    });
  },
  // 招生宣传分享帮
  shareRanking: function() {
    wx.navigateTo({
      url: '../shareRanking/shareRanking'
    });
  },
  // 招生管理
  enrolManger: function() {
    wx.navigateTo({
      url: '/pages/headmaster/recruitStudent/recruitStudent'
    });
  },
  // 招生宣传
  publicity: function() {
    wx.navigateTo({
      url: '/pages/headmaster/publicity/publicity'
    });
  },
  publicity2: function() {
    wx.showToast({
      title: '请先编辑幼儿园资料',
      icon: 'none'
    })
  },
  // 幼儿园编辑资料
  editInfo: function() {
    wx.navigateTo({
      url: '/pages/headmaster/kindergartenInfo/kindergartenInfo'
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
    var that = this;
    //招生管理未审核条数
    that.noCk();
    //上次编辑时间
    that.updataTime();
    //查看次数
    that.selectEnrolViewNum();
    //查询我的报名
    that.myApply();
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