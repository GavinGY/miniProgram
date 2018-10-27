
var app = getApp()

Page({
  data: {
    isShowNoJoinPrice: false,
    isShowMemberDiscount: false,
    appTitle: '',
    franchisee: '',                                // 子店id
    useBalance: false,
    useStoreBenefit: true,
    totalDiscountPrice: '',                       
    totalPayment: '',
    inputPrice: '',
    requesting: false,
    transferConfig: {                              // 当面付配置信息
      background_color: '',
      vip_card_benefit_enable: 1,
      coupon_benefit_enable: 1,
      integral_benefit_enable: 1,
      use_balance_enable: 1,
      get_vipcard_directly: 0                      // 快速开卡
    },
    userInfo: {},                                  // 会员信息
    vipCardInfo: {                                 // 会员卡信息
      isShow: false
    },
    isShowVipCardDialog: false,                    // 是否显示会员卡弹窗
    memberDiscount: [],                            // 会员优惠
    no_use_benefit: true,                          // 不使用会员优惠
    selectedBenefit: {},                           // 选中的会员优惠
    store_benefit_info: {},                        // 店铺优惠
    store_benefit_info_discount_price: '',         // 店铺优惠价格
    use_balance_price: '0.00',                     // 储值的金额
    selected_benefit_discount_cut_price: '0.00',   // 会员优惠的价格
    ifUserInfo: false,                             // 是否存在相应的用户信息
    userCityArr: ['', '', ''],                     // 用户城市信息的集合   [country, pri, city]
    currentStoreBenefitInfo: {},                   // 店铺满减活动    
    todayDate: '2018-8-10',
    isShowStoreBenefitInfo: true,                  // 是否显示店铺满减信息 
    isGetPhoneNumber: false,                       // 是否获得手机授权
    storeBenefitActivityList: [],                  // 店铺优惠列表
    userInfoCollectConfig: {},                     // 用户信息收集配置    
    isShowPriceLimitTip: false,                    // 是否显示价格限制提示
    combineBenefit: {},                            // 自定义优惠
    noUseVipBenefit: true,                         // 不使用自定义优惠的会员卡、优惠券、积分优惠
    noUseCouponBenefit: true,
    noUseIntegralBenefit: true,
    combine_use_benefit: {}                        // 可使用的自定义优惠的选项
  },
  inputTimeout: '',
  remark: '',
  onLoad: function (options) {
    let franchisee = options.franchisee || '';
    let appTitle = franchisee ? '' : app.getAppTitle();

    this.setData({
      appTitle: appTitle,
      franchisee: franchisee
    });

    if (franchisee) {
      this.getAppShopByPage();
    }
  },
  onShow: function () {
    this.setData({
      userInfo: app.getUserInfo(),
      inputPrice: '',
      selectedBenefit: {},
      store_benefit_info: {},
      totalPayment: '',
      transferConfig: {
        background_color: '',
        vip_card_benefit_enable: 1,
        coupon_benefit_enable: 1,
        integral_benefit_enable: 1,
        use_balance_enable: 0,
        get_vipcard_directly: 0
      },
      useBalance: false,
      no_use_benefit: true,                          // 不使用会员优惠
      remark: '',
      use_balance_price: '0.00',
      selected_benefit_discount_cut_price: '0.00',
      noUseVipBenefit: true,
      noUseCouponBenefit: true,
      noUseIntegralBenefit: true,
      isShowStoreBenefitInfo: true,
      useStoreBenefit: true,
      'combineBenefit.selected_user_coupon_id': 0
    })

    this.getBalanceData();
    this.getTransferOrderConfig();
    this.getCurrentStoreBenefitInfo();
    this.getStoreBenefitActivityList();
  },
  // 获取当面付配置信息
  getTransferOrderConfig: function () {
    let _this = this;

    app.sendRequest({
      url: '/index.php?r=AppTransferOrder/GetTransferOrderConfig',
      method: 'post',
      data: {
        sub_shop_app_id: _this.data.franchisee
      },
      hideLoading: true,
      success: function (res) {
        let transferConfig = res.data;

        if (res.status === 0) {
          _this.setData({
            transferConfig: transferConfig,
            combine_use_benefit: {
              vip_card_benefit_enable: transferConfig.combine_benefit_enable == 1 && transferConfig.vip_card_benefit_enable == 1 ? 1 : 0,
              coupon_benefit_enable: transferConfig.combine_benefit_enable == 1 && transferConfig.coupon_benefit_enable == 1 ? 1 : 0,
              integral_benefit_enable: transferConfig.combine_benefit_enable == 1 && transferConfig.integral_benefit_enable == 1 ? 1 : 0
            }
          })
          if (transferConfig.get_vipcard_directly == 1 && transferConfig.vipcard_id && transferConfig.vipcard_id != 0) {
            _this.vipCardInit(transferConfig.vipcard_id);
          }
        }
      }
    })
  },
  // 初始化开卡信息
  vipCardInit: function (id) {
    let _this = this;

    this.getEnableVipCardList(id, function () {
      app.sendRequest({
        url: '/index.php?r=AppShop/GetVIPCardInfo',
        data: {
          vip_id: id,
          sub_shop_app_id: _this.data.franchisee
        },
        hideLoading: true,
        success: (res) => {
          let cardInfo = res.data[0];
          _this.getUserVipLevel(cardInfo);
        }
      })
    })

  },
  // 获取用户会员卡级别
  getUserVipLevel: function (cardInfo) {
    let _this = this;
    app.sendRequest({
      url: '/index.php?r=AppShop/GetVIPInfo',
      data: {
        sub_shop_app_id: _this.data.franchisee
      },
      hideLoading: true,
      success: (res) => {
        let user_vip_level = res.data.level ? res.data.level : 0;
        let user_vip_id = res.data.vip_id ? res.data.vip_id : 0;

        if (user_vip_level <= +cardInfo.level && user_vip_id !== cardInfo.id) {
          cardInfo.isShow = true;
          _this.setData({
            vipCardInfo: cardInfo
          })
        }
      }
    })
  },
  // 获取可使用的会员卡列表
  getEnableVipCardList: function (id, callback) {
    let _this = this;
    app.sendRequest({
      url: '/index.php?r=AppVipCard/GetEnableVipCardList',
      data: {
        sub_shop_app_id: _this.data.franchisee
      },
      hideLoading: true,
      success: (res) => {
        res.data.map((val) => {
          if (val.id === id) {
            callback();
          }
        })
      }
    })
  },
  // 获取当前店铺优惠信息
  getCurrentStoreBenefitInfo: function () {
    let _this = this;
    app.sendRequest({
      url: '/index.php?r=AppStoreBenefit/GetCurrentStoreBenefitInfo',
      method: 'post',
      data: {
        sub_shop_app_id: _this.data.franchisee
      },
      hideLoading: true,
      success: function (res) {
        _this.setData({
          currentStoreBenefitInfo: res.data
        })
      }
    })
  },
  goToCouponDesc: function () {
    let pagePath = '/eCommerce/pages/couponDescription/couponDescription?franchisee=' + this.data.franchisee;

    app.turnToPage(pagePath, false);
  },
  // 立即开卡
  handleVipCard: function () {
    let _this = this;

    let userInfo = JSON.parse(JSON.stringify(app.getUserInfo()));
    if (!userInfo.birthday || userInfo.birthday === '0000-00-00' || !userInfo.phone || userInfo.nickname === '') {
      let date = new Date();

      userInfo.birthday = ''

      this.getCollectUserinfoConfig(function () {
        if (userInfo.phone && userInfo.phone.length === 11) {
          _this.setData({
            isGetPhoneNumber: true
          })
        }

        _this.setData({
          todayDate: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
          ifUserInfo: false,
          isShowVipCardDialog: true,
          userInfo: userInfo
        })
      });
      return;
    }

    this.recvVipCard();
  },
  // 领卡
  recvVipCard: function () {
    let _this = this;

    app.sendRequest({
      data: {
        vipcard_id: _this.data.transferConfig.vipcard_id,
        sub_shop_app_id: _this.data.franchisee
      },
      url: '/index.php?r=AppVipCard/RecvVipCard',
      hideLoading: true,
      success: (res) => {
        _this.data.transferConfig.combine_benefit_enable == 1 ? _this.calulateTransferOrderPrice() : _this.calculateTotalPrice();
        _this.setData({
          'vipCardInfo.isShow': false,
          'ifUserInfo': true,
          'isShowVipCardDialog': true
        })
      }
    })
  },
  // 保存用户信息
  saveUserInfo: function () {
    let data = this.data.userInfo;
    let _this = this;
    let config = this.data.userInfoCollectConfig;

    let newData = {};
    if (data.country === 'China') {
      data.country = '中国'
    }
    data.province = this.data.userCityArr[0];
    data.city = this.data.userCityArr[1];

    if ((config.collect_username == 1 && data.nickname === '') ||
      (config.collect_phone == 1 && !data.phone) ||
      (config.collect_birthday == 1 && data.birthday === '') ||
      (config.collect_region == 1 && (data.province === '' || data.city === ''))) {
      app.showModal({
        content: '请填写完整的会员信息'
      });
      return;
    }

    newData.nickname = data.nickname;
    newData.phone = data.phone;
    newData.birthday = data.birthday;
    newData.country = data.country;
    newData.province = data.province;
    newData.city = data.city;

    app.sendRequest({
      url: '/index.php?r=AppData/saveUserInfo',
      method: 'post',
      data: newData,
      success: function (res) {
        if (res.status === 0) {
          app.setUserInfoStorage(data);

          _this.recvVipCard();
        }
      }
    });
  },
  // 获取用户信息收集配置
  getCollectUserinfoConfig: function (callback) {
    let _this = this;
    let userInfo = JSON.parse(JSON.stringify(app.getUserInfo()));

    app.sendRequest({
      data: {},
      url: '/index.php?r=AppVipCard/GetCollectUserinfoConfig',
      hideLoading: true,
      success: (res) => {
        let config = res.data;
        _this.setData({
          userInfoCollectConfig: config
        })

        if (config.collect_birthday == 0 && config.collect_phone == 0 && config.collect_region == 0 && config.collect_username == 0) {
          _this.recvVipCard();
        } else if (config.collect_birthday == 1 && (!userInfo.birthday || userInfo.birthday === '0000-00-00')) {
          callback();
        } else if (config.collect_phone == 1 && !userInfo.phone) {
          callback();
        } else {
          _this.recvVipCard();
        }
      }
    })
  },
  isShowNoJoinPriceChange: function (e) {
    let val = e.detail.value;
    let data = {}

    if (val[0] === 'noJoinPrice') {
      data = { isShowNoJoinPrice: true }
    } else {
      data = { isShowNoJoinPrice: false }
    }
    this.setData(data)
  },
  showMemberDiscount: function (e) {
    let memberDiscount = [];
    let selectedBenefit = {};
    let combineBenefit = this.data.combineBenefit;
    if (e.currentTarget.dataset.type === 'vip') {                  // 会员优惠为vip、coupon、integral时，展示对应的优惠信息和选择的优惠
      memberDiscount.push({
        label: 'vip',
        value: combineBenefit.vip_benefit instanceof Array ? combineBenefit.vip_benefit : [combineBenefit.vip_benefit]
      })
      selectedBenefit = {
        type: 'combine',
        discount_type: 'vip',
        no_use_benefit: combineBenefit.vip_benefit.discount_price === '0.00' ? 1 : 0
      };
    } else if (e.currentTarget.dataset.type === 'coupon') {
      memberDiscount.push({
        label: 'coupon',
        value: combineBenefit.coupon_benefit
      })
      selectedBenefit = {
        type: 'combine',
        discount_type: 'coupon',
        coupon_id: combineBenefit.selected_user_coupon_id,
        no_use_benefit: combineBenefit.coupon_benefit_discount_price === '0.00' ? 1 : 0
      }
    } else if (e.currentTarget.dataset.type === 'integral') {
      memberDiscount.push({
        label: 'integral',
        value: combineBenefit.integral_benefit instanceof Array ? combineBenefit.integral_benefit : [combineBenefit.integral_benefit]
      })
      selectedBenefit = {
        type: 'combine',
        discount_type: 'integral',
        no_use_benefit: combineBenefit.integral_benefit.discount_price === '0.00' ? 1 : 0
      }
    } else {
      memberDiscount = this.data.memberDiscount;
      selectedBenefit = this.data.selectedBenefit;
    }
    this.setData({
      memberDiscount: memberDiscount,
      selectedBenefit: selectedBenefit
    })
    this.selectComponent('#component-memberDiscount').showDialog(this.data.selectedBenefit, this.data.franchisee);
  },
  inputPrice: function (e) {
    let _this = this,
      re = /^\d{1,4}(\.\d{0,2})?$/,
      isShowPriceLimitTip = false,
      price = e.detail.value.split('¥').length === 2 ? e.detail.value.split('¥')[1] : e.detail.value;

    price = price.replace(/\s+/g, "");

    if (!re.test(price)) {
      price = '';
      isShowPriceLimitTip = true;
    }

    this.setData({
      selectedBenefit: {},
      inputPrice: price,
      isShowPriceLimitTip: isShowPriceLimitTip
    })
    this.inputTimeout && clearTimeout(this.inputTimeout);

    this.inputTimeout = setTimeout(function () {
      _this.data.transferConfig.combine_benefit_enable == 1 ? _this.calulateTransferOrderPrice() : _this.calculateTotalPrice({});
    }, 200)
  },
  priceBlur: function (e) {
    let price = e.detail.value.split('¥').length === 2 ? e.detail.value.split('¥')[1] : e.detail.value;

    if (typeof (+(price)) === 'number') {
      price = (+price).toFixed(2);
    }

    this.setData({
      inputPrice: price
    })
  },
  confirmPay: function () {
    let _this = this,
      inputPrice = this.data.inputPrice,
      totalPayment = this.data.totalPayment,
      selected_store_benefit = {},
      selected_combination_benefit = this.filterCombinationBenefit(),
      benefits = this.data.selectedBenefit;

    if (isNaN(inputPrice) || (+inputPrice).toFixed(2) <= 0) {
      app.showModal({
        content: '请输入正确的金额'
      });
      return;
    }
    if (isNaN(totalPayment) || totalPayment < 0) {
      alertTip('error payment amount');
      return;
    }

    if (this.data.requesting) {
      return;
    }
    this.setData({
      requesting: true
    });

    if (this.data.useStoreBenefit && this.data.store_benefit_info.discount_price) {
      selected_store_benefit = this.data.store_benefit_info;
    }

    app.sendRequest({
      url: '/index.php?r=AppShop/createTransferOrder',
      method: 'post',
      data: {
        price: inputPrice,
        check_price: totalPayment,
        message: this.data.remark,
        selected_benefit: this.data.transferConfig.combine_benefit_enable == 1 ? '' : benefits,
        selected_store_benefit: this.data.transferConfig.combine_benefit_enable == 1 ? '' : selected_store_benefit,
        is_balance: this.data.useBalance == true ? 1 : 0,
        sub_shop_app_id: this.data.franchisee,
        selected_combination_benefit: this.data.transferConfig.combine_benefit_enable == 1 ? selected_combination_benefit : '',
        goods_type: 5
      },
      success: function (res) {
        var orderId = res.data;
        _this.payOrder(orderId);
      }
    })
  },
  // 过滤选中的自定义优惠
  filterCombinationBenefit: function(){
    let benefit = this.data.combineBenefit,
      use_benefit = this.data.combine_use_benefit;

    benefit.use_balance = (+this.data.use_balance_price);
    benefit.total_price = (+this.data.totalPayment);
    benefit.total_discount_price = (+this.data.totalDiscountPrice);

    if (use_benefit.vip_card_benefit_enable == 0) {
      delete benefit.vip_benefit;
    }
    if (use_benefit.coupon_benefit_enable == 0) {
      delete benefit.coupon_benefit;
      delete benefit.selected_user_coupon_id;
    }else if(use_benefit.coupon_benefit_enable == 1) {
      let selectedCouponBenefit = {};

      benefit.coupon_benefit.map((val) => {
        if(val.user_coupon_id == benefit.selected_user_coupon_id){
          selectedCouponBenefit = val;
        }
      })
      if(selectedCouponBenefit.user_coupon_id){
        benefit.coupon_benefit = selectedCouponBenefit;
      }
    }
    if (use_benefit.integral_benefit_enable == 0) {
      delete benefit.integral_benefit;
    }
    if (!this.data.useStoreBenefit){
      delete benefit.store_benefit;
    }

    return benefit;
  },
  payOrder: function (orderId) {
    var _this = this;

    function paySuccess() {
      var pagePath = '/eCommerce/pages/transferPaySuccess/transferPaySuccess?detail=' + orderId + '?franchisee=' + _this.data.franchisee;

      app.turnToPage(pagePath, 0);
    }

    function payFail() {
      app.turnToPage('/eCommerce/pages/transferOrderDetail/transferOrderDetail?detail=' + orderId, 0);
    }

    if (this.data.totalPayment == 0) {
      app.sendRequest({
        url: '/index.php?r=AppShop/paygoods',
        data: {
          order_id: orderId,
          total_price: 0
        },
        success: function (res) {
          paySuccess();
        },
        fail: function () {
          payFail();
        },
        complete: function () {
          _this.setData({
            requesting: false
          })
        }
      });
      return;
    }
    app.sendRequest({
      url: '/index.php?r=AppShop/GetWxWebappPaymentCode',
      data: {
        order_id: orderId
      },
      success: function (res) {
        var param = res.data;

        param.orderId = orderId;
        param.goodsType = 5;
        param.success = paySuccess;
        param.fail = payFail;
        app.wxPay(param);
      },
      complete: function () {
        _this.setData({
          requesting: false
        })
      }
    })
  },
  // 唯一会员优惠的金额计算
  calculateTotalPrice: function (selectedBenefit = this.data.selectedBenefit) {
    let _this = this,
      price = +this.data.inputPrice;

    app.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppShop/calculationPrice',
      method: 'post',
      data: {
        price: price,
        selected_benefit: selectedBenefit,
        is_balance: this.data.useBalance == true ? 1 : 0,
        not_use_store_benefit: this.data.useStoreBenefit ? 0 : 1,
        sub_shop_app_id: this.data.franchisee
      },
      success: function (res) {
        let data = res.data,
          benefits = data.can_use_benefit,
          selected_benefit,
          no_use_benefit = true,
          selectedBenefit = {},
          useStoreBenefit = _this.data.useStoreBenefit,
          isShowStoreBenefitInfo = _this.data.isShowStoreBenefitInfo,
          transferConfig = _this.data.transferConfig,
          memberDiscount = [];

        if (+price === 0) {
          _this.setData({
            use_balance_price: '0.00',
            totalPayment: '',
            useBalance: false,
            no_use_benefit: true,                          // 不使用会员优惠
            selected_benefit_discount_cut_price: '0.00',
            'store_benefit_info.discount_price': '0.00'
          })
          return;
        }

        if (transferConfig.coupon_benefit_enable == 1) {
          memberDiscount.push({
            label: 'coupon',
            value: benefits.coupon_benefit
          })
        }
        if (transferConfig.vip_card_benefit_enable == 1) {
          memberDiscount.push({
            label: 'vip',
            value: benefits.vip_benefit instanceof Array ? benefits.vip_benefit : [benefits.vip_benefit]
          })
        }
        if (transferConfig.integral_benefit_enable == 1) {
          memberDiscount.push({
            label: 'integral',
            value: benefits.integral_benefit instanceof Array ? benefits.integral_benefit : [benefits.integral_benefit]
          })
        }

        if (benefits.data.length) {
          memberDiscount.map((val) => {
            if (val.value.length > 0) {
              no_use_benefit = false;
            }
          })
        }

        if (!no_use_benefit) {
          data.selected_benefit_info && data.selected_benefit_info.length !== 0 ? selectedBenefit = data.selected_benefit_info : selectedBenefit = {};
        }

        if (data.store_benefit_info && data.store_benefit_info.discount_price) {
          isShowStoreBenefitInfo = false;
        }

        _this.setData({
          totalPayment: data.price,
          memberDiscount: memberDiscount,
          selectedBenefit: selectedBenefit,
          no_use_benefit: no_use_benefit,
          store_benefit_info: data.store_benefit_info,
          store_benefit_info_discount_price: data.store_benefit_info && data.store_benefit_info.discount_price ? data.store_benefit_info.discount_price.toFixed(2) : '0.00',
          selected_benefit_discount_cut_price: data.selected_benefit_info.discount_cut_price ? data.selected_benefit_info.discount_cut_price.toFixed(2) : '0.00',
          isShowStoreBenefitInfo: isShowStoreBenefitInfo,
          use_balance_price: data.use_balance.toFixed(2),
        });
      }
    })
  },
  // 自定义优惠的金额计算
  calulateTransferOrderPrice: function () {
    let _this = this,
      price = +this.data.inputPrice,
      combine_use_benefit = this.data.combine_use_benefit,
      transferConfig = this.data.transferConfig;

    app.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppTransferOrder/CalulateTransferOrderPrice',
      method: 'post',
      data: {
        price: price,
        no_use_vip_benefit: combine_use_benefit.vip_card_benefit_enable ? 0 : 1,
        no_use_coupon_benefit: combine_use_benefit.coupon_benefit_enable ? 0 : 1,
        no_use_integral_benefit: combine_use_benefit.integral_benefit_enable ? 0 : 1,
        selected_user_coupon_id: this.data.combineBenefit.selected_user_coupon_id || 0,
        no_use_balance: this.data.useBalance == false ? 1 : 0,
        no_use_store_benefit: this.data.useStoreBenefit ? '' : 1,
        sub_shop_app_id: this.data.franchisee
      },
      success: function (res) {
        let data = res.data,
          combine_benefit = data.combine_benefit,
          isShowStoreBenefitInfo = _this.data.isShowStoreBenefitInfo,
          noUseVipBenefit = true,
          noUseCouponBenefit = true,
          noUseIntegralBenefit = true;

        if (combine_benefit.vip_benefit) {
          if (combine_benefit.vip_benefit.vip_id) {
            noUseVipBenefit = false;
          }
          combine_use_benefit.vip_card_benefit_enable ? combine_benefit.vip_benefit.discount_price = (+combine_benefit.vip_benefit.discount_price).toFixed(2) : combine_benefit.vip_benefit.discount_price = '0.00';
        }
        if (combine_benefit.coupon_benefit.length) {
          noUseCouponBenefit = false;
          combine_benefit.coupon_benefit_discount_price = '0.00';
          combine_benefit.coupon_benefit.map((val) => {
            if (val.user_coupon_id == combine_benefit.selected_user_coupon_id) {
              combine_use_benefit.coupon_benefit_enable ? combine_benefit.coupon_benefit_discount_price = (+val.discount_price).toFixed(2) : combine_benefit.coupon_benefit_discount_price = '0.00';
            }
          })
        } else {
          combine_benefit.coupon_benefit_discount_price = '0.00'
        }
        if (combine_benefit.integral_benefit.max_can_use_integral) {
          noUseIntegralBenefit = false;
          combine_use_benefit.integral_benefit_enable ? combine_benefit.integral_benefit.discount_price = (+combine_benefit.integral_benefit.discount_price).toFixed(2) : combine_benefit.integral_benefit.discount_price = '0.00';
        }

        if (combine_benefit.store_benefit && combine_benefit.store_benefit.discount_price) {
          isShowStoreBenefitInfo = false;
        }

        _this.setData({
          totalPayment: data.total_price,
          totalDiscountPrice: data.total_discount_price,
          combineBenefit: combine_benefit,
          store_benefit_info: combine_benefit.store_benefit,
          store_benefit_info_discount_price: combine_benefit && combine_benefit.store_benefit && combine_benefit.store_benefit.discount_price ? combine_benefit.store_benefit.discount_price.toFixed(2) : '0.00',
          use_balance_price: data.use_balance,
          noUseVipBenefit: noUseVipBenefit,
          noUseCouponBenefit: noUseCouponBenefit,
          isShowStoreBenefitInfo: isShowStoreBenefitInfo,
          noUseIntegralBenefit: noUseIntegralBenefit
        })
      }
    })
  },
  inputRemark: function (e) {
    this.data.remark = e.detail.value;
  },
  ifUseBalance: function (e) {
    this.setData({
      useBalance: e.detail.value
    })
    this.data.transferConfig.combine_benefit_enable == 1 ? this.calulateTransferOrderPrice() : this.calculateTotalPrice();
  },
  ifUseStoreBenefit: function (e) {
    this.setData({
      useStoreBenefit: e.detail.value,
      selectedBenefit: {}
    })
    this.data.transferConfig.combine_benefit_enable == 1 ? this.calulateTransferOrderPrice() : this.calculateTotalPrice();
  },
  // 获取商家详情信息
  getAppShopByPage: function () {
    let that = this;
    let franchiseeId = this.data.franchisee;

    app.sendRequest({
      url: '/index.php?r=AppShop/GetAppShopByPage',
      data: {
        sub_shop_app_id: franchiseeId
      },
      success: function (res) {
        let newdata = {},
          data = res.data[0];

        newdata['franchiseeInfo'] = data;
        newdata['appTitle'] = data.name;
        that.setData(newdata);
      }
    })
  },
  bindBirthdayChange: function (e) {
    this.setData({
      'userInfo.birthday': e.detail.value
    })
  },
  bindCityChange: function (e) {
    this.setData({
      'userCityArr': e.detail.value
    })
  },
  closeVipCardDialog: function (e) {
    if (e.target.dataset.type === 'shadow') {
      this.setData({
        isShowVipCardDialog: false
      })
    }
  },
  afterSelectedBenefit: function (e) {
    let selectedDiscount = e.detail.selectedDiscount,
      combine_use_benefit = this.data.combine_use_benefit,
      combineBenefit = this.data.combineBenefit;
    
    if (selectedDiscount.type === 'combine') {                  // 自定义优惠
      if (selectedDiscount.discount_type === 'coupon') {
        if (selectedDiscount.no_use_benefit) {
          combineBenefit.selected_user_coupon_id = 0;
          combine_use_benefit.coupon_benefit_enable = 0;
        } else {
          combineBenefit.selected_user_coupon_id = selectedDiscount.coupon_id;
          combine_use_benefit.coupon_benefit_enable = 1;
        }
      } else if (selectedDiscount.discount_type === 'vip') {
        combine_use_benefit.vip_card_benefit_enable = (selectedDiscount.no_use_benefit ? 0 : 1);
      } else if (selectedDiscount.discount_type === 'integral') {
        combine_use_benefit.integral_benefit_enable = (selectedDiscount.no_use_benefit ? 0 : 1);
      }
      this.setData({
        combine_use_benefit: combine_use_benefit,
        combineBenefit: combineBenefit
      })
    } else {                                                   // 唯一会员优惠
      this.setData({
        selectedBenefit: selectedDiscount,
      });
    }

    this.data.transferConfig.combine_benefit_enable == 1 ? this.calulateTransferOrderPrice() : this.calculateTotalPrice();
  },
  inputUserInfo: function (e) {
    let setData = {}

    if (e.currentTarget.dataset.type === 'name') {
      setData = { 'userInfo.name': e.detail.value }
    } else if (e.currentTarget.dataset.type === 'phone') {
      setData = { 'userInfo.phone': e.detail.value }
    }

    this.setData(setData);
  },
  getPhoneNumber: function (e) {
    if (this.data.isGetPhoneNumber) {
      return;
    }

    let _this = this;
    app.checkSession(function () {
      if (!e.detail.encryptedData) {
        return;
      }
      app.sendRequest({
        hideLoading: true,
        url: '/index.php?r=AppUser/GetPhoneNumber',
        data: {
          encryptedData: e.detail.encryptedData || '',
          iv: e.detail.iv || ''
        },
        success: function (res) {
          app.setUserInfoStorage({
            phone: res.data
          })

          _this.setData({
            'userInfo.phone': res.data,
            isGetPhoneNumber: true
          })
        },
        successStatus5: function(){
          app.goLogin({
            success: function () {
              app.showModal({
                content: '获取手机号失败，请再次点击授权获取'
              });
            },
            fail: function () {
              app.showModal({
                content: '获取手机号失败，请再次点击授权获取'
              });
            }
          });
        }
      })
    });
  },
  // 获取店铺优惠活动列表
  getStoreBenefitActivityList: function () {
    let _this = this;
    app.sendRequest({
      url: '/index.php?r=AppStoreBenefit/GetStoreBenefitActivityList',
      method: 'post',
      data: {
        sub_shop_app_id: _this.data.franchisee
      },
      hideLoading: true,
      success: function (res) {
        let data = [];
        res.data.map((val) => {
          val.activity_start_date = val.activity_start_date.substr(0, 16);
          val.activity_end_date = val.activity_end_date.substr(0, 16);
          if (val.expired !== 1) {
            data.push(val);
          }
        })
        _this.setData({
          storeBenefitActivityList: data
        })
      }
    })
  },
  // 获取当前储值金
  getBalanceData: function(){
    let that = this;
    app.sendRequest({
      url: '/index.php?r=AppShop/getAppUserBalance',
      hideLoading: true,
      success: function(res){
        that.setData({
          'userInfo.balance': res.data.balance
        });
      }
    });
  },
})
