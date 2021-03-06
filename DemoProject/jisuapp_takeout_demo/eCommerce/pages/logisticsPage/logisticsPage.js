
var app = getApp()

Page({
  data: {
    info: {},
    logistics: []
  },
  orderId: '',
  applyId: '',
  franchiseeId: '',
  onLoad: function(options){
    let form = options.form;
    this.orderId = options.detail;
    this.applyId = options.applyId;
    this.franchiseeId = options.franchiseeId || '';
    if (form == 'afterSale'){
      this.getRefundExpress();
    }else{
      this.getExpressFlow();
    }
  },
  getExpressFlow: function(){
    let _this = this;
    app.sendRequest({
      url: '/index.php?r=AppShop/expressFlow',
      data: {
        order_id: _this.orderId
      },
      success: function (res) {
        _this.setData({
          info: res.data,
          logistics: res.data.Traces.reverse()
        })
      }
    })
  },
  getRefundExpress: function(){
    let _this = this;
    app.sendRequest({
      url: '/index.php?r=appShop/getRefundExpress',
      data: {
        apply_id: _this.applyId,
        sub_shop_app_id: _this.franchiseeId
      },
      success: function (res) {
        _this.setData({
          info: res.data,
          logistics: res.data.Traces.reverse()
        })
      }
    })
  }
})
