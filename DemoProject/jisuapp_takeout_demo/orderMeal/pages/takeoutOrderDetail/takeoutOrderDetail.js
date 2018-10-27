
var app = getApp()

Page({
  data: {
    orderData: {},
    orderInfo: {},
    orderStatus: { '0':'待付款', '1':'待发货', '2':'待收货', '3':'待评价', '4':'退款审核中', '5':'退款中', '6':'已完成', '7':'已关闭'},
    orderStatusText: [
      { name: '等待付款', orderName: '订单待付款', },
      { name: '待配送', orderName: '订单待配送', },
      { name: '配送中', orderName: '订单配送中', },
      { name: '等待评价', orderName: '订单待评价', },
      { name: '退款审核中', orderName: '订单退款审核中', },
      { name: '退款中', orderName: '订单退款中', },
      { name: '已完成', orderName: '订单已完成', },
      { name: '已关闭', orderName: '订单已取消', },
      { name: '等待商家接单', orderName: '订单待接单', }
    ],
    transportStatus: {
      1: '待骑手接单',
      2: '待骑手取货',
      3: '骑手配送中',
      4: '骑手配送已完成',
      5: '已取消',
      7: '已过期',
      8: '指派单',
      9: '妥投异常之物品返回中',
      10: '妥投异常之物品返回完成',
      1000: '系统故障订单发布失败'
    },
    selectAddressId: '',
    goodsAdditionalInfo: {},
    hasAdditionalInfo: false,
    customFields: [],
    orderId: '',
    isFromTemplateMsg: false,
    originalPrice: '',
    useBalance: '',
    freightAdress:{},
    express_fee:'',
    discount_cut_price: '',
    isFromBack: false,
    marker: [{
      latitude: 0,
      longitude: 0,
      iconPath: '/images/transport.png',
      width: 75,
      height: 75
    }],
  },
  onLoad: function (options) {
    this.setData({
      orderId: options.detail,
      isFromTemplateMsg: options.from === 'template_msg' ? true : false,
      franchiseeId: options.franchisee || ''
    })
    this.dataInitial();
  },
  onShow:function(){
    if (this.data.isFromBack){
      this.dataInitial();
    }else{
      this.setData({
        isFromBack: true
      });
    }
  },
  mapDetail:function(e){
    let dataset = e.currentTarget.dataset,
        marker = [{
          latitude: dataset.lat,
          longitude: dataset.lng,
          iconPath: '/images/transport.png',
          width: 75,
          height: 75
        }]
    app.turnToPage("/default/pages/mapDetail/mapDetail?eventParams=" + JSON.stringify(marker))
  },
  canvas: function(acceptTime, needTime){
    let nowTime = new Date().getTime(),
        winWidth = wx.getSystemInfoSync().windowWidth / 750,
        ctx = wx.createCanvasContext('canvasArcCir'),
        x = 80 * winWidth,
        y = 80 * winWidth,
        radius = 65 * winWidth,
        // 使用线性渐变
        gradient = ctx.createLinearGradient(0, 0 * winWidth, 0, 160 * winWidth),
        angle = (((nowTime / 1000 - acceptTime) / 60 / needTime) * 2 - 0.5) * Math.PI;
    this.setData({
      isOverTime: ((nowTime / 1000 - acceptTime) / 60 / needTime) > 1 ? true : false ,
    })
    
    gradient.addColorStop("0", "#FF5900");
    gradient.addColorStop("0.5", "#FFA156");
    gradient.addColorStop("1", "#FF8838");
    // 画圆角进度圆环
    
    if (acceptTime) {
      ctx.draw();
      ctx.setTextAlign('center');
      ctx.setTextBaseline('bottom')
      ctx.setFontSize(36 * winWidth)
      ctx.fillText(this.returnDeliveryTime(acceptTime, needTime), x, (90 * winWidth) )
      ctx.setTextBaseline('top')
      ctx.setFontSize(21 * winWidth)
      ctx.setFillStyle('#a3a3a3')
      ctx.fillText('预计送达', x, (90 * winWidth))
    }else{
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, 55 * winWidth, 0, 2 * Math.PI);
      ctx.clip()
      ctx.drawImage('http://img.weiye.me/tmp_file/df5be6203a516ea94b792b357551fbe81.png', 15 * winWidth, 15 * winWidth, 130 * winWidth, 130 * winWidth)
      ctx.restore()
      
    }
    ctx.setLineWidth(12*winWidth);
    ctx.setStrokeStyle(gradient);
    ctx.setLineCap('round');
    ctx.beginPath();
    ctx.arc(x, y, radius, 1.5 * Math.PI, angle, true);
    ctx.stroke();
    ctx.draw();
  },
  //砸金蛋
  getGoldenData: function (id) {
    let that = this;
    app.sendRequest({
      url: "/index.php?r=appLotteryActivity/getTimeAfterConsume",
      method: "post",
      data: {
        order_id: id,
        sub_app_id: that.data.franchiseeId
      },
      success: function (data) {
        if (data.integral) {//支付获取积分
          that.setData({
            'rewardPointObj': {
              showModal: true,
              count: data.integral,
              callback: ''
            }
          })
        }
      }
    })
  },
  makePhoneCall:function(e){
    var phone = e.currentTarget.dataset.phone;
    app.makePhoneCall(phone);
  },
  // 每个页面数据初始化函数 dataInitial
  dataInitial: function () {
    this.getOrderDetail(this.data.orderId);
    this.initialAddressId();
  },
  turnToOrderTracking: function(){
    app.turnToPage('/orderMeal/pages/orderTracking/orderTracking?orderId=' + this.data.orderId)
  },
  // 达达订单状态查询
  getOrderStatus: function (orderId){
    let that = this;
    app.sendRequest({
      url: '/index.php?r=AppTransport/queryTransporterInfo',
      data: {
        order_id: orderId,
      },
      success: function (res) {
        let newdata = {};
        newdata['marker[0].latitude'] = res.data.transporterLat;
        newdata['marker[0].longitude'] = res.data.transporterLng;
        newdata['transporterInfo'] = res.data;
        // res.data.statusCode 订单状态(待接单＝1 待取货＝2 配送中＝3 已完成＝4 已取消＝5 已过期＝7 指派单=8 妥投异常之物品返回中=9 妥投异常之物品返回完成=10 系统故障订单发布失败=1000 可参考文末的状态说明）
        that.setData(newdata)
      }
    })
  },
  getOrderDetail: function (orderId) {
    var that = this;
    app.getOrderDetail({
      data: {
        order_id: orderId,
        sub_shop_app_id: this.data.franchiseeId
      },
      success: function (res) {
        var data = res.data[0],
            form_data = data.form_data,
            hasAdditionalInfo = false,
            additional_info_goods = [],
            additional_goodsid_arr = [],
            address_id = '';
          if (form_data.status!=0){
              that.getGoldenData(orderId);
              if (form_data.status == 2 && form_data.take_out_info.deliver_type != 0 && form_data.take_out_info.deliver_type != '' && (form_data.take_out_transport_order.status == 2 || form_data.take_out_transport_order.status == 3)) {
                that.getOrderStatus(that.data.orderId);
              }
          } 
          
        for (var i = 0; i < form_data.goods_info.length; i++) {
          var deliveryId = form_data.goods_info[i].delivery_id,
              goodsId = form_data.goods_info[i].id;

          if (deliveryId && deliveryId != '0' && additional_goodsid_arr.indexOf(goodsId) == -1) {
            additional_info_goods.push(form_data.goods_info[i]);
            additional_goodsid_arr.push(goodsId);
            hasAdditionalInfo = true;
          }
        }
        let estimateTime;
        if (data.form_data.take_out_info.accept_time){
          estimateTime = that.returnDeliveryTime(+data.form_data.take_out_info.accept_time, data.take_out_info.deliver_time);
        }
        that.setData({
          orderData: data,
          orderInfo: form_data,
          estimateTime: estimateTime || '',
          hasAdditionalInfo: hasAdditionalInfo,
          discount_cut_price: form_data.discount_cut_price,
          useBalance: form_data['use_balance'],
          express_fee: res.data[0]['express_fee']
        });
        app.setPreviewGoodsInfo(additional_info_goods);

        that.canvas(data.form_data.take_out_info.accept_time, +data.take_out_info.deliver_time)
        if(form_data.is_self_delivery == 1){
        // 自提
          that.getFreigtAdress();
        } else {
        // 快递
          address_id = form_data.address_info.address_id;
          that.setData({
            selectAddressId: address_id,
          })
        }

        app.setGoodsAdditionalInfo(form_data.additional_info || {});
      }
    })
  },
  returnDeliveryTime: function (accept_time, deliver_time){
    let time = accept_time * 1000 + deliver_time * 60000,
        HM = (new Date(time).toISOString().split('T')[0] + ' ' + new Date(time).toTimeString().split(' ')[0]).split(' ')[1];
        console.log(HM)
    HM = HM.split(':')[0] + ':' +HM.split(':')[1]
    return HM
  },
  makeComment:function(e){
    var orderId = this.data.orderId,
        franchiseeId = this.data.franchiseeId,
        queryStr = franchiseeId === app.getAppId() ? '' : '&franchisee=' + franchiseeId;
    app.turnToPage('/orderMeal/pages/takeoutMakeComment/takeoutMakeComment?detail=' + orderId + queryStr);
  },
  orderDelete: function (e) {
    var orderId = this.data.orderId,
    that = this,
      franchiseeId = this.data.franchiseeId;
    app.showModal({
      content: '订单删除后不可找回，确认删除？',
      showCancel: true,
      cancelText: '取消',
      confirmText: '确定',
      confirm: function () {
        app.sendRequest({
          url: '/index.php?r=AppShop/HideOrder',
          data: {
            order_id: orderId,
            sub_shop_app_id: franchiseeId
          },
          success: function (res) {
            app.turnBack()
          }
        })
      }
    })
  },
  cancelOrder: function (e) {
    var orderId = this.data.orderInfo.order_id,
        that = this;

    app.showModal({
      content: '是否取消订单？',
      showCancel: true,
      confirmText: '是',
      cancelText: '否',
      confirm: function () {
        app.sendRequest({
          url: '/index.php?r=AppShop/cancelOrder',
          data: {
            order_id: orderId,
            sub_shop_app_id: that.data.franchiseeId
          },
          success: function (res) {
            var data = {};

            data['orderInfo.status'] = 7;
            that.setData(data);
          }
        })
      }
    })
  },
  payOrder: function (e) {
    var address_info = this.data.orderInfo.address_info,
        that = this,
        orderId;

    if (!address_info && this.data.orderInfo.goods_type != 3) {
      app.showModal({
        content: '请选择邮寄地址'
      })
      return;
    }

    orderId = this.data.orderInfo.order_id;

    if (this.data.orderInfo.total_price == 0) {
      app.sendRequest({
        url: '/index.php?r=AppShop/paygoods',
        data: {
          order_id: orderId,
          total_price: 0
        },
        success: function(res){
          setTimeout(function(){
            app.showToast({
              title: '支付成功',
              icon: 'success'
            });
          });
          setTimeout(function(){
            that.getOrderDetail(that.data.orderInfo.order_id);
          }, 1000);
        }
      });
      return;
    }

    app.sendRequest({
      url: '/index.php?r=AppShop/GetWxWebappPaymentCode',
      data: {
        order_id: orderId,
        sub_shop_app_id: that.data.franchiseeId
      },
      success: function (res) {
        var param = res.data,
            orderId = that.data.orderInfo.order_id;

        param.orderId = orderId;
        param.goodsType = that.data.orderInfo.goods_type;
        param.success = function () {
          setTimeout(function(){
            that.getOrderDetail(orderId);
          }, 1500); 
        };
        app.wxPay(param);
      }
    })
  },
  applyDrawback: function () {
    var orderId = this.data.orderInfo.order_id,
        that = this;

    app.showModal({
      content: '确定要申请退款？',
      showCancel: true,
      confirmText: '确定',
      cancelText: '取消',
      confirm: function () {
        app.sendRequest({
          url: '/index.php?r=AppShop/applyRefund',
          data: {
            order_id: orderId,
            sub_shop_app_id: that.data.franchiseeId
          },
          success: function (res) {
            var data = {};
            data['orderInfo.status'] = 4;
            that.setData(data);
          },
          successShowModalConfirm: function() {
            that.dataInitial();
          }
        })
      }
    })
  },
  receiveDrawback: function () {
    var orderId = this.data.orderInfo.order_id,
        that = this;

    app.showModal({
      content: '确定已收到退款？',
      showCancel: true,
      confirmText: '确定',
      cancelText: '取消',
      confirm: function () {
        app.sendRequest({
          url: '/index.php?r=AppShop/comfirmRefund',
          data: {
            order_id: orderId,
            sub_shop_app_id: that.data.franchiseeId
          },
          success: function (res) {
            var data = {};

            data['orderInfo.status'] = 7;
            that.setData(data);
          }
        })
      }
    })
  },
  checkLogistics: function () {
    var orderId = this.data.orderInfo.order_id;
    app.turnToPage('/eCommerce/pages/logisticsPage/logisticsPage?detail=' + orderId);
  },
  sureReceipt: function () {
    var orderId = this.data.orderInfo.order_id,
        that = this;

    app.showModal({
      content: '确定已收到货物？',
      showCancel: true,
      confirmText: '确定',
      cancelText: '取消',
      confirm: function () {
        app.sendRequest({
          url: '/index.php?r=AppShop/comfirmOrder',
          data: {
            order_id: orderId,
            sub_shop_app_id: that.data.franchiseeId
          },
          success: function (res) {
            var data = {};

            data['orderInfo.status'] = 3;
            that.setData(data);
          }
        })
      }
    })
  },
  showAddressList: function () {
    var addressId = this.data.selectAddressId,
        orderId = this.data.orderInfo.order_id,
        franchiseeId = this.data.franchiseeId;

    app.turnToPage('/eCommerce/pages/myAddress/myAddress?id=' + addressId + '&oid=' + orderId + '&sub_shop_id=' + franchiseeId,true);
  },
  goToHomepage: function () {
    var router = app.getHomepageRouter();
    app.turnToPage('/pages/' + router + '/' + router, true);
  },
  verificationCode: function() {
    app.turnToPage('/eCommerce/pages/verificationCodePage/verificationCodePage?detail=' + this.data.orderInfo.order_id + '&sub_shop_app_id=' + this.data.franchiseeId);
  },
  getFreigtAdress:function(){
    var that = this;
    app.sendRequest({
      url: '/index.php?r=AppShop/getAppShopLocationInfo',
      data: {
        app_id: app.getAppId()
      },
      success: function (res) {
        that.setData({
          freightAdress: res.data
        });
      }
    });
  },
  freightGoMap:function(){
    var _this = this,
      infor = _this.data.freightAdress.region_string + _this.data.freightAdress.shop_location;
    infor = infor.replace(/\s+/g,'');
    app.sendRequest({
      url: '/index.php?r=Map/GetLatAndLngByAreaInfo',
      data: {
        location_info: infor
      },
      success: function (res) {
        if (res.result){
          wx.openLocation({
            latitude: res.result.location.lat,
            longitude: res.result.location.lng
          })
        }
      }
    });

  },
  initialAddressId:function(){
    var that = this;
    app.sendRequest({
      url: '/index.php?r=AppShop/addressList',
      data: {
        app_id: app.getAppId()
      },
      success: function (res) {
        if(res.data.length){
          that.setData({
            selectAddressId: res.data[0].id
          });
        }
      }
    });
  },
  freightPlayPhone:function(){
    var that = this;
    app.makePhoneCall(that.data.freightAdress.shop_contact)
  },
  seeAdditionalInfo: function(){
    app.turnToPage('/eCommerce/pages/goodsAdditionalInfo/goodsAdditionalInfo?from=goodsOrderDetail');
  }
})
