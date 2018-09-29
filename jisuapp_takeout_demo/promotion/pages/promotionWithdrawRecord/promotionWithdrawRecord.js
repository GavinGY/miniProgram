
var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data: {
    statusArray: [{statusName:'全部'}, {statusName:'申请中'}, {statusName:'申请通过'}, {statusName:'拒绝'}],
    hideStatusList: true,
    selectStatus: -1,
    withdrawArr: [],
    hidefaildialog:true,
    hidesuccessDialog:true,
    hideFeedbackDialog: true,
    failReason: '',
    singleRecord: {},
    feedbackText: ''
  },
  onLoad: function (options) {
    this.dataInitial();
  },
  dataInitial: function () {
    this.getWithdrawRecord({
      status: -1
    });
  },
  toggleStatusList: function(){
    this.setData({
      hideStatusList: !this.data.hideStatusList
    })
  },
  previewImage: function (e) {
    let img = [];
    img.push(e.target.dataset.img)
    wx.previewImage({
      urls: img
    })
  },
  clickStatus: function(e){
    var index = e.currentTarget.dataset.index;
    this.setData({
      hideStatusList: true,
      selectStatus: index
    })
    this.getWithdrawRecord({
      status: index
    });
  },
  getWithdrawRecord: function(param){
    var that = this;
    let withdrawArr = {};
    app.sendRequest({
      url: '/index.php?r=AppDistribution/getWithdrawList',
      data: param || '',
      success: function (res) {
        for(let i in res.data){
          res.data[i].create_time = res.data[i].create_time.replace(/-/g, '.').slice(0,16);
        }
        that.setData({
          withdrawArr: res.data,
          totalPage: res.total_page,
          currentPage: res.current_page
        })
      }
    })
  },
  nextPage: function () {
    var that = this;
    if (that.data.currentPage >= that.data.totalPage) return;
    this.getWithdrawRecord({
      page: that.data.currentPage + 1,
      status: this.data.selectStatus
    })
  },
  prevPage: function () {
    var that = this;
    if (that.data.currentPage <= 1) return;
    this.getWithdrawRecord({
      page: that.data.currentPage - 1,
      status: this.data.selectStatus
    })
  },
  singleDetail:function(e){
    let i = 0, singleInfo = e.currentTarget.dataset.info
    if (singleInfo.feedback instanceof Object){
      for (let j in singleInfo.feedback ){
        i++
      }
    }else{
      singleInfo.feedback = ''
    }
    singleInfo.feedbackLength = i;
    if (singleInfo.status == '申请失败'){
      this.setData({
        singleRecord: e.currentTarget.dataset.info,
        hidefaildialog: false
      })
    }
    if (singleInfo.status == '转账成功'){
      this.setData({
        singleRecord: e.currentTarget.dataset.info,
        hidesuccessDialog: false
      })
    }
  },
  hideFailDialog:function(){
    this.setData({
      hidefaildialog: true
    })
  },
  hidesuccessDialog:function(){
    this.setData({
      hidesuccessDialog: true
    })
  },
  hideFeedbackDialog:function(){
    this.setData({
      hideFeedbackDialog:true,
      hidesuccessDialog:  false
    })
  },
  showFeedbackDialog:function(){
    this.setData({
      hideFeedbackDialog: false,
      hidesuccessDialog: true
    })
  },
  stopPropagation:function(){},
  feedback:function(){
    let that = this;
    app.sendRequest({
      url: '/index.php?r=AppDistribution/updateWithdrawFeedback',
      data: {
        withdraw_history_id: that.data.singleRecord.id,
        feedback: that.data.feedbackText
      },
      success: function (res) {
        that.setData({
          hideFeedbackDialog: true,
          hidesuccessDialog: true
        })
      }
    })
  },
  feedbackText:function(e){
    this.setData({
      feedbackText : e.detail.value
    })
  }
})
