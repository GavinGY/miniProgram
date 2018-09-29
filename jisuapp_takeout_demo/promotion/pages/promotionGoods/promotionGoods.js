
var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data: {
    goodsArr: [],
    isHaveSecondCommission: false,
    currentType: 0
  },
  onLoad: function (options) {
    this.dataInitial()
  },
  dataInitial: function () {
    this.getCommissionGoodsList({page_size: 9})
  },
  getCommissionGoodsList:function(param){
    var that = this;
    app.sendRequest({
      url: '/index.php?r=AppDistribution/getCommissionGoodsList',
      data: param || '',
      success: function (res) {
        for(let i in res.data){
          res.data[i].first_commission = (+res.data[i].first_commission).toFixed(3);
          res.data[i].second_commission ? res.data[i].second_commission = (+res.data[i].second_commission).toFixed(3) : '';
        }
        that.setData({
          goodsArr: res.data,
          isHaveSecondCommission: res.data[0]&&res.data[0].second_commission ? true : false,
          totalPage: res.total_page,
          currentPage: res.current_page
        })
      }
    })
  },
  nextPage:function(){
    var that = this;
    if (that.data.currentPage >= that.data.totalPage) return;
    this.getCommissionGoodsList({
      page: that.data.currentPage + 1,
      goods_type: that.data.currentType,
      page_size: 9
    })
  },
  prevPage:function(){
    var that = this;
    if (that.data.currentPage <= 1)return;
    this.getCommissionGoodsList({
      page: that.data.currentPage - 1,
      goods_type: that.data.currentType,
      page_size: 9
    })
  },
  changeMenu:function(e){
    this.setData({
      currentType: e.currentTarget.dataset.type
    })
    this.getCommissionGoodsList({
      goods_type: e.currentTarget.dataset.type,
      page_size:9
    })
  }
})
