var url = getApp().globalData.url;
var qiniuUploader = require("../../../utils/qiniuUploader");
// 初始化七牛相关参数
function initQiniu() {
  var url = getApp().globalData.url; //url+'
  var options = {
    region: 'ECN', // 区
    uptokenURL: url + "interface/dynamic/getUptoken.do",
    uptoken: wx.getStorageSync('uploadToken'),
    domain: wx.getStorageSync('baseUrl'), //'http://qinwh.qiniudn.com/' 
    shouldUseQiniuFileName: false,
  };
  qiniuUploader.init(options);
}


Page({
  data: {
    imgArr: [], //上传图片列表
    disabled: true,
    array: [], //列表
    kindergartenImg: '', //幼儿园风采图
    kindergartenName: '', //幼儿园名称
    linkMan: '', //联系人名称
    linkTel: '', //联系人电话
    adress: '', //幼儿园地址
    garden_address: ''
  },

  //幼儿园信息
  kindergartenName: function(e) {
    this.setData({
      kindergartenName: e.detail.value
    });
    this.ck();
  },
  linkMan: function(e) {
    this.setData({
      linkMan: e.detail.value
    });
    this.ck();
  },
  linkTel: function(e) {
    this.setData({
      linkTel: e.detail.value
    });
    this.ck();
  },

  //验证判断
  ck: function() {
    var that = this;
    if (that.data.kindergartenName.length >= 2 && that.data.linkMan.length >= 2 && that.data.linkTel.length == 11 && that.data.garden_address) {
      that.setData({
        disabled: false
      })
    } else {
      that.setData({
        disabled: true
      })
    }
  },

  //幼儿园地址
  chooseLocation: function(e) {
    var that = this
    wx.chooseLocation({
      success: function(res) {
        var address = res.address
        that.setData({
          garden_address: address //详细地址
        });
        that.ck();
      }
    })
  },

  onLoad: function(options) {
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
            console.log(res)
        if (res.data.rtnCode == 10000) {
          if (res.data.rtnData) {
            var datas = res.data.rtnData[0];
            that.setData({
              allInfo: datas,
              kindergartenName: datas.v_kindergarten_name, //幼儿园名称
              linkMan: datas.v_kindergarten_leader_name, //联系人姓名
              linkTel: datas.v_kindergarten_tel, //联系人电话
              garden_address: datas.v_kindergarten_address, //幼儿园地址
              imageURL: datas.v_kindergarten_photo //图片
            });
            that.ck();
          }
        } else {
          console.log('查询幼儿园园所招生宣传页面信息失败');
        }
      }
    });
  },

  submit: function() {
  
    var that = this;
    var token = wx.getStorageSync('token');
    var openid = wx.getStorageSync('openid');
    var nickName = wx.getStorageSync('nickName');
    wx.request({
      url: url + 'enrolLeader/saveKindergarBaseInfo.do',
      data: {
        v_open_code: openid, //微信唯一标识
        v_kindergarten_nick_name: nickName, //微信昵称
        v_kindergarten_name: that.data.kindergartenName, //幼儿园名称
        v_kindergarten_leader_name: that.data.linkMan, //联系人姓名
        v_kindergarten_tel: that.data.linkTel, //联系人电话
        v_kindergarten_address: that.data.garden_address, //幼儿园地址
        v_kindergarten_photo: that.data.imageURL //图片
      },
      method: 'POST',
      header: {
        token: token // 默认值
      },
      success: function(res) {
        if (res.data.rtnCode == 10000) {
          wx.showToast({
            title: '保存成功',
          });
        console.log("保存成功!!!!")
          wx.navigateTo({
            url: '/pages/headmaster/resource/resource?i_enrol_id=' + res.data.rtnData[0].i_enrol_id
          });
        } else {
          console.log('幼儿园信息保存失败')
        }
      }
    });
  },



  //添加图片
  addImg: function() {
    var that = this;

    wx.showActionSheet({
      itemList: ['拍照', '从手机相册选择'],
      success: function(res) {
        if (res.tapIndex == 0) {
          wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['camera'],
            success: function(res) {
              var tempFilePaths = res.tempFilePaths;
              var filePath = tempFilePaths[0];

              //七牛提供的上传方法
              qiniuUploader.upload(filePath, (res) => {
                that.setData({
                  imageURL: res.imageURL,
                  imgArr: that.data.imgArr.concat(res.imageURL)
                });
                console.log(that.data.imgArr)
                console.log(wx.getStorageSync('baseUrl'))
                console.log(wx.getStorageSync('uploadToken'))
              }, (error) => {
                console.log('error: ' + error);
              }, {
                region: 'ECN',
                uptokenURL: url + "interface/dynamic/getUptoken.do",
                domain: wx.getStorageSync('baseUrl'),
                uptoken: wx.getStorageSync('uploadToken'), // 由其他程序生成七牛 uptoken
              });

              wx.showToast({
                title: '加载中...',
                icon: 'loading',
                duration: 1000
              });
            }
          })
        } else if (res.tapIndex == 1) { //相机

          wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
              var tempFilePaths = res.tempFilePaths;
              var filePath = tempFilePaths[0];

              //七牛提供的上传方法
              qiniuUploader.upload(filePath, (res) => {
                that.setData({
                  imageURL: res.imageURL,
                  imgArr: that.data.imgArr.concat(res.imageURL)
                });
                console.log(that.data.imgArr)
                console.log(wx.getStorageSync('baseUrl'))
                console.log(wx.getStorageSync('uploadToken'))
              }, (error) => {
                console.log('error: ' + error);
              }, {
                region: 'ECN',
                uptokenURL: url + "interface/dynamic/getUptoken.do",
                domain: wx.getStorageSync('baseUrl'),
                uptoken: wx.getStorageSync('uploadToken'), // 由其他程序生成七牛 uptoken
              });

              wx.showToast({
                title: '加载中...',
                icon: 'loading',
                duration: 1000
              });
            }
          });
        }
      }
    })
  },



  previewImage02: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.wechatma // 需要预览的图片http链接列表
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

  }
})