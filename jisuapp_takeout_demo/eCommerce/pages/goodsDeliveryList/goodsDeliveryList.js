var app = getApp();

Page({
  data: {
    deliveryList: [],
    centerLat: '',
    centerLng: '',
    markers: [{
      latitude: '',
      longitude: '',
      iconPath: '/images/delivery.png',
      width: 20,
      height: 20
    }],
    deliveryId: ''
  },
  callout: {
    content: '离您最近的门店地址',
    fontSize: 14,
    color: '#333333',
    borderRadius: 4,
    bgColor: '#ffffff',
    padding: 10,
    display: 'ALWAYS',
    textAlign: 'center'
  },
  franchiseeId: '',
  selfLocation: {},
  onLoad: function (options) {
    this.franchiseeId = options.franchiseeId || '';
    this.setData({
      deliveryId: options.deliveryId || ''
    })
    this.dataInitial();
  },
  onShow: function () {
    
  },
  dataInitial: function(){
    this.getLocation();
  },
  getLocation: function(){
    let _this = this;
    wx.getLocation({
      success: function(res){
        _this.selfLocation = {
          lat: res.latitude,
          log: res.longitude
        }
      },
      fail: function(){
        _this.setData({
          statusFail: true
        })
      },
      complete: function(){
        _this.getSelfDeliveryList();
      }
    })
  },
  getSelfDeliveryList: function(){
    let _this = this;
    app.sendRequest({
      url: '/index.php?r=AppShop/getSelfDeliveryList',
      data: {
        sub_shop_app_id: _this.franchiseeId,
      },
      success: function (res) {
        if (res.data.store_list_data){
          let deliveryList = res.data.store_list_data;
          if (_this.data.statusFail){
            _this.setData({
              deliveryList: deliveryList,
              centerLat: deliveryList[0].latitude,
              centerLng: deliveryList[0].longitude,
              "markers[0].latitude": deliveryList[0].latitude,
              "markers[0].longitude": deliveryList[0].longitude,
              "markers[0].callout": '',
              deliveryId: deliveryList[0].id
            })  
          }else{
            _this.calculationDistance(deliveryList);
          }
        }
      }
    })
  },
  calculationDistance: function(data){
    let deliveryList = data;
    let _this = this;
    for (let i = 0; i < deliveryList.length;i++){
      deliveryList[i].distance = parseInt(app.calculationDistanceByLatLng(_this.selfLocation.lat, _this.selfLocation.log, deliveryList[i].latitude, deliveryList[i].longitude));
    }
    for (let i = 0; i < deliveryList.length;i++){
      for (let j = i + 1; j < deliveryList.length; j++){
        if (deliveryList[i].distance > deliveryList[j].distance){
          let tmp = deliveryList[i];
          deliveryList[i] = deliveryList[j];
          deliveryList[j] = tmp; 
        }
      }
    }
    this.setData({
      deliveryList: deliveryList
    })
    _this.showCallout();
  },
  showCallout: function(){
    let deliveryList = this.data.deliveryList;
    let deliveryId = this.data.deliveryId;
    let _this = this;
    let index = -1;
    for (let i = 0; i < deliveryList.length; i++) {
      if (deliveryList[i].id == deliveryId) {
        index = i;
      }
    };
    index = index < 0 ? 0 : index;
    this.setData({
      centerLat: deliveryList[index].latitude,
      centerLng: deliveryList[index].longitude,
      "markers[0].latitude": deliveryList[index].latitude,
      "markers[0].longitude": deliveryList[index].longitude,
      "markers[0].callout": index == 0 ? _this.callout : '',
      deliveryId: deliveryList[index].id
    })
  },
  selectDelivery: function(event){
    let index = event.currentTarget.dataset.index;
    let deliveryList = this.data.deliveryList;
    let _this = this;
    this.setData({
      centerLat: deliveryList[index].latitude,
      centerLng: deliveryList[index].longitude,
      "markers[0].latitude": deliveryList[index].latitude,
      "markers[0].longitude": deliveryList[index].longitude,
      "markers[0].callout": index == 0 && !_this.data.statusFail ? _this.callout : '',
      deliveryId: deliveryList[index].id
    })
  },
  sureDelivery: function(){
    let _this = this;
    let deliveryId = this.data.deliveryId;
    let pages = getCurrentPages();
    let prePage = pages[pages.length - 2];
    let deliveryList = this.data.deliveryList;

    for (let i = 0;i < deliveryList.length;i++) {
      if (deliveryList[i].id == deliveryId) {
        prePage.setData({
          selectDelivery: deliveryList[i]
        });
      }
    };
    app.turnBack();
  }
})