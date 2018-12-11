var url = getApp().globalData.url; //url+'
Page({

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
    v_stu_brithday: '', //学生生日
    v_stu_class: '', //就读班级

    allInfo: '', //
    i_enrol_id: '' //招生id
  },

  

  bindGetUserInfo: function (e) {
    var that = this;
    //此处授权得到userInfo
    console.log('此处授权得到userInfo');
    console.log(e.detail.userInfo);
    //接下来写业务代码
    wx.redirectTo({
      url: '/pages/patriarch/publicity/publicity',
    })
  },
  onLoad: function(options) {
    wx.showShareMenu({
      withShareTicket: true
    });
    wx.showLoading({
      title:"努力加载中"
    });
    var that = this;
    var i_enrol_id = options.i_enrol_id; //接收报名id
    var headmast = options.headmast ? options.headmast : '';
    var token = wx.getStorageSync('token');
    var openid = wx.getStorageSync('openid');

    console.log('当前人openid=' + wx.getStorageSync('openid'));
    console.log('当前人name=' + wx.getStorageSync('nickName'));
    console.log('当前人头像=' + wx.getStorageSync('avatarUrl'));
    

    //分享url带过来的参数
    var shareNickName = options.shareNickName ? options.shareNickName : '';
    var sharePhoto = options.sharePhoto ? options.sharePhoto : '';
    var shareOpenId = options.shareOpenId ? options.shareOpenId:'';

    // 分享出去后，别人打开时用
    console.log("shareNickName=" + shareNickName);
    console.log("sharePhoto=" + sharePhoto);
    console.log("shareOpenId=" + shareOpenId);

    that.setData({
      i_enrol_id,
      shareNickName,
      sharePhoto,
      shareOpenId
    });

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
    wx.request({
      url: url + 'enrolParent/selectPublicity.do',
      data: {
        openId: openid, //微信唯一标识
        enrolId: that.data.i_enrol_id //招生id
      },
      method: 'GET',
      header: {
        token: token // 默认值
      },
      success: function(res) {
        wx.hideLoading();
        console.log('宣传页所有信息...................')
        console.log(res.data)
        if (res.data.rtnCode == 10000) {
          if (res.data.rtnData.length) {
            var datas = res.data.rtnData[0];
            var form = datas.enrolParentFrom;
            var form2 = datas.enrulpublicityFrom;
            var v_class = datas.enrolObj;
            wx.setNavigationBarTitle({
              title: form2.v_sch_name
            });
            var aClass = [];
            for (var i in v_class) {
              aClass.push(v_class[i].v_sch_grade)
            }
            that.setData({
              allInfo: datas,
              // ts: form2.v_sch_feature.split(";"),
              jiaoyu: datas.pic_classroom.split(";"),
              qinzi: datas.pic_parents.split(";"),
              shipu: datas.pic_food.split(";"),
              shougong: datas.pic_handwork.split(";"),
              //创建班级数组供选择班级时使用
              v_sch_grade: aClass,
            });
            if (form){
              that.setData({
                //报名信息
                v_stu_name: form.v_stu_name, //学生
                i_stu_sex: form.i_stu_sex, //学生性别0:女 1:男
                v_stu_brithday: form.v_stu_brithday, //学生生日
                v_par_name: form.v_par_name, //家长姓名
                v_par_tel: form.v_par_tel, //家长电话
                v_par_address: form.v_par_address, //家庭住址
                v_par_relation: form.v_par_relation //家长身份
              })
            }
            if (form2){
              that.setData({
                form2: form2, //
                //报名成功页面要用
                v_sch_tel: form2.v_sch_tel, //招生电话
                v_sch_name: form2.v_sch_name, //幼儿园
              })
            }
          }
        } else {
          console.log('查询幼儿园园所招生宣传页面信息失败');
        }
      }
    });



    //招生宣传页浏览记录
    wx.request({
      url: url + 'enrolLeader/saveEnrolKindergartenViewInfo.do',
      data: {
        v_open_code: wx.getStorageSync('openid'),
        i_enrol_id: that.data.i_enrol_id //招生id
      },
      method: 'POST',
      header: {
        token: token // 默认值
      },
      success: function(res) {
        console.log('招生宣传页浏览记录')
        console.log(res.data)
        if (res.data.rtnCode == 10000) {}
      }
    });
    
   //查询分享次数
    that.selectShareNum();

    //打开招生宣传页时增加分享者的被查看次数
    // var name = wx.getStorageSync('nickName');
    // var url = wx.getStorageSync('avatarUrl');
    // var id = wx.getStorageSync('openid');
    wx.request({
      url: url + 'enrolParent/addApplyViews.do',
      data: {
        openId: openid, //微信唯一标识
        enrolID: that.data.i_enrol_id, //招生id
        shareOpenId: wx.getStorageSync('openid'), //分享人微信唯一标识
        shareNickName: wx.getStorageSync('nickName'), //分享人昵称
        sharePhoto: wx.getStorageSync('avatarUrl') //分享人头像
      },
      method: 'POST',
      header: {
        token: token // 默认值
      },
      success: function (res) {
        console.log('分享者的被查看次数')
        console.log(res.data)
        if (res.data.rtnCode == 10000) {

        }
      }
    });

  },

  //查询分享次数
  selectShareNum: function () {
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
      success: function (res) {

        console.log(res.data)
        if (res.data.rtnCode == 10000) {
          that.setData({
            selectShareNum: res.data.rtnData[0] //分享次数
          });
        }
      }
    });
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

  //报读年级
  bindPickerChange3: function(e) {
    this.setData({
      index3: e.detail.value,
      v_app_enrolGrade: this.data.v_sch_grade[e.detail.value]
    });
  },

  //家长身份
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value,
      v_par_relation: this.data.array[e.detail.value]
    });
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
  },

  //出生日期
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value,
      v_stu_brithday: e.detail.value
    });
  },
  //家长姓名
  parName: function(e) {
    this.setData({
      v_par_name: e.detail.value
    })
  },
  //家长电话
  parTel: function(e) {
    this.setData({
      v_par_tel: e.detail.value
    });
  },
  //学生姓名
  stuName: function(e) {
    this.setData({
      v_stu_name: e.detail.value
    });
  },

  // 我要报名
  iApply: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.formId);
    var formId = e.detail.formId;
    var that = this;
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!that.data.v_stu_name.length) {
      wx.showToast({
        title: '宝宝姓名不能为空',
        icon: 'none',
        duration: 1000
      });
      return;
    } else if (that.data.v_stu_name.length < 2) {
      wx.showToast({
        title: '宝宝姓名不能少于2个字',
        icon: 'none',
        duration: 1000
      });
      return;
    } else if (that.data.i_stu_sex != 0 && that.data.i_stu_sex != 1) {
      wx.showToast({
        title: '选择宝宝性别',
        icon: 'none',
        duration: 1000
      });
      return;
    } else if (!that.data.v_stu_brithday) {
      wx.showToast({
        title: '选择宝宝出生日期',
        icon: 'none',
        duration: 1000
      });
      return;
    } else if (!that.data.v_app_enrolGrade) {
      wx.showToast({
        title: '报读年级不能为空',
        icon: 'none',
        duration: 1000
      });
      return;
    } else if (!that.data.v_par_name.length) {
      wx.showToast({
        title: '家长姓名不能为空',
        icon: 'none',
        duration: 1000
      });
      return;
    } else if (that.data.v_par_name.length < 2) {
      wx.showToast({
        title: '家长姓名不能少于2个字',
        icon: 'none',
        duration: 1000
      });
      return;
    } else if (!that.data.v_par_relation) {
      wx.showToast({
        title: '请选择家长身份',
        icon: 'none',
        duration: 1000
      });
      return;
    } else if (!that.data.v_par_tel.length) {
      wx.showToast({
        title: '请输入联系电话',
        icon: 'none',
        duration: 1000
      });
      return;
    } else if (!myreg.test(that.data.v_par_tel) || that.data.v_par_tel.length != 11) {
      wx.showToast({
        title: '手机号格式有误',
        icon: 'none',
        duration: 1000
      });
      return;
    }

    var token = wx.getStorageSync('token');
    var openid = wx.getStorageSync('openid');
    wx.request({
      url: url + 'enrolParent/addApplyEnrol.do',
      data: {
        i_enrol_id: that.data.i_enrol_id, //招生id
        i_opp_id: openid, //微信唯一标识
        v_stu_name: that.data.v_stu_name, //学生姓名
        i_stu_sex: that.data.i_stu_sex, //学生性别0:女 1:男
        v_stu_brithday: that.data.v_stu_brithday, //学生生日
        v_app_enrolGrade: that.data.v_app_enrolGrade, //报名年级
        v_par_name: that.data.v_par_name, //家长姓名
        v_par_tel: that.data.v_par_tel, //家长电话
        v_par_address: that.data.v_par_address, //家庭住址
        v_par_relation: that.data.v_par_relation //家长身份
      },
      method: 'POST',
      header: {
        token: token // 默认值
      },
      success: function(res) {
        if (res.data.rtnCode == 10000) {
          var datas = res.data.rtnData[0];
          wx.showToast({
            title: '提交成功'
          })
          that.setData({
            baoming: datas
          });
          console.log("报名返回信息:")
          console.log(datas);
          console.log("宣传页招生id=" + datas.id);
       
          //推送(学生)
          wx.request({
            url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + datas.access_tocken,
            data: {
              "touser": wx.getStorageSync('openid'),
              "page": "pages/patriarch/applyDetals/applyDetals?id=" + datas.id,
              "template_id":"JdmChGiTYXjqMvW9wIQngyFp6NiXnP0ke6NNkymhPgg",
              "form_id": formId,
              "data": {
                "keyword1": {
                  "value": datas.v_stu_name
                },
                "keyword2": {
                  "value": datas.v_app_date
                },
                "keyword3": {
                  "value": datas.v_sch_name+"入校报名"
                },
                "keyword4": {
                  "value": "审核中"
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
          //推送(园长)
          wx.request({
            url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + datas.access_tocken,
            data: {
              "touser": wx.getStorageSync('openid'),
              "page": "pages/patriarch/applyDetals/applyDetals?id=" + datas.id,
              "template_id":"aclb5ktLPPamtMCSHLm02CMnI4jJjedMAOQnYEd7nCo",
              "form_id": formId,
              "data": {
                "keyword1": {
                  "value": datas.v_stu_name
                },
                "keyword2": {
                  "value": datas.v_app_date
                },
                "keyword3": {
                  "value": datas.v_sch_name+"入校报名"
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





          wx.navigateTo({
            url: '../submitSuccess/submitSuccess?v_sch_tel=' + that.data.v_sch_tel + "&v_sch_name=" + that.data.v_sch_name
          })

        } else {
          console.log('查询幼儿园园所招生宣传页面信息失败');
        }
      }
    });
  },

  more: function (e) {
    var desc = e.currentTarget.dataset.desc;
    wx.navigateTo({
      url: '/pages/headmaster/intro/intro?desc=' + desc
    });
  },

  //我要建园
  createGarden:function(){
    wx.navigateTo({
      url: '../my/my?create=true'
    })
  },

  //分享帮
  share: function() {
    var that = this;
    wx.navigateTo({
      url: '../shareRanking/shareRanking?enrolId=' + that.data.i_enrol_id + "&shareOpenId=" + that.data.shareOpenId 
    })
    console.log('that.data.id=' + that.data.i_enrol_id)
  },
  //我的
  my: function() {
    var that = this;
    wx.redirectTo({
      url: '../my/my?apply=1'
    })
  },
  //立即报名
  toApply: function() {
    var that=this;
      that.setData({
        toView: 'the-id'
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

  // //查询分享次数
  // selectShareNum: function () {
  //   var that = this;
  //   wx.request({
  //     url: url + 'enrolParent/selectShareNum.do',
  //     data: {
  //       enrolId: that.data.id //招生id
  //     },
  //     method: 'GET',
  //     header: {
  //       token: wx.getStorageSync('token') // 默认值
  //     },
  //     success: function (res) {

  //       console.log(res.data)
  //       if (res.data.rtnCode == 10000) {
  //         that.setData({
  //           selectShareNum: res.data.rtnData[0] //分享次数
  //         });
  //       }
  //     }
  //   });
  // },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //定位到我的报名
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        var height = res.windowHeight - 52;   //footerpannelheight为底部组件的高度
        that.setData({
          srollHeight: height
        });
      }
    })
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
  updateShareNum:function(){
    var that=this;
    wx.request({
      url: url + 'enrolParent/updateShareNum.do',
      data: {
        enrolId: that.data.i_enrol_id //招生id
      },
      method: 'GET',
      header: {
        token: wx.getStorageSync('token') // 默认值
      },
      success: function (res) {
        console.log('分享次数')
        console.log(res.data)
        if (res.data.rtnCode == 10000) {
          that.setData({
            updateShareNum: res.data.rtnData[0] //分享次数
          });
        }
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    var name = wx.getStorageSync('nickName');
    var url = wx.getStorageSync('avatarUrl');
    var id = wx.getStorageSync('openid');
    console.log('i_enrol_id='+that.data.i_enrol_id)
    console.log(name)
    
    return {
      title: "我是" + name + ",我是第" + that.data.selectShareNum + "位分享的人",
      path: "/pages/patriarch/publicity/publicity?i_enrol_id=" + that.data.i_enrol_id + "&shareOpenId=" + id + "&shareNickName=" + name + "&sharePhoto=" + url,

      success: function (res) {
        //分享次数+1并返回当前分享次数
        that.updateShareNum();
        console.log("已经转发了")
      }
    }
  }
})