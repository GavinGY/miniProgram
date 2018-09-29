
var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data: {
    userName: '',
    currentCommission: '',
    historyCommission: ''
  },
  onLoad: function (options) {
    this.dataInitial()

  },
  dataInitial: function () {
    this.getPromotionLevelInfo()
  },
  getPromotionLevelInfo:function(){
    var that = this;
    app.sendRequest({
      url: '/index.php?r=AppDistribution/getDistributionLevelInfo',
      data: {
        page: -1
      },
      success: function (res) {
        that.setData({
          userLevels: res.data,
          countThreshold: res.data ? res.data[res.data.length - 1].commission_to : ''
        })
      }
    })
  }
})
