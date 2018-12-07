var url = getApp().globalData.url;
var qiniuUploader = require("../../../utils/qiniuUploader");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [], //列表
    array2: [], //列表
    array3: [], //列表
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


    v_kindergarten_info: '',
    v_kindergarten_familyday_photo: '',
    v_kindergarten_recipe_photo: '',
    v_kindergarten_handwork_photo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var enrol_id = options.i_enrol_id;
    that.setData({
      i_enrol_id: enrol_id
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
          if (datas.v_kindergarten_familyday_photo.length) {
            that.setData({
              array: datas.v_kindergarten_familyday_photo.split(";"),
            });
          } else {
            that.setData({
              array: [],
            });
          }
          if (datas.v_kindergarten_recipe_photo.length) {
            that.setData({
              array2: datas.v_kindergarten_recipe_photo.split(";"),
            });
          } else {
            that.setData({
              array2: [],
            });
          }
          if (datas.v_kindergarten_handwork_photo.length) {
            that.setData({
              array3: datas.v_kindergarten_handwork_photo.split(";"),
            });
          } else {
            that.setData({
              array3: [],
            });
          }
          that.setData({
            allInfo: datas,
            v_kindergarten_info: datas.v_kindergarten_info, //
            // array: datas.v_kindergarten_familyday_photo.split(";"), //
            // array2: datas.v_kindergarten_recipe_photo.split(";"), //
            // array3: datas.v_kindergarten_handwork_photo.split(";") //
          });
          console.log(that.data.array3)
        } else {
          console.log('查询幼儿园园所招生宣传页面信息失败');
        }
      }
    });
  },
  //幼儿园信息
  fee: function(e) {
    this.setData({
      v_kindergarten_info: e.detail.value
    });
  },
  request: function() {
    var that = this;
    // var v_kindergarten_familyday_photo;
    // if (that.data.array.length==1){
    //    v_kindergarten_familyday_photo = that.data.array.join(';');
    // }else{
    // }
    var v_kindergarten_familyday_photo = that.data.array.join(';');
    var v_kindergarten_recipe_photo = that.data.array2.join(';');
    var v_kindergarten_handwork_photo = that.data.array3.join(';');
    wx.request({
      url: url + 'enrolLeader/saveEnrolKindergartenInfoFou.do',
      data: {
        v_open_code: wx.getStorageSync('openid'), //微信唯一标识
        i_enrol_id: that.data.i_enrol_id, //招生ID
        v_kindergarten_info: that.data.v_kindergarten_info, //幼儿园介绍
        v_kindergarten_familyday_photo: v_kindergarten_familyday_photo, //亲子活动图片,多张用;隔开
        v_kindergarten_recipe_photo: v_kindergarten_recipe_photo, //每日食谱图片,多张用;隔开
        v_kindergarten_handwork_photo: v_kindergarten_handwork_photo //手工作品图片,多张用;隔开
      },
      method: 'POST',
      header: {
        token: wx.getStorageSync('token') // 默认值
      },
      success: function(res) {
        if (res.data.rtnCode == 10000) {
          wx.showToast({
            title: '保存成功',
            duration: 500
          });
        } else {
          console.log('幼儿园信息保存失败');
        }
      }
    });
  },

  //添加学校后调用此接口生成二维码保存到后台 用于pc端招生学校列表显示
  getCode: function() {
    var that = this;
    wx.request({
      url: url + 'enrolParent/addXcxCode.do',
      data: {
        // token: wx.getStorageSync('access_token'), //当前access_token
        // token: wx.getStorageSync('token'), //当前access_token
        id: that.data.i_enrol_id, //学校enrolid
        // urlMain: "/pages/patriarch/publicity/publicity?id=" + that.data.i_enrol_id //幼儿园介绍
        // urlMain: "pages/patriarch/publicity/publicity?id=" + that.data.i_enrol_id //幼儿园介绍
        // urlMain: "pages/patriarch/publicity/publicity" //幼儿园介绍
        urlMain: "pages/patriarch/publicity/publicity" //幼儿园介绍
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },

      // header: {
      //   token: wx.getStorageSync('token') // 默认值
      // },
      success: function(res) {
        console.log('用于pc端招生学校列表显示')
        console.log(res)
        if (res.data.rtnCode == 10000) {
        } else {}
      }
    });
  },

  // 保存
  save: function() {
    var that = this;
    that.request();
    //添加学校后调用此接口生成二维码保存到后台 用于pc端招生学校列表显示
    that.getCode();
  },

  //下一步
  next: function() {
    var that = this;
    that.request();
    // wx.navigateBack({
    //   delta:5
    // });
    wx.reLaunch({
      url: '/pages/patriarch/my/my'
    });
    //添加学校后调用此接口生成二维码保存到后台 用于pc端招生学校列表显示
    that.getCode();
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
  //添加图片
  addImg2: function() {
    var that = this;
    if (that.data.array2.length == 9) {
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
            count: 9-that.data.array2.length, // 默认9
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: source_type, // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
              var tempFilePaths = res.tempFilePaths;
              if ((that.data.array2.length + res.tempFilePaths.length) > 9) {
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
              that.startupload2();
            }
          })
        }
      })
    }
  },
  //开始上传图片
  startupload2: function() {
    var that = this;
    var url = getApp().globalData.url; //url+'
    if (that.data.iscontinues == true) {
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      if (that.data.array2.length != 9) {
        var i = that.data.arrayIndex;
        qiniuUploader.upload(that.data.tempArray[i], (res) => {
          if (that.data.array2.length == 9) {
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
              array2: that.data.array2.concat(res.imageURL)
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
              that.startupload2(); //继续上传
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
            that.startupload2(); //继续上传
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
  delete2: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var images = that.data.array2;
    images.splice(index, 1);

    that.setData({
      array2: images,
      photos: images
    });
  },

  //预览图片
  previewImage2: function(e) {
    var current2 = e.target.dataset.url;
    console.log('current=' + this.data.array2)
    wx.previewImage({
      current2: current2, // 当前显示图片的http链接  
      urls: this.data.array2 // 需要预览的图片http链接列表  
    })
  },
  //添加图片
  addImg3: function() {
    var that = this;
    if (that.data.array3.length == 9) {
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
            count: 9 - that.data.array3.length, // 默认9
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: source_type, // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
              var tempFilePaths = res.tempFilePaths;
              if ((that.data.array3.length + res.tempFilePaths.length) > 9) {
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
              that.startupload3();
            }
          })
        }
      })
    }
  },
  //开始上传图片
  startupload3: function() {
    var that = this;
    var url = getApp().globalData.url; //url+'
    if (that.data.iscontinues == true) {
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      if (that.data.array3.length != 9) {
        var i = that.data.arrayIndex;
        qiniuUploader.upload(that.data.tempArray[i], (res) => {
          if (that.data.array3.length == 9) {
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
              array3: that.data.array3.concat(res.imageURL)
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
              that.startupload3(); //继续上传
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
            that.startupload3(); //继续上传
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
  delete3: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var images = that.data.array3;
    images.splice(index, 1);

    that.setData({
      array3: images,
      photos: images
    });
  },

  //预览图片
  previewImage3: function(e) {
    var current3 = e.target.dataset.url;
    console.log('current=' + this.data.array3)
    wx.previewImage({
      current3: current3, // 当前显示图片的http链接  
      urls: this.data.array3 // 需要预览的图片http链接列表  
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