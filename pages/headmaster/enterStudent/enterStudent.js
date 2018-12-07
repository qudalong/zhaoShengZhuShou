var url = getApp().globalData.url;
Page({


  data: {
    v_enrol_num: 0,//招生人数
    enrolObjectList: [
      {
        i_enrol_id: 1,
        v_grade_name: '托班',
        v_age_range: '2-3岁',
        v_enrol_num: ''
      },
      {
        i_enrol_id: 2,
        v_grade_name: '小班',
        v_age_range: '3-4岁',
        v_enrol_num: ''
      },
      {
        i_enrol_id: 3,
        v_grade_name: '中班',
        v_age_range: '4-5岁',
        v_enrol_num: ''
      }, {
        i_enrol_id: 4,
        v_grade_name: '大班',
        v_age_range: '5-6岁',
        v_enrol_num: ''
      }, {
        i_enrol_id: 5,
        v_grade_name: '衔接班',
        v_age_range: '5-6岁',
        v_enrol_num: ''
      }
    ],//招生范围
    v_kindergarten_fee: '', //学费费用
    v_kindergarten_activity: ''//优惠活动
  },
  input: function (e) {
    var that=this;
    var dataset = e.target.dataset;
    var Index = dataset.index; //拿到是第几个数组
    that.data.enrolObjectList[Index].v_enrol_num = e.detail.value;
    that.setData({
      enrolObjectList: that.data.enrolObjectList
    });
  },
  ageRange:function(e){
    var that = this;
    var dataset = e.target.dataset;
    var Index = dataset.index; //拿到是第几个数组
    console.log(Index)
    that.data.enrolObjectList[Index].v_age_range = e.detail.value;
    that.setData({
      enrolObjectList: that.data.enrolObjectList
    });
  },
  gradeName:function(e){
    var that = this;
    var dataset = e.target.dataset;
    var Index = dataset.index; //拿到是第几个数组
    that.data.enrolObjectList[Index].v_grade_name = e.detail.value;
    that.setData({
      enrolObjectList: that.data.enrolObjectList
    });
  },
  //自定义
  definition:function(){
    var that=this;
    that.data.enrolObjectList.push({
      i_enrol_id: '',
      v_grade_name: '',
      v_age_range: '',
      v_enrol_num: ''
    });
    that.setData({
      enrolObjectList: that.data.enrolObjectList
    });
  },
  // 学校费用
  fee: function (e) {
    this.setData({
      v_kindergarten_fee: e.detail.value
    });
  },
  //优惠活动
  activity: function (e) {
    this.setData({
      v_kindergarten_activity: e.detail.value
    });
  },



  onLoad: function (options) {
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
        token: token// 默认值
      },
      success: function (res) {
        console.log(res.data.rtnData[0])
        if (res.data.rtnCode == 10000) {
          var datas = res.data.rtnData[0];
          var enrolObjectList=[];
          if (datas.enrolObjectList.length){
            enrolObjectList = datas.enrolObjectList
            console.log("有enrolObjectList")
          }else{
            enrolObjectList = that.data.enrolObjectList
            console.log("没enrolObjectList")
          }
          that.setData({
            allInfo: datas,
            enrolObjectList: enrolObjectList,//开始没有时，用本地的
            v_kindergarten_fee: datas.v_kindergarten_fee, //
            v_kindergarten_activity: datas.v_kindergarten_activity //
          });
        } else {
          console.log('查询幼儿园园所招生宣传页面信息失败');
        }
      }
    });
  },

  request:function(){
    var that = this;
    var aFiler=[];
    // console.log(that.data.enrolObjectList)
    // 过滤年级范围
    for (var i in that.data.enrolObjectList){
      if (that.data.enrolObjectList[i].v_grade_name && that.data.enrolObjectList[i].v_age_range && that.data.enrolObjectList[i].v_enrol_num){
        aFiler.push(that.data.enrolObjectList[i]);
      }
    }
    console.log(aFiler);
    wx.request({
      url: url + 'enrolLeader/saveEnrolKindergartenInfoThr.do',
      data: {
        i_enrol_id: that.data.i_enrol_id,//
        v_open_code: wx.getStorageSync('openid'), //微信唯一标识
        enrolObjectList: aFiler,//招生范围
        v_kindergarten_fee: that.data.v_kindergarten_fee, //学费费用
        v_kindergarten_activity: that.data.v_kindergarten_activity, //优惠活动
      },
      method: 'POST',
      header: {
        token: wx.getStorageSync('token') // 默认值
      },
      success: function (res) {
        if (res.data.rtnCode == 10000) {
          wx.showToast({
            title: '保存成功',
            duration: 500
          });
        } else {
          console.log('幼儿园信息保存失败')
        }
      }
    });
  },


  //保存
  save: function () {
    var that = this;
    that.request();
  },
  //下一步
  next: function () {
    var that = this;
    wx.navigateTo({
      url: '/pages/headmaster/introduction/introduction?i_enrol_id=' + that.data.i_enrol_id
    });
    that.request();
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