
var app = getApp()

Page({
  data: {
    orderLists: [],
    pages: 1,
    types: {      // 只有一种商品订单时，types保存商品订单的五个分类
      // 订单状态   0待付款 1待发货 2待收货 3待评价 4退款审核 5退款中 6成功 7关闭
      0: [undefined, 0, 1, 2, 3],     // 电商
      1: [undefined, 0, 1, 2, 3],     // 预约
      2: [undefined, 0, 6, 7],     // 外卖
      3: [undefined, 0, 1, 2, 3, 'refund_status', 7],     // 到店
      5: [undefined, 0, 6, 7],      // 当面付
      6: [undefined, 2, 6, 7]     //排号
    },
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
    noMore: false,
    currentTabIndex: 0,
    currentGoodsType: '',                
    goodsTypeList: [],
    isFromBack: false,
    marker: [{
      latitude: 0,
      longitude: 0,
      iconPath: '/images/transport.png',
      width: 75,
      height: 75
    }],
    toStoreSetting: '',
    showWriteOffCodeBox: false
  },
  verifiTimeInterval: '',
  onLoad: function(options){
    if (options.goodsType && options.currentIndex){
      this.setData({
        currentGoodsType: options.goodsType,
        currentTabIndex: options.currentIndex
      })
    }
    this.dataInitial();
  },
  onShow: function(){
    if (this.data.isFromBack) {
      this.setData({
        pages:1,
        currentTabIndex: this.data.currentTabIndex,
        noMore: false
      });
      this.getOrderList({ tabIndex: this.data.currentTabIndex});
    } else {
      this.setData({
        isFromBack: true
      })
    }
  },
  dataInitial: function(){
    var that = this;
    this.getOrderList({
      tabIndex: that.data.currentTabIndex,
      firstLoad: true
    });
  },
  getOrderList: function(param){
    var that = this,
        data = {
          page: that.data.pages,
          page_size: 25
        },
        type;

    if ( this.data.currentGoodsType != ""){
      type = this.data.types[this.data.currentGoodsType][param.tabIndex];

      if(type != undefined){
        data.idx_arr = {
          idx: 'status',
          idx_value: type
        }
      }
      
      data.goods_type = this.data.currentGoodsType
    }

    data.parent_shop_app_id = app.getAppId(); // 获取订单列表时 传parent_shop_app_id获取本店以及所有子店的订单

    if(param.firstLoad && this.data.currentGoodsType == ""){
    // 进入页面首次请求列表时 没有goodsType值 传入use_default_goods_type
      data.use_default_goods_type = 1;
    }
    app.sendRequest({
      url: '/index.php?r=AppShop/orderList',
      method: 'post',
      data: data,
      success: function(res){
        let data = {},
            orders = res.data;

        for (var i = orders.length - 1; i >= 0; i--) {
          var formData = orders[i].form_data;

          if(formData.tostore_data && formData.tostore_data.appointed_time){
            formData.tostore_data.appointed_time = formData.tostore_data.appointed_time.substr(11, 5);
          }
          if (formData.goods_type == 2 && formData.status == 2 && formData.take_out_info.deliver_type != 0 && formData.take_out_info.deliver_type != '' && (formData.take_out_transport_order.status == 2 || formData.take_out_transport_order.status == 3) ){
            that.getTransportInfo(formData.order_id, i)
          }
          if (formData.goods_type == 2) {
            let goodNum = 0;
            for (let j = 0; j < formData.goods_info.length; j++) {
              goodNum += +formData.goods_info[j].num;
            }
            data['goodsNum'] = goodNum;
          }
          orders[i] = formData;
        }

        if(param.scrollLoad){
          orders = that.data.orderLists.concat(orders);
        }
        data['orderLists'] = orders;
        data['takeoutInfo'] = res.take_out_info || '';
        data['pages'] = that.data.pages + 1;
        data['noMore'] = res.is_more == 0 ? true : false;
        data['currentGoodsType'] = res.current_goods_type;
        // 判断goods_type_list里面是否存在当前需要展示的列表
        data['goodsTypeList'] = res.goods_type_list;
        if (data['goodsTypeList'].indexOf(data['currentGoodsType'].toString()) < 0){
          data['goodsTypeList'].push(data['currentGoodsType']);
        }
        that.setData(data);
        if (param.firstLoad && data['goodsTypeList'].indexOf('6') >= 0){
          that.getTostoreSetting();
        }
      }
    })
  },
  getTransportInfo: function (orderId, i){
    let that = this,
        newdata = {};
    app.sendRequest({
      url: '/index.php?r=AppTransport/queryTransporterInfo',
      data: {
        order_id: orderId,
      },
      success: function (res) {
        // res.data.statusCode 订单状态(待接单＝1 待取货＝2 配送中＝3 已完成＝4 已取消＝5 已过期＝7 指派单=8 妥投异常之物品返回中=9 妥投异常之物品返回完成=10 系统故障订单发布失败=1000 可参考文末的状态说明
        newdata['orderLists[' + i + '].transport'] = res.data
        newdata['marker[0].latitude'] = res.data.transporterLat
        newdata['marker[0].longitude'] = res.data.transporterLng
        that.setData(newdata)
      }
    })
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
  clickOrderTab: function(e){
    var dataset = e.target.dataset,
        index = dataset.index,
        data = {};

    data.currentTabIndex = index;
    data['pages'] = 1;
    data['orderLists'] = [];
    data['noMore'] = false;

    this.setData(data);
    this.getOrderList({tabIndex : index});
  },
  clickMeanTab: function(e){
    var dataset = e.target.dataset,
      index = dataset.index,
      data = {};

    data.currentTabIndex = 0;
    data['pages'] = 1;
    data['orderLists'] = [];
    data['noMore'] = false;
    data.currentGoodsType = dataset.goodsType;

    this.setData(data);
    this.getOrderList({ tabIndex: 0 });
  },
  // 多种商品下面的子菜单
  clickSubmenuTab: function(e){
    var dataset = e.target.dataset,
        index = dataset.index,
        data = {};

    data.currentTabIndex = index;
    data['pages'] = 1;
    data['orderLists'] = [];
    data['noMore'] = false;
    data.currentGoodsType = e.currentTarget.dataset.goodsType;

    this.setData(data);
    this.getOrderList({ tabIndex: index });
  },
  goToOrderDetail: function(e){
    var dataset = e.currentTarget.dataset,
        orderId = dataset.id,
        type = dataset.type,
        franchiseeId = dataset.franchisee,
        queryStr = franchiseeId === app.getAppId() ? '' : '&franchisee='+franchiseeId,
        router;
    if(type === 'transfer'){
      router = '/eCommerce/pages/transferOrderDetail/transferOrderDetail?detail=';
    }else if(type === 'tostore'){
      router = '/orderMeal/pages/tostoreOrderDetail/tostoreOrderDetail?detail=';
    } else if(type === 'eBusiness') {
      router = '/eCommerce/pages/goodsOrderDetail/goodsOrderDetail?detail=';
    } else if (type === 'takeout'){
      router = '/orderMeal/pages/takeoutOrderDetail/takeoutOrderDetail?detail=';
    } else if (type === 'rowNumber') {
      router = '/orderMeal/pages/rowNumberOrderDetail/rowNumberOrderDetail?detail=';
    } else {
      router = '/eCommerce/pages/appointmentOrderDetail/appointmentOrderDetail?detail=';
    }
    app.turnToPage(router+orderId+queryStr);
  },
  cancelOrder: function(e){
    var orderId = e.target.dataset.id,
        franchisee = e.target.dataset.franchisee,
        subShopId = franchisee == app.getAppId() ? '' : franchisee,
        that = this;

    app.showModal({
      content: '确定要取消订单？',
      showCancel: true,
      cancelText: '取消',
      confirmText: '确定',
      confirm: function(){
        app.sendRequest({
          url: '/index.php?r=AppShop/cancelOrder',
          data: {
            order_id: orderId,
            sub_shop_app_id: subShopId
          },
          success: function(res){
            var index = that.data.currentTabIndex,
                data = {};

            data['pages'] = 1;
            that.setData(data);
            that.getOrderList({tabIndex : index});
          }
        })
      }
    })
  },
  applyDrawback: function(e){
    var orderId = e.target.dataset.id,
        franchisee = e.target.dataset.franchisee,
        subShopId = franchisee == app.getAppId() ? '' : franchisee,
        that = this,
        delivery = e.target.dataset.delivery;

    app.showModal({
      content: delivery == 1 ? '确定要取消订单？' : '确定要申请退款？',
      showCancel: true,
      cancelText: '取消',
      confirmText: '确定',
      confirm: function(){
        app.sendRequest({
          url: '/index.php?r=AppShop/applyRefund',
          data: {
            order_id: orderId,
            sub_shop_app_id: subShopId
          },
          success: function(res){
            var index = that.data.currentTabIndex,
                data = {};

            data['pages'] = 1;
            that.setData(data);
            that.getOrderList({tabIndex : index});
          }
        })
      }
    })
  },
  checkLogistics: function(e){
    var orderId = e.target.dataset.id;
    app.turnToPage('/eCommerce/pages/logisticsPage/logisticsPage?detail='+orderId);
  },
  sureReceipt: function(e){
    var orderId = e.target.dataset.id,
        franchisee = e.target.dataset.franchisee,
        subShopId = franchisee == app.getAppId() ? '' : franchisee,
        that = this,
        content = this.data.currentGoodsType == '1'? '确认已消费?':'确认已收到货物?';

    app.showModal({
      content: content,
      showCancel: true,
      cancelText: '取消',
      confirmText: '确定',
      confirm: function(){
        app.sendRequest({
          url: '/index.php?r=AppShop/comfirmOrder',
          data: {
            order_id: orderId,
            sub_shop_app_id: subShopId
          },
          success: function(res){
            var index = that.data.currentTabIndex,
                data = {},
                addTime = Date.now();

            data['pages'] = 1;
            that.setData(data);
            that.getOrderList({tabIndex : index});

            app.sendRequest({
              hideLoading: true,
              url: '/index.php?r=appShop/getIntegralLog',
              data: { add_time: addTime },
              success: function (res) {
                if (res.status == 0) {
                  res.data && that.setData({
                    'rewardPointObj': {
                      showModal: true,
                      count: res.data,
                      callback: ''
                    }
                  });
                }
              }
            })
          }
        })
      }
    })
  },
  makeComment: function(e){
    var orderId = e.target.dataset.id,
        franchiseeId = e.target.dataset.franchisee,
        queryStr = franchiseeId === app.getAppId() ? '' : '&franchisee='+franchiseeId;
    app.turnToPage('/eCommerce/pages/makeComment/makeComment?detail='+orderId+queryStr);
  },
  takeoutMakeComment:function(e){
    var orderId = e.target.dataset.id,
      franchiseeId = e.target.dataset.franchisee,
      queryStr = franchiseeId === app.getAppId() ? '' : '&franchisee=' + franchiseeId;
    app.turnToPage('/orderMeal/pages/takeoutMakeComment/takeoutMakeComment?detail=' + orderId + queryStr);
  },
  scrollToListBottom: function(){
    var currentTabIndex = this.data.currentTabIndex;
    if(this.data.noMore){
      return;
    }
    this.getOrderList({
      tabIndex: currentTabIndex,
      scrollLoad: true
    });
  },
  getTostoreSetting: function () {
    let _this = this;
    app.sendRequest({
      url: '/index.php?r=AppTostore/getTostoreLineUpSetting',
      success: function (res) {
        if (res.status == 0) {
          _this.setData({
            toStoreSetting: res.data
          })
        }
      }
    });
  },
  // 核销码
  getWriteOffCodeBox: function (event) {
    let _this = this;
    let orderId = event.target.dataset.id;
    let franchiseeId = event.target.dataset.franchisee;
    app.sendRequest({
      url: '/index.php?r=AppShop/GetOrderVerifyCode',
      data: {
        'sub_shop_app_id': franchiseeId,
        'order_id': orderId
      },
      success: _this.setVerificationCodeData
    })
  },
  setVerificationCodeData: function (res) {
    let _this = this;
    _this.setData({
      'codeImgUrl': res.data.qrcode_url,
      'codeNum': res.data.code,
      'codeStatus': res.data.status,
      'showWriteOffCodeBox': true
    });
    _this.connectSocket();
  },
  connectSocket: function () {
    var _this = this;
    wx.connectSocket({
      url: 'wss://xcx.jisuapp.cn',
      header: {
        'content-type': 'application/json'
      },
      method: 'GET'
    });
    wx.onSocketOpen(function (res) {
      let data = {
        'action': 'mark_client',
        'user_token': app.globalData.userInfo.user_token,
        'scenario_name': 'app_order_verify',
        'session_key': app.globalData.sessionKey
      };
      wx.sendSocketMessage({
        data: JSON.stringify(data)
      });
      _this.verifiTimeInterval = setInterval(function () {
        let data = {
          'action': 'heartbeat',
          'user_token': app.globalData.userInfo.user_token,
          'scenario_name': 'app_order_verify',
          'session_key': app.globalData.sessionKey
        };
        wx.sendSocketMessage({
          data: JSON.stringify(data)
        })
      }, 30000);
    });
    wx.onSocketMessage(function (res) {
      let data = JSON.parse(res.data);
      if (data.action == 'push_to_client') {
        let msg = JSON.parse(data.msg);
        if ((msg.type == 'app_order_verify') && (msg.status == 0)) {
          _this.setData({
            'codeStatus': 1
          });
          clearInterval(_this.verifiTimeInterval);
          wx.closeSocket();
        }
      }
    });
  },
  hideWriteOffCodeBox: function () {
    var _this = this;
    this.setData({
      'showWriteOffCodeBox': false
    })
    clearInterval(_this.verifiTimeInterval);
    wx.closeSocket();
  },
})
