var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data: {
    type: -1,
    loadData: {
      currentPage: 1,
      isMore: 1,
      loading: false
    },
    couponList: [],
    rechargeSuccess: 0
  },
  onShow: function() {
    let _this = this;

    let isParent = app.globalData.hasFranchiseeList;
    _this.setData({
      isParentShop: isParent
    });
    if (isParent) {
      _this.getLocation();
    } else {
      _this.getMyCoupons();
    }
  },
  // tab切换
  changeTab: function(event){
    let _this = this;
    let type = event.target.dataset.type;
    _this.setData({
      type: type,
      couponList: [],
      loadData: {
        currentPage: 1,
        isMore: 1,
        loading: false
      }
    });
    if (_this.data.isParentShop){
      _this.getMyAllCoupons();
    }else{
      _this.getMyCoupons();
    }
  },
  // 获取单店的我拥护的优惠券
  getMyCoupons: function(){
    let _this = this;
    if(_this.data.loadData.isMore == 0 || _this.data.loadData.loading) {
      return false;
    }
    _this.setData({
      'loadData.loading': true,
    })
    app.sendRequest({
      url: '/index.php?r=AppShop/getMyCoupons',
      data: {
        type: _this.data.type,
        page: _this.data.loadData.currentPage,
        page_size: 10
      },
      hideLoading: true,
      success: function(res) {
        _this.setData({
          'couponList': _this.data.couponList.concat(res.data),
          'loadData.currentPage': (res.current_page || 0)+ 1,
          'loadData.isMore': res.is_more,
          'loadData.loading': false,
        })
      }
    });
  },
  // 获取多商家的我拥护的优惠券
  getMyAllCoupons: function () {
    let _this = this;
    if (_this.data.loadData.isMore == 0 || _this.data.loadData.loading) {
      return false;
    }
    _this.setData({
      'loadData.loading': true,
    })
    app.sendRequest({
      url: '/index.php?r=AppShop/GetMyAllCoupons',
      data: {
        type: _this.data.type,
        latitude: _this.data.latitude,
        longitude: _this.data.longitude,
        page: _this.data.loadData.currentPage,
        page_size: 10
      },
      hideLoading: true,
      success: function (res) {
        _this.setData({
          'couponList': _this.data.couponList.concat(res.data),
          'loadData.currentPage': (res.current_page || 0) + 1,
          'loadData.isMore': res.is_more,
          'loadData.loading': false,
        })
      }
    });
  },
  // 获取定位
  getLocation: function () {
    let that = this;
    app.getLocation({
      success: function (res) {
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude
        });
        that.getMyAllCoupons();
      },
      fail: function () {
        that.setData({
          longitude: '',
          latitude: ''
        });
        that.getMyAllCoupons();
      }
    })
  },
  // 跳转优惠券详情(使用状态)
  gotoCouponDetail: function(event){
    let couponId = event.currentTarget.dataset.id;
    let appid = event.currentTarget.dataset.appid;
    let franisee = '';
    if (app.globalData.appId != appid && this.data.isParentShop) {
      franisee = '&franchisee=' + appid;
    }
    let url = '/pages/couponDetail/couponDetail?status=use&detail=' + couponId + franisee;
    app.turnToPage(url, false);
  },
  // 满减券、打折券、代金券使用
  gotoTransferPage: function(){
    let url = '/eCommerce/pages/transferPage/transferPage';
    app.turnToPage(url, false);
  },
  // 储值券使用
  gotoRecharge: function(event){
    let _this = this;
    let userCouponId = event.currentTarget.dataset.id;
    app.sendRequest({
      url: '/index.php?r=AppShop/useCoupon',
      data: {
        user_coupon_id: userCouponId
      },
      hideLoading: true,
      success: function(res) {
        _this.setData({
          rechargeSuccess: 1
        });
        setTimeout(function() {
          _this.hideToast();
        }, 3000);
        let couponList = _this.data.couponList;
        for(var i = 0; i < couponList.length; i++){
          if(couponList[i]['id'] == userCouponId){
            let newData = {};
            newData['couponList['+i+'].status'] = 2;
            _this.setData(newData); 
          }
        }
      }
    })
  },
  // 关闭toast
  hideToast: function(){
    this.setData({
      rechargeSuccess: 0
    });
  },
  // 跳转到子店
  gotoShop: function (e) {
    let appid = e.currentTarget.dataset.appid;
    let mode = e.currentTarget.dataset.mode;

    if (app.globalData.appId == appid) {
      let home = app.getHomepageRouter();
      app.reLaunch({
        url: '/pages/' + home + '/' + home
      })
    } else {
      if (mode == 1) {
        app.turnToPage('/franchisee/pages/franchiseeWaimai/franchiseeWaimai?detail=' + appid);
      } else if (mode == 3) {
        app.turnToPage('/franchisee/pages/franchiseeTostore/franchiseeTostore?detail=' + appid);
      } else {
        app.turnToPage('/franchisee/pages/franchiseeDetail/franchiseeDetail?detail=' + appid);
      }
    }
  }
})
