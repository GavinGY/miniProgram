
var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data: {
    personArr: []
  },
  onLoad: function (options) {
    this.dataInitial()
  },
  dataInitial: function () {
    this.getMyTeamMembersInfo()
  },
  getMyTeamMembersInfo:function(param){
    var that = this;
    app.sendRequest({
      url: '/index.php?r=AppDistribution/getMyTeamMembersInfo',
      data: param || '',
      success: function (res) {
        that.setData({
          personArr: res.data,
          totalPage: res.total_page,
          currentPage: res.current_page
        })
      }
    })
  },
  nextPage: function () {
    var that = this;
    if (that.data.currentPage >= that.data.totalPage) return;
    this.getMyTeamMembersInfo({
      page: that.data.currentPage + 1
    })
  },
  prevPage: function () {
    var that = this;
    if (that.data.currentPage <= 1) return;
    this.getMyTeamMembersInfo({
      page: that.data.currentPage - 1
    })
  },
})
