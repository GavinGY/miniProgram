
var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data: {
    commissionArray: [],
  },
  onLoad: function (options) {
    this.dataInitial()
  },
  dataInitial: function () {
    this.getPromotionCommission()
  },
  getPromotionCommission:function(param){
    var that = this;
    app.sendRequest({
      url: '/index.php?r=AppDistribution/getCommissionHistory',
      data: param || '',
      success: function (res) {
        that.setData({
          commissionArray: res.data,
          totalPage: res.total_page,
          currentPage: res.current_page
        })
      }
    })
  },
  nextPage: function () {
    var that = this;
    if (that.data.currentPage >= that.data.totalPage) return;
    this.getPromotionCommission({
      page: that.data.currentPage + 1
    })
  },
  prevPage: function () {
    var that = this;
    if (that.data.currentPage <= 1) return;
    this.getPromotionCommission({
      page: that.data.currentPage - 1
    })
  }
})
