
var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data: {
    userInfo: {},
    distributionInfo: '',
    distributorInfo: '',
    shopImg: ''
  },
  isClickShopset: false,
  onLoad: function (options) {
    this.isClickShopset = options.isClickShopset ? true : false;
    this.dataInitial();
    this.setData({
      userInfo: app.getUserInfo()
    })
  },
  onShow: function(){
    if (this.isClickShopset) {
      this.getDistributorInfo();
      this.isClickShopset = false;
    }
  },
  dataInitial: function () {
    this.setData({
      distributionInfo: app.globalData.getDistributionInfo
    })
    if (!this.isClickShopset) {
      let distributorInfo = app.globalData.getDistributorInfo;
      this.setData({
        distributorInfo: distributorInfo,
        nowCommission: distributorInfo ? distributorInfo.can_withdraw_commission : '',
        userLevel: distributorInfo.level_info ? distributorInfo.level_info.level_name : ''
      })
    }
  },
  checkLevelRules: function(){
    app.turnToPage('/promotion/pages/promotionUserLevel/promotionUserLevel');
  },
  withdraw: function(){
    if (!this.isClickShopset){
      app.turnToPage('/promotion/pages/promotionWithdraw/promotionWithdraw');
      this.isClickShopset = true;
    }
  },
  checkCommission: function(){
    app.turnToPage('/promotion/pages/promotionCommission/promotionCommission');
    this.isClickShopset = true;
  },
  checkWithdrawRecord: function(){
    app.turnToPage('/promotion/pages/promotionWithdrawRecord/promotionWithdrawRecord');
    this.isClickShopset = true;
  },
  checkGoods: function(){
    app.turnToPage('/promotion/pages/promotionGoods/promotionGoods');
    this.isClickShopset = true;
  },
  checkIdentity: function(){
    app.turnToPage('/promotion/pages/promotionMyIdentity/promotionMyIdentity');
    this.isClickShopset = true;
  },
  checkTeam: function(){
    app.turnToPage('/promotion/pages/promotionTeam/promotionTeam');
    this.isClickShopset = true;
  },
  checkMyPromotion: function(){
    app.turnToPage('/promotion/pages/promotionMyPromotion/promotionMyPromotion');
    this.isClickShopset = true;
  },
  checkShopSetting: function(){
    app.turnToPage('/promotion/pages/promotionShopSetting/promotionShopSetting');
    this.isClickShopset = true;
  },
  goToHomepage: function(){
    let homepageRouter = app.getHomepageRouter();
    app.reLaunch({
      url: '/pages/' + homepageRouter + '/' + homepageRouter
    })
  },
  goMyShop:function(){
    let homepageRouter = app.getHomepageRouter();
    app.reLaunch({
      url: '/pages/' + homepageRouter + '/' + homepageRouter + '?promotionName=' + this.data.distributorInfo.shop_name || this.data.userInfo.nickname
    })
    app.globalData.PromotionUserToken = this.data.distributorInfo.user_token;
  },
  getDistributorInfo:function(){
    var that = this;
    app.sendRequest({
      url: '/index.php?r=AppDistribution/getDistributorInfo',
      success: function (res) {
        that.setData({
          distributorInfo: res.data,
          nowCommission: res.data.can_withdraw_commission ? res.data.can_withdraw_commission : '',
          userLevel: res.data.level_info ? res.data.level_info.level_name : ''
        })
      }
    })
  }
})
