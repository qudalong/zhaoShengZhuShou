var url = getApp().globalData.url;
var qiniuUploader = require("../../../utils/qiniuUploader");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    aZdy: [],
    zdy: false,
    ts: [],
    array: [], //列表
    video: '', //视频
    content: '', //内容
    photos: [], //照片列表
    videos: [], //视频列表
    videos2: [], //视频列表2
    uploadToken: '', //七牛上传Token
    str: { //图片
      name: '',
      shoottime: ''
    },
    str2: { //视频
      name: '', //视频名称（key）
      thumbpath: '', // 	缩略图（key）
      size: '', //视频大小（ＫＢ）
      length: '' //视频长度
    },
    a: 0, //点击事件控制
    tempArray: [], //预上传列表
    iscontinues: false, //是否继续
    arrayIndex: 0, //位置

    active: false, //幼儿园特色选中状态
    imgArr: [],
    array1: [{
        name: '蒙特梭利',
        status: 0
      },
      {
        name: '国学',
        status: 0
      },
      {
        name: '奥尔夫',
        status: 0
      },
      {
        name: '支付宝',
        status: 0
      },
      {
        name: '外教',
        status: 0
      },
      {
        name: '绿色园所',
        status: 0
      },
      {
        name: '美术',
        status: 0
      },
      {
        name: '亲子课堂',
        status: 0
      },
      {
        name: '感统',
        status: 0
      },
      {
        name: '双语教学',
        status: 0
      },
      {
        name: '幼儿舞蹈',
        status: 0
      }
    ],
    i_enrol_id: '', //招生ID
    v_kindergarten_feature: '', //幼儿园特色
    v_kindergarten_room_photo: '' //教学环境照片
  },



  //点击单个园
  swichItem: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.key;
    //回显改变更新删除
    for (var j in that.data.ts) {
      if (that.data.array1[index].name == that.data.ts[j]) {
        this.data.ts.splice(j, 1)
        that.setData({
          ts: this.data.ts
        });
      }
    }
    //选择反选
    if (this.data.array1[index].status == 1) {
      this.data.array1[index].status = 0;
    } else if (this.data.array1[index].status == 0) {
      this.data.array1[index].status = 1;
      this.data.ts.push(this.data.array1[index].name);
    }
    this.setData({
      array1: this.data.array1,
      ts: this.data.ts
    });
  },

  // 自定义
  zdy: function() {
    var that = this;
    that.setData({
      zdy: true,
      v_item: ''
    });
  },
  closeDialog: function() {
    var that = this;
    that.setData({
      zdy: false
    });
  },
  ok: function() {
    var that = this;
    if (!that.data.v_item) {
      wx.showToast({
        title: '请输入5个字以内的标签',
        icon: 'none'
      });
    } else {
      that.data.array1.push({
        name: that.data.v_item,
        status: 1
      });
      //保存自定义标签
      that.data.aZdy.push(that.data.v_item);
      that.data.ts.push(that.data.v_item);

      that.setData({
        aZdy: that.data.aZdy,
        array1: that.data.array1,
        ts: that.data.ts,
        zdy: false
      });
      console.log(that.data.aZdy);

    }

  },
  enter: function(e) {
    var that = this;
    that.setData({
      v_item: e.detail.value
    });
  },
  // 删除自定义标签
  deleteItem: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.key;
    var name = that.data.array1[index].name;
    //删除特色
    for (var i in that.data.ts) {
      if (that.data.ts[i] == name) {
        that.data.ts.splice(i, 1);
      }
    }
    that.setData({
      ts: that.data.ts
    });
    console.log(that.data.ts)
    that.data.array1.splice(index, 1);
    that.setData({
      array1: that.data.array1
    });
  },




  onLoad: function(options) {
    var that = this;
    var aZdy = wx.getStorageSync('aZdy');
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
          if (datas.v_kindergarten_room_photo.length) {
            that.setData({
              array: datas.v_kindergarten_room_photo.split(";"),
            });
          } else {
            that.setData({
              array: [],
            });
          }
          that.setData({
            allInfo: datas
          });
          if (datas.v_kindergarten_feature) {
            that.setData({
              ts: datas.v_kindergarten_feature.split(";"),
            });
          }
          //临时保存的数组
          var ts_lins = that.data.ts;
          //查找位置
          console.log(that.data.ts)
          console.log(that.data.array1)
          var _new = [];
          for (var i in that.data.array1) {
            for (var j in that.data.ts) {
              if (that.data.ts[j] == that.data.array1[i].name) {
                that.data.array1[i].status = 1;
                that.setData({
                  ts: that.data.ts,
                  array1: that.data.array1
                });
                // 保存选择非自定义的
                _new.push(that.data.ts[j]);
              }
            }
          }
          console.log("-----------------------------")
          console.log(_new)
          console.log(that.data.ts)
          // 过滤自定义的
          for (var p in _new) {
            for (var m in ts_lins) {
              if (ts_lins[m] == _new[p]) {
                ts_lins.splice(m, 1);
              }
            }
          }
          console.log(ts_lins)
          // 改造数组
          var lins = [];
          for (var o in ts_lins) {
            lins.push({
              name: ts_lins[o],
              status: 1
            })
          }
          //合并自定义添加的标签
          that.setData({
            array1: that.data.array1.concat(lins)
          });
          console.log(that.data.array1)
        } else {
          console.log('查询幼儿园园所招生宣传页面信息失败');
        }
      }
    });
  },

  request: function(next) {
    var that = this;
    var v_kindergarten_feature = that.data.ts.join(';');
    var v_kindergarten_room_photo = that.data.array.join(';');
    wx.request({
      url: url + 'enrolLeader/saveEnrolKindergartenInfoTwo.do',
      data: {
        v_open_code: wx.getStorageSync('openid'), //微信唯一标识
        i_enrol_id: that.data.i_enrol_id, //招生ID
        v_kindergarten_feature: v_kindergarten_feature, //幼儿园特色
        v_kindergarten_room_photo: v_kindergarten_room_photo //教学环境照片
      },
      method: 'POST',
      header: {
        token: wx.getStorageSync('token') // 默认值
      },
      success: function(res) {
        if (res.data.rtnCode == 10000) {
          //保存自定义
          wx.setStorageSync('aZdy', that.data.aZdy);
          wx.showToast({
            title: '保存成功',
            duration: 500
          });
          if (next) {
            console.log('特色教育下一步')
            wx.navigateTo({
              url: '/pages/headmaster/enterStudent/enterStudent?i_enrol_id=' + that.data.i_enrol_id
            });
            console.log('特色教育下一步2')
          }
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
    that.request(true); //保存
  },
  //添加图片
  addImg: function() {
    var that = this;
    if (that.data.array.length == 9) {
      wx.showModal({
        title: '提示信息',
        content: "最多可以上传9张！",
        showCancel: false,
        confirmText: "确定",
        success: function(res) {}
      })
    } else {
      var url = getApp().globalData.url; //url+'
      wx.showActionSheet({
        itemList: ['拍照', '从手机相册选择'],
        success: function(e) {
          var source_type = ['album'];
          if (e.tapIndex == 0) {
            source_type = ['camera'];
          }
          wx.chooseImage({
            count: 9 - that.data.array.length, // 默认9
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: source_type, // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
              var tempFilePaths = res.tempFilePaths;
              if ((that.data.array.length + res.tempFilePaths.length) > 9) {
                wx.showModal({
                  title: '提示信息',
                  content: "最多可以上传9张！",
                  showCancel: false,
                  confirmText: "确定",
                  success: function(res) {}
                })
              }
              wx.showToast({
                title: '加载中...',
                icon: 'loading',
                duration: 2000
              });
              // 交给七牛上传
              that.setData({
                tempArray: res.tempFilePaths, //预上传列表
                iscontinues: true, //是否继续
                arrayIndex: 0
              });
              that.startupload();
            }
          })
        }
      })
    }
  },
  //开始上传图片
  startupload: function() {
    var that = this;
    var url = getApp().globalData.url; //url+'
    if (that.data.iscontinues == true) {
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      if (that.data.array.length != 9) {
        var i = that.data.arrayIndex;
        qiniuUploader.upload(that.data.tempArray[i], (res) => {
          if (that.data.array.length == 9) {
            that.setData({
              iscontinues: false //是否继续
            });
            if (wx.hideLoading) {
              wx.hideLoading();
            } else {
              // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
              wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
              });
            }
          } else {
            that.setData({
              'str.name': res.imageURL,
              'str.shoottime': new Date()
            });
            that.setData({
              array: that.data.array.concat(res.imageURL)
            });
            that.setData({
              photos: that.data.photos.concat(that.data.str)
            });
            that.setData({
              arrayIndex: that.data.arrayIndex + 1
            });
            if (that.data.arrayIndex > (that.data.tempArray.length - 1)) {
              that.setData({
                iscontinues: false //是否继续
              });

              if (wx.hideLoading) {
                wx.hideLoading();
              } else {
                // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
                wx.showModal({
                  title: '提示',
                  content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
                });
              }
            } else {
              that.startupload(); //继续上传
            }


          }
        }, (error) => {
          wx.showModal({
            title: '提示信息',
            content: JSON.stringify(error),
            showCancel: false,
            confirmText: "确定",
            success: function(res) {}
          })
          that.setData({
            arrayIndex: that.data.arrayIndex + 1
          });
          if (that.data.arrayIndex > (that.data.tempArray.length)) {
            that.setData({
              iscontinues: false //是否继续
            });

            if (wx.hideLoading) {
              wx.hideLoading();
            } else {
              wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
              });
            }
          } else {
            that.startupload(); //继续上传
          }
          console.error('error: ' + JSON.stringify(error));
        }, {
          region: 'ECN', // 区
          uptokenURL: url + "interface/dynamic/getUptoken.do",
          uptoken: wx.getStorageSync('uploadToken'),
          domain: wx.getStorageSync('baseUrl'),
          key: 'img_' + timestamp + that.data.arrayIndex
        });
      }
    }
  },
  //删除图片array，photos
  delete: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var images = that.data.array;
    images.splice(index, 1);

    that.setData({
      array: images,
      photos: images
    });
  },

  //预览图片
  previewImage: function(e) {
    var current = e.target.dataset.url;
    console.log('current=' + this.data.array)
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.array // 需要预览的图片http链接列表  
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