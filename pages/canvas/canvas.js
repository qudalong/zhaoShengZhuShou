var utils = require("../../utils/util");
var QRCode = require('../../utils/weapp-qrcode.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    //  画图
    const ctx = wx.createCanvasContext('myCanvas');
    //在canvas绘制前填充白色背景（解决黑背景问题）  
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, 300, 500);

    ctx.drawImage('../../image/card_bg.png', 0, 0, 300, 125)
    ctx.drawImage('../../image/code.jpg', 70, 200, 160, 125)
    ctx.stroke();
    ctx.draw();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  save: function() {
    const wxCanvasToTempFilePath = utils.promisify(wx.canvasToTempFilePath)
    const wxSaveImageToPhotosAlbum = utils.promisify(wx.saveImageToPhotosAlbum)
    wxCanvasToTempFilePath({
      canvasId: 'myCanvas'
    }, this).then(res => {
      return wxSaveImageToPhotosAlbum({
        filePath: res.tempFilePath
      })
    }).then(res => {
      wx.showToast({
        title: '已保存到相册'
      })
    })


  },
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
  onShareAppMessage: function() {

  }
})