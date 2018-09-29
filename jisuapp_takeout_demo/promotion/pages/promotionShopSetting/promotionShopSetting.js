
var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data: {
    userInfo: {},
    hasShopCover:'',
    shopIntroduce: '',
    shopName:'',
  },
  onLoad: function (options) {
    this.setData({
      userInfo: app.getUserInfo()
    })
    this.dataInitial()
  },
  dataInitial: function () {
    this.getDistributorInfo();
  },
  uploadImage:function(){
    var that = this;
    app.chooseImage(function (image) {
      that.setData({
        hasShopCover:image[0]
      });
    })
  },
  submitInfo:function(){
    var that = this;
    if (that.data.shopName == ''){
      app.showModal({
        content: '店铺名称不能空'
      })
      return;
    }
    app.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppDistribution/setDistributorShopInfo',
      data: {
        shop_name: that.data.shopName,
        shop_description: that.data.shopIntroduce,
        shop_img: that.data.hasShopCover
      },
      success: function (res) {
        app.showModal({
          content:'保存成功',
          confirm:function(){
            app.turnBack();
          }
        })
      }
    })
  },
  inputShopName:function(e){
    this.data.shopName = e.detail.value
  },
  inputShopIntroduce:function(e){
    this.data.shopIntroduce = e.detail.value
  },
  getDistributorInfo: function () {
    var that = this;
    app.sendRequest({
      url: '/index.php?r=AppDistribution/getDistributorInfo',
      success: function (res) {
        that.setData({
          shopIntroduce: res.data.shop_description,
          hasShopCover: res.data.shop_img || that.data.userInfo.cover_thumb,
          shopName: res.data.shop_name || that.data.userInfo.nickname,
        })
      }
    })
  }
})
