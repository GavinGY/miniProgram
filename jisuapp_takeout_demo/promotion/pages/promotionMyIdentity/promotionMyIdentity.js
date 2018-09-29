
var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data: {
    identity: ''
  },
  onLoad: function (options) {
    this.dataInitial()
  },
  dataInitial: function () {
    this.getDistributorInfo()
  },
  goToLeaderPromotion: function(){
    app.turnToPage('/promotion/pages/promotionLeaderPromotion/promotionLeaderPromotion');
  },
  getDistributorInfo:function(){
    var that = this;
    app.sendRequest({
      url: '/index.php?r=AppDistribution/getDistributorInfo',
      success: function (res) {
        that.setData({
          identity: res.data.role
        })
      }
    })
  }
})
