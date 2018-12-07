var app = getApp()
Page({
  data: {
    tempFilePaths: ''
  },
  onLoad: function () {
  },
  chooseimage: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        that.setData({
          tempFilePaths: res.tempFilePaths
        })
      }
    });
  }
})  












// const qiniuUploader = require("../../../utils/qiniuUploader");
// var sourceType = [['camera'], ['album'], ['camera', 'album']];
// var sizeType = [['compressed'], ['original'], ['compressed', 'original']];
// var imageArray = [];// 点击事件，从本地相册选择图片或使用相机拍照。

// Page({

//   /**
//    * 页面的初始数据
//    */
//   data: {

//   },

//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function (options) {

//   },


//   chooseImage: function (e) {
//     var that = this;
//     wx.chooseImage({
//       sourceType: [['camera'], ['album'], ['camera', 'album']],
//       sizeType: [['compressed'], ['original'], ['compressed', 'original']],
//       count: 1,//这个count可以用来删除当前图片
//       success: function (res) {
//         // 返回照片的本地文件路径，tempFilePath可以作为img标签的src属性显示图片vartempFilePaths = res.tempFilePaths;
//         var tempFilePaths = res.tempFilePaths;
//         console.log(tempFilePaths)
//         imageArray.push(tempFilePaths);
//         that.setData({
//           imageList: tempFilePaths
//         })
//         that.pictureUploadqiniuMethod(imageArray, "tupian_");
//       },
//     })

//   },
//   //得到图片路径数组后，准备上传七牛

//   pictureUploadqiniuMethod: function (imageArray, fileHead) {

//     var that = this;

//     for (var i = 0; i < imageArray.length; i++) {

//       var filePath = imageArray[i].toString();
//       console.log(filePath)
//       　　var imgName = filePath.substr(30,50);
//         console.log(imgName)

//         qiniuUploader.upload(filePath, (res) => {

//         　　//上传成功，上传成功一张图片，进入一次这个方法，也就是返回一次

//         console.log(1)
//         console.log(res)

//       },

//         (error) => {

//           //图片上传失败，可以在七牛的js里面自己加了一个err错误的返回值console.log('error: '+ error)

//         },

//         {

//           　　domain: 'oqxfq54dn.bkt.clouddn.com',

//           uptokenURL: 'https://get.qiniutoken.com/minibx/geo_f/gain_qn_token',

//           　　uploadURL: 'https://up.qbox.me',//华东key: fileHead + imgName,// 自定义文件 keyregion:'ECN',

//         });

//     }

//   },
//   onReady: function () {

//   },

//   /**
//    * 生命周期函数--监听页面显示
//    */
//   onShow: function () {

//   },

//   /**
//    * 生命周期函数--监听页面隐藏
//    */
//   onHide: function () {

//   },

//   /**
//    * 生命周期函数--监听页面卸载
//    */
//   onUnload: function () {

//   },

//   /**
//    * 页面相关事件处理函数--监听用户下拉动作
//    */
//   onPullDownRefresh: function () {

//   },

//   /**
//    * 页面上拉触底事件的处理函数
//    */
//   onReachBottom: function () {

//   },

//   /**
//    * 用户点击右上角分享
//    */
//   onShareAppMessage: function () {

//   }
// })