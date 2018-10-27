var WxParse = require('components/wxParse/wxParse.js');
var util    = require('utils/util.js');
var customEvent = require('utils/custom_event.js');

App({
  onLaunch: function () {
    let userInfo;
    if (userInfo = wx.getStorageSync('userInfo')) {
      this.globalData.userInfo = userInfo;
    }
    this.appInitial();
  },
  appInitial: function () {
    let that = this;

    this._getSystemInfo({
      success: function (res) {
        that.setSystemInfoData(res);
      }
    });

    wx.request({
      url: this.globalData.siteBaseUrl +'/index.php?r=AppUser/MarkWxXcxStatus',
      data: {
        app_id: this.getAppId(),
        his_id: this.globalData.historyDataId
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      }
    });
  },
  onShow: function (options) {
    this._logining = false;
    if ((options && [1007, 1008, 1011, 1012, 1013, 1014, 1019, 1020, 1024, 1029, 1035, 1036, 1038, 1043, 1044, 1058, 1067, 1073, 1074, 1091, 1096].indexOf(+options.scene) > -1) || !this.globalData.appOptions) {
      this.globalData.appOptions = options;
    }
    let that = this;
    if (options && options.scene && ([1011, 1012, 1013, 1007, 1008].indexOf(options.scene) > -1)){
      if(options.query.location_id){
        this.globalData.urlLocationId = options.query.location_id;
      }
      if (options.query.user_token) {
        this._getPromotionUserToken({
          user_token: options.query.user_token
        });
      }
      if (options.query.leader_user_token) {
        that.showModal({
          content: '是否要成为推广人员的团员',
          showCancel: true,
          confirm: function () {
            that._getPromotionUserToken({
              leader_user_token: options.query.leader_user_token
            });
          }
        })
      }
      if (options.query.needStatistics == 1 && options.query.statisticsType) {
        let detail = options.query.detail;
        let param = "";
        let params = {};
        let objId = (options.query.statisticsType != 9 && options.query.statisticsType != 10) ? (options.query.statisticsType == 11 ? options.path.split('/')[2] : detail) : options.query.statisticsType
        if (options.query.statisticsType == 9 || options.query.statisticsType == 10) {
          params = {
            obj_id: options.query.statisticsType,
            type: options.query.statisticsType
          }
        } else if (options.query.statisticsType == 11) {
          let newOption = Object.assign({}, options.query)
          delete newOption.needStatistics;
          delete newOption.statisticsType;
          for (let i in newOption) {
            param += '&' + i + '=' + newOption[i]
          }
          params = {
            obj_id: objId,
            type: 11,
            params: param
          }
        }
        that.sendRequest({
          hideLoading: true,
          url: '/index.php?r=AppShop/AddQRCodeStat',
          method: 'POST',
          data: params
        })
      }
    }
    if (options && options.scene && ([1011, 1012, 1013, 1007, 1008, 1047, 1048, 1049].indexOf(options.scene) > -1)){
      if(options.query.p_u){
        that.globalData.p_u = options.query.p_u;
      }
    }
    if (options && options.scene && options.query.shareKey) {
      that.sendRequest({
        url: '/index.php?r=appShop/shareSuccess',
        data: {
          share_key: options.query.shareKey
        },
        success: res => { }
      })
    }
  },
  onPageNotFound: function(){
    let that = this;
    let router = that.getHomepageRouter();
    that.turnToPage('/pages/' + router + '/' + router, true, function(){
      that.showModal({
        content: '您跳转的页面不存在，已经返回首页',
        success: function(){
        }
      });
    });
  },
  _getPromotionUserToken: function (param) {
    let that = this;
    this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppDistribution/userBind',
      method: 'post',
      data: param,
      success: function (res) {
        that.setPageTitle(res.data.nickname);
      },
      successStatusAbnormal: function (res) {
        if(res.status == 99){
          let homepageRouter = that.getHomepageRouter();
          that.turnToPage('/pages/' + homepageRouter + '/' + homepageRouter, true);
        }
        if (res.status == 100){
          that.turnToPage('/promotion/pages/promotionApply/promotionApply', true);
        }
      }
    });
  },


  returnSubPackageRouter: function(router){
    switch (router) {
      case 'goldenEggs':
      case 'luckyWheelDetail':
      case 'scratch':
        return '/awardManagement/pages/' + router + '/' + router;
        break;
      case 'advanceSearch':
      case 'bindCellphone':
      case 'extensionPage':
      case 'mapDetail':
        return '/default/pages/' + router + '/' + router;
        break;
      case 'addAddress':
      case 'appointmentOrderDetail':
      case 'balance':
      case 'couponList':
      case 'couponListPage':
      case 'couponReceiveListPage':
      case 'goodsAdditionalInfo':
      case 'goodsComment':
      case 'goodsOrderDetail':
      case 'goodsOrderPaySuccess':
      case 'groupCenter':
      case 'groupOrderDetail':
      case 'groupRules':
      case 'logisticsPage':
      case 'makeAppointment':
      case 'makeComment':
      case 'myAddress':
      case 'myGroup':
      case 'myOrder':
      case 'previewAppointmentOrder':
      case 'previewGoodsOrder':
      case 'recharge':
      case 'searchAddress':
      case 'shoppingCart':
      case 'transferOrderDetail':
      case 'shoppingCart':
      case 'transferPage':
      case 'transferPaySuccess':
      case 'verificationCodePage':
      case 'vipCard':
      case 'goodsCustomerService':
        return '/eCommerce/pages/' + router + '/' + router;
        break;
      case 'franchiseeCooperation':
      case 'franchiseeDetail':
      case 'franchiseeDetail4':
      case 'franchiseeFacility':
      case 'franchiseeEnter':
      case 'franchiseeEnterStatus':
      case 'franchiseeList':
      case 'franchiseePerfect':
      case 'franchiseeTostore':
      case 'franchiseeWaimai':
      case 'goodsMore':
        return '/franchisee/pages/' + router + '/' + router;
        break;
      case 'communityDetail':
      case 'communityFailpass':
      case 'communityNotify':
      case 'communityPage':
      case 'communityPublish':
      case 'communityReply':
      case 'communityReport':
      case 'communityUsercenter':
      case 'newsDetail':
      case 'newsReply':
        return '/informationManagement/pages/' + router + '/' + router;
        break;
      case 'makeTostoreComment':
      case 'paySuccess':
      case 'previewOrderDetail':
      case 'previewTakeoutOrder':
      case 'takeoutMakeComment':
      case 'takeoutOrderDetail':
      case 'tostoreComment':
      case 'tostoreOrderDetail':
        return '/orderMeal/pages/' + router + '/' + router;
        break;
      case 'promotionApply':
      case 'promotionCommission':
      case 'promotionGoods':
      case 'promotionLeaderPromotion':
      case 'promotionMyIdentity':
      case 'promotionMyPromotion':
      case 'promotionShopSetting':
      case 'promotionTeam':
      case 'promotionUserCenter':
      case 'promotionUserLevel':
      case 'promotionWithdraw':
      case 'promotionWithdrawOffline':
      case 'promotionWithdrawRecord':
        return '/promotion/pages/' + router + '/' + router;
        break;
      case 'myIntegral':
      case 'myMessage':
      case 'vipCardList':
      case 'winningRecord':
        return '/userCenter/pages/' + router + '/' + router;
        break;
      case 'videoAssess':
      case 'videoDetail':
      case 'videoUsercenter':
        return '/video/pages/' + router + '/' + router;
        break;
      case 'userCenter':
        return '/pages/userCenter/userCenter';
        break;
    }
  },
  _getSystemInfo: function (options) {
    wx.getSystemInfo({
      success: function (res) {
        typeof options.success === 'function' && options.success(res);
      },
      fail: function (res) {
        typeof options.fail === 'function' && options.fail(res);
      },
      complete: function (res) {
        typeof options.complete === 'function' && options.complete(res);
      }
    });
  },
  sendRequest: function (param, customSiteUrl) {
    let that   = this;
    let data   = param.data || {};
    let header = param.header;
    let requestUrl;

    if(data.app_id){
      data._app_id = data.app_id;
    } else {
      data._app_id = data.app_id = this.getAppId();
    }

    if(!this.globalData.notBindXcxAppId){
      data.session_key = this.getSessionKey();
    }

    if(customSiteUrl) {
      requestUrl = customSiteUrl + param.url;
    } else {
      requestUrl = this.globalData.siteBaseUrl + param.url;
    }

    if(param.method){
      if(param.method.toLowerCase() == 'post'){
        data = this._modifyPostParam(data);
        header = header || {
          'content-type': 'application/x-www-form-urlencoded;'
        }
      }
      param.method = param.method.toUpperCase();
    }

    if(!param.hideLoading){
      this.showLoading({
        title: '请求中...'
      });
    }
    wx.request({
      url: requestUrl,
      data: data,
      method: param.method || 'GET',
      header: header || {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.statusCode && res.statusCode != 200) {
          that.hideToast();
          that.showToast({
            title: ''+res.errMsg,
            icon: 'none'
          });
          typeof param.successStatusAbnormal == 'function' && param.successStatusAbnormal(res.data);
          return;
        }
        if (res.data.status) {
          if (res.data.status == 2 || res.data.status == 401) {
            that.goLogin({
              success: function () {
                that.sendRequest(param, customSiteUrl);
              },
              fail: function () {
                typeof param.successStatusAbnormal == 'function' && param.successStatusAbnormal(res.data);
              }
            });
            return;
          }
          if(res.data.status == 5){
            typeof param.successStatus5 == 'function' && param.successStatus5(res.data);
            return;
          }
          if (res.data.status != 0) {
            that.hideToast();
            that.showModal({
              content: ''+res.data.data,
              confirm : function() {
                typeof param.successShowModalConfirm == 'function' && param.successShowModalConfirm(res.data);
              }
            });
            typeof param.successStatusAbnormal == 'function' && param.successStatusAbnormal(res.data);
            return;
          }
        }
        typeof param.success == 'function' && param.success(res.data);
      },
      fail: function (res) {
        console.log('request fail:', requestUrl, res.errMsg);
        that.hideToast();
        if(res.errMsg == 'request:fail url not in domain list'){
          that.showToast({
            title: '请配置正确的请求域名',
            icon: 'none',
            duration: 2000
          });
        }
        typeof param.fail == 'function' && param.fail(res.data);
      },
      complete: function (res) {
        param.hideLoading || that.hideLoading();
        typeof param.complete == 'function' && param.complete(res.data);
      }
    });
  },
  _modifyPostParam: function (obj) {
    let query = '';
    let name, value, fullSubName, subName, subValue, innerObj, i;

    for(name in obj) {
      value = obj[name];

      if(value instanceof Array) {
        for(i=0; i < value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += this._modifyPostParam(innerObj) + '&';
        }
      } else if (value instanceof Object) {
        for(subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += this._modifyPostParam(innerObj) + '&';
        }
      } else if (value !== undefined && value !== null) {
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
      }
    }

    return query.length ? query.substr(0, query.length - 1) : query;
  },
  turnToPage: function (url, isRedirect) {
    let tabBarPagePathArr = this.getTabPagePathArr();
    if (this.globalData.turnToPageFlag)return;
    this.globalData.turnToPageFlag = true;
    setTimeout(() => {
      this.globalData.turnToPageFlag = false;
    }, 1000);
    let curl = url.replace(/\?(.)+/, '');
    if(tabBarPagePathArr.indexOf(curl) != -1) {
      this.switchToTab(url);
      return;
    }
    let router = url.split('/');
    router = router[router.length-2];
    if(/page/.test(router)){
      let subPack = this.subPackagePages || {};
      for(let i in subPack){
        if (subPack[i].indexOf(router) > -1){
          url = '/' + i + url;
          break;
        }
      }
    }
    if(!isRedirect){
      wx.navigateTo({
        url: url,
        complete: (res) => {
          if (res.errMsg && /fail/i.test(res.errMsg)) {
            this.showModal({
              content: '跳转的页面不存在'
            });
          }
        }
      });
    } else {
      wx.redirectTo({
        url: url,
        complete: (res) => {
          if (res.errMsg && /fail/i.test(res.errMsg)) {
            this.showModal({
              content: '跳转的页面不存在'
            });
          }
        }
      });
    }
  },
  reLaunch: function (options) {
    wx.reLaunch({
      url: options.url,
      success: options.success,
      fail: options.fail,
      complete: options.complete
    })
  },
  switchToTab: function (url) {
    wx.switchTab({
      url: url
    });
  },
  turnBack: function (options) {
    options = options || {};
    wx.navigateBack({
      delta: options.delta || 1
    });
  },
  navigateToXcx: function (param = {}) {
    let that = this;
    if (wx.navigateToMiniProgram) {
      wx.navigateToMiniProgram({
        appId: param.appId,
        path: param.path,
        fail: function (res) {
          that.showModal({
            content: '' + res.errMsg
          })
        }
      });
    } else {
      this.showUpdateTip();
    }
  },
  setPageTitle: function (title) {
    wx.setNavigationBarTitle({
      title: title
    });
  },
  showToast: function (param) {
    wx.showToast({
      title: param.title,
      icon: param.icon,
      duration: param.duration || 1500,
      success: function (res) {
        typeof param.success == 'function' && param.success(res);
      },
      fail: function (res) {
        typeof param.fail == 'function' && param.fail(res);
      },
      complete: function (res) {
        typeof param.complete == 'function' && param.complete(res);
      }
    })
  },
  hideToast: function () {
    wx.hideToast();
  },
  showLoading: function(param){
    wx.showLoading({
      title: param.title,
      success: function (res) {
        typeof param.success == 'function' && param.success(res);
      },
      fail: function (res) {
        typeof param.fail == 'function' && param.fail(res);
      },
      complete: function (res) {
        typeof param.complete == 'function' && param.complete(res);
      }
    })
  },
  hideLoading: function(){
    wx.hideLoading();
  },
  showModal: function (param) {
    wx.showModal({
      title: param.title || '提示',
      content: param.content,
      showCancel: param.showCancel || false,
      cancelText: param.cancelText || '取消',
      cancelColor: param.cancelColor || '#000000',
      confirmText: param.confirmText || '确定',
      confirmColor: param.confirmColor || '#3CC51F',
      success: function (res) {
        if (res.confirm) {
          typeof param.confirm == 'function' && param.confirm(res);
        } else {
          typeof param.cancel == 'function' && param.cancel(res);
        }
      },
      fail: function (res) {
        typeof param.fail == 'function' && param.fail(res);
      },
      complete: function (res) {
        typeof param.complete == 'function' && param.complete(res);
      }
    })
  },
  chooseVideo: function (callback, maxDuration) {
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: maxDuration || 60,
      camera: ['front', 'back'],
      success: function (res) {
        typeof callback == 'function' && callback(res.tempFilePaths[0]);
      }
    })
  },
  chooseImage: function (callback, count) {
    let that = this;
    wx.chooseImage({
      count: count || 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let tempFilePaths = res.tempFilePaths,
            imageUrls = [],
            imglength = 0;

        that.showToast({
          title: '提交中...',
          icon: 'loading',
          duration: 10000
        });
        for (let i = 0; i < tempFilePaths.length; i++) {
          wx.uploadFile({
            url : that.globalData.siteBaseUrl+ '/index.php?r=AppData/uploadImg',
            filePath: tempFilePaths[i],
            name: 'img_data',
            success: function (res) {
              let data = JSON.parse(res.data);
              if (data.status == 0) {
                // imageUrls.push(data.data);
                imageUrls[i] = data.data;
                imglength++;
                if (imglength == tempFilePaths.length) {
                  that.hideToast();
                  typeof callback == 'function' && callback(imageUrls);
                }
              } else {
                that.hideToast();
                that.showModal({
                  content: data.data
                })
              }
            },
            fail: function (res) {
              that.hideToast();
              that.showModal({
                content: '' + res.errMsg
              });
            }
          })
        }
      },
      fail: function (res) {
        if (res.errMsg != 'chooseImage:fail cancel'){
          that.showModal({
            content: '' + res.errMsg
          })
        }
      }
    })
  },
  previewImage: function (options) {
    wx.previewImage({
      current: options.current || '',
      urls: options.urls || [options.current]
    })
  },
  playVoice: function (filePath) {
    wx.playVoice({
      filePath: filePath
    });
  },
  pauseVoice: function () {
    wx.pauseVoice();
  },
  countUserShareApp: function (callback) {
    let addTime = Date.now();
    this.sendRequest({
      url: '/index.php?r=AppShop/UserShareApp',
      complete: function (res) {
        if (res.status == 0) {
          typeof callback === 'function' && callback(addTime);
        }
      }
    });
  },
  getShareKey: function(){
    let that = this;
    that.sendRequest({
      url: "/index.php?r=appShop/getAppShareKey",
      success: res=>{
        if(res.status == 0){
          that.globalData.shareKey = res.data; 
        }
      }
    })
  },
  shareAppMessage: function (options) {
    let that = this,
        pageInstance = this.getAppCurrentPage(),
      path = that.globalData.shareKey ? options.path + '?shareKey=' + that.globalData.shareKey : options.path;
    return {
      title: options.title || this.getAppTitle() || '即速应用',
      desc: options.desc || this.getAppDescription() || '即速应用，拖拽生成app，无需编辑代码，一键打包微信小程序',
      path: path,
      imageUrl: options.imageUrl || '',
      success: function () {
        // // 统计用户分享
        // that.countUserShareApp(options.success);
      },
      complete:function(res){
        if (pageInstance.data.needbackToHomePage){
          pageInstance.setData({
            backToHomePage: {
              showButton: true
            },
            needbackToHomePage: false
          })
        }
      }
    }
  },

  wxPay: function (param) {
    let _this = this;
    wx.requestPayment({
      'timeStamp': param.timeStamp,
      'nonceStr': param.nonceStr,
      'package': param.package,
      'signType': param.signType,
      'paySign': param.paySign,
      success: function(res){
        _this.wxPaySuccess(param);
        typeof param.success === 'function' && param.success();
      },
      fail: function(res){
        if(res.errMsg === 'requestPayment:fail cancel'){
          _this.showModal({
            content: '支付已取消',
            complete: function(){
              typeof param.fail === 'function' && param.fail();
            }
          });
          return;
        }
        if(res.errMsg === 'requestPayment:fail'){
          res.errMsg = '支付失败';
        }
        _this.showModal({
          content: res.errMsg
        })
        _this.wxPayFail(param, res.errMsg);
        typeof param.fail === 'function' && param.fail();
      }
    })
  },
  wxPaySuccess: function (param) {
    let orderId = param.orderId,
        goodsType = param.goodsType,
        formId = param.package.substr(10),
        t_num = goodsType == 1 ? 'AT0104':'AT0009';

    this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppShop/SendXcxOrderCompleteMsg',
      data: {
        formId: formId,
        t_num: t_num,
        order_id: orderId
      }
    })
  },
  wxPayFail: function (param, errMsg) {
    let orderId = param.orderId,
        formId = param.package.substr(10);

    this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppShop/SendXcxOrderCompleteMsg',
      data: {
        formId: formId,
        t_num: 'AT0010',
        order_id: orderId,
        fail_reason: errMsg
      }
    })
  },
  makePhoneCall: function (number, callback) {
    wx.makePhoneCall({
      phoneNumber: number,
      success: callback
    })
  },
  getLocation: function (options) {
    wx.getLocation({
      type: options.type || 'wgs84',
      altitude: options.altitude || false,
      success: function(res){
        typeof options.success === 'function' && options.success(res);
      },
      fail: function(res){
        typeof options.fail === 'function' && options.fail(res);
      }
    })
  },
  chooseLocation: function (options) {
    let that = this;
    wx.chooseLocation({
      success: function(res){
        typeof options.success === 'function' && options.success(res);
      },
      cancel: options.cancel,
      fail: function(res){
        if (res.errMsg === 'chooseLocation:fail auth deny'){
          that.showModal({
            content: '您之前拒绝授权我们使用您的定位，致使我们无法定位，是否重新授权定位？',
            showCancel: true,
            cancelText: "否",
            confirmText: "是",
            confirm: function () {
              wx.openSetting({
                success: function (res) {
                  if (res.authSetting['scope.userLocation'] === true) {
                    that.chooseLocation(options);
                  }
                }
              })
            },
            cancel : function(){
              typeof options.fail === 'function' && options.fail();
            }
          })
        }else{
          typeof options.fail === 'function' && options.fail();
        }
      }
    });
  },
  openLocation: function (options) {
    wx.openLocation(options);
  },
  setClipboardData: function (options) {
    wx.setClipboardData({
      data: options.data || '',
      success: options.success,
      fail: options.fail,
      complete: options.complete
    })
  },
  getClipboardData: function (options) {
    wx.getClipboardData({
      success: options.success,
      fail: options.fail,
      complete: options.complete
    })
  },
  showShareMenu: function (options) {
    options = options || {};
    wx.showShareMenu({
      withShareTicket: options.withShareTicket || false,
      success: options.success,
      fail: options.fail,
      complete: options.complete
    });
  },
  scanCode: function (options) {
    options = options || {};
    wx.scanCode({
      onlyFromCamera: options.onlyFromCamera || false,
      success: options.success,
      fail: options.fail,
      complete: options.complete
    })
  },
  pageScrollTo: function (scrollTop) {
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: scrollTop
      });
    } else {
      this.showUpdateTip();
    }
  },
  getAuthSetting: function () {
    wx.getSetting({
      success: function (res) {
        return res.authSetting;
      },
      fail: function () {
        return {};
      }
    })
  },
  getStorage: function (options) {
    options = options || {};
    wx.getStorage({
      key: options.key || '',
      success: function (res) {
        typeof options.success === 'function' && options.success(res);
      },
      fail: function () {
        typeof options.fail === 'function' && options.fail();
      },
      complete: function () {
        typeof options.complete === 'function' && options.complete();
      }
    })
  },
  setStorage: function (options) {
    options = options || {};
    wx.setStorage({
      key: options.key || '',
      data: options.data || '',
      success: function () {
        typeof options.success === 'function' && options.success();
      },
      fail: function () {
        typeof options.fail === 'function' && options.fail();
      },
      complete: function () {
        typeof options.complete === 'function' && options.complete();
      }
    })
  },
  removeStorage: function (options) {
    options = options || {};
    wx.removeStorage({
      key: options.key || '',
      success: function () {
        typeof options.success === 'function' && options.success();
      },
      fail: function () {
        typeof options.fail === 'function' && options.fail();
      },
      complete: function () {
        typeof options.complete === 'function' && options.complete();
      }
    })
  },
  createAnimation: function (options) {
    options = options || {};
    return wx.createAnimation({
      duration: options.duration,
      timingFunction: options.timingFunction,
      transformOrigin: options.transformOrigin,
      delay: options.delay
    });
  },
  chooseAddress: function (options) {
    let that = this;
    options = options || {};
    wx.chooseAddress({
      success: function (res) {
        typeof options.success === 'function' && options.success(res);
      },
      fail: function (res) {
        if (res && (res.errMsg === "chooseAddress:fail auth deny" || res.errMsg === "chooseAddress:fail:auth denied" )) {
          wx.showModal({
            title: '提示',
            content: '获取通讯地址失败，这将影响您使用小程序，您可以点击右上角的菜单按钮，选择关于。进入之后再点击右上角的菜单按钮，选择设置，然后将通讯地址按钮打开，返回之后再重试。',
            showCancel: false,
            confirmText: "确定",
            success: function (res) {
            }
          })
        }else{
          typeof options.fail === 'function' && options.fail(res);
        }
      },
      complete: function (res) {     
        typeof options.complete === 'function' && options.complete(res);
      }
    })
  },
  downloadFile : function(url, successfn){
    wx.downloadFile({
      url: url, 
      success: function(res) {
        successfn && successfn(res);
      }
    })
  },
  connectWifi:function(option){
    wx.connectWifi({
      SSID: option.SSID || '',
      BSSID: option.BSSID || '',
      password: option.password || '',
      success: function(res){
        option.success && option.success(res)
      },
      fail:function(res){
        option.fail && option.fail(res)
      },
      complete:function(res){
        option.complete && option.complete(res);
      }
    })
  },
  startWifi:function(option){
    wx.startWifi({
      success:function(res){
        option.success && option.success(res);
      },
      fail:function(res){
        option.fail && option.fail(res);
      },
      complete:function (res) {
        option.complete && option.complete(res);
      }
    })
  },
  wifiErrCode:function(code){
    switch(code){
      case 12000:
        return '未初始化Wi-Fi模块';
        break;
      case 12001:
        return '系统暂不支持连接 Wi-Fi';
        break;
      case 12002:
        return 'Wi-Fi 密码错误';
        break;
      case 12003:
        return '连接超时';
        break;
      case 12004:
        return '重复连接 Wi-Fi';
        break;
      case 12005:
        return '未打开 Wi-Fi 开关';
        break;
      case 12006:
        return '未打开 GPS 定位开关';
        break;
      case 12007:
        return '已拒绝授权链接 Wi-Fi';
        break;
      case 12008:
        return 'Wi-Fi名称无效';
        break;
      case 12009:
        return '运营商配置拒绝连接 Wi-Fi';
        break;
      case 12010:
        return '系统错误';
        break;
      case 12011:
        return '无法配置 Wi-Fi';
        break;
      default:
        return '连接失败';
        break;
    }
  },
  checkSession: function(callback){
    let that = this;
    wx.checkSession({
      success: function () {
        typeof callback == 'function' && callback();
        console.log('session valid');
      },
      fail: function () {
        console.log('session Invalid');
        that.setSessionKey('');
        that._login({
          success: function(){
            typeof callback == 'function' && callback();
          }
        });
      }
    })
  },
  goLogin: function (options) {
    this._sendSessionKey(options);
  },
  isLogin: function () {
    return this.getIsLogin();
  },
  _sendSessionKey: function (options) {
    let that = this, key;
    try {
      key = wx.getStorageSync('session_key');
    } catch(e) {
      console.log('wx.getStorageSync session_key error');
      console.log(e);
    }
    console.log('_logining', that._logining);
    if(that._logining){
      that.globalData.showGetUserInfoOptions.push(options);
      return;
    }
    that._logining = true;
    that.globalData.showGetUserInfoOptions = [];
    that.globalData.showGetUserInfoOptions.push(options);

    if (!key) {
      console.log("check login key=====");
      this._login();

    } else {
      this.globalData.sessionKey = key;
      let addTime = Date.now();
      this.sendRequest({
        hideLoading: true,
        url: '/index.php?r=AppUser/onLogin',
        success: function (res) {
          if (!res.is_login) {
            that._login();
            return;
          } else if (res.is_login == 2) {
            that.globalData.notBindXcxAppId = true;
          }
          that._requestUserInfo(res.is_login);
          that.loginForRewardPoint(addTime);
        },
        fail: function (res) {
          console.log('_sendSessionKey fail');
          let callback = that.globalData.showGetUserInfoOptions;
          for(let i = 0; i < callback.length; i++){
            let options = callback[i];
            typeof options.fail == 'function' && options.fail(res);
          }
        },
        successStatusAbnormal: function(){
          that._logining = false;
        }
      });
    }
  },
  _logining: false,
  _login: function () {
    let that = this;

    wx.login({
      success: function (res) {
        if (res.code) {
          that._sendCode(res.code);
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      },
      fail: function (res) {
        that._logining = false;
        console.log('login fail: ' + res.errMsg);
      }
    })
  },
  _sendCode: function (code) {
    let that = this;
    let addTime = Date.now();
    this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppUser/onLogin',
      data: {
        code: code
      },
      success: function (res) {
        if (res.is_login == 2) {
          that.globalData.notBindXcxAppId = true;
        }
        that.setSessionKey(res.data || that.globalData.sessionKey);
        that._requestUserInfo(res.is_login);
        that.loginForRewardPoint(addTime);
      },
      fail: function (res) {
        that._logining = false;
        console.log('_sendCode fail');
      },
      successStatusAbnormal: function(){
        that._logining = false;
      }
    })
  },
  _requestUserInfo: function (is_login) {
    if (is_login == 1) {
      this._requestUserXcxInfo();
    } else {
      this._requestUserWxInfo();
    }
  },
  _requestUserXcxInfo: function () {
    let that = this;
    this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppData/getXcxUserInfo',
      success: function (res) {
        if (res.data) {
          that.setUserInfoStorage(res.data);
        }
        that.setIsLogin(true);
        that.getShareKey();
        let callback = that.globalData.showGetUserInfoOptions;
        for(let i = 0; i < callback.length; i++){
          let options = callback[i];
          typeof options.success === 'function' && options.success();
        }
      },
      fail: function (res) {
        console.log('_requestUserXcxInfo fail');
      },
      complete: function(){
        that._logining = false;
      }
    })
  },
  _requestUserWxInfo: function () {
    let that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (msg) {
              that._sendUserInfo(msg.userInfo);
            },
            fail: function(msg){
              console.log('getUserInfo fail');
            }
          })
        }else{
          let pageInstance = that.getAppCurrentPage();
          pageInstance.setData({
            showGetUserInfo: true
          });
        }
      },
      fail: function(res){
        let pageInstance = that.getAppCurrentPage();
        pageInstance.setData({
          showGetUserInfo: true
        });
      }
    })

  },
  _sendUserInfo: function (userInfo) {
    let that = this;
    let pageInstance = that.getAppCurrentPage();
    this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppUser/LoginUser',
      method: 'post',
      data: {
        nickname: userInfo['nickName'],
        gender: userInfo['gender'],
        city: userInfo['city'],
        province: userInfo['province'],
        country: userInfo['country'],
        avatarUrl: userInfo['avatarUrl']
      },
      success: function (res) {
        that.setUserInfoStorage(res.data.user_info);
        that.setIsLogin(true);
        that.getShareKey();
        let callback = that.globalData.showGetUserInfoOptions;
        for(let i = 0; i < callback.length; i++){
          let options = callback[i];
          typeof options.success === 'function' && options.success();
        }
      },
      fail: function (res) {
        console.log('_sendUserInfo fail');
        let callback = that.globalData.showGetUserInfoOptions;
        for(let i = 0; i < callback.length; i++){
          let options = callback[i];
          typeof options.fail == 'function' && options.fail(res);
        }
      },
      complete: function(){
        pageInstance.setData({
          showGetUserInfo: false
        });
        that._logining = false;
      }
    })
  },

  onPageLoad: function (event) {
    let pageInstance  = this.getAppCurrentPage();
    let detail        = event.detail || '';
    let promotionName = event.promotionName;
    let that = this;
    pageInstance.sharePageParams = event;

    let appOption = this.globalData.appOptions;
    if (appOption && appOption.path.split('/')[1] != this.globalData.homepageRouter && this.getTabPagePathArr().indexOf('/' + appOption.path) == -1 && appOption.path == pageInstance.route && !pageInstance.isbackHome) {
      pageInstance.isbackHome = true;
      pageInstance.setData({
        'backToHomePage': {
          showButton: true,
          showTip: true
        }
      })
    } else {
      pageInstance.setData({
        'backToHomePage': {
          showButton: false,
          showTip: false
        }
      })
    }
    pageInstance.setData({
      dataId: detail,
      addShoppingCartShow: false,
      addTostoreShoppingCartShow: false
    });
    this.setPageUserInfo();
    if (detail) {
      pageInstance.dataId = detail;
    }
    if (promotionName) {
      let userInfo = this.getUserInfo();
      this.setPageTitle(promotionName);
    }
    if (!!pageInstance.carouselGroupidsParams) {
      for(let i in pageInstance.carouselGroupidsParams){
        let compid = pageInstance.carouselGroupidsParams[i].compid;
        let carouselgroupId = pageInstance.carouselGroupidsParams[i].carouselgroupId;
        if(carouselgroupId){
          let deletePic = {};
          deletePic[compid + '.content'] = [];
          pageInstance.setData(deletePic);
        }
      }
    }
    for(let i in pageInstance.data){
      if(/^bbs[\d]+$/.test(i)){
        pageInstance.reachBottomFuc = [{
          param :  {
            compId : i
          },
          triggerFuc : function(param) {
            that.bbsScrollFuc(param.compId);
          }
        }];
      }
      if(/^list_vessel[\d]+$/.test(i)){
        let component = pageInstance.data[i];
        if(component.customFeature.vesselAutoheight == 1 && component.customFeature.loadingMethod == 0){
          pageInstance.reachBottomFuc = [{
            param :  component,
            triggerFuc : function(param) {
              that.pageScrollFunc(param.compId);
            }
          }];
        }
      }
      if(/^goods_list[\d]+$/.test(i)){
        let component = pageInstance.data[i];
        if(component.customFeature.vesselAutoheight == 1 && component.customFeature.loadingMethod == 0){
          pageInstance.reachBottomFuc = [{
            param :  component,
            triggerFuc : function(param) {
              that.goodsScrollFunc(param.compId);
            }
          }];
        }
      }
      if(/^seckill[\d]+$/.test(i)){
        let component = pageInstance.data[i];
        if(component.customFeature.vesselAutoheight == 1 && component.customFeature.loadingMethod == 0){
          pageInstance.reachBottomFuc = [{
            param :  component,
            triggerFuc : function(param) {
              that.seckillScrollFunc(param.compId);
            }
          }];
        }
      }
      if(/^video_list[\d]+$/.test(i)){
        let component = pageInstance.data[i];
        if(component.customFeature.vesselAutoheight == 1 && component.customFeature.loadingMethod == 0){
          pageInstance.reachBottomFuc = [{
            param :  component,
            triggerFuc : function(param) {
              that.videoScrollFunc(param.compId);
            }
          }];
        }
      }
      if(/^news[\d]+$/.test(i)){ //资讯列表滚动到底部加载数据,只能有一个
        let component = pageInstance.data[i];
        pageInstance.reachBottomFuc = [{
          param: component,
          triggerFuc: function (param) {
            that.getNewsList({ compid: param.compId });
          }
        }]
      }
      if(/^topic[\d]+$/.test(i)){ //话题列表滚动到底部加载数据,只能有一个
        let component = pageInstance.data[i];
        if (component.customFeature.vesselAutoheight == 1 && component.customFeature.loadingMethod == 0) {
          pageInstance.reachBottomFuc = [{
            param: component,
            triggerFuc: function (param) {
              that.getTopListData(pageInstance, param.compId );
            }
          }]
        }
      }
      if (/^franchisee_list[\d]+$/.test(i)) { //多商家列表滚动到底部加载数据,只能有一个
        let component = pageInstance.data[i];
        if (component.customFeature.vesselAutoheight == 1 && component.customFeature.loadingMethod == 0) {
          pageInstance.reachBottomFuc = [{
            param: component,
            triggerFuc: function (param) {
              that.franchiseeScrollFunc(param.compId);
            }
          }];
        }
      }
    }

    this.globalData.takeoutRefresh = false;
    this.globalData.tostoreRefresh = false;
    if(pageInstance.page_router){
      this.globalData['franchiseeTplChange-' + pageInstance.page_router] = false;
    }

    pageInstance.dataInitial();
  },
  pullRefreshTime : '',
  onPagePullDownRefresh: function(){
    let pageInstance  = this.getAppCurrentPage();
    let that = this;

    let downcountArr = pageInstance.downcountArr;
    if(downcountArr && downcountArr.length){
      downcountArr = downcountArr.concat().reverse();
      for (let i = 0; i < downcountArr.length; i++) {
        downcountArr[i] && downcountArr[i].clear();
      }
    }

    pageInstance.setData({
      addShoppingCartShow: false,
      addTostoreShoppingCartShow: false
    });
    this.setPageUserInfo();
    pageInstance.requestNum = 1;
    this.pageDataInitial(true);

    clearTimeout(this.pullRefreshTime);
    this.pullRefreshTime = setTimeout(function(){
      wx.stopPullDownRefresh();
    }, 3000);
  },

  pageDataInitial: function (isPullRefresh, pageIn) {
    let _this          = this;
    let pageInstance   = pageIn || this.getAppCurrentPage();
    let pageRequestNum = pageInstance.requestNum;
    let newdata        = {};

    if(!pageInstance.pageLoaded){
      this._getPageData(pageInstance.page_router);
      return;
    }

    if (pageInstance.slidePanelComps.length) {
      for (let i in pageInstance.slidePanelComps){
        let item = pageInstance.slidePanelComps[i];
        if(item.compid){
          clearInterval(pageInstance.data[item.compid].slideInterval);
          if (pageInstance.data[item.compid].customFeature.autoplay && pageInstance.data[item.compid].customFeature.interval){
            this.slideSwiper({
              pageInstance: pageInstance,
              compid: item.compid
            })
          }
        }
      }
    }

    // 优先判断页面是否绑定了数据对象，没有绑定时直接展示页面，绑定时就等数据请求之后再展示
    if (!!pageInstance.dataId && !!pageInstance.page_form) {
      let dataid = parseInt(pageInstance.dataId);
      let param = {};

      param.data_id = dataid;
      param.form = pageInstance.page_form;

      pageInstance.requestNum = pageRequestNum + 1;
      _this.sendRequest({
        hideLoading: pageRequestNum++ == 1 ? false : true,
        url: '/index.php?r=AppData/getFormData',
        data: param,
        method: 'post',
        success: function (res) {
          let newdata = {};
          let formdata = res.data[0].form_data;

          for (let i in formdata) {
            if (i == 'category') {
              continue;
            }
            if(/region/.test(i)){
              continue;
            }

            let description = formdata[i];
            if (_this.needParseRichText(description)) {
              formdata[i] = _this.getWxParseResult(description,  'detail_data.' + i);
            }
          }
          newdata['detail_data'] = formdata;
          pageInstance.setData(newdata);

          // 当有视频字段时，请求视频链接，并放到数据里
          for (let i in formdata) {
            if (formdata[i] instanceof Object && formdata[i].type === 'video') {
              let video = formdata[i];

              pageInstance.requestNum = pageRequestNum + 1;
              _this.sendRequest({
                hideLoading: pageRequestNum++ == 1 ? false : true,   // 页面第一个请求才展示loading
                url: '/index.php?r=AppVideo/GetVideoLibUrl',
                data: {
                  id : video.id
                },
                method: 'get',
                success: function (res) {
                  let videoUrl = res.data,
                      newdata = {};

                  newdata['detail_data.'+i+'.videoUrl'] = videoUrl;
                  pageInstance.setData(newdata);
                }
              });
            }
          }

          if (!!pageInstance.carouselGroupidsParams.length) {
            for (let i in pageInstance.carouselGroupidsParams) {
              let compid = pageInstance.carouselGroupidsParams[i].compid;
              let segment = pageInstance.data[compid].customFeature.segment;
              let detail_data = pageInstance.data.detail_data;
              let carouselgroupId = segment && detail_data && detail_data[segment] ? detail_data[segment][0].text : '';
  
              carouselgroupId && _this._initialCarouselData(pageInstance, compid, carouselgroupId);
            }
          }
          
          if (!!pageInstance.dynamicVesselComps.length) {
            for (let i in pageInstance.dynamicVesselComps) {
              let compid = pageInstance.dynamicVesselComps[i].compid;
              let customFeature = pageInstance.data[compid].customFeature;
              let vessel_param = {
                "form": customFeature.form,
                "is_count": pageInstance.dynamicVesselComps[i].param.is_count,
                "page": 1,
                "param_segment": customFeature.param_segment,
                "search_segment": customFeature.search_segment
              };

              if (vessel_param.param_segment === 'id') {
                vessel_param.idx = vessel_param.search_segment;
                vessel_param.idx_value = pageInstance.dataId;
              } else if (!!newdata.detail_data[vessel_param.param_segment]) {
                vessel_param.idx = vessel_param.search_segment;
                vessel_param.idx_value = newdata.detail_data[vessel_param.param_segment];
              } else {
                continue;
              }
              let dynewdata = {};
              dynewdata[compid + '.loading'] = true;
              dynewdata[compid + '.loadingFail'] = false;
              dynewdata[compid + '.list_data'] = [];
              dynewdata[compid + '.is_more'] = 1;
              pageInstance.setData(dynewdata);
              _this.sendRequest({
                hideLoading: true,   // 页面第一个请求才展示loading
                url: '/index.php?r=AppData/getFormDataList',
                data: {
                  app_id: vessel_param.app_id,
                  form: vessel_param.form,
                  page: 1,
                  idx_arr: {
                    idx: vessel_param.idx,
                    idx_value: vessel_param.idx_value
                  }
                },
                method: 'post',
                success: function (res) {
                  let newDynamicData = {};

                  if (!res.data.length) {
                    return;
                  }

                  if (param.form !== 'form') { // 动态列表绑定表单则不调用富文本解析
                    for (let j in res.data) {
                      for (let k in res.data[j].form_data) {
                        if (k == 'category') {
                          continue;
                        }
                        if(/region/.test(k)){
                          continue;
                        }
                        if(k == 'goods_model') {
                          res.data[j].form_data.virtual_price = _this.formVirtualPrice(res.data[j].form_data);
                        }

                        let description = res.data[j].form_data[k];

                        // 判断字段是否需要进行富文本解析
                        if (_this.needParseRichText(description)) {
                          res.data[j].form_data[k] = _this.getWxParseResult(description);
                        }
                      }
                    }
                  }

                  newDynamicData[compid + '.list_data'] = res.data;
                  newDynamicData[compid + '.is_more'] = res.is_more || 0;
                  newDynamicData[compid + '.curpage'] = res.current_page;
                  newDynamicData[compid + '.loading'] = false;
                  newDynamicData[compid + '.loadingFail'] = false;
                  pageInstance.setData(newDynamicData);
                },
                fail: function () {
                  let dynewdata2 = {};
                  dynewdata2[compid + '.loadingFail'] = true;
                  dynewdata2[compid + '.loading'] = false;
                  pageInstance.setData(dynewdata2);
                }
              });
            }
          }
        },
        complete: function () {
          pageInstance.setData({
            page_hidden: false
          });
        }
      })
    } else {
      pageInstance.setData({
        page_hidden: false
      });
    }

    if (!!pageInstance.carouselGroupidsParams.length) {
      for (let i in pageInstance.carouselGroupidsParams) {
        let compid = pageInstance.carouselGroupidsParams[i].compid;
        let carouselgroupId = pageInstance.data[compid].customFeature.carouselgroupId;

        carouselgroupId && this._initialCarouselData(pageInstance, compid, carouselgroupId);
      }
    }

    if (pageInstance.user_center_compids_params.length) {
      for (let i in pageInstance.user_center_compids_params) {
        let compid = pageInstance.user_center_compids_params[i].compid
        this._initUserCenterData(pageInstance, compid);
      }
    }
    if (!!pageInstance.list_compids_params.length) {
      for (let i in pageInstance.list_compids_params) {
        let compid = pageInstance.list_compids_params[i].compid;
        let compData = pageInstance.data[compid];
        let customFeature = compData.customFeature;
        let url = '/index.php?r=AppData/getFormDataList';
        let param = { 
          id: customFeature.id, 
          form: customFeature.form, 
          page: 1, 
          is_count: pageInstance.list_compids_params[i].param.is_count 
        };
        if(customFeature.form=='group_buy'){
          url="/index.php?r=AppGroupBuy/GetGroupBuyGoodsList";
          param ={
            page:1,
            form: customFeature.form, 
            current_status:0
          }
        }
        let field = _this.getListVessel(compData);
        let fieldData = {};
        fieldData[compid + '.listField'] = field;
        fieldData[compid + '.loading'] = true;
        fieldData[compid + '.loadingFail'] = false;
        fieldData[compid + '.list_data'] = [];
        fieldData[compid + '.is_more'] = 1;
        fieldData[compid + '.curpage'] = 0;
        pageInstance.setData(fieldData);

        if(customFeature.source && customFeature.source !== 'none'){
          param.idx_arr = {
            idx: 'category',
            idx_value: customFeature.source
          }
        }
        param.page_size = customFeature.loadingNum || 10;
        _this.sendRequest({
          hideLoading: true,
          url: url,
          data: param,
          method: 'post',
          success: function (res) {
            if (res.status == 0) {
              let newdata = {};

              if (param.form !== 'form') {
                for (let j in res.data) {
                  if (customFeature.form == 'group_buy') {
                    res.data[j] = {
                      form_data: Object.assign({}, res.data[j])
                    }
                  }
                  for (let k in res.data[j].form_data) {
                    if (k == 'category') {
                      continue;
                    }
                    if(/region/.test(k)){
                      continue;
                    }
                    if(k == 'goods_model') {
                      res.data[j].form_data.virtual_price = _this.formVirtualPrice(res.data[j].form_data);
                    }
                    let description = res.data[j].form_data[k];
                    
                    if (field.indexOf(k) < 0 && /<("[^"]*"|'[^']*'|[^'">])*>/.test(description)) { //没有绑定的字段的富文本置为空
                      res.data[j].form_data[k] = '';
                    } else if (_this.needParseRichText(description)) {
                      res.data[j].form_data[k] = _this.getWxParseResult(description);
                    }
                  }
                }
              }

              newdata[compid + '.list_data'] = res.data;
              newdata[compid + '.is_more'] = res.is_more;
              newdata[compid + '.curpage'] = 1;
              newdata[compid + '.loading'] = false;
              newdata[compid + '.loadingFail'] = false;

              pageInstance.setData(newdata);
            }
          },
          fail: function(res){
            let newdata = {};
            newdata[compid + '.loadingFail'] = true;
            newdata[compid + '.loading'] = false;
            pageInstance.setData(newdata);
          }
        });
      }
    }

    if (!!pageInstance.goods_compids_params.length) {
      for (let i in pageInstance.goods_compids_params) {
        let compid = pageInstance.goods_compids_params[i].compid;
        let param = pageInstance.goods_compids_params[i].param;
        let compData = pageInstance.data[compid];
        let customFeature = compData.customFeature;
        let newInitData = {};
        newInitData[compid + '.goods_data'] = [];
        newInitData[compid + '.is_more'] = 1;
        newInitData[compid + '.loadingFail'] = false;
        newInitData[compid + '.curpage'] = 0;
        pageInstance.setData(newInitData);
        param.page = 1;
        param.is_integral = customFeature.isIntegral ? 1 : 0;
        if (param.form === 'takeout') {
          this._takeoutInit({
            param: param,
            compid: compid,
            compData: compData
          });
        }else if(param.form === 'tostore'){
          _this.getTostoreCartList();

          param.page_size = customFeature.loadingNum || 20;
          pageInstance.requestNum = pageRequestNum + 1;
          _this.sendRequest({
            hideLoading: pageRequestNum++ == 1 ? false : true,
            url: '/index.php?r=AppShop/GetGoodsList',
            data: param,
            method: 'post',
            success: function (res) {
              if (res.status == 0) {
                let newdata = {};
                let goodslist = res.data;
                for (let i = 0; i < goodslist.length; i++) {
                  if (goodslist[i].form_data.goods_model && (goodslist[i].form_data.goods_model.length >= 2)) {
                    goodslist[i].form_data.price = goodslist[i].form_data.goods_price || goodslist[i].form_data.price;
                  }
                }
                if (_this.getHomepageRouter() == pageInstance.page_router) {
                  let second = new Date().getMinutes().toString();
                  if (second.length <= 1) {
                    second = '0' + second;
                  }
                  let currentTime = new Date().getHours().toString() + second,
                      showFlag = true,
                      showTime = '';

                  pageInstance.requestNum = pageRequestNum + 1;
                  _this.sendRequest({
                    hideLoading: pageRequestNum++ == 1 ? false : true,
                    url: '/index.php?r=AppShop/getBusinessTime',
                    method: 'post',
                    data: {
                      app_id: _this.getAppId()
                    },
                    success: function (res) {
                      let businessTime = res.data.business_time;
                      if(businessTime && businessTime.length){
                        for (let i = 0; i < businessTime.length; i++) {
                          showTime += businessTime[i].start_time.substring(0, 2) + ':' + businessTime[i].start_time.substring(2, 4) + '-' + businessTime[i].end_time.substring(0, 2) + ':' + businessTime[i].end_time.substring(2, 4) + (businessTime.length == 1 ? '' : (i <= businessTime.length - 1 ? ' / ' : ''));
                          if (+currentTime > +businessTime[i].start_time && +currentTime < +businessTime[i].end_time) {
                            showFlag = false;
                          }
                        }
                      }
                      if (showFlag) {
                        _this.showModal({
                          content: '店铺休息中,暂时无法接单。营业时间为：' + showTime
                        })
                      }
                    }
                  });
                }
                newdata[compid + '.goods_data'] = goodslist;
                newdata[compid + '.is_more'] = res.is_more;
                newdata[compid + '.curpage'] = 1;
                pageInstance.setData(newdata);
              }
            },
            fail: function (res) {
              let newdata = {};
              newdata[compid + '.loadingFail'] = true;
              newdata[compid + '.loading'] = false;
              pageInstance.setData(newdata);
            }
          });
        }else {
          var isClassify = false;
          if (!!pageInstance.newClassifyGroupidsParams.length) {
            let params = pageInstance.newClassifyGroupidsParams;
            for (let i = 0; i < params.length; i++) {
              if (params[i].customFeature.refresh_object == customFeature.id){
                isClassify = true;
              }
            }
          }
          if (!isClassify){
            param.page_size = customFeature.loadingNum || 20;
            pageInstance.requestNum = pageRequestNum + 1;
            _this.sendRequest({
              hideLoading: pageRequestNum++ == 1 ? false : true,
              url: '/index.php?r=AppShop/GetGoodsList',
              data: param,
              method: 'post',
              success: function (res) {
                if (res.status == 0) {
                  for(let i in res.data){
                    if (res.data[i].form_data.goods_model) {
                      let modelVP = [];
                      for (let j in res.data[i].form_data.goods_model){
                        modelVP.push(res.data[i].form_data.goods_model[j].virtual_price == '' ? 0 : Number(res.data[i].form_data.goods_model[j].virtual_price))
                      }
                      Math.min(...modelVP) == Math.max(...modelVP) ? res.data[i].form_data.virtual_price = Math.min(...modelVP).toFixed(2) :
                      res.data[i].form_data.virtual_price = Math.min(...modelVP).toFixed(2) + '~' + Math.max(...modelVP).toFixed(2);
                    }
                    delete res.data[i].form_data.description; 
                  }
                  newdata = {};
                  newdata[compid + '.goods_data'] = res.data;
                  newdata[compid + '.is_more'] = res.is_more;
                  newdata[compid + '.curpage'] = 1;
                  pageInstance.setData(newdata);
                }
              },
              fail: function (res) {
                let newdata = {};
                newdata[compid + '.loadingFail'] = true;
                newdata[compid + '.loading'] = false;
                pageInstance.setData(newdata);
              }
            });
            if (param.form === 'goods'){
              _this.getAppECStoreConfig((res)=> {
                let newdata = {};
                newdata[compid + '.storeStyle'] = res.color_config;
                pageInstance.setData(newdata);
              })
            }
          }
        }
      }
    }
    if (!!pageInstance.franchiseeComps.length) {
      for (let i in pageInstance.franchiseeComps) {
        let compid = pageInstance.franchiseeComps[i].compid;
        let param = pageInstance.franchiseeComps[i].param;

        _this.initialFranchiseeList(compid, param, pageInstance);
      }
    }


    if (!!pageInstance.relobj_auto.length) {
      for (let i in pageInstance.relobj_auto) {
        let obj = pageInstance.relobj_auto[i],
            objrel = obj.obj_rel,
            AutoAddCount = obj.auto_add_count,
            compid = obj.compid,
            hasCounted = obj.has_counted,
            parentcompid = obj.parentcompid;

        if (parentcompid != '' && parentcompid != null) {
          if (compid.search('data.') !== -1) {
            compid = compid.substr(5);
          }
          compid = parentcompid + '.' + compid;
        }

        if(!!pageInstance.dataId && !!pageInstance.page_form){
          objrel = pageInstance.page_form + '_' + pageInstance.dataId;

          if(AutoAddCount){
            objrel = objrel + '_view';
          }

          pageInstance.setData({[compid + 'objrel']: objrel});
        }

        pageInstance.requestNum = pageRequestNum + 1;
        _this.sendRequest({
          hideLoading: pageRequestNum++ == 1 ? false : true,
          url: '/index.php?r=AppData/getCount',
          data: {
            obj_rel: objrel
          },
          success: function (res) {
            if (res.status == 0) {
              if (AutoAddCount == 1) {
                if (hasCounted == 0) {
                  pageInstance.requestNum = pageRequestNum + 1;
                  _this.sendRequest({
                    hideLoading: pageRequestNum++ == 1 ? false : true,
                    url: '/index.php?r=AppData/addCount',
                    data: {
                      obj_rel: objrel
                    },
                    success: function (newres) {
                      if (newres.status == 0) {
                        newdata = {};
                        newdata[compid + '.count_data.count_num'] = parseInt(newres.data.count_num);
                        newdata[compid + '.count_data.has_count'] = parseInt(newres.data.has_count);
                        pageInstance.setData(newdata);
                      }
                    },
                    fail: function () {
                    }
                  });
                }
              } else {
                newdata = {};
                newdata[compid + '.count_data.count_num'] = parseInt(res.data.count_num);
                newdata[compid + '.count_data.has_count'] = parseInt(res.data.has_count);
                pageInstance.setData(newdata);
              }
            }
          }
        });
      }
    }

    if(pageInstance.bbsCompIds.length){
      for (let i in pageInstance.bbsCompIds) {
        let compid = pageInstance.bbsCompIds[i],
            bbsData = pageInstance.data[compid],
            bbs_idx_value = '';

        if(bbsData.customFeature.ifBindPage && bbsData.customFeature.ifBindPage !== 'false'){
          if(pageInstance.page_form && pageInstance.page_form != 'none'){
            bbs_idx_value = pageInstance.page_form + '_' + pageInstance.dataId;
          }else{
            bbs_idx_value = pageInstance.page_router;
          }
        }else{
          bbs_idx_value = _this.getAppId();
        }
        let newdata = {};
        newdata[compid + '.loading'] = true;
        newdata[compid + '.loadingFail'] = false;
        newdata[compid + '.content.data'] = [];
        newdata[compid + '.content.is_more'] = 1;
        newdata[compid + '.content.current_page'] = 0;
        pageInstance.setData(newdata);

        pageInstance.requestNum = pageRequestNum + 1;
        _this.sendRequest({
          hideLoading: true,   // 页面第一个请求才展示loading
          url: '/index.php?r=AppData/getFormDataList',
          method: 'post',
          data: {
            form: 'bbs',
            is_count: bbsData.customFeature.ifLike ? 1 : 0,
            page: 1,
            idx_arr: {
              idx: 'rel_obj',
              idx_value: bbs_idx_value
            }
          },
          success: function(res){
            let data = {};

            for(let i in res.data){
              res.data[i].form_data.content.addTime = res.data[i].form_data.content.addTime.slice(2, 19);
            }
            if (res.count > 99){
              res.count = '99+'
            } else if (res.count > 999) {
              res.count = '999+'
            } else if (res.count > 10000) {
              res.count = '1w+'
            }

            data[compid+'.content'] = res;
            data[compid+'.comment'] = {};
            data[compid + '.loading'] = false;
            data[compid + '.loadingFail'] = false;
            pageInstance.setData(data);
          },
          fail: function (res) {
            let newdata = {};
            newdata[compid + '.loadingFail'] = true;
            newdata[compid + '.loading'] = false;
            pageInstance.setData(newdata);
          }
        });
      }
    }
    if (!!pageInstance.communityComps.length) {
      for (let i in pageInstance.communityComps) {
        let compid = pageInstance.communityComps[i].compid,
            dataId = [],
            content = pageInstance.data[compid].content,
            customFeature = pageInstance.data[compid].customFeature,
            styleData = {},
            imgStyle = [],
            liStyle = [],
            secStyle = [],
            maskStyle = [];

        secStyle = [
              'color:'+ customFeature.secColor ,
              'text-decoration:' + (customFeature.secTextDecoration || 'none'),
              'text-align:' + (customFeature.secTextAlign || 'left'),
              'font-size:' + customFeature.secFontSize,
              'font-style:' + (customFeature.secFontStyle || 'normal'),
              'font-weight:' + (customFeature.secFontWeight || 'normal')
          ].join(";");

        imgStyle = [
                'width :'+ (customFeature.imgWidth * 2.34) + 'rpx',
                'height :'+ (customFeature.imgHeight * 2.34) + 'rpx'
          ].join(";");
        liStyle = [
              'height :'+ (customFeature.lineHeight * 2.34) + 'rpx',
              'margin-bottom :'+ (customFeature.margin * 2.34) +'rpx'
          ];
        customFeature['lineBackgroundColor'] && (liStyle.push('background-color:' + customFeature['lineBackgroundColor']));
        customFeature['lineBackgroundImage'] && (liStyle.push('background-image:' + customFeature['lineBackgroundImage']));
        customFeature['maskMarginSpace'] && (liStyle.push('margin-right:' + (customFeature.maskMarginSpace * 2.34) + 'rpx'));
        customFeature['mode'] && customFeature['mode'] != 0 && (liStyle.push('width: '+ (customFeature['imgWidth'] * 2.34) + 'rpx'));
        liStyle = liStyle.join(";");
        maskStyle = [
          'background-color:'+ customFeature.maskBackgroundColor,
          'opacity:'+ customFeature.opacity
        ].join(';');

        styleData[compid + '.secStyle'] = secStyle;
        styleData[compid + '.imgStyle'] = imgStyle;
        styleData[compid + '.liStyle']  = liStyle;
        styleData[compid + '.maskStyle']  = maskStyle;

        if (customFeature.mode == undefined) {
          styleData[compid + '.customFeature.mode'] = 0;
          styleData[compid + '.customFeature.style'] = 1;
        }

        pageInstance.setData(styleData);

        _this.initialCommunityList(compid, pageInstance);
      }
    }

    if (pageInstance.cityLocationComps.length){
      for (let i in pageInstance.cityLocationComps){
        let compid = pageInstance.cityLocationComps[i];
        let customFeature = pageInstance.data[compid].customFeature;
        let form = customFeature.citylocation ? customFeature.citylocation.customFeature.form : '';
        pageInstance.data[compid].citylocationHidden = false;

        let newdata = {};
        newdata[compid + '.provinces'] = [];
        newdata[compid + '.provinces_ids'] = [];
        newdata[compid + '.province'] = '';
        newdata[compid + '.citys'] = [];
        newdata[compid + '.city_ids'] = [];
        newdata[compid + '.city '] = '';
        newdata[compid + '.districts'] = [];
        newdata[compid + '.district_ids'] = [];
        newdata[compid + '.district'] = '';
        newdata[compid + '.value'] = [0, 0, 0];
        
        if (_this.globalData.locationInfo.latitude) {
          let info = _this.globalData.locationInfo.info;

          newdata[compid + '.local'] = info.address_component.province + ' ' + info.address_component.city + ' ' + info.address_component.district + ' >';
          pageInstance.setData(newdata);
        }else{
          _this.getLocation({
            success: function (res) {
              let latitude = res.latitude,
                  longitude = res.longitude;
              if(!latitude){
                newdata = {};
                newdata[compid + '.local'] = '定位失败';
                pageInstance.setData(newdata);
                return;
              }
              pageInstance.requestNum = pageRequestNum + 1;
              _this.sendRequest({
                hideLoading: pageRequestNum++ == 1 ? false : true,
                url: '/index.php?r=Map/GetAreaInfoByLatAndLng',
                data: {
                  latitude: latitude,
                  longitude: longitude
                },
                success: function (res) {
                  newdata[compid + '.local'] = res.data.address_component.province+' '+res.data.address_component.city + ' ' +res.data.address_component.district + ' >';
                  pageInstance.setData(newdata);

                  _this.setLocationInfo({
                    latitude: latitude,
                    longitude: longitude,
                    address: res.data.formatted_addresses.recommend,
                    info: res.data
                  });
                }
              })
            }
          });
        }
        pageInstance.requestNum = pageRequestNum + 1;
        _this.sendRequest({
          hideLoading: pageRequestNum++ == 1 ? false : true,   // 页面第一个请求才展示loading
          url: '/index.php?r=AppRegion/getAllExistedDataRegionList&is_xcx=1&form=' + form,
          success: function (data) {
            let newArea = {};
            newArea[compid + '.areaList'] = data.data;
            pageInstance.setData(newArea);
          }
        });
      }
    }

    if (!!pageInstance.seckillOnLoadCompidParam.length) {
      for (let i in pageInstance.seckillOnLoadCompidParam) {
        let compid = pageInstance.seckillOnLoadCompidParam[i].compid;
        let param = pageInstance.seckillOnLoadCompidParam[i].param;
        let compData = pageInstance.data[compid];
        let customFeature = compData.customFeature;
        let newdata = {};
        newdata[compid + '.loading'] = true;
        newdata[compid + '.loadingFail'] = false;
        newdata[compid + '.goods_data'] = [];
        newdata[compid + '.is_more'] = 1;
        newdata[compid + '.curpage'] = 0;
        pageInstance.setData(newdata);

        param.page_size = customFeature.loadingNum || 10;
        param.is_seckill = 1;
        param.page = 1;

        _this.sendRequest({
          hideLoading: true,   // 页面第一个请求才展示loading
          url: '/index.php?r=AppShop/GetGoodsList',
          data: param,
          method: 'post',
          success: function (res) {
            let rdata = res.data,
                newdata = {},
                downcountArr = pageInstance.downcountArr || [];

            for (let i = 0; i < rdata.length; i++) {
              let f = rdata[i].form_data,
                  dc ;

              f.downCount = {
                hours : '00' ,
                minutes : '00' ,
                seconds : '00'
              };
              if(f.seckill_start_state == 0){
                dc = _this.beforeSeckillDownCount(f , pageInstance , compid + '.goods_data[' + i + '].form_data');
              }else if(f.seckill_start_state == 1){
                dc = _this.duringSeckillDownCount(f , pageInstance , compid + '.goods_data[' + i + '].form_data');
              }
              dc && downcountArr.push(dc);
            }
            newdata[compid + '.goods_data'] = res.data;
            newdata[compid + '.is_more'] = res.is_more;
            newdata[compid + '.curpage'] = 1;
            newdata[compid + '.loading'] = false;
            newdata[compid + '.loadingFail'] = false;
            pageInstance.downcountArr = downcountArr;
            pageInstance.setData(newdata);
          },
          fail: function (res) {
            let newdata = {};
            newdata[compid + '.loadingFail'] = true;
            newdata[compid + '.loading'] = false;
            pageInstance.setData(newdata);
          }
        });
      }
    }
    if (!!pageInstance.newClassifyGroupidsParams.length) {
      let params = pageInstance.newClassifyGroupidsParams;
      for(let i = 0; i < params.length; i++){
        let compId = params[i]['compid'];
        let compData = pageInstance.data[compId];
        let customFeature = compData.customFeature;
        _this.sendRequest({
          hideLoading: true,
          url: '/index.php?r=appData/getCategoryByGroup',
          data: {
            group_id: customFeature.classifyGroupId
          },
          success: function(res){
            let classifyData  = res.data.item;
            let classifyLevel = +customFeature.classifyType || 1;
            let newData = {};
            let selectedIndex = customFeature.selected || 0;

            if (customFeature.isManualAddClassify === true) {
              let compContent = compData.content, newClassifyData = [];
              compContent.forEach(function (co) {
                let newItem = {};
                let targetItem = classifyData.find(function (cd) {
                  return cd.category_id == co.firstClassifyId;
                });
                if (targetItem) {
                  Object.keys(targetItem).forEach(function (k) {
                    newItem[k] = targetItem[k];
                  });
                  if (co.secondClassifyId > 0 && newItem.subclass.length) {
                    newItem.subclass = newItem.subclass.filter(function (sc) {
                      return sc.category_id == co.secondClassifyId;
                    });
                  }else {
                    newItem.subclass.unshift({
                      category_id: co.firstClassifyId,
                      group_id: newItem.group_id,
                      name: '全部',
                      cover: '',
                      pid: 0,
                      weight: 1
                    });
                  }
                }else {
                  newItem = {};
                }
                newClassifyData.push(newItem);
              });
              classifyData = newClassifyData;
            }
            
            let categoryId = classifyData[selectedIndex] ? classifyData[selectedIndex].category_id : '';
            newData[compId + '.classifyData'] = classifyData;
            newData[compId + '.classifyGroupForm'] = res.data.form;
            newData[compId + '.selectedIndex'] = selectedIndex;
            newData[compId + '.selectedCateId'] = categoryId;
            newData[compId + '.classifyLevel'] = classifyLevel;
            newData[compId + '.showSubClassify'] = false;
            pageInstance.setData(newData);
            _this.tapNewClassifyRefreshHandler(null, compId, categoryId, pageInstance);
          }
        });
      }
    }
    if (!!pageInstance.dynamicClassifyGroupidsParams.length) {
      let params = pageInstance.dynamicClassifyGroupidsParams;
      for(let i = 0; i < params.length; i++){
        let compId = params[i]['compid'];
        let groupId = params[i]['dynamicClassifyGroupId'];
        let compData = pageInstance.data[compId];
        let classifyLevel = compData.classifyType.charAt(5);
        let customFeature = compData.customFeature;
        let newdata = {};
        newdata[compId + '.loading'] = true;
        newdata[compId + '.loadingFail'] = false;
        newdata[compId + '.list_data'] = [];
        newdata[compId + '.is_more'] =1;
        pageInstance.setData(newdata);

        _this.sendRequest({
          hideLoading: true,
          url: '/index.php?r=appData/getCategoryByGroup',
          data: {
            group_id: groupId
          },
          success: function(res){
            let classifyData  = res.data.item;
            let newData = {};
            let currentCategory = [];
            if(classifyLevel == 1 && classifyData[0]){
              currentCategory.push(classifyData[0]['category_id']);
            } else if (classifyLevel == 2 && classifyData[0]){
              if(compData.classifyType == 'level2-vertical-withpic'){
                 classifyData = classifyData.filter(function(item){
                  return item.category_id != '';
                })
              }
              if(classifyData[0]) {
                // currentCategory.push(classifyData[0]['category_id']);
                // if(classifyData[0]['subclass'][0]){
                //   currentCategory.push(classifyData[0]['subclass'][0]['category_id']);
                // }
                currentCategory = [ classifyData[0]['category_id'], classifyData[0]['category_id']];
              }
            }
            newData[compId + '.classifyData'] = classifyData;
            newData[compId + '.classifyGroupForm'] = res.data.form;
            newData[compId + '.currentCategory'] = currentCategory;
            pageInstance.setData(newData);
            if (classifyLevel == 1 && currentCategory.length < 1) {
              return;
            } else if (classifyLevel == 2 && currentCategory.length < 2) {
              if (currentCategory.length == 1){
                currentCategory[1] = currentCategory[0];
              } else {
                return;
              }
            }
            if(compData.classifyType == 'level2-vertical-withpic'){
              return;
            }
            let idx_value = currentCategory[classifyLevel - 1] == -1 ? '' : currentCategory[classifyLevel - 1];
            let param = {
              page: 1,
              page_size: 15,
              form: res.data.form,
              idx_arr: {
                idx: 'category',
                idx_value: idx_value
              }
            };
            param.page_size = customFeature.loadingNum || 20;
            let field = _this.getListVessel(compData);
            let fieldData = {};
            fieldData[compId + '.listField'] = field;
            pageInstance.setData(fieldData);

            _this.sendRequest({
              hideLoading: true,
              url: '/index.php?r=AppData/getFormDataList',
              data: param,
              method: 'post',
              success: function (res) {
                  let newdata = {};
                  if (param.form !== 'form') { // 动态列表绑定表单则不调用富文本解析
                    for (let j in res.data) {
                      for (let k in res.data[j].form_data) {
                        if (k == 'category') {
                          continue;
                        }
                        if(/region/.test(k)){
                          continue;
                        }
                        if(k == 'goods_model') {
                          res.data[j].form_data.virtual_price = _this.formVirtualPrice(res.data[j].form_data);
                        }
                        let description = res.data[j].form_data[k];
                        if (field.indexOf(k) < 0 && /<("[^"]*"|'[^']*'|[^'">])*>/.test(description)) { //没有绑定的字段的富文本置为空
                          res.data[j].form_data[k] = '';
                        } else if (_this.needParseRichText(description)) {
                          res.data[j].form_data[k] = _this.getWxParseResult(description);
                        }
                      }
                    }
                  }
                  newdata[compId + '.list_data'] = res.data;
                  newdata[compId + '.is_more'] = res.is_more || '';
                  newdata[compId + '.curpage'] = 1;
                  newdata[compId + '.loading'] = false;
                  newdata[compId + '.loadingFail'] = false;
                  pageInstance.setData(newdata);
              },
              fail: function (res) {
                let newdata = {};
                newdata[compId + '.loadingFail'] = true;
                newdata[compId + '.loading'] = false;
                pageInstance.setData(newdata);
              }
            });
          },
          fail: function (res) {
            let newdata = {};
            newdata[compId + '.loadingFail'] = true;
            newdata[compId + '.loading'] = false;
            pageInstance.setData(newdata);
          }
        });
      }
    }
    if (pageInstance.videoListComps.length) {
      for (let i in pageInstance.videoListComps) {
        let compid = pageInstance.videoListComps[i].compid;
        let param = pageInstance.videoListComps[i].param;
        let compData = pageInstance.data[compid];
        let customFeature = compData.customFeature;
        let newdata = {};
        newdata[compid + '.loading'] = true;
        newdata[compid + '.loadingFail'] = false;
        newdata[compid + '.video_data'] = [];
        newdata[compid + '.is_more'] = 1;
        newdata[compid + '.curpage'] = 0;
        pageInstance.setData(newdata);

        param.page_size = customFeature.loadingNum || 10;
        param.page = 1;

        _this.sendRequest({
          hideLoading: true,
          url: '/index.php?r=AppVideo/GetVideoList',
          data: param,
          method: 'post',
          success: function (res) {
            if (res.status == 0) {
              let rdata = res.data,
                  newdata = {};

              for (let i = 0; i < rdata.length; i++) {
                rdata[i].video_view = _this.handlingNumber(rdata[i].video_view);
              }

              newdata[compid + '.video_data'] = rdata;

              newdata[compid + '.is_more'] = res.is_more;
              newdata[compid + '.curpage'] = 1;
              newdata[compid + '.loading'] = false;
              newdata[compid + '.loadingFail'] = false;

              pageInstance.setData(newdata);
            }
          },
          fail: function (res) {
            let newdata = {};
            newdata[compid + '.loadingFail'] = true;
            newdata[compid + '.loading'] = false;
            pageInstance.setData(newdata);
          }
        });
      }
    }
    if (pageInstance.videoProjectComps.length) {
      for (let i in pageInstance.videoProjectComps) {
        let compid = pageInstance.videoProjectComps[i].compid;
        let customFeature = pageInstance.data[compid].customFeature;
        
        if(customFeature.usage === 'videoProject'){
          let videoProjectId = pageInstance.videoProjectComps[i].videoProjectId;
          pageInstance.requestNum = pageRequestNum + 1;
          _this.sendRequest({
            hideLoading: pageRequestNum++ == 1 ? false : true,
            url: '/index.php?r=AppVideo/GetProjectInfo',
            data: {
              id : videoProjectId
            },
            method: 'post',
            success: function (res) {
              if (res.status == 0) {
                let rdata = res.data,
                    newdata = {};
  
                newdata[compid + '.videoInfo'] = rdata;
                newdata[compid + '.videoPoster'] = false;
  
                pageInstance.setData(newdata);
              }
            }
          });
        } else if(customFeature.usage === 'videoLibrary'){
          pageInstance.requestNum = pageRequestNum + 1;          
          _this.sendRequest({
            hideLoading: pageRequestNum++ == 1 ? false : true,   // 页面第一个请求才展示loading
            url: '/index.php?r=AppVideo/GetVideoLibUrl',
            data: {
              id: customFeature['video-id']
            },
            method: 'post',
            success: function (res) {
              let info = {
                video_url: res.data,
                preview_img: customFeature['video-pic']
              }
              let newdata = {};
      
              newdata[compid + '.videoInfo'] = info;
              newdata[compid + '.videoPoster'] = false;
  
              pageInstance.setData(newdata);
            }
          });
        }
      }
    }
    // 资讯组件
    if (pageInstance.newsComps && pageInstance.newsComps.length) {
      for (let i in pageInstance.newsComps) {
        let compid = pageInstance.newsComps[i].compid,
            conStyle = pageInstance.data[compid].style,
            customFeature = pageInstance.data[compid].customFeature,
            selectedCateId = +customFeature.newsClassifyId || '',
            tabStyle = "color:"+ customFeature.tabTextColor + ";background:" + customFeature.backgroundColor +";",
            selectedStyle = "color:" + customFeature.tabTextSelectColor + ";background:" + customFeature.backgroundSelectColor +";font-weight: bold;opacity:1;",
            initData = {};
        initData[compid + '.conStyle'] = conStyle;
        initData[compid + '.tabStyle'] = tabStyle;
        initData[compid + '.selectedStyle'] = selectedStyle;
        initData[compid + '.pageObj'] = {
          isLoading: false,
          noMore: false,
          page: 1
        };
        initData[compid + '.cdnUrl'] = this.globalData.cdnUrl;
        pageInstance.setData(initData);

        if (customFeature.isPartClassify) {
          if (!!!selectedCateId && !!!customFeature.isManualClassify) {
            _this.sendRequest({
              hideLoading: true,
              url: '/index.php?r=AppNews/GetCategoryByPage',
              data: {page: -1},
              success: function (res) {
                _this.createNewsCateData(pageInstance, compid, res.data);
              },
              fail: function(){
                _this.createNewsCateData(pageInstance, compid, []);
              }
            });
          }else {
            _this.createNewsCateData(pageInstance, compid, pageInstance.data[compid].content);
          }
        }else {
          pageInstance.setData({[compid + '.selectedCateId']: selectedCateId});
          _this.getNewsList({ compid: compid, category_id: selectedCateId, pageInstance: pageInstance, page: 1});
        }
      }
    }
    if (!isPullRefresh && pageInstance.popupWindowComps.length) {
      this.controlAutoPopupWindow(pageInstance);
    }

    if (pageInstance.tostoreComps.length){
      this.tostoreCompsInit(pageInstance);
    }
    // 表单组件
    if (pageInstance.formVesselComps.length) {
      this.formVessel(pageInstance);
    }
    //排号组件
    if (pageInstance.rowNumComps.length) {
      this.isOpenRowNumber(pageInstance);
    }
    // 悬浮窗有无底部导航判断
    if (!isPullRefresh){
      this.suspensionBottom(pageInstance);
    }

    if (pageInstance.topicComps && pageInstance.topicComps.length) {
      for (let i in pageInstance.topicComps) {
        let compid = pageInstance.topicComps[i].compid,
          comData = pageInstance.data[compid],
          customFeature = comData.customFeature,
          style = comData.style,
          listParam = {
            page: 1,
            page_size: customFeature.loadingNum || 10,
            orderby: 'comment_count',
            article_style: 1,
            section_id: customFeature.bindPlate || '',
            category_id: customFeature.bindTopic || '',
            search_value: ''
          },
          listStatus = {
            loading: false,
            isMore: true
          },
          topicSuspension = {
            isShow: customFeature.isShowSuspension,
            topBtnShow: false
          },
          topicPhoneModal = {
            isShow: false,
            phone: ''
          },
          topicReplyComment = {
            isShow: false,
            kbHeight: '50%',
            index: '',
            compid: '',
            sectionId: '',
            articleId: '',
            text: ''
          },
          newdata = {};

        if (customFeature.vesselAutoheight == 0) {
          style += 'height:' + customFeature.height * 2.34 + 'rpx';
          newdata[compid + '.style'] = style;
        }
        newdata[compid + '.listParam'] = listParam;
        newdata[compid + '.listStatus'] = listStatus;
        newdata[compid + '.topicSuspension'] = topicSuspension;
        newdata[compid + '.topicPhoneModal'] = topicPhoneModal;
        newdata[compid + '.topicReplyComment'] = topicReplyComment;

        setTimeout(() => {
          this.getLocation({
            success: function (res) {
              pageInstance.setData({
                [compid + '.listParam.longitude']: res.longitude,
                [compid + '.listParam.latitude']: res.latitude
              });
            }
          });
        }, 500);

        pageInstance.setData(newdata);
        this.getTopListData(pageInstance, compid);
        this.globalData.hasTopicCom = true;
      }
    }
    if (pageInstance.searchComponentParam && pageInstance.searchComponentParam.length) {
      for (let i in pageInstance.searchComponentParam) {
        let searchComp = pageInstance.searchComponentParam[i];
        let compid = searchComp.compid;
        let searchObject = pageInstance.data[compid].customFeature.searchObject;
        if (searchObject && searchObject.type == 'topic') {
          let originalStyle = pageInstance.data[compid].style;
					let filterStyle = originalStyle.match(/(width|height|background|background\-color|margin-top|backgroundColor|marginTop)\:[^:;]+\;/g).join('');
          let topicComp = pageInstance.topicComps.find(
            topic => topic.param.id == searchObject.customFeature.id);
          if (topicComp) {
            let topicCompid = topicComp.compid;
            let isShowList = pageInstance.data[topicCompid].customFeature.isShowList;
            pageInstance.setData({
              [compid + '.searchValue']: '',
              [compid + '.style']: filterStyle,
              [compid + '.showCenter']: isShowList === false ? isShowList : true,
              [compid + '.relateTopicCompId']: topicCompid,
              [topicCompid + '.relateSearchCompId']: compid
            });
          }else {
            this.showModal({content: '未找到对应的话题列表'});
            pageInstance.setData({
              [compid + '.searchValue']: '',
              [compid + '.style']: filterStyle
            });
          }
        }
      }
    }
    if (pageInstance.topicClassifyComps && pageInstance.topicClassifyComps.length) {
      for (let i in pageInstance.topicClassifyComps) {
        let topicClassifyComp = pageInstance.topicClassifyComps[i],
          compid = topicClassifyComp.compid,
          customFeature = pageInstance.data[compid].customFeature,
          style = pageInstance.data[compid].style,
          topicComp = pageInstance.topicComps.find(
            topic => topic.param.id == customFeature.topic_refresh_object),
          imgStyle = '', liStyle = '', newdata = {};

        imgStyle = [
          'width: '+ customFeature.width * 2.34 + 'rpx',
          'height: '+ customFeature.height * 2.34 + 'rpx',
          'border-radius: '+ customFeature.picBorderRadius * 2.34 + 'rpx'
        ].join(';');

        liStyle = [
          'margin-top: '+ customFeature['margin-top'] * 2.34 + 'rpx',
          'margin-left: '+ customFeature['margin-left'] * 2.34 + 'rpx'
        ].join(';');

        if (topicComp) {
          let topicCompid = topicComp.compid,
            topicListParam = pageInstance.data[topicCompid].listParam;
          newdata[compid + '.relateTopicCompId'] =  topicCompid;
          newdata[topicCompid + '.relateClassifyCompId'] =  compid;
          newdata[compid + '.selectedSectionId'] =  topicListParam.section_id;
          newdata[compid + '.selectedCategoryId'] =  topicListParam.category_id;
        }else {
          this.showModal({content: '未找到对应的话题列表'});
        }
        newdata[compid + '.imgStyle'] =  imgStyle;
        newdata[compid + '.liStyle'] =  liStyle;
        pageInstance.setData(newdata);
      }
    }
    if (pageInstance.topicSortComps && pageInstance.topicSortComps.length) {
      for (let i in pageInstance.topicSortComps) {
        let topicSortComp = pageInstance.topicSortComps[i],
          compid = topicSortComp.compid,
          customFeature = pageInstance.data[compid].customFeature,
          topicComp = pageInstance.topicComps.find(
            topic => topic.param.id == customFeature.topic_sort_object);
        if (topicComp) {
          let topicCompid = topicComp.compid;
          pageInstance.setData({
            [compid + '.currentOrderby']: 'comment_count',
            [compid + '.relateTopicCompId']: topicCompid,
            [topicCompid + '.relateSortCompId']: compid
          });
        }else {
          this.showModal({content: '未找到对应的话题列表'});
          pageInstance.setData({
            [compid + '.currentOrderby']: 'comment_count'
          });
        }

      }
    }
  },
  initialFranchiseeList: function (compid, param, pageInstance){
    let _this = this;
    let customFeature = pageInstance.data[compid].customFeature;
    let locationInfo = _this.globalData.locationInfo;

    param.page_size = customFeature.loadingNum || 10;
    param.page = 1;

    if (locationInfo.latitude){
      let newdata = {};
      newdata[compid + '.location_address'] = locationInfo.address;
      pageInstance.setData(newdata);

      param.latitude = locationInfo.latitude;
      param.longitude = locationInfo.longitude;
      _this.getFranchiseeList(compid, param, pageInstance);
    }else{
      _this.getLocation({
        type: 'gcj02',
        success: function (res) {
          let latitude = res.latitude,
            longitude = res.longitude;

          if (res.latitude) {
            pageInstance.requestNum ++;
            _this.sendRequest({
              hideLoading: true,
              url: '/index.php?r=Map/GetAreaInfoByLatAndLng',
              data: {
                latitude: latitude,
                longitude: longitude
              },
              success: function (res) {
                let newdata = {};
                newdata[compid + '.location_address'] = res.data.formatted_addresses.recommend;
                pageInstance.setData(newdata);

                _this.setLocationInfo({
                  latitude: latitude,
                  longitude: longitude,
                  address: res.data.formatted_addresses.recommend,
                  info: res.data
                });
              }
            });
            param.latitude = latitude;
            param.longitude = longitude;

            _this.getFranchiseeList(compid, param, pageInstance);
          } else {
            let newdata = {};
            newdata[compid + '.location_address'] = '定位失败';
            pageInstance.setData(newdata);
          }
        },
        fail: function (res) {
          let newdata = {};
          if (res.errMsg === 'getLocation:fail auth deny' || res.errMsg === "getLocation:fail:auth denied") {
            newdata[compid + '.location_address'] = '已拒绝定位';
          } else {
            newdata[compid + '.location_address'] = '定位失败';
          }
          param.sort_key = 'weight';
          _this.getFranchiseeList(compid, param, pageInstance);
          pageInstance.setData(newdata);
        }
      });
    }
  },
  getFranchiseeList: function (compid, param, pageInstance){
    let _this = this;
    let newdata = {};
    newdata[compid + '.loading'] = true;
    newdata[compid + '.loadingFail'] = false;
    newdata[compid + '.franchisee_data'] = [];
    newdata[compid + '.is_more'] = 1;
    newdata[compid + '.curpage'] = 0;
    pageInstance.setData(newdata);

    _this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppShop/GetAppShopByPage',
      data: param,
      method: 'post',
      success: function (res) {
        for (let index in res.data) {
          let distance = res.data[index].distance;
          res.data[index].distance = util.formatDistance(distance);
        }

        _this.getMyAppShopList(compid, pageInstance);

        let newdata = {};
        newdata[compid + '.franchisee_data'] = res.data;
        newdata[compid + '.is_more'] = res.is_more;
        newdata[compid + '.curpage'] = 1;
        newdata[compid + '.loading'] = false;
        newdata[compid + '.loadingFail'] = false;

        pageInstance.setData(newdata);
      },
      fail: function(){
        let newdata = {};
        newdata[compid + '.loading'] = false;
        newdata[compid + '.loadingFail'] = true;
        pageInstance.setData(newdata);
      }
    });
  },
  initialCommunityList: function (compid, pageIns){
    let pageInstance = pageIns || this.getAppCurrentPage();
    let compdata = pageInstance.data[compid];
    let dataId = [];
    let content = compdata.content;
    let newdata = {};

    for (let j in content) {
      dataId.push(content[j]['community-id']);
    }
    newdata[compid + '.loading'] = true;
    newdata[compid + '.loadingFail'] = false;
    pageInstance.setData(newdata);

    this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppSNS/GetSectionByPage',
      data: {
        section_ids: dataId,
        page: 1,
        page_size: 100
      },
      method: 'post',
      success: function (res) {
        let ddata = {},
          lastdata = [],
          newdata = {};

        for (let x = 0; x < res.data.length; x++) {
          let val = res.data[x];
          ddata[val.id] = val;
        }
        for (let y = 0; y < dataId.length; y++) {
          let val = ddata[dataId[y]];
          if (val) {
            lastdata.push(val);
          }
        }
        newdata[compid + '.community_data'] = lastdata;
        newdata[compid + '.loading'] = false;
        newdata[compid + '.loadingFail'] = false;

        pageInstance.setData(newdata);
      },
      fail: function(){
        let newdata = {};
        newdata[compid + '.loading'] = false;
        newdata[compid + '.loadingFail'] = true;
        pageInstance.setData(newdata);
      }
    });
  },
  onPageScroll: function (e) {
    let pageInstance = this.getAppCurrentPage();
    if (pageInstance.topicComps && pageInstance.topicComps.length) {
      for (let i in pageInstance.topicComps) {
        let compid = pageInstance.topicComps[i].compid;
        if (pageInstance.data[compid].topicSuspension.isShow) {
          pageInstance.setData({[compid + '.topicSuspension.topBtnShow']: this.globalData.pageScrollTop > e.scrollTop && e.scrollTop > 0});
        }
      }
      this.globalData.pageScrollTop = e.scrollTop;
    }
  }, 
  getTopListData: function (pageIns, compid, callback) {
    let that = this;
    let pageInstance = pageIns || this.getAppCurrentPage(),
      listComData = pageInstance.data[compid],
      listParam = listComData.listParam,
      listStatus = listComData.listStatus,
      topicList = listComData.topicList || [];
    if (listComData.customFeature.isShowList === false) {
      pageInstance.setData({[compid + '.topicList']: []});
      return;
    }
    if (listStatus.loading || !listStatus.isMore) {
      return;
    }
    let newdata = {};
    newdata[compid + '.listStatus.loading'] = true;
    newdata[compid + '.listStatus.loadingFail'] = false;
    if(listParam.page == 1){
      newdata[compid + '.topicList'] = [];
      newdata[compid + '.listStatus.isMore'] = true;
    }
    pageInstance.setData(newdata);

    this.sendRequest({
      url: '/index.php?r=AppSNS/GetArticleByPage',
      data: listParam,
      method: 'post',
      hideLoading: true,
      success: function (res) {
        let newdata = {};
        listStatus.loading = false;
        listStatus.isMore = res.is_more == 1;
        listStatus.loadingFail = false;
        res.data.forEach(t => {
          t.comment_box_show = false;
          if (t.content.type == 2) {
            if (t.content.url.article && t.content.url.article.type == 3) {
              t.content.url.article.cover = that.globalData.cdnUrl + '/zhichi_frontend/static/webapp/images/audio_default.png';
            }
          }
        });
        topicList = res.current_page > 1 ? topicList.concat(res.data) : res.data;
        newdata[compid + '.topicList'] = topicList;
        newdata[compid + '.listParam.page'] = res.current_page + 1;
        newdata[compid + '.listStatus'] = listStatus;
        pageInstance.setData(newdata);
        typeof callback === 'function' && callback(res.data);
      },
      fail: function () {
        let newdata = {};
        newdata[compid + '.listStatus.loading'] = false;
        newdata[compid + '.listStatus.loadingFail'] = true;
        pageInstance.setData(newdata);
      }
    });
  },
  refreshOneTopicData: function (param) {
    if (!param.articleId || !param.compid) {
      return;
    }
    let pageInstance = this.getAppCurrentPage();
    this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppSNS/GetArticleByPage',
      data: {article_id: param.articleId, page: 1, page_size: 10},
      method: 'post',
      success: function (res) {
        if (!res.data.length) {
          return;
        }
        pageInstance.setData({[param.compid + '.topicList['+ param.index +']']: res.data[0]});
      },
      fail: function () {
      }
    });
  },
  topicEleScrollFunc: function (e) {
    let currentTarget = e.currentTarget,
      dataset = currentTarget.dataset,
      compid = dataset.compid;
    this.getTopListData(null, compid);
  },
  switchTopiclistOrderBy: function (e) {
    let currentTarget = e.currentTarget,
      dataset = currentTarget.dataset,
      compid = dataset.compid,
      orderby = dataset.orderby,
      pageInstance = this.getAppCurrentPage(),
      newdata = {};

    if (pageInstance.data[compid].relateTopicCompId) {
      let topicCompId = pageInstance.data[compid].relateTopicCompId,
        topicListParam = pageInstance.data[topicCompId].listParam;

      newdata[compid + '.currentOrderby'] = orderby;
      newdata[topicCompId + '.listStatus.loading'] = false;
      newdata[topicCompId + '.listStatus.isMore'] = true;
      newdata[topicCompId + '.topicList'] = [];

      if (orderby === 'distance' && !topicListParam.latitude) {
        this.getLocation({
          success: res => {
            newdata[topicCompId + '.listParam.page'] = 1;
            newdata[topicCompId + '.listParam.orderby'] = orderby;
            newdata[topicCompId + '.listParam.latitude'] = res.latitude;
            newdata[topicCompId + '.listParam.longitude'] = res.longitude;
            pageInstance.setData(newdata);
            this.getTopListData(pageInstance, topicCompId);
          }
        });
      }else {
        newdata[topicCompId + '.listParam.page'] = 1;
        pageInstance.setData(newdata);
        this.getTopListData(pageInstance, topicCompId);
      }
    }else {
      this.showModal({content: '未找到对应的话题列表'});
    }
  },
  switchTopicCategory: function (e) {
    let currentTarget = e.currentTarget,
      dataset = currentTarget.dataset,
      compid = dataset.compid,
      section_id = dataset.sectionid || 0,
      category_id = dataset.categoryid || 0,
      topicCompId = dataset.topicCompid,
      pageInstance = this.getAppCurrentPage(),
      newdata = {};

    if (topicCompId) {
      let searchCompId = pageInstance.data[topicCompId].relateSearchCompId;

      newdata[compid + '.selectedSectionId'] = section_id;
      newdata[compid + '.selectedCategoryId'] = category_id;
      newdata[topicCompId + '.listStatus.loading'] = false;
      newdata[topicCompId + '.listStatus.isMore'] = true;
      newdata[topicCompId + '.listParam.search_value'] = '';
      newdata[topicCompId + '.topicList'] = [];

      if (searchCompId) {
        newdata[searchCompId + '.searchValue'] = '';
      }
      newdata[topicCompId + '.listParam.page'] = 1;
      newdata[topicCompId + '.listParam.section_id'] = section_id;
      newdata[topicCompId + '.listParam.category_id'] = category_id;

      pageInstance.setData(newdata);
      this.getTopListData(pageInstance, topicCompId);
    }else {
      this.showModal({content: '未找到对应的话题列表'});
    }
  },
  topicSearchInputAct: function (e) {
  },
  searchForTopicAct: function (e) {
    let that = this,
      currentTarget = e.currentTarget,
      dataset = currentTarget.dataset,
      compid = dataset.compid,
      topicCompId = dataset.topicCompid,
      search_value = e.detail.value,
      pageInstance = this.getAppCurrentPage(),
      newdata = {};

    if (topicCompId) {
      let classifyCompId = pageInstance.data[topicCompId].relateClassifyCompId;

      newdata[compid + '.searchValue'] = search_value;
      newdata[topicCompId + '.listStatus.loading'] = false;
      newdata[topicCompId + '.listStatus.isMore'] = true;
      newdata[topicCompId + '.listParam.section_id'] = '';
      newdata[topicCompId + '.listParam.category_id'] = '';

      if (classifyCompId) {
        newdata[classifyCompId + '.selectedSectionId'] = '';
        newdata[classifyCompId + '.selectedCategoryId'] = '';
      }
      newdata[topicCompId + '.listParam.search_value'] = search_value;
      newdata[topicCompId + '.listParam.page'] = -1;
      pageInstance.setData(newdata);
      this.getTopListData(pageInstance, topicCompId, function (data) {
        that.showModal({
          content: '搜索到' + data.length + '条话题'
        });
      });
    }else {
      this.showModal({content: '未找到对应的话题列表'});
    }
  },
  turnToTopicUserCenter: function (e) {
    this.turnToPage('/informationManagement/pages/communityUsercenter/communityUsercenter?detail=');
  },
  turnToTopicNotify: function (e) {
    this.turnToPage('/informationManagement/pages/communityNotify/communityNotify?detail=');
  },
  turnToTopicDetail: function (e) {
    if (this.globalData.topicTurnToDetail) {
      return;
    }
    this.globalData.topicTurnToDetail = true;
    let currentTarget = e.currentTarget,
      dataset = currentTarget.dataset,
      articlestyle = dataset.articlestyle,
      compid = dataset.compid,
      index = dataset.index,
      pageInstance = this.getAppCurrentPage(),
      topic = pageInstance.data[compid].topicList[index],
      newdata = {};
    newdata[compid + '.topicList['+ index +'].read_count'] = +topic.read_count + 1;
    pageInstance.setData(newdata);
    this.turnToPage('/informationManagement/pages/communityDetail/communityDetail?detail=' + topic.id + '&articleStyle=' + articlestyle + '&dataLiked=' + topic.is_liked + '&phoneNumber=' + topic.phone + '&sectionid=' + topic.section_id);
  },
  pageBackTopAct: function (e) {
    this.pageScrollTo(0);
  },
  turnToTopicPublish: function (e) {
    let pageInstance = this.getAppCurrentPage();
    pageInstance.setData({
      'communityPublishType.show': true
    });
  },
  closeCommunityPublishTypeModal: function () {
    let pageInstance = this.getAppCurrentPage();
    pageInstance.setData({
      'communityPublishType.show': false
    });
  },
  turnToCommunityPublish: function (e) {
    let dataset = e.currentTarget.dataset,
      publishType = dataset.type === 'link' ? 2 : 0,
      pageInstance = this.getAppCurrentPage();
    pageInstance.setData({
      'communityPublishType.show': false,
      'communityPublish.show': true,
      'communityPublish.publishType': publishType,
      'communityPublish.detail': dataset.detail || '',
      'communityPublish.articleId': dataset.articleId || '',
      'communityPublish.reqAudit': dataset.reqAudit || '',
      'communityPublish.from': dataset.from || '',
      'communityPublish.franchisee': dataset.franchisee || ''
    });
  },
  closeCommunityPublishModal: function () {
    let pageInstance = this.getAppCurrentPage();
    pageInstance.setData({
      'communityPublish.show': false
    });
  },
  showTopicCommentBox: function (e) {
    let currentTarget = e.currentTarget,
      dataset = currentTarget.dataset,
      compid = dataset.compid,
      index = dataset.index,
      pageInstance = this.getAppCurrentPage(),
      topic = pageInstance.data[compid].topicList[index],
      commentBoxShow = topic.comment_box_show;
    pageInstance.setData({[compid + '.topicList['+ index +'].comment_box_show']: !commentBoxShow});
  },
  showTopicPhoneModal: function (e) {
    let currentTarget = e.currentTarget,
      dataset = currentTarget.dataset,
      phone = dataset.phone,
      compid = dataset.compid,
      pageInstance = this.getAppCurrentPage(),
      topicPhoneModal = pageInstance.data[compid].topicPhoneModal;
    topicPhoneModal.phone = phone.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
    topicPhoneModal.isShow = !topicPhoneModal.isShow;
    pageInstance.setData({[compid + '.topicPhoneModal']: topicPhoneModal});
  },
  topicMakePhoneCall: function (e) {
    let pageInstance = this.getAppCurrentPage(),
      compid = e.currentTarget.dataset.compid,
      phone = pageInstance.data[compid].topicPhoneModal.phone;
    pageInstance.setData({[compid + '.topicPhoneModal.isShow']: false});
    this.makePhoneCall(phone);
  },
  showTopicReplyComment: function (e) {
    let currentTarget = e.currentTarget,
      dataset = currentTarget.dataset,
      compid = dataset.compid,
      cancel = dataset.cancel,
      pageInstance = this.getAppCurrentPage(),
      topicReplyComment = pageInstance.data[compid].topicReplyComment;
    if (!cancel) {
      let index = dataset.index,
        topic = pageInstance.data[compid].topicList[index],
        newdata = {};
      topicReplyComment.isShow = !topicReplyComment.isShow;
      topicReplyComment.sectionId = topic.section_id;
      topicReplyComment.articleId = topic.id;
      topicReplyComment.compid = compid;
      topicReplyComment.index = index;
      newdata[compid + '.topicReplyComment'] = topicReplyComment;
      newdata[compid + '.topicList['+ index +'].comment_box_show'] = false;
      pageInstance.setData(newdata);
      setTimeout(function () {
        pageInstance.setData({
          [compid + '.topicReplyComment.focus']: true
        });
      }, 300);
    }else {
      pageInstance.setData({
        [compid + '.topicReplyComment.isShow']: !topicReplyComment.isShow,
        [compid + '.topicReplyComment.focus']: false,
        [compid + '.topicReplyComment.text']: ''
      });
    }
  },
  topicCommentReplyInput: function (e) {
    let pageInstance = this.getAppCurrentPage(),
      compid = e.currentTarget.dataset.compid;
    pageInstance.setData({[compid + '.topicReplyComment.text']: e.detail.value});
  },
  topicCommentReplyblur: function (e) {
    let pageInstance = this.getAppCurrentPage(),
      compid = e.currentTarget.dataset.compid;
    pageInstance.setData({[compid + '.topicReplyComment.focus']: false});
  },
  topicCommentReplyfocus: function (e) {
    let pageInstance = this.getAppCurrentPage(),
      compid = e.currentTarget.dataset.compid;
      if (e.detail.height && e.detail.height != this.globalData.kbHeight) {
        let curKbHeight = pageInstance.data.has_tabbar == 1 ? (e.detail.height - 56) : e.detail.height;
        if (/iPhone\s?X/i.test(this.globalData.systemInfo.model)) {
          curKbHeight = 282;
        }
        pageInstance.setData({
          [compid + '.topicReplyComment.focus']: true,
          [compid + '.topicReplyComment.kbHeight']: curKbHeight + 'px'
        });
        return;
      }
    pageInstance.setData({[compid + '.topicReplyComment.focus']: true});
  },
  topicReplycommentSubmit: function (e) {
    let that = this,
      pageInstance = this.getAppCurrentPage(),
      compid = e.currentTarget.dataset.compid,
      topicReplyComment = pageInstance.data[compid].topicReplyComment;
    if (/^\s*$/.test(topicReplyComment.text)) {
      this.showModal({ content: '请填写回复内容' });
      return;
    }
    if (this.globalData.isTopicCommentSubmiting) {
      return;
    }
    this.globalData.isTopicCommentSubmiting = true;
    this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppSNS/AddComment',
      data: {
        section_id: topicReplyComment.sectionId,
        article_id: topicReplyComment.articleId,
        text: topicReplyComment.text
      },
      method: 'post',
      success: function (res) {

      },
      complete: function (res) {
        if (res.status == 0) {
          that.showToast({
            title: '回复成功',
            icon: 'success',
            duration: 1500,
            success: function () {
              pageInstance.setData({
                [compid + '.topicReplyComment.isShow']: false,
                [compid + '.topicReplyComment.text']: ''
              });
              that.refreshOneTopicData(topicReplyComment);
            }
          });
        }
        that.globalData.isTopicCommentSubmiting = false;
      }
    });
  },
  topicPerformLikeAct: function (e) {
    let that = this,
      currentTarget = e.currentTarget,
      dataset = currentTarget.dataset,
      compid = dataset.compid,
      index = dataset.index,
      isliked = dataset.isliked,
      pageInstance = this.getAppCurrentPage(),
      topic = pageInstance.data[compid].topicList[index];
    // if (isliked == 1) {
    //   that.showToast({ title: '己点赞' });
    //   pageInstance.setData({[compid + '.topicList['+ index +'].comment_box_show']: false});
    //   return;
    // }
    this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppSNS/PerformLike',
      data: {
        obj_type : 1,
        obj_id : topic.id
      },
      method: 'post',
      success: function (res) {
        if (res.status == 0) {
          that.showToast({
            title : isliked == 1 ? '点赞取消' : '点赞成功',
            icon: 'success',
            success: function () {
              pageInstance.setData({[compid + '.topicList['+ index +'].comment_box_show']: false});
              that.refreshOneTopicData({'articleId': topic.id, index, compid});
            }
          });
        }
      }
    });
  },
  topicImgLoad : function(event) {
    let pageInstance = this.getAppCurrentPage(),
      owidth = event.detail.width,
      oheight = event.detail.height,
      topicId = event.currentTarget.dataset.topicId,
      compid = event.currentTarget.dataset.compid,
      oscale = owidth / oheight,
      cwidth = 290 ,
      cheight = 120,
      ewidth , eheight;

    if (event.currentTarget.dataset.style == 1) {
      cwidth = 240;
    }

    if( oscale > cwidth / cheight ){
      ewidth = cwidth;
      eheight = cwidth / oscale;
    }else{
      ewidth = cheight * oscale;
      eheight = cheight;
    }

    pageInstance.setData({
      [compid + '.oneImgArr.'+ topicId +'.imgData']: {
        imgWidth : ewidth * 2.34,
        imgHeight : eheight * 2.34
      }
    });
  },
  getIntegralLog: function (addTime) {
    let pageInstance = this.getAppCurrentPage();
    this.showToast({ title: '转发成功', duration: 500 });
    this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=appShop/getIntegralLog',
      data: { add_time: addTime },
      success: function (res) {
        res.data && pageInstance.setData({
          'rewardPointObj': {
            showModal: true,
            count: res.data,
            callback: ''
          }
        });
      }
    });
  },
  CountSpreadCount: function (articleId) {
    this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppSNS/CountSpreadCount',
      data: { article_id: articleId },
      success: function (res) {}
    })
  },
  controlAutoPopupWindow: function (pageInstance) {
    let _this = this;

    for (let windowConfig of pageInstance.popupWindowComps) {
      let newData = {};
      let windowCompId = windowConfig.compid;
      let customFeature = pageInstance.data[windowCompId].customFeature;

      if (customFeature.autoPopup === true) {
        if (customFeature.popupScene === 'everyDay' || customFeature.popupScene === 'firstAuthorize'){
          // 获取用户是否为第一次授权、是否为当天第一次登录
          if (!this.globalData.firstLoginAppChecked) {
            this.sendRequest({
              hideLoading: true,
              url: '/index.php?r=AppData/CheckFirstLoginApp',
              success: function(data){
                _this.globalData.firstAuthorize = data.data.isAppFirstLogin;
                _this.globalData.dailyFirstLogin = data.data.isDailyFirstLogin;
                _this.globalData.firstLoginAppChecked = true;
                _this.controlAutoPopupWindow(pageInstance);
              }
            })
            break;
          }
          if((this.globalData.firstAuthorize && customFeature.popupScene === 'firstAuthorize') || (this.globalData.dailyFirstLogin && customFeature.popupScene === 'everyDay')){
            if(!pageInstance.data[windowCompId].alreadyShown){
              newData[windowCompId+'.showPopupWindow'] = true;
              newData[windowCompId+'.alreadyShown'] = true;
              pageInstance.setData(newData);
            }
          }

        } else if (customFeature.popupScene === 'everyTime'){
          newData[windowCompId+'.showPopupWindow'] = true;
          pageInstance.setData(newData);
        }

        if(customFeature.autoClose === true){
          setTimeout(()=>{
            newData[windowCompId+'.showPopupWindow'] = false;
            pageInstance.setData(newData);
          }, +customFeature.closeDelay*1000);
        }
      }
    }
  },
  formVessel: function (pageInstance) {
    let _this = this;
    for (let formConfig of pageInstance.formVesselComps) {
      let newData = {};
      let formCompId = formConfig.compid;
      let customFeature = pageInstance.data[formCompId].customFeature;
      let content = pageInstance.data[formCompId].content;
      let buttonContent = '';
      let buttonIndex = '';
      for (let i = 0; i < content.length; i++) {
        if (content[i].type == 'form-button') {
          buttonContent = content[i];
          buttonIndex = i;
        }
      }
      if (buttonIndex === ''){
        continue;
      }
      newData[formCompId + '.content[' + buttonIndex + '].can_use'] = 1;
      pageInstance.setData(newData);
      let param = {
        form_id: customFeature.id,
        app_id: _this.getAppId(),
        button_info: {
          'type': buttonContent.customFeature.effect || 1,
          'times': buttonContent.customFeature.frequency || -1
        }
      }
      this.sendRequest({
        hideLoading: true,
        url: '/index.php?r=AppData/isFormSubmitButtonValid',
        data: param,
        method: 'post',
        success: function (res) {
          console.log(res);
          if (res.status == 0) {
            newData[formCompId + '.content[' + buttonIndex + '].can_use'] = res.data.can_use;
            newData[formCompId + '.buttonContent'] = buttonContent;
            pageInstance.setData(newData);
          }
        }
      })
    }
  },
  formVirtualPrice: function (formdata) {
    let modelVP = [];
    let price = '';
    for (let l in formdata.goods_model) {
      modelVP.push(formdata.goods_model[l].virtual_price == '' ? 0 : Number(formdata.goods_model[l].virtual_price))
    }
    if (Math.min(...modelVP) == Math.max(...modelVP)) {
      if (formdata.virtual_price instanceof Object) {
        price = formdata.virtual_price;
        price[0].text = Math.min(...modelVP).toFixed(2);
      } else {
        price = Math.min(...modelVP).toFixed(2);
      }
    } else {
      if (formdata.virtual_price instanceof Object) {
        price = formdata.virtual_price;
        price[0].text = Math.min(...modelVP).toFixed(2) + '~' + Math.max(...modelVP).toFixed(2);
      } else {
        price = Math.min(...modelVP).toFixed(2) + '~' + Math.max(...modelVP).toFixed(2);
      }
    }
    return price;
  },
  getListVessel: function(comp){
    let that = this;
    let field = [];

    if (Object.prototype.toString.call(comp.content) == "[object Array]"){
      for (let i = 0; i < comp.content.length; i++) {
        let cp = comp.content[i];
        if (typeof cp.content == 'object'){
          let f = that.getListVessel(cp);
          field = field.concat(f);
        } else if (cp.customFeature && cp.customFeature.segment){
          field.push(cp.customFeature.segment);
        }
      }
    }else{
      for(let i in comp.content){
        let cp = comp.content[i];
        for (let j = 0; j < cp.length; j++) {
          let cpj = cp[j];
          if (typeof cpj.content == 'object') {
            let f = that.getListVessel(cpj);
            field = field.concat(f);
          } else if (cpj.customFeature && cpj.customFeature.segment) {
            field.push(cpj.customFeature.segment);
          }
        }
      }
    }
    return field;
  },
  createNewsCateData: function (pageIns, compid, cateArr, selectedId) {
    if (!compid) {
      return;
    }
    let compContent = cateArr || [],
      pageInstance = pageIns || this.getAppCurrentPage(),
      selectId = selectedId,
      cateData = [], newData = {};
      cateData = compContent.map(cc => {
        return {
          compid: compid,
          id: cc.id || cc.classifyId,
          name: cc.name || cc.classifyName
        }
      });
    newData[compid + '.cateData'] = cateData;
    selectId || (selectId = cateData.length ? cateData[0].id : '');
    newData[compid + '.selectedCateId'] = selectId;
    pageInstance.setData(newData);
    this.getNewsList({ compid: compid, category_id: selectId, pageInstance: pageInstance, page: 1 });
  },
  getNewsCateList: function (event) {
    let that = this;
    let pageInstance = this.getAppCurrentPage(),
      dataset = event.currentTarget.dataset,
      compid = dataset.compid,
      cateId = dataset.id,
      pageObj = {
        isLoading: false,
        noMore: false,
        page: 1
      }, 
      newData = {};

      newData[compid + '.pageObj'] = pageObj;
      newData[compid + '.selectedCateId'] = cateId;
      newData[compid + '.newslist'] = [];
      pageInstance.setData(newData);

      that.getNewsList({ compid: compid, category_id: cateId, pageInstance: pageInstance });
  },
  getNewsList: function (component_params, callback) {
    if (!component_params) {
      component_params = {};
    }
    let that = this;
    let pageInstance = component_params.pageInstance || this.getAppCurrentPage(),
      compid = component_params.compid ? component_params.compid : pageInstance.newsComps[0].compid,
      newsData = pageInstance.data[compid],
      cateId = component_params.category_id,
      searchValue = component_params.search_value || '',
      pageObj = newsData.pageObj,
      page = component_params.page || pageObj.page || 1,
      newsList = newsData.newslist || [];
    if (cateId === undefined) {
      cateId = newsData.selectedCateId;
    }

    let newdata = {};
    if(page == 1){
      newdata[compid + '.newslist'] = [];
      newdata[compid + '.pageObj.noMore'] = false;
    }
    if (pageObj.isLoading || pageObj.noMore) {
      return;
    }
    newdata[compid + '.pageObj.isLoading'] = true;
    newdata[compid + '.pageObj.loadingFail'] = false;
    pageInstance.setData(newdata);

    // 请求资讯列表
    this.sendRequest({
      url: '/index.php?r=AppNews/GetArticleByPage',
      data: {
        category_id: cateId,
        orderby: 'add_time',
        page: page,
        search_value: searchValue,
        page_size: 10
      },
      method: 'post',
      hideLoading: true,
      success: function (res) {
        if (res.status == 0) {
          let resData = res.data,
            newData = {};

          resData = resData.map(n => {
            if (n.wechat_id) {
              return n;
            }
            if (n.form_data.url.article && n.form_data.url.article.type == 3) { //添加音乐图标
              n.form_data.url.article.cover = that.globalData.cdnUrl + '/zhichi_frontend/static/webapp/images/audio_default.png';
            }
            if (n.form_data.event.action) {
              n.event_params = n.form_data.event;
            }else {
              n.event_params = '';
            }
            if (n.article_type == 2 && n.form_data.url.article) {
              delete n.form_data.url.article.body;
            }
            if (n.content) {
              delete n.content;
            }
            if (n.form_data.recommend) {
              delete n.form_data.recommend;
            }
            return n;
          });

          if (pageObj.page == 1) {
            newsList = resData;
          }else {
            newsList = newsList.concat(resData);
          }

          newData[compid + '.newslist'] = newsList;
          pageInstance.setData(newData);

          if (res.is_more == 0) {
            pageObj.noMore = true;
          }
          pageObj.isLoading = false;
          pageObj.loadingFail = false;
          pageObj.page++;
        }
      },
      fail: function(){
        pageObj.loadingFail = true;
      },
      complete: function (res) {
        pageObj.isLoading = false;
        let newPageObj = {};
        newPageObj[compid + '.pageObj'] = pageObj;
        pageInstance.setData(newPageObj);
        typeof callback == 'function' && callback(res);
      }
    });
  },
  _getPageData: function(router){
    let that = this;
    let currentpage = that.getAppCurrentPage();
    this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppData/GetAppLayoutConfig',
      data: {
        his_id: this.globalData.historyDataId,
        page: router
      },
      success: function(res){
        let data = res.data;
        if(data.dynamic_data_config && data.dynamic_data_config.dynamic_data_open_status != 0){
          if (!data.dataId && !data.page_form){
            data.page_hidden = false
          }
          currentpage.setData(data);
          currentpage.page_form = data.page_form;
          data.dataId && (currentpage.dataId = data.dataId);
          that.checkCanUse('navigator.target', 'canIUseNavigatorTarget', ['button', 'picture', 'text', 'layout-vessel', 'static-vessel', 'free-vessel', 'title-ele', 'album', 'carousel', 'suspension', 'list', 'announce']);
        }
        currentpage.pageLoaded = true;
        that.pageDataInitial('', currentpage);
      },
      complete: function(){
        if (!currentpage.dataId && !currentpage.page_form){
          currentpage.setData({
            page_hidden: false
          });
        }
      }
    })
  },
  _initialCarouselData: function(pageInstance, compid, carouselgroupId){
    let newdata = {};
    newdata[compid + '.loading'] = true;
    newdata[compid + '.loadingFail'] = false;
    pageInstance.setData(newdata);
    let groupId = carouselgroupId;
    if (!groupId){
      groupId = pageInstance.data[compid].customFeature.carouselgroupId;
    }
    let url = '/index.php?r=AppExtensionInfo/carouselPhotoProjiect';
    pageInstance.requestNum = pageInstance.requestNum + 1;
    this.sendRequest({
      hideLoading: true,   // 页面第一个请求才展示loading
      url: url,
      data: {
        type: groupId
      },
      method: 'post',
      success: function (res) {
        let newdata = {};
        newdata[compid + '.loading'] = false;
        newdata[compid + '.loadingFail'] = false;
        if (res.data.length) {
          let content = [];
          for (let j in res.data) {
            let form_data = JSON.parse(res.data[j].form_data);
            if (form_data.isShow == 1) {
              let customFeature = {};
              customFeature = form_data;
              customFeature.compid = compid;
              content.push({
                "customFeature": customFeature,
                'pic': form_data.pic
              })
            }
          }
          newdata[compid+'.content'] = content;
        }
        pageInstance.setData(newdata);
      },
      fail: function(){
        let newdata = {};
        newdata[compid + '.loading'] = false;
        newdata[compid + '.loadingFail'] = true;
        pageInstance.setData(newdata);
      }
    });
  },
  tapEventCommonHandler: function(e){
    let form = e.currentTarget.dataset.eventParams;
    let action = form.action;

    customEvent.clickEventHandler[action] && customEvent.clickEventHandler[action](form);
  },
  _initUserCenterData: function(pageInstance, compid){
    let content = pageInstance.data[compid].content;
    let data = {};
    let goodsTypeList = [{
          requested: false,
          index: []
        },{
        requested: false,
        index: []
        },{
          requested: false,
          index: []
        },{
          requested: false,
          index: []
        }]
    for(let i in content) {
      for (let j in content[i].blockArr){
        let item = content[i].blockArr[j];
        if (item.actionType === 'custom'){
          let action = item.action;
          action.action = item.action.actionType;
          item.bindtap = "tapEventCommonHandler";
          item.param = action;
        } else {
          let goodsTypeReg = new RegExp('(^|&)goodsType=([^&]*)(&|$)');
          let orderIndex = new RegExp('(^|&)currentIndex=([^&]*)(&|$)');
          let goodsType = item.param && item.param.match(goodsTypeReg) ? +item.param.match(goodsTypeReg)[2] : -1;
          let k = item.param && item.param.match(orderIndex) ? +item.param.match(orderIndex)[2] : -1
          if (goodsType >= 0 && goodsType < 4) {
            goodsTypeList[goodsType].index.push([i,j,k])
          }

          if (item.router === 'myOrder' && goodsType != -1 && !goodsTypeList[goodsType].requested) {
            goodsTypeList[goodsType].requested = true;
            setTimeout(() => {
              this.userCenterOrderCount({
                goodsType: goodsType,
              }, (data) => {
                let newdata = {}
                data = [0, ...data]
                for(let i in goodsTypeList[goodsType].index){
                  let index = goodsTypeList[goodsType].index[i]
                  if (i == index[2]) {

                  }
                  newdata[compid + '.content[' + index[0] + ']blockArr[' + index[1] + ']count'] = +data[index[2]]
                }
                pageInstance.setData(newdata)
              })
            }, 0);
          }
        }
      }
    }
    data[compid + '.content'] = content;
    pageInstance.setData(data)
  },
  _takeoutInit: function (options) {
    let data = {};
    let _this = this;
    let param = options.param;
    let compid = options.compid;
    let pageInstance = this.getAppCurrentPage();
    let compData = options.compData;
    data[compid + '.goodsDetailShow'] = false;
    data[compid + '.goodsModelShow'] = false;
    data[compid + '.selected'] = 1;
    if (pageInstance.data[compid].TotalNum == undefined) {
      data[compid + '.TotalNum'] = 0;
      data[compid + '.TotalPrice'] = 0.00;
    }
    data[compid + '.cartList'] = {};
    data[compid + '.cartGoodsIdList'] = [];
    data[compid + '.loading'] = true;
    data[compid + '.loadingFail'] = false;
    if (pageInstance.data[compid].goods_data_list) {
      data[compid + '.show_goods_data'] = {};
    }
    // 分类
    for (let j in compData.content) {
      data[compid + '.pagination.category' + compData.content[j].source] = {};
      data[compid + '.pagination.category' + compData.content[j].source].param = {},
        Object.assign(data[compid + '.pagination.category' + compData.content[j].source].param, param)
      data[compid + '.pagination.category' + compData.content[j].source].param.idx_arr = {
        idx: 'category',
        idx_value: compData.content[j].source == 'all' ? '' : compData.content[j].source
      };
    }
    data[compid + '.heightPx'] = _this._returnListHeight(pageInstance.data[compid].customFeature.showShopInfo, 1);
    data[compid + '.route'] = pageInstance.route;
    pageInstance.setData(data);

    param.page = 1;
    param.page_size = 20;
    param.idx_arr = {
      idx: 'category',
      idx_value: compData.content[0].source == 'all' ? '' : compData.content[0].source
    };
    // 店铺信息
    _this._getTakeoutShopInfo((data) => {
      let _data = data.data;
      let newdata = {};
      _data.min_deliver_price = Number(_data.min_deliver_price);
      _data.description = _data.description ? _data.description.replace(/\n|\\n/g, '\n') : _data.description;
      newdata[compid + '.shopInfo'] = _data;
      _this.globalData.takeoutShopInfo = _data;
      newdata[compid + '.assessScore'] = (_data.commont_stat.average_score).toFixed(2);
      newdata[compid + '.goodsScore'] = Math.round(_data.commont_stat.score);
      newdata[compid + '.serviceScore'] = Math.round(_data.commont_stat.logistic_score);

        newdata[compid + '.isDeliver'] = (+_data.min_deliver_price).toFixed(2);
        if (_this.globalData.takeoutLocate.lat) {
          let distance = _this.calculationDistanceByLatLng(_this.globalData.takeoutLocate.lat, _this.globalData.takeoutLocate.lng, _data.latitude, _data.longitude);
          newdata[compid + '.in_distance'] = (distance < +_data.deliver_distance ? 1 : 0);
        }
      pageInstance.setData(newdata)
      let length = _data.coupon_list ? _data.coupon_list.length : 0;
      if (length > 1) {
        _this._horseRaceLampUp(pageInstance, compid, length);
        _this.takeoutAniUp = setTimeout(function () {
          _this._horseRaceLampDown(pageInstance, compid, length);
        }, length * 2500)
        _this.takeoutAniDown = setInterval(function () {
          if (_this.getAppCurrentPage().route != pageInstance.data[compid].route) {
            clearTimeout(_this.takeoutAniUp)
            clearTimeout(_this.takeoutAniUp2)
            clearInterval(_this.takeoutAniDown)
            _this.downAnima && clearInterval(_this.downAnima)
            _this.upAnima && clearInterval(_this.upAnima)
          } else {
            _this._horseRaceLampUp(pageInstance, compid, length);
            _this.takeoutAniUp2 = setTimeout(function () {
              _this._horseRaceLampDown(pageInstance, compid, length);
            }, length * 2500)
          }
        }, length * 5000)
      }
    })
    _this._getTakeoutStyleGoodsList(param, pageInstance, compid, 1);

    if (_this.globalData.takeoutLocate.lat && _this.globalData.takeoutRefresh){
      let takeoutData = pageInstance.data[compid];
      let latitude = _this.globalData.takeoutLocate.lat;
      let longitude = _this.globalData.takeoutLocate.lng;
      if (takeoutData.shopInfo && takeoutData.shopInfo.latitude) {
        let distance = _this.calculationDistanceByLatLng(latitude, longitude, takeoutData.shopInfo.latitude, takeoutData.shopInfo.longitude);
        let data = {};
        data[compid + '.in_distance'] = (distance < +takeoutData.shopInfo.deliver_distance ? 1 : 0);
        pageInstance.setData(data);
      }
    }else if (_this.globalData.locationInfo.latitude){
      let newdata = {};
      let takeoutData = pageInstance.data[compid];
      let loaction = _this.globalData.locationInfo;
      if (takeoutData.shopInfo && takeoutData.shopInfo.latitude) {
        let distance = _this.calculationDistanceByLatLng(loaction.latitude, loaction.longitude, takeoutData.shopInfo.latitude, takeoutData.shopInfo.longitude);
        let data = {};
        data[compid + '.in_distance'] = (distance < +takeoutData.shopInfo.deliver_distance ? 1 : 0);
        pageInstance.setData(data);
      }
      _this.globalData.takeoutLocate.lat = loaction.latitude;
      _this.globalData.takeoutLocate.lng = loaction.longitude;
      newdata[compid + '.addressInfo'] = loaction.info;
      newdata[compid + '.location_address'] = loaction.address;
      pageInstance.setData(newdata);
    }else{
      this.getLocation({
        type: 'gcj02',
        altitude: true,
        success: function (res) {
          if(!res.latitude){
            let newdata = {};
            newdata[compid + '.location_address'] = '定位失败'
            pageInstance.setData(newdata);
            return;
          }
          let latitude = res.latitude;
          let longitude = res.longitude;
          _this.globalData.takeoutLocate.lat = latitude;
          _this.globalData.takeoutLocate.lng = longitude;

          let takeoutData = pageInstance.data[compid];
          if (takeoutData.shopInfo && takeoutData.shopInfo.latitude) {
            let distance = _this.calculationDistanceByLatLng(latitude, longitude, takeoutData.shopInfo.latitude, takeoutData.shopInfo.longitude);
            let data = {};
            data[compid + '.in_distance'] = (distance < +takeoutData.shopInfo.deliver_distance ? 1 : 0);
            pageInstance.setData(data);
          }
          // 顶部定位地址
          _this.getAddressByLatLng({
            lat: latitude,
            lng: longitude
          }, function (res) {
            let newdata = {};
            newdata[compid + '.addressInfo'] = res.data;
            newdata[compid + '.location_address'] = res.data.formatted_addresses.recommend
            pageInstance.setData(newdata);

            _this.setLocationInfo({
              latitude: latitude,
              longitude: longitude,
              address: res.data.formatted_addresses.recommend,
              info: res.data
            });
          });
        },
        fail:function(res){
          console.log(res);
          let newdata = {};
          newdata[compid + '.location_address'] = '定位失败'
          pageInstance.setData(newdata);
        }
      });
    }
    _this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppShop/getAssessList&idx_arr[idx]=goods_type&idx_arr[idx_value]=2',
      data: { page: 1, page_size: 10, obj_name: 'app_id' },
      success: function (res) {
        let newdata = {},
          showAssess = [],
          hasImgAssessList = 0,
          goodAssess = 0,
          normalAssess = 0,
          badAssess = 0;
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].assess_info.has_img == 1 ? (hasImgAssessList++ , showAssess.push(res.data[i])) : null;
          res.data[i].assess_info.level == 3 ? goodAssess++ : (res.data[i].assess_info.level == 1 ? badAssess++ : normalAssess++)
        }
        for (let j = 0; j < res.num.length; j++) {
          res.num[j] = parseInt(res.num[j])
        }
        newdata[compid + '.assessActive'] = 0;
        newdata[compid + '.assessList'] = res.data;
        newdata[compid + '.showAssess'] = showAssess;
        newdata[compid + '.assessNum'] = res.num;
        newdata[compid + '.moreAssess'] = res.is_more;
        newdata[compid + '.assessCurrentPage'] = res.current_page || 1;
        pageInstance.setData(newdata);
      }
    })
    
    
  },
  _horseRaceLampUp: function (pageInstance, compid, delay) {
    let that = this;
    let takeoutAmination = this.createAnimation({
      duration: 400,
      timingFunction: 'linear',
      delay: 0,
      transformOrigin: '0 0'
    });
    let count = 0;
    if (pageInstance.data[compid].route != that.getAppCurrentPage().route) {
      clearInterval(that.upAnima)
      clearInterval(that.downAnima)
      clearTimeout(that.takeoutAniUp)
      clearTimeout(that.takeoutAniUp2)
      clearInterval(that.takeoutAniDown)
      return;
    }else{
      that.upAnima = setInterval(function () {
      let animationData = {}
      if (count < delay) {
        takeoutAmination.translateY(-21 * count).step()
        count ++
      }
      animationData[compid + '.takeoutAmination'] = takeoutAmination.export()
      pageInstance.setData(animationData)
    }, 2500)
    }
    setTimeout(function(){
      clearInterval(that.upAnima)
    }, delay * 2500)
  },
  _horseRaceLampDown: function (pageInstance, compid, delay){
    let that = this;
    let takeoutAmination = this.createAnimation({
      duration: 400,
      timingFunction: 'linear',
      delay: 0,
      transformOrigin: '0 0'
    });
    let count = delay - 1;
    if (pageInstance.data[compid].route != that.getAppCurrentPage().route) {
      clearInterval(that.downAnima)
      clearInterval(that.upAnima)
      clearTimeout(that.takeoutAniUp)
      clearTimeout(that.takeoutAniUp2)
      clearInterval(that.takeoutAniDown)
      return
    }else{
      that.downAnima = setInterval(function () {
        let animationData = {}
        if (count >= 0) {
          takeoutAmination.translateY(-21 * count).step();
          count--
        }
        animationData[compid + '.takeoutAmination'] = takeoutAmination.export()
        pageInstance.setData(animationData)
      }, 2500)
      setTimeout(function () {
        clearInterval(that.downAnima)
      }, delay * 2500)
    }
  },
  _getTakeoutStyleGoodsList:function(param, pageInstance, compid, isOnShow){
    let _this = this;
    this.sendRequest({
      hideLoading: true,   // 页面第一个请求才展示loading
      url: '/index.php?r=AppShop/GetGoodsList',
      data: param,
      method: 'post',
      success: function (res) {
        if (res.status == 0) {
          pageInstance.requesting = false;
          let categoryId = param.idx_arr.idx_value == '' ? 'all' : param.idx_arr.idx_value;
          let data = pageInstance.data,
              newdata = {},
              isRequireing = {},
              categoryList = {},
              takeoutGoodsModelData = {};
          isRequireing[compid + '.pagination.category' + categoryId] = data[compid].pagination['category' + categoryId];
          isRequireing[compid + '.pagination.category' + categoryId].requesting = false;
          pageInstance.setData(isRequireing);
          if (!data[compid].show_goods_data || (data[compid].show_goods_data && !data[compid].show_goods_data['category' + categoryId]) || isOnShow) {
            categoryList['category'+categoryId] = []
          }else {
            categoryList['category'+categoryId] = data[compid].show_goods_data['category'+categoryId]
          }
          if(data[compid].goods_data_list){
            newdata[compid + '.goods_data_list'] = data[compid].goods_data_list
          }else{
            newdata[compid + '.goods_data_list'] = {}
          }
          if (data[compid].goods_model_list) {
            newdata[compid + '.goods_model_list'] = data[compid].goods_model_list
          } else {
            newdata[compid + '.goods_model_list'] = {}
          }
          for(let i in res.data){
            let form_data = res.data[i].form_data
            categoryList['category'+categoryId].push({
              app_id: form_data.app_id,
              cover: form_data.cover,
              description: form_data.description,
              goods_model: form_data.goods_model,
              id : form_data.id,
              model: form_data.model,
              price: form_data.price,
              sales: form_data.sales,
              title: form_data.title,
              business_time: form_data.business_time,
              is_in_business_time: form_data.goods_in_business_time
            });
            newdata[compid + '.goods_model_list']['' + form_data.id + ''] = {};
            newdata[compid + '.goods_data_list']['' + form_data.id + ''] = {
              totalNum : 0,
              stock: form_data.stock,
              goods_model:{},
              name: form_data.title,
              price: form_data.price,
              in_business_time: form_data.goods_in_business_time
            }
            if (form_data.goods_model) {
              let new_goods_model = {}
              for(let i in form_data.goods_model){
                new_goods_model[form_data.goods_model[i].id] = {
                  model: form_data.goods_model[i].model,
                  stock: form_data.goods_model[i].stock,
                  price: form_data.goods_model[i].price,
                  goods_id: form_data.goods_model[i].goods_id,
                  totalNum: 0
                }
              }
              newdata[compid + '.goods_model_list']['' + form_data.id + ''] = {
                modelData: [],
                name: form_data.title,
                goods_model : new_goods_model
              }
              for(let k in form_data.model){
                 newdata[compid + '.goods_model_list'][''+form_data.id+'']['modelData'].push({
                  name: form_data.model[k].name,
                  subModelName: form_data.model[k].subModelName,
                  subModelId : form_data.model[k].subModelId
                })
              }
            } else {
               newdata[compid + '.goods_model_list'][''+form_data.id+''][0] = {
                price: form_data.price,
                num: 0,
                stock: form_data.stock,
                price: form_data.price
              }
            }
          }
          newdata[compid + '.show_goods_data.category' + categoryId] = categoryList['category'+categoryId];
          newdata[compid + '.in_business_time'] = res.in_business_time;
          
          newdata[compid + '.pagination.category' + categoryId] = data[compid].pagination['category' + categoryId];
          param.page++;
          newdata[compid + '.pagination.category' + categoryId].param = param;
          newdata[compid + '.pagination.category' + categoryId].is_more= res.is_more;
          newdata[compid + '.pagination.category' + categoryId].current_page = res.current_page;
          newdata[compid + '.modelChoose'] = [];
          newdata[compid + '.modelIdArr'] = [];
          newdata[compid + '.loading'] = false;
          newdata[compid + '.loadingFail'] = false;
          pageInstance.setData(newdata);
          if (pageInstance.data[compid].cartTakeoutStyleList) {
            _this._parseTakeoutCartListData(pageInstance.data[compid].cartlistData, pageInstance, compid)
          }else{
            _this._getTakeoutStyleCartList(pageInstance, compid)
          }
        }
      },
      fail: function(){
        let newdata = {};
        newdata[compid + '.loadingFail'] = true;
        newdata[compid + '.loading'] = false;
        pageInstance.setData(newdata);
      },
      complete: function () {
        setTimeout(function () {
          pageInstance.requesting = false;
        }, 300);
      }
    });
  },
  _getTakeoutShopInfo:function(successFun){
    this.sendRequest({
      hideLoading: true,   // 页面第一个请求才展示loading
      url: '/index.php?r=AppShop/getTakeOutInfo',
      data: {},
      success: function (data) {
        successFun(data)
      }
    });
  },
  getAddressByLatLng: function (params, callback) {
    this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=Map/getAreaInfoByLatAndLng',
      data: {
        latitude: params.lat,
        longitude: params.lng
      },
      success: function(res){
        callback(res)
      }
    })
  },
  _getTakeoutStyleCartList: function(pageInstance, compid){
    let _this = this;
    this.sendRequest({
      hideLoading: true,   // 页面第一个请求才展示loading
      url: '/index.php?r=AppShop/cartList',
      data: { page: -1, page_size: 1000, sub_shop_app_id: '', parent_shop_app_id: '' },
      success: function (cartlist) {
        if (cartlist.status == 0) {
          _this._parseTakeoutCartListData(cartlist, pageInstance, compid)
        }
      }
    })
  },
  _parseTakeoutCartListData: function(cartlist, pageInstance, compid){
    let newdata = {},
        stockEmpty = false,
        data = pageInstance.data,
        totalNum = 0,
        totalPrice = 0.00;
    newdata[compid + '.cart_data'] = {};
    newdata[compid + '.goods_data_list'] = data[compid].goods_data_list;
    newdata[compid + '.goods_model_list'] = data[compid].goods_model_list;
    newdata[compid + '.cartGoodsIdList'] = [];
    if (cartlist.data.length) {
      for(let i in cartlist.data){
        let item = cartlist.data[i];

        newdata[compid + '.cartlistData'] = [];
        newdata[compid + '.cartlistData'].push(item)
        if (item.goods_type == 2 && /waimai/.test(compid)) {
          if (+item.num > +item.stock) {
            item.num = item.stock;
            stockEmpty = true;
          }
          newdata[compid + '.cart_data'][item.goods_id] ? null : newdata[compid + '.cart_data'][item.goods_id] = {};
          newdata[compid + '.cart_data'][item.goods_id][item.model_id] = { cart_id: item.id };
          if (data[compid].goods_data_list[item.goods_id] && !data[compid].cartList[item.goods_id]) {
            newdata[compid + '.goods_data_list']['' + item.goods_id].totalNum += +item.num;
            if (newdata[compid + '.goods_model_list'][item.goods_id + ''].goods_model) {
              newdata[compid + '.goods_model_list'][item.goods_id + ''].goods_model[item.model_id].totalNum += +item.num
            }else{
              newdata[compid + '.goods_model_list'][item.goods_id + ''][0].num += +item.num
            }
          }
          if (!newdata[compid + '.cartList.'+item.goods_id]) {
            newdata[compid + '.cartList.'+item.goods_id] = {};
          }
          if (newdata[compid + '.cartGoodsIdList'].indexOf(+item.goods_id) == -1) {
            newdata[compid + '.cartGoodsIdList'].push(+item.goods_id);
          }
          newdata[compid + '.cartList.'+item.goods_id][item.model_id] = {
            list: 'list',
            id: item.goods_id,
            modelName: item.model_value ? item.model_value.join(' | ') : '',
            modelId: item.model_id,
            num: +item.num,
            price: +item.price,
            gooodsName: item.title,
            totalPrice: Number(item.num * item.price).toFixed(2),
            stock: item.stock,
            cart_id: item.id,
            in_business_time: data[compid].goods_data_list[item.goods_id] && data[compid].goods_data_list[item.goods_id].in_business_time
          }
          totalNum += Number(item.num);
          totalPrice += Number(item.price) * item.num;
        } else if (item.goods_type == 3 && /tostore/.test(compid)) {
          if (+item.num > +item.stock) {
            item.num = item.stock;
            stockEmpty = true;
          }
          newdata[compid + '.cart_data'][item.goods_id] ? null : newdata[compid + '.cart_data'][item.goods_id] = {};
          newdata[compid + '.cart_data'][item.goods_id][item.model_id] = {cart_id: item.id};
          if (data[compid].goods_data_list[item.goods_id] && !data[compid].cartList[ item.goods_id]) {
            newdata[compid + '.goods_data_list.'+item.goods_id+'.totalNum'] = (newdata[compid + '.goods_data_list.'+item.goods_id+'.totalNum'] || 0)+ +item.num;
            newdata[compid + '.goods_model_list.'+ item.goods_id] = data[compid].goods_model_list[item.goods_id];
            if (newdata[compid + '.goods_model_list.' + item.goods_id].goods_model) {
              newdata[compid + '.goods_model_list.' + item.goods_id].goods_model[item.model_id].totalNum += +item.num
            }else{
              newdata[compid + '.goods_model_list.' + item.goods_id][0].num += +item.num
            }
          }
          if (!newdata[compid + '.cartList.'+item.goods_id]) {
            newdata[compid + '.cartList.'+item.goods_id] = {};
          }
          if (newdata[compid + '.cartGoodsIdList'].indexOf(+item.goods_id) == -1) {
            newdata[compid + '.cartGoodsIdList'].push(+item.goods_id);
          }
          newdata[compid + '.cartList.'+item.goods_id][item.model_id] = {
            list: 'list',
            id: item.goods_id,
            modelName: item.model_value ? item.model_value.join(' | ') : '',
            modelId: item.model_id,
            num: +item.num,
            price: +item.price,
            gooodsName: item.title,
            totalPrice: Number(item.num * item.price).toFixed(2),
            stock: item.stock,
            cart_id: item.id,
            in_business_time: data[compid].goods_data_list[item.goods_id] && data[compid].goods_data_list[item.goods_id].in_business_time
          }
          totalNum += Number(item.num);
          totalPrice += Number(item.price) * item.num;
        }
      }
      newdata[compid + '.TotalNum'] = totalNum;
      newdata[compid + '.TotalPrice'] = totalPrice.toFixed(2);
      if (/waimai/.test(compid)) {
        newdata[compid + '.isDeliver'] = (+data[compid].shopInfo.min_deliver_price - newdata[compid + '.TotalPrice']).toFixed(2);
      }
      pageInstance.setData(newdata);

      if (stockEmpty) {
        this.showModal({
          content: '部分商品库存不足，购物车总数量已修改为最大库存'
        })
        let options = {
          goods_type: /waimai/.test(compid) ? 2 : 3,
          cartListData: pageInstance.data[compid].cartList,
          thisPage: pageInstance,
          compid: compid
        }
        this._addTakeoutCart(options, this.eachCartList(options))
      }
    }else{
      newdata[compid + '.TotalNum'] = 0;
      newdata[compid + '.TotalPrice'] = 0.00;
      pageInstance.setData(newdata);
    }
  },
  onPageShareAppMessage: function (event, callback) {
    let pageInstance = this.getAppCurrentPage();
    let pageRouter   = pageInstance.page_router;
    let pagePath     = '/' + pageInstance.route;
    let desc         = event.target ? event.target.dataset.desc : this.getAppDescription();

    pageInstance.setData({
      pageQRCodeData: {
        shareDialogShow: "100%",
        shareMenuShow: false,
      },
      backToHomePage: {
        showButton: false
      },
      needbackToHomePage: pageInstance.data.backToHomePage && pageInstance.data.backToHomePage.showButton
    })
    pagePath += pageInstance.dataId ? '?detail=' + pageInstance.dataId : '';
    if (this.globalData.PromotionUserToken){
      if (pagePath.indexOf('?') < 0){
        pagePath += '?user_token=' + this.globalData.PromotionUserToken;
      }else{
        pagePath += '&user_token=' + this.globalData.PromotionUserToken;
      }
    }
    return this.shareAppMessage({path: pagePath, desc: desc, success: callback});
  },
  onPageShow: function () {
    let pageInstance = this.getAppCurrentPage();
    let that         = this;
    if (this.globalData.takeoutRefresh) {
      this.pageDataInitial();
      this.globalData.takeoutRefresh = false;
    } else if (this.globalData.tostoreRefresh){
      this.pageDataInitial();
      this.globalData.tostoreRefresh = false;
    } else if (this.globalData.topicRefresh && this.globalData.hasTopicCom) {
      this.pageDataInitial();
      this.globalData.topicRefresh = false;
    } else {
      setTimeout(function () {
        that.setPageUserInfo();
      });
    }

    if (this.globalData.topicTurnToDetail) {
      this.globalData.topicTurnToDetail = false;
    }
    if (pageInstance.user_center_compids_params.length) {
      for (let i in pageInstance.user_center_compids_params) {
        let compid = pageInstance.user_center_compids_params[i].compid
        this._initUserCenterData(pageInstance, compid);
      }
    }

    if (pageInstance.need_login && !pageInstance.bind_phone) {
      this.goLogin({});
    } else if (pageInstance.need_login && pageInstance.bind_phone && !this.getUserInfo().phone && !that.globalData.isOpenSettingBack) {
      if (this.isLogin()) {
        setTimeout(function(){
          that.turnToPage('/default/pages/bindCellphone/bindCellphone?r=' + pageInstance.page_router, 1);
        }, 1000);
      } else {
        this.goLogin({
          success: function () {
            !that.getUserInfo().phone && that.turnToPage('/default/pages/bindCellphone/bindCellphone?r=' + pageInstance.page_router, 1);
          }
        });
      }
      that.globalData.isOpenSettingBack = false;
    }
    // 用户返回刷新排号
    if (pageInstance.rowNumComps.length) {
      this.isOpenRowNumber(pageInstance);
    }
    if (pageInstance.tostoreComps.length && pageInstance.returnToVersionFlag) {
      this.tostoreCompsInit(pageInstance);
    }
    // 多商家列表待审核状态进入预览修改了模板返回需要重新加载
    if(this.globalData['franchiseeTplChange-' + pageInstance.page_router]){
      if (!!pageInstance.franchiseeComps && pageInstance.franchiseeComps.length) {
        for (let i in pageInstance.franchiseeComps) {
          let compid = pageInstance.franchiseeComps[i].compid;
          that.getMyAppShopList(compid, pageInstance, true);
          that.globalData['franchiseeTplChange-' + pageInstance.page_router] = false;
        }
      }
    }
  },
  onPageHide: function () {
    let pageInstance = this.getAppCurrentPage(),
      newdata = {};
    if (pageInstance.popupWindowComps && pageInstance.popupWindowComps.length) { // 隐藏弹窗
      for (let i in pageInstance.popupWindowComps) {
        let compid = pageInstance.popupWindowComps[i].compid;
        if (pageInstance.data[compid] && pageInstance.data[compid].showPopupWindow) {
          newdata[compid + '.showPopupWindow'] = false;
        }

      }
      pageInstance.setData(newdata);
    }
  },
  tostoreCompsInit:function(pageInstance){
    let that = this;
    pageInstance.returnToVersionFlag = false;
    for (let i in pageInstance.tostoreComps) {
      let compid = pageInstance.tostoreComps[i].compid;
      let param = pageInstance.tostoreComps[i].param;
      let data = pageInstance.data;
      let newTostoreData = {};
      newTostoreData[compid + '.goodsDetailShow'] = false;
      newTostoreData[compid + '.goodsModelShow'] = false;
      newTostoreData[compid + '.heightPx'] = that._returnListHeight(data[compid].customFeature.showShopInfo)
      newTostoreData[compid + '.selected'] = 1;
      newTostoreData[compid + '.cartList'] = {};
      newTostoreData[compid + '.cartGoodsIdList'] = [];
      newTostoreData[compid + '.loading'] = true;
      newTostoreData[compid + '.loadingFail'] = false;
      if (pageInstance.data[compid].goods_data_list) {
        newTostoreData[compid + '.show_goods_data'] = {};
      }
      pageInstance.setData(newTostoreData);
      param.page = 1;
      param.page_size = 50;
      param.take_out_style = 1;
      let newWaimaiData = {};
      for (let j in data[compid].content) {
        newWaimaiData[compid + '.pagination.category' + data[compid].content[j].source] = {};
        newWaimaiData[compid + '.pagination.category' + data[compid].content[j].source].param = {},
          Object.assign(newWaimaiData[compid + '.pagination.category' + data[compid].content[j].source].param, param)
        newWaimaiData[compid + '.pagination.category' + data[compid].content[j].source].param.idx_arr = {
          idx: 'category',
          idx_value: data[compid].content[j].source == 'all' ? '' : data[compid].content[j].source
        };
      }
      pageInstance.setData(newWaimaiData);
      param.idx_arr = {
        idx: 'category',
        idx_value: data[compid].content[0].source == 'all' ? '' : data[compid].content[0].source
      }
        that._getTakeoutStyleGoodsList(param, pageInstance, compid, 1);
      that.sendRequest({
        url: '/index.php?r=AppShop/GetTostoreWaitingRule',
        method: 'get',
        success: function (res) {
          let newdata = {};
          res.data.description = res.data.description ? res.data.description.replace(/\n|\\n/g, '\n') : res.data.description;
          newdata[compid + '.shopInfo'] = res.data;
          pageInstance.setData(newdata);
        }
      });
      that.sendRequest({
        url: '/index.php?r=AppShop/getAssessList&idx_arr[idx]=goods_type&idx_arr[idx_value]=3',
        method: 'get',
        data: { page: 1, page_size: 10, obj_name: 'app_id' },
        success: function (res) {
          let newdata = {},
            showAssess = [],
            hasImgAssessList = 0,
            goodAssess = 0,
            normalAssess = 0,
            badAssess = 0;
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].assess_info.has_img == 1 ? (hasImgAssessList++ , showAssess.push(res.data[i])) : null;
            res.data[i].assess_info.level == 3 ? goodAssess++ : (res.data[i].assess_info.level == 1 ? badAssess++ : normalAssess++)
          }
          for (let j = 0; j < res.num.length; j++) {
            res.num[j] = parseInt(res.num[j])
          }
          newdata[compid + '.assessActive'] = 0;
          newdata[compid + '.assessList'] = res.data;
          newdata[compid + '.showAssess'] = showAssess;
          newdata[compid + '.assessNum'] = res.num;
          newdata[compid + '.moreAssess'] = res.is_more;
          newdata[compid + '.assessCurrentPage'] = res.current_page || 0;
          pageInstance.setData(newdata);
        }
      })
    }
  },
  userCenterOrderCount: function (options, callback) {

    this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppShop/countStatusOrder',
      data: {
        parent_shop_app_id: this.getAppId(),
        goods_type: options.goodsType
      },
      method: 'post',
      success: function (res) {
        if (res.status == 0) {
          callback(res.data);
        }
      }
    });
  },
  _returnListHeight:function(isshow, takeout){
    if (!isshow) {
      return wx.getSystemInfoSync().windowHeight - 43;
    } else {
      if(takeout){
        return wx.getSystemInfoSync().windowHeight - 163;
      }else{
        return wx.getSystemInfoSync().windowHeight - 138;
      }
    }
  },
  onPageReachBottom: function ( reachBottomFuc ) {
    for (let i = 0; i < reachBottomFuc.length; i++) {
      let e = reachBottomFuc[i];
      e.triggerFuc(e.param);
    }
  },
  bbsScrollFuc: function (compid) {
    let _this         = this;
    let pageInstance  = this.getAppCurrentPage();
    let bbsData       = pageInstance.data[compid];
    let bbs_idx_value = '';

    if (bbsData.loading || bbsData.content.is_more == 0) {
      return ;
    }
    let newdata = {};
    newdata[compid + '.loading'] = true;
    pageInstance.setData(newdata);

    if (bbsData.customFeature.ifBindPage && bbsData.customFeature.ifBindPage !== 'false') {
      if (pageInstance.page_form && pageInstance.page_form != 'none') {
        bbs_idx_value = pageInstance.page_form + '_' + pageInstance.dataId;
      } else {
        bbs_idx_value = pageInstance.page_router;
      }
    } else {
      bbs_idx_value = _this.getAppId();
    }
    _this.sendRequest({
      url: '/index.php?r=AppData/getFormDataList',
      method: 'post',
      data: {
        form: 'bbs',
        is_count: bbsData.customFeature.ifLike ? 1 : 0,
        page: bbsData.content.current_page + 1,
        idx_arr: {
          idx: 'rel_obj',
          idx_value: bbs_idx_value
        }
      },
      hideLoading: true,
      success: function (res) {
        let data = {},
            newData = {};
        data = res;

        data.data = bbsData.content.data.concat(res.data);
        data.isloading = false;

        newData[compid+'.content'] = data;
        newData[compid + '.loading'] = false;
        newData[compid + '.loadingFail'] = false;
        pageInstance.setData(newData);
      },
      fail: function (res) {
        let newdata = {};
        newdata[compid + '.loadingFail'] = true;
        newdata[compid + '.loading'] = false;
        pageInstance.setData(newdata);
      }
    });
  },
  onPageUnload: function () {
    let pageInstance = this.getAppCurrentPage();
    this._logining = false;
    let downcountArr = pageInstance.downcountArr;
    if(downcountArr && downcountArr.length){
      downcountArr = downcountArr.concat().reverse();
      for (let i = 0; i < downcountArr.length; i++) {
        downcountArr[i] && downcountArr[i].clear();
      }
    }
  },
  slidePanelStart: function (e) {
    let pageInstance = this.getAppCurrentPage();
    let compid = e.currentTarget.dataset.compid;
    let startX = e.changedTouches[0].clientX;
    let index = pageInstance.data[compid].slideIndex;
    clearInterval(pageInstance.data[compid].slideInterval);
    let data = {};
    data[compid + '.startX'] = startX;
    pageInstance.setData(data);
  },
  slidePanelEnd: function (e) {
    let pageInstance = this.getAppCurrentPage();
    let compid = e.currentTarget.dataset.compid;
    let endX = e.changedTouches[0].clientX;
    let startX = pageInstance.data[compid].startX;
    let index = pageInstance.data[compid].customFeature.slideIndex;
    let direction
    if (Math.abs(startX - endX) > 50) {
      startX - endX > 0 ? index++ : index--;
      if (pageInstance.data[compid].customFeature.autoplay) {
        pageInstance.data[compid].slideInterval = setInterval(() => {
          let index = pageInstance.data[compid].customFeature.slideIndex;
          if (index >= pageInstance.data[compid].content.length ) {
            index = 0;
          } else {
            index += 1;
          }
          let direction = '_interval'
          this.slideAnimation({
            compid: compid,
            num: index,
            pageInstance: pageInstance,
            direction: direction
          })
        }, pageInstance.data[compid].customFeature.interval * 1000)
      } else {
        clearInterval(pageInstance.data[compid].slideInterval);
      }
      if (index >= pageInstance.data[compid].content.length || index < 0) {
        return;
      }
      this.slideAnimation({ compid: compid, num: index, pageInstance: pageInstance, direction: direction})
    }
  },
  slideAnimation: function (params) {
    let animation = wx.createAnimation({
      duration: (params.num == 0 && params.direction) ? 0 : 500
      // duration: 500
    });
    let length = (-750 * params.num) + 'rpx';
    let data = {};
      animation.left(length).step();
    data[params.compid + '.animations'] = animation.export();
    data[params.compid + '.customFeature.slideIndex'] = params.num
    params.pageInstance.setData(data);
  },

  slideSwiper: function(options) {
    options.pageInstance.data[options.compid].slideInterval = setInterval(() =>{
      let index = options.pageInstance.data[options.compid].customFeature.slideIndex;
      let direction = '_interval'
      if (index >= options.pageInstance.data[options.compid].content.length ){
        index = 0;
      }else {
        index += 1;
      }
      this.slideAnimation({
        compid: options.compid,
        num: index,
        pageInstance: options.pageInstance,
        direction: direction
      })
    }, options.pageInstance.data[options.compid].customFeature.interval*1000)
  },

  changeDropDown: function (e) {
    let pageInstance = this.getAppCurrentPage();
    let dataset = e.currentTarget.dataset;
    let form = dataset.form;
    let index = dataset.index;
    let name = dataset.name;
    let key = dataset.key;
    let filed = dataset.filed;
    let range = dataset.range;
    let value = e.detail.value;
    let newdata = {};
    newdata[form + '.dropDown'] = pageInstance.data[form].dropDown ? pageInstance.data[form].dropDown : {};
    newdata[form + '.dropDown'][filed] = newdata[form + '.dropDown'][filed] ? newdata[form + '.dropDown'][filed] : [];
    newdata[form + '.dropDown'][filed][index] = range[value];
    newdata[form + '.form_data.' + filed] = newdata[form + '.dropDown'][filed].join(',');
    pageInstance.setData(newdata);
  },
  selectPicOption:function(e){
    let pageInstance = this.getAppCurrentPage();
    let dataset = e.currentTarget.dataset;
    let form = dataset.form;
    let src = dataset.src;
    let filed = dataset.filed;
    let index = dataset.index;
    let multi = dataset.multi;
    let min = dataset.min;
    let max = dataset.max;
    let name = dataset.name;
    let id = dataset.id;
    let newdata = {};
    let arr = [];
    if (!filed) {
      this.showModal({
        content: '该组件未绑定字段 请在电脑编辑页绑定后使用'
      });
      return;
    }
    if (multi) {
      if (pageInstance.data[form].picOptions && pageInstance.data[form].picOptions[id]) {
        newdata[form + '.picOptions.' + id] = [...pageInstance.data[form].picOptions[id]]
      }else {
        newdata[form + '.picOptions.' + id] = [];
      }
      if (!newdata[form + '.picOptions.' + id][index] ) {
        newdata[form + '.picOptions.'+id][index] = src;
      } else {
        newdata[form + '.picOptions.'+id][index] = '';
      }
      for (let i in newdata[form + '.picOptions.' + id]){
        if (newdata[form + '.picOptions.' + id][i] !== '' && newdata[form + '.picOptions.' + id][i] !== undefined ){
          arr.push(newdata[form + '.picOptions.' + id][i]);
        }
      }
      if (arr.length > max) {
        this.showModal({
          content: name + '最多选择' + max + '项'
        });
        return;
      }
      if (pageInstance.data[form].picOptionsIndex) {
        if ((pageInstance.data[form].picOptionsIndex[id] && pageInstance.data[form].picOptionsIndex[id][index]) || (pageInstance.data[form].picOptionsIndex[id] && pageInstance.data[form].picOptionsIndex[id][index] === 0)) {
          newdata[form + '.picOptionsIndex.' + id + '.' + index] = null;
        } else {
          newdata[form + '.picOptionsIndex.' + id + '.' + index] = index;
        }
      } else {
        newdata[form + '.picOptionsIndex.' + id + '.' + index] = index;
      }
      newdata[form + '.form_data.' + filed] = arr;
    } else {
      let i = '';
      pageInstance.data[form].picOptionsIndex ? ((pageInstance.data[form].picOptionsIndex[id] || pageInstance.data[form].picOptionsIndex[id] == 0) && pageInstance.data[form].picOptionsIndex[id] === index ? i = -1 : i = index) : i = index
      newdata[form + '.picOptionsIndex.' + id] = i;
      newdata[form + '.form_data.' + filed] = newdata[form + '.picOptions.0'] = i === -1 ? '' : [src];
    }
    pageInstance.setData(newdata);
  },
  selectOptionOne: function (event){
    let dataset = event.currentTarget.dataset;
    let value = event.detail.value;
    let pageInstance = this.getAppCurrentPage();
    let datakey = dataset.datakey;
    let segment = dataset.segment;
    let compid = dataset.compid;
    let formcompid = dataset.formcompid;
    compid = formcompid + compid.substr(4);
    if (!segment) {
      this.showModal({
        content: '该组件未绑定字段 请在电脑编辑页绑定后使用'
      });
      return;
    }
    let newdata = {};
    let selectKey = {}
    newdata[datakey] = value;
    if (newdata[datakey].constructor === Array) {
      newdata[datakey] = newdata[datakey].join();
      for (let i in value) {
        selectKey[value[i]] = 1;
      }
      selectKey.itemLength = value.length
    }else{
      selectKey[value] = 1;
      selectKey.itemLength = 1;
    }
    newdata[compid + '.selectedData'] = selectKey
    pageInstance.setData(newdata);
  },
  selectOptionSecond: function (event) {
    let dataset = event.currentTarget.dataset;
    let pageInstance = this.getAppCurrentPage();
    let datakey = dataset.datakey;
    let index = dataset.index;
    let selectedValue = dataset.selectedValue;
    let selectedData = dataset.selectedData;
    let compid = dataset.compid;
    let formcompid = dataset.formcompid;
    let segment = dataset.segment;
    let newdata = {};
    let dataArray = [];
    let multi = dataset.multi;
    let min = dataset.min;
    let max = dataset.max;
    compid = formcompid + compid.substr(4);

    if (!segment) {
      this.showModal({
        content: '该组件未绑定字段 请在电脑编辑页绑定后使用'
      });
      return;
    }
    newdata[compid + '.selectedValue'] = selectedValue ? selectedValue : [];
    if (multi){
      let arrLength = 0;
      if (newdata[compid + '.selectedValue'][index] === index) {
        newdata[compid + '.selectedValue'][index] = null;
      } else {
        newdata[compid + '.selectedValue'][index] = index;
      }
      for (let i = 0; i < newdata[compid + '.selectedValue'].length; i++) {
        let dataIndex = newdata[compid + '.selectedValue'][i];
        if (dataIndex != null) {
          arrLength++;
          if (arrLength > max){
            this.showModal({
              content: '最多选择' + max + '项'
            });
            return;
          }
          dataArray.push(selectedData[dataIndex]);
        }
        newdata[datakey] = dataArray.join(',');
      }
    }else{
      newdata[datakey] = '';
      if (newdata[compid + '.selectedValue'][index] === index) {
        newdata[compid + '.selectedValue'][index] = null;
      }else{
        newdata[compid + '.selectedValue'] = [];
        newdata[compid + '.selectedValue'][index] = index;
        newdata[datakey] = selectedData[index]; 
      }
    }       
    pageInstance.setData(newdata);
  },
  connectWifiHandler: function (e) {
    let that = this;
    let param = JSON.parse(e.currentTarget.dataset.eventParams);
    let system = this.getSystemInfoData().system;

    this.startWifi({
      success: function (res) {
        if (/ios/i.test(system)) {
          wx.showLoading({
            title: '连接中'
          })
        }
        that.connectWifi({
          SSID: param.wifi_name,
          BSSID: param.wifi_address,
          password: param.wifi_password,
          success: function (res) {
            setTimeout(function () {
              that.showToast({
                title: '连接成功',
                icon: 'success',
                duration: 3000
              });
            }, 1000)
          },
          fail: function (res) {
            console.log(res);
            if(res.errCode){
              that.showModal({
                content: that.wifiErrCode(res.errCode)
              })
            }else if(res.errMsg == 'connectWifi:fail the api is only supported in iOS 11 or above'){
              that.showModal({
                content: '连接WiFi功能，仅Android 与 iOS 11 以上版本支持'
              })
            }else if(/connectWifi:fail/.test(res.errMsg)){
              that.showModal({
                content: res.errMsg
              })
            }
          },
          complete: function (res) {
            wx.hideLoading();
          }
        })
      },
      fail: function (res) {
        that.showModal({
          content: res.errMsg
        })
      }
    })

  },
  tapPrevewPictureHandler: function (event) {
    this.previewImage({
      current: event.currentTarget.dataset.img || event.currentTarget.dataset.imgarr[0],
      urls: event.currentTarget.dataset.imgarr instanceof Array ? event.currentTarget.dataset.imgarr : [event.currentTarget.dataset.imgarr],
    })
  },
  suspensionBottom: function (pageInstance) {
    for (let i in pageInstance.data) {
      if(/suspension/.test(i)){
        let suspension = pageInstance.data[i],
            newdata = {},
            bottom = suspension.suspension_bottom;
        if (bottom){
          let b = 0;
          if (/rpx/.test(bottom)){
            b = parseFloat(bottom);
          }else{
            b = (+bottom) * 2.34;
          }
          if(pageInstance.data.has_tabbar == 1){
            newdata[i + '.suspension_bottom'] = b - 56*2.34;
          }else{
            newdata[i + '.suspension_bottom'] = b;
          }
        }else{
          newdata[i + '.suspension_bottom'] = -1;
        }
        pageInstance.setData(newdata);
      }
    }
  },
  pageScrollFunc : function(event) {
    let pageInstance = this.getAppCurrentPage();
    let compid       = typeof event == 'object' ? event.currentTarget.dataset.compid : event;
    let compData     = pageInstance.data[compid];

    if(!compData){
      console.log('pageScrollFunc is not find compData');
      return;
    }
    if(compData.is_search){
      this.searchList( compData.searchEle ,compData.compId, event);
    }else{
      this._pageScrollFunc(event);
    }
  },
  _pageScrollFunc: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let compid       = typeof event == 'object' ? event.currentTarget.dataset.compid : event;
    let compData     = pageInstance.data[compid];
    let curpage      = (compData.curpage || 0) + 1;
    let newdata      = {};
    let param        = {};
    let _this        = this;
    let customFeature = compData.customFeature;
    let url          = '/index.php?r=AppData/getFormDataList';

    if(!compData.is_more && typeof event == 'object' && event.type == 'tap'){
      _this.showModal({
        content: '已经加载到最后了'
      });
    }
    if (pageInstance.requesting || !compData.is_more) {
      return;
    }
    pageInstance.requesting = true;
    newdata[compid + '.loading'] = true;
    newdata[compid + '.loadingFail'] = false;
    pageInstance.setData(newdata);

    if (pageInstance.list_compids_params) {
      for (let index in pageInstance.list_compids_params) {
        if (pageInstance.list_compids_params[index].compid === compid) {
          param = pageInstance.list_compids_params[index].param;
          break;
        }
      }
    }
    if (pageInstance.dynamicClassifyGroupidsParams.length != 0) {
      param = {
        form: compData.classifyGroupForm,
        page_size: 15,
        idx_arr: {
          idx: 'category',
          idx_value: compData.currentCategory[compData.currentCategory.length-1]
        }
      }
    }
    if (customFeature.form == 'group_buy') {
      url = "/index.php?r=AppGroupBuy/GetGroupBuyGoodsList";
      param = {
        page: curpage,
        form: customFeature.form,
        current_status: 0
      }
    }

    param.page_size = customFeature.loadingNum || 10;

    param.page = curpage;
    _this.sendRequest({
      url: url,
      data: param,
      method: 'post',
      hideLoading: true,
      success: function (res) {
        newdata = {};
        let len = compData.list_data ? compData.list_data.length : 0;

        for (let j in res.data) {
          if (customFeature.form == 'group_buy') {
            res.data[j] = {
              form_data: Object.assign({}, res.data[j])
            }
          }
          for (let k in res.data[j].form_data) {
            if (k == 'category') {
              continue;
            }
            if(/region/.test(k)){
              continue;
            }
            if(k == 'goods_model') {
              res.data[j].form_data.virtual_price = _this.formVirtualPrice(res.data[j].form_data);
            }

            let description = res.data[j].form_data[k];

            if (compData.listField && compData.listField.indexOf(k) < 0 && /<("[^"]*"|'[^']*'|[^'">])*>/.test(description)) { //没有绑定的字段的富文本置为空
              res.data[j].form_data[k] = '';
            } else if (_this.needParseRichText(description)) {
              res.data[j].form_data[k] = _this.getWxParseResult(description);
            }
          }

          newdata[compid + '.list_data[' + (+j + len) + ']'] = res.data[j];
        }

        // newdata[compid + '.list_data'] = compData.list_data.concat(res.data);
        newdata[compid + '.is_more'] = res.is_more;
        newdata[compid + '.curpage'] = res.current_page;
        newdata[compid + '.loading'] = false;
        newdata[compid + '.loadingFail'] = false;

        pageInstance.setData(newdata);
      },
      fail: function(){
        let newdata = {};
        newdata[compid + '.loadingFail'] = true;
        newdata[compid + '.loading'] = false;
        pageInstance.setData(newdata);
      },
      complete: function () {
        setTimeout(function () {
          pageInstance.requesting = false;
        }, 300);
      }
    })
  },
  dynamicVesselScrollFunc: function (event) {
    let pageInstance  = this.getAppCurrentPage();
    let compid        = event.target.dataset.compid;
    let compData      = pageInstance.data[compid];
    let curpage       = compData.curpage + 1;
    let newdata       = {};
    let param         = {};
    let _this         = this;

    if (pageInstance.requesting || !compData.is_more) {
      return;
    }
    pageInstance.requesting = true;
    newdata[compid + '.loading'] = true;
    newdata[compid + '.loadingFail'] = false;
    pageInstance.setData(newdata);

    if (pageInstance.dynamicVesselComps) {
      for (let index in pageInstance.dynamicVesselComps) {
        if (pageInstance.dynamicVesselComps[index].compid === compid) {
          param = pageInstance.dynamicVesselComps[index].param;
          break;
        }
      }
    }
    if (param.param_segment === 'id') {
      param.idx = param.search_segment;
      param.idx_value = pageInstance.dataId;
    } else if (!!pageInstance.data.detail_data[param.param_segment]) {
      param.idx = param.search_segment;
      param.idx_value = pageInstance.data.detail_data[param.param_segment];
    }

    _this.sendRequest({
      url: '/index.php?r=AppData/getFormDataList',
      data: {
        form: param.form,
        page: curpage,
        idx_arr: {
          idx: param.idx,
          idx_value: param.idx_value
        }
      },
      method: 'post',
      success: function (res) {
        newdata = {};
        for (let j in res.data) {
          for (let k in res.data[j].form_data) {
            if (k == 'category') {
              continue;
            }
            if(/region/.test(k)){
              continue;
            }
            if(k == 'goods_model') {
              res.data[j].form_data.virtual_price = _this.formVirtualPrice(res.data[j].form_data);
            }

            let description = res.data[j].form_data[k];

            // 判断字段是否需要进行富文本解析
            if (_this.needParseRichText(description)) {
              res.data[j].form_data[k] = _this.getWxParseResult(description);
            }
          }
        }
        newdata[compid + '.list_data'] = compData.list_data.concat(res.data);
        newdata[compid + '.is_more'] = res.is_more;
        newdata[compid + '.curpage'] = res.current_page;
        newdata[compid + '.loading'] = false;
        newdata[compid + '.loadingFail'] = false;

        pageInstance.setData(newdata);
      },
      fail: function () {
        let newdata = {};
        newdata[compid + '.loadingFail'] = true;
        newdata[compid + '.loading'] = false;
        pageInstance.setData(newdata);
      },
      complete: function () {
        setTimeout(function () {
          pageInstance.requesting = false;
        }, 300);
      }
    })
  },
  goodsScrollFunc : function(event) {
    let pageInstance = this.getAppCurrentPage();
    let compid       = typeof event == 'object' ? event.currentTarget.dataset.compid : event;
    let compData     = pageInstance.data[compid];
    let that         = this;
    if(compData.is_search){
      this.searchList( compData.searchEle ,compData.compId, event);
    }else{
      this._goodsScrollFunc(event);
    }
  },
  _goodsScrollFunc: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let compid       = typeof event == 'object' ? event.currentTarget.dataset.compid : event;
    let compData     = pageInstance.data[compid];
    let curpage      = compData.curpage + 1;
    let customFeature = compData.customFeature;
    let newdata      = {};
    let param        = {};

    if(!compData.is_more && typeof event == 'object' && event.type == 'tap'){
      this.showModal({
        content: '已经加载到最后了'
      });
    }
    if (pageInstance.requesting || !compData.is_more) {
      return;
    }
    pageInstance.requesting = true;
    newdata[compid + '.loading'] = true;
    newdata[compid + '.loadingFail'] = false;
    pageInstance.setData(newdata);

    if (pageInstance.goods_compids_params) {
      for (let index in pageInstance.goods_compids_params) {
        if (pageInstance.goods_compids_params[index].compid === compid) {
          param = pageInstance.goods_compids_params[index].param;
          break;
        }
      }
    }
    param.page_size = customFeature.loadingNum || 20;
    param.page = curpage;
    this.sendRequest({
      url: '/index.php?r=AppShop/GetGoodsList',
      hideLoading: true,
      data: param,
      method: 'post',
      success: function (res) {
        let newdata = {};
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].form_data.goods_model && (res.data[i].form_data.goods_model.length >= 2)) {
            res.data[i].form_data.price = res.data[i].form_data.goods_price || res.data[i].form_data.price;
          }
        }
        for (let i in res.data) {
          if (res.data[i].form_data.goods_model) {
            let modelVP = [];
            for (let j in res.data[i].form_data.goods_model) {
              modelVP.push(res.data[i].form_data.goods_model[j].virtual_price == '' ? 0 : Number(res.data[i].form_data.goods_model[j].virtual_price))
            }
            Math.min(...modelVP) == Math.max(...modelVP) ? res.data[i].form_data.virtual_price = Math.min(...modelVP).toFixed(2) :
              res.data[i].form_data.virtual_price = Math.min(...modelVP).toFixed(2) + '~' + Math.max(...modelVP).toFixed(2);
          }
          delete res.data[i].form_data.description;
        }
        if (res.current_page == 1){
          compData.goods_data = [];
        }
        newdata[compid + '.goods_data'] = compData.goods_data.concat(res.data);
        newdata[compid + '.is_more'] = res.is_more;
        newdata[compid + '.curpage'] = res.current_page;
        newdata[compid + '.loading'] = false;

        pageInstance.setData(newdata);
      },
      fail: function () {
        let newdata = {};
        newdata[compid + '.loadingFail'] = true;
        newdata[compid + '.loading'] = false;
        pageInstance.setData(newdata);
      },
      complete: function () {
        setTimeout(function () {
          pageInstance.requesting = false;
        }, 300);
      }
    })
  },
  takeoutStyleScrollFunc:function(event){
    let pageInstance = this.getAppCurrentPage();
    let dataset      = event.currentTarget.dataset;
    let compid       = dataset.compid;
    let compData = pageInstance.data[compid];
    let categoryId = compData.content[compData.customFeature.selected].source;
    // let curpage = (parseInt(compData.curpage) || 0) + 1;
    let newdata      = {};
    // let categoryId = param.idx_arr.idx_value == '' ? 'all' : param.idx_arr.idx_value;
    let pagination = compData.pagination['category' + categoryId];
    let param = pagination.param;
    // param.page++
    if ((pagination.requesting || pagination.is_more === 0) && !compData.loadingFail) {
      return;
    }
    newdata[compid + '.pagination.category'+categoryId + '.requesting'] = true;
    newdata[compid + '.loading'] = true;
    newdata[compid + '.loadingFail'] = false;
    pageInstance.setData(newdata)
    this._getTakeoutStyleGoodsList(param, pageInstance, compid, 0);
  },
  franchiseeScrollFunc: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let compid       = typeof event == 'object' ? event.currentTarget.dataset.compid : event;
    let compData     = pageInstance.data[compid];
    let curpage      = compData.curpage + 1;
    let newdata      = {};
    let param        = {};

    if (pageInstance.requesting || !pageInstance.data[compid].is_more) {
      return;
    }
    pageInstance.requesting = true;
    newdata[compid + '.loading'] = true;
    newdata[compid + '.loadingFail'] = false;
    pageInstance.setData(newdata);

    if (pageInstance.franchiseeComps) {
      for (let index in pageInstance.franchiseeComps) {
        if (pageInstance.franchiseeComps[index].compid === compid) {
          param = pageInstance.franchiseeComps[index].param;
          break;
        }
      }
    }
    param.page = curpage;
    this.sendRequest({
      url: '/index.php?r=AppShop/GetAppShopByPage',
      data: param,
      method: 'post',
      hideLoading: true,
      success: function (res) {
        for(let index in res.data){
          let distance = res.data[index].distance;
          res.data[index].distance = util.formatDistance(distance);
        }
        newdata = {};
        newdata[compid + '.franchisee_data'] = pageInstance.data[compid].franchisee_data.concat(res.data);
        newdata[compid + '.is_more'] = res.is_more;
        newdata[compid + '.curpage'] = res.current_page;
        newdata[compid + '.loadingFail'] = false;
        newdata[compid + '.loading'] = false;

        pageInstance.setData(newdata);
      },
      fail: function () {
        let newdata = {};
        newdata[compid + '.loadingFail'] = true;
        newdata[compid + '.loading'] = false;
        pageInstance.setData(newdata);
      },
      complete: function () {
        setTimeout(function () {
          pageInstance.requesting = false;
        }, 300);
      }
    })
  },
  seckillScrollFunc: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let compid       = typeof event == 'object' ? event.currentTarget.dataset.compid : event;
    let compData     = pageInstance.data[compid];
    let curpage      = compData.curpage + 1;
    let customFeature = compData.customFeature;
    let _this        = this;
    let newdata      = {};
    let param        = {};

    if(!compData.is_more && typeof event == 'object' && event.type == 'tap'){
      _this.showModal({
        content: '已经加载到最后了'
      });
    }
    if (pageInstance.requesting || !compData.is_more) {
      return;
    }
    pageInstance.requesting = true;
    newdata[compid + '.loading'] = true;
    newdata[compid + '.loadingFail'] = false;
    pageInstance.setData(newdata);

    if (pageInstance.seckillOnLoadCompidParam) {
      for (let index in pageInstance.seckillOnLoadCompidParam) {
        if (pageInstance.seckillOnLoadCompidParam[index].compid === compid) {
          param = pageInstance.seckillOnLoadCompidParam[index].param;
          break;
        }
      }
    }
    param.page_size = +customFeature.loadingNum || 10;

    param.page = curpage;
    _this.sendRequest({
      url: '/index.php?r=AppShop/GetGoodsList',
      data: param,
      method: 'post',
      hideLoading: true,
      success: function (res) {
        newdata = {};
        let rdata = res.data,
            downcountArr = pageInstance.downcountArr || [];

        for (let i = 0; i < rdata.length; i++) {
          let f = rdata[i].form_data,
              dc ,
              idx = (curpage-1) * param.page_size + i;

          f.downCount = {
            hours : '00' ,
            minutes : '00' ,
            seconds : '00'
          };
          if(f.seckill_start_state == 0){
            dc = _this.beforeSeckillDownCount(f , pageInstance , compid + '.goods_data[' + idx + '].form_data');
          }else if(f.seckill_start_state == 1){
            dc = _this.duringSeckillDownCount(f , pageInstance , compid + '.goods_data[' + idx + '].form_data');
          }
          dc && downcountArr.push(dc);
        }
        newdata[compid + '.goods_data'] = compData.goods_data.concat(res.data);
        newdata[compid + '.is_more']    = res.is_more;
        newdata[compid + '.curpage']    = res.current_page;
        newdata[compid + '.loading'] = false;
        newdata[compid + '.loadingFail'] = false;
        pageInstance.downcountArr = downcountArr;

        pageInstance.setData(newdata);
      },
      fail: function () {
        let newdata = {};
        newdata[compid + '.loadingFail'] = true;
        newdata[compid + '.loading'] = false;
        pageInstance.setData(newdata);
      },
      complete: function () {
        setTimeout(function () {
          pageInstance.requesting = false;
        }, 300);
      }
    })
  },
  videoScrollFunc : function(event) {
    let pageInstance = this.getAppCurrentPage();
    let compid       = typeof event == 'object' ? event.currentTarget.dataset.compid : event;
    let compData     = pageInstance.data[compid];
    let that         = this;

    if(compData.is_search){
      this.searchList( compData.searchEle ,compData.compId, event);
    }else{
      this._videoScrollFunc(event);
    }
  },
  _videoScrollFunc: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let compid       = typeof event == 'object' ? event.currentTarget.dataset.compid : event;
    let compData     = pageInstance.data[compid];
    let curpage      = compData.curpage + 1;
    let customFeature = compData.customFeature;
    let newdata      = {};
    let param        = {};
    let that         = this;

    if(!compData.is_more && typeof event == 'object' && event.type == 'tap'){
      this.showModal({
        content: '已经加载到最后了'
      });
    }
    if (pageInstance.requesting || !compData.is_more) {
      return;
    }
    pageInstance.requesting = true;
    newdata[compid + '.loading'] = true;
    newdata[compid + '.loadingFail'] = false;
    pageInstance.setData(newdata);

    if (pageInstance.videoListComps) {
      for (let index in pageInstance.videoListComps) {
        if (pageInstance.videoListComps[index].compid === compid) {
          param = pageInstance.videoListComps[index].param;
          break;
        }
      }
    }
    param.page_size = customFeature.loadingNum || 20;
    param.page = curpage;
    this.sendRequest({
      url: '/index.php?r=AppVideo/GetVideoList',
      data: param,
      method: 'post',
      hideLoading: true,
      success: function (res) {
        let rdata = res.data;

        for (let i = 0; i < rdata.length; i++) {
          rdata[i].video_view = that.handlingNumber(rdata[i].video_view);
        }

        newdata = {};
        newdata[compid + '.video_data'] = compData.video_data.concat(rdata);
        newdata[compid + '.is_more'] = res.is_more;
        newdata[compid + '.curpage'] = res.current_page;
        newdata[compid + '.loading'] = false;
        newdata[compid + '.loadingFail'] = false;

        pageInstance.setData(newdata);
      },
      fail: function () {
        let newdata = {};
        newdata[compid + '.loadingFail'] = true;
        newdata[compid + '.loading'] = false;
        pageInstance.setData(newdata);
      },
      complete: function () {
        setTimeout(function () {
          pageInstance.requesting = false;
        }, 300);
      }
    })
  },
  carouselVideoClose:function(event){
    let pageInstance = this.getAppCurrentPage(),
        compid = event.currentTarget.dataset.compid ;
    let newdata = {};

    newdata[compid + '.videoUrl'] = '';
    pageInstance.setData(newdata);
  },
  // 点赞 取消点赞
  changeCountRequert : {},
  changeCount: function (event) {
    let dataset      = event.currentTarget.dataset;
    let that         = this;
    let pageInstance = this.getAppCurrentPage();
    let newdata      = {};
    let counted      = dataset.counted;
    let compid       = dataset.compid;
    let objrel       = dataset.objrel;
    let form         = dataset.form;
    let dataIndex    = dataset.index;
    let parentcompid = dataset.parentcompid;
    let parentType   = dataset.parenttype;
    let url;
    let objIndex     = compid + '_' + objrel;

    if(counted == 1){
      url = '/index.php?r=AppData/delCount';
    } else {
      url = '/index.php?r=AppData/addCount';
    }

    if(that.changeCountRequert[objIndex]){
      return ;
    }
    that.changeCountRequert[objIndex] = true;

    that.sendRequest({
      url: url,
      data: { obj_rel: objrel },
      success: function (res) {
        newdata = {};

        if (parentcompid) {
          if (parentcompid.indexOf('list_vessel') === 0) {
            newdata[parentcompid + '.list_data[' + dataIndex + '].count_num'] = counted == 1
              ? parseInt(pageInstance.data[parentcompid].list_data[dataIndex].count_num) - 1
              : parseInt(res.data.count_num);
            newdata[parentcompid + '.list_data[' + dataIndex + '].has_count'] = counted == 1
              ? 0 : parseInt(res.data.has_count);
          } else if (parentcompid.indexOf('bbs') === 0) {
            newdata[parentcompid + '.content.data[' + dataIndex + '].count_num'] = counted == 1
              ? parseInt(pageInstance.data[parentcompid].content.data[dataIndex].count_num) - 1
              : parseInt(res.data.count_num);
            newdata[parentcompid + '.content.data[' + dataIndex + '].has_count'] = counted == 1
              ? 0 : parseInt(res.data.has_count);
          } else if (parentcompid.indexOf('free_vessel') === 0 || parentcompid.indexOf('popup_window') === 0 || parentcompid.indexOf('dynamic_vessel') === 0) {
            let path = compid
            if (compid.search('data.') !== -1) {
              path = compid.substr(5);
            }
            path = parentcompid + '.' + path;
            newdata[path + '.count_data.count_num'] = parseInt(res.data.count_num);
            newdata[path + '.count_data.has_count'] = parseInt(res.data.has_count);
          } else if (parentType && parentType.indexOf('list_vessel') === 0) {
            newdata[parentType + '.list_data[' + dataIndex + '].count_num'] = parseInt(res.data.count_num);
            newdata[parentType + '.list_data[' + dataIndex + '].has_count'] = parseInt(res.data.has_count);
          }
        } else {
          if (parentcompid != '' && parentcompid != null) {
            if (compid.search('data.') !== -1) {
              compid = compid.substr(5);
            }
            compid = parentcompid + '.' + compid;
          }
          newdata[compid + '.count_data.count_num'] = parseInt(res.data.count_num);
          newdata[compid + '.count_data.has_count'] = parseInt(res.data.has_count);
          pageInstance.setData(newdata);
        }

        pageInstance.setData(newdata);
        that.changeCountRequert[objIndex] = false;
      },
      complete : function () {
        that.changeCountRequert[objIndex] = false;
      }
    });
  },
  inputChange: function (event) {
    let dataset      = event.currentTarget.dataset;
    let value        = event.detail.value;
    let pageInstance = this.getAppCurrentPage();
    let datakey      = dataset.datakey;
    let segment      = dataset.segment;

    if (!segment) {
      this.showModal({
        content: '该组件未绑定字段 请在电脑编辑页绑定后使用'
      });
      return;
    }
    let newdata = {};
    newdata[datakey] = value;
    let selectKey ={}
    for(let i in value){
      selectKey[value[i]] = 1;
    }
    selectKey.itemLength = value.length
    newdata[dataset.compid + '.selectedData'] = selectKey
    pageInstance.setData(newdata);
  },
  bindDateChange: function (event) {
    let dataset      = event.currentTarget.dataset;
    let value        = event.detail.value;
    let pageInstance = this.getAppCurrentPage();
    let datakey      = dataset.datakey;
    let compid       = dataset.compid;
    let formcompid   = dataset.formcompid;
    let segment      = dataset.segment;
    let newdata      = {};

    compid = formcompid + compid.substr(4);

    if (!segment) {
      this.showModal({
        content: '该组件未绑定字段 请在电脑编辑页绑定后使用'
      });
      return;
    }

    let obj = pageInstance.data[formcompid]['form_data'];
    if (util.isPlainObject(obj)) {
      obj = pageInstance.data[formcompid]['form_data'] = {};
    }
    obj = obj[segment];

    if (!!obj) {
      let date = obj.substr(0, 10);
      let time = obj.substr(11);

      if (obj.length == 16) {
        newdata[datakey] = value + ' ' + time;
      } else if (obj.length == 10) {
        newdata[datakey] = value;
      } else if (obj.length == 5) {
        newdata[datakey] = value + ' ' + obj;
      } else if (obj.length == 0) {
        newdata[datakey] = value;
      }
    } else {
      newdata[datakey] = value;
    }
    newdata[compid + '.date'] = value;
    pageInstance.setData(newdata);
  },
  bindTimeChange: function (event) {
    let dataset      = event.currentTarget.dataset;
    let value        = event.detail.value;
    let pageInstance = this.getAppCurrentPage();
    let datakey      = dataset.datakey;
    let compid       = dataset.compid;
    let formcompid   = dataset.formcompid;
    let segment      = dataset.segment;
    let newdata      = {};

    compid = formcompid + compid.substr(4);
    if (!segment) {
      this.showModal({
        content: '该组件未绑定字段 请在电脑编辑页绑定后使用'
      });
      return;
    }

    let obj = pageInstance.data[formcompid]['form_data'];
    if (util.isPlainObject(obj)) {
      obj = pageInstance.data[formcompid]['form_data'] = {};
    }
    obj = obj[segment];

    if (!!obj) {
      let date = obj.substr(0, 10);
      let time = obj.substr(11);

      if (obj.length == 16) {
        newdata[datakey] = date + ' ' + value;
      } else if (obj.length == 10) {
        newdata[datakey] = obj + ' ' + value;
      } else if (obj.length == 5) {
        newdata[datakey] = value;
      } else if (obj.length == 0) {
        newdata[datakey] = value;
      }
    } else {
      newdata[datakey] = value;
    }
    newdata[compid + '.time'] = value;
    pageInstance.setData(newdata);
  },
  bindSelectChange: function (event) {
    let dataset      = event.currentTarget.dataset;
    let value        = event.detail.value;
    let pageInstance = this.getAppCurrentPage();
    let datakey      = dataset.datakey;
    let segment      = dataset.segment;

    if (!segment) {
      this.showModal({
        content: '该组件未绑定字段 请在电脑编辑页绑定后使用'
      });
      return;
    }
    let newdata = {};
    newdata[datakey] = value;
    if (newdata[datakey].constructor === Array){
      newdata[datakey] = newdata[datakey].join();
    }
    let selectKey ={}
    for(let i in value){
      selectKey[value[i]] = 1;
    }
    selectKey.itemLength = value.length
    newdata[dataset.compid + '.selectedData.'+segment] = selectKey
    pageInstance.setData(newdata);
  },
  bindScoreChange: function (event) {
    let dataset      = event.currentTarget.dataset;
    let pageInstance = this.getAppCurrentPage();
    let datakey      = dataset.datakey;
    let value        = dataset.score;
    let compid       = dataset.compid;
    let formcompid   = dataset.formcompid;
    let segment      = dataset.segment;

    compid = formcompid + compid.substr(4);

    if (!segment) {
      this.showModal({
        content: '该组件未绑定字段 请在电脑编辑页绑定后使用'
      });
      return;
    }
    let newdata = {};
    newdata[datakey] = value;
    newdata[compid + '.editScore'] = value;
    pageInstance.setData(newdata);
  },
  formAddress: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let compid = event.currentTarget.dataset.compid;
    let syncUserAddress = event.currentTarget.dataset.syncUserAddress;
    let that = this;
    let filed = event.currentTarget.dataset.filed;
    this.turnToPage('/eCommerce/pages/myAddress/myAddress?from=form&syncUserAddress=' + syncUserAddress);
    pageInstance.selectAddressCallback = (res) => {
      let newdata = {};
      let address = res.address_info.province.text + res.address_info.city.text + res.address_info.district.text + res.address_info.detailAddress;
      newdata[compid + '.form_data.' + filed] = address
      pageInstance.setData(newdata);
    }
  },
  bindSliderChange: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let dataset = event.currentTarget.dataset;
    let datakey = dataset.datakey;
    let compid = dataset.compid;
    let formcompid = dataset.formcompid;
    let segment = dataset.segment;
    let value = event.detail.value;

    compid = formcompid + compid.substr(4);

    if (!segment) {
      this.showModal({
        content: '该组件未绑定字段 请在电脑编辑页绑定后使用'
      });
      return;
    }
    let newdata = {};
    newdata[datakey] = value;
    newdata[compid + '.sliderScore'] = value;
    pageInstance.setData(newdata);
  },
  submitForm: function (event) {
    let dataset      = event.currentTarget.dataset;
    let pageInstance = this.getAppCurrentPage();
    let _this        = this;
    let compid       = dataset.compid;
    let form         = dataset.form;
    let form_data    = pageInstance.data[compid].form_data;
    let field_info   = pageInstance.data[compid].field_info;
    let content      = pageInstance.data[compid].content;
    let form_id      = pageInstance.data[compid].customFeature.id;
    let buttonContent = pageInstance.data[compid].buttonContent;
    let button_info = {
                      'type': buttonContent.customFeature.effect,
                      'times': buttonContent.customFeature.frequency,
                      'pay': buttonContent.customFeature.pay,
                      'price': buttonContent.customFeature.price,
                      'isDiscount': buttonContent.customFeature.discount
                      };
    let operation = '';
    let url = '';
    let contentTip = '';
    let formEleType = ['input-ele', 'textarea-ele', 'grade-ele', 'select-ele', 'upload-img', 'time-ele', 'drop-down', 'pic-options', 'address-ele'];
    let pageRoot = {
      'groupCenter': '/eCommerce/pages/groupCenter/groupCenter',
      'shoppingCart': '/eCommerce/pages/shoppingCart/shoppingCart',
      'myOrder': '/eCommerce/pages/myOrder/myOrder',
    };
    switch (buttonContent.customFeature.action){
      case 'integral':
        operation = 1;
        contentTip = '提交成功，增加' + (buttonContent.customFeature['interests'] || 0) + '积分';
        button_info['num'] = buttonContent.customFeature['interests'];
        url = "/userCenter/pages/myIntegral/myIntegral";
        break;
      case 'scratch':
        operation = 2;
        contentTip = '提交成功，增加' + (buttonContent.customFeature['scratch'] || 0) + '刮刮乐次数';
        button_info['num'] = buttonContent.customFeature['scratch'];
        url = "/awardManagement/pages/scratch/scratch";
        break;
      case 'break-egg':
        operation = 3;
        contentTip = '提交成功，增加' + (buttonContent.customFeature['break-egg'] || 0) + '砸金蛋次数';
        button_info['num'] = buttonContent.customFeature['break-egg'];
        url = "/awardManagement/pages/goldenEggs/goldenEggs";
        break;
      case 'turntable':
        operation = 4;
        contentTip = '提交成功，增加' + (buttonContent.customFeature['turntable'] || 0) + '大转盘次数';
        button_info['num'] = buttonContent.customFeature['turntable'];
        url = "/awardManagement/pages/luckyWheelDetail/luckyWheelDetail";
        break;
      case 'coupon':
        operation = 5;
        button_info['obj_id'] = buttonContent.customFeature['couponId'];
        button_info['num'] = buttonContent.customFeature['coupon-num'];
        contentTip = '提交成功，增加' + (buttonContent.customFeature['coupon-num'] || 0) + '优惠券';
        url = "/eCommerce/pages/couponList/couponList";
        break;
      case 'vip-card':
        operation = 6;
        button_info['obj_id'] = buttonContent.customFeature['vipId'];
        contentTip = '提交成功，增加会员卡一张';
        url = "/userCenter/pages/vipCardList/vipCardList";
        break;
      case 'inner-link':
        operation = 'inner-link';
        let innerParam = JSON.parse(buttonContent.eventParams);
        let pageLink = innerParam.inner_page_link;
        url = pageRoot[pageLink] ? pageRoot[pageLink] : '/pages/' + pageLink + '/' + pageLink;
        break
      case 'plugin-link':
        operation = 'plugin-link';
        let pluginParam = JSON.parse(buttonContent.eventParams);
        url = pluginParam.plugin_page;
        break;
    }

    for(let index = 0; index < content.length; index++){
      if(formEleType.indexOf(content[index].type) == -1){
        continue;
      }
      let customFeature = content[index].customFeature,
          segment = customFeature.segment,
          ifMust = content[index].segment_required;
      switch (content[index].type){
        case 'drop-down':
          if ((!form_data || !form_data[segment] || form_data[segment].split(',').length < content[index].customFeature.contents.length || form_data[segment].split(',').includes('')) && ifMust == 1 ){
            _this.showModal({
              content: field_info[segment].title + ' 没有填写'
            });
            return;
          }
          break;
        case 'pic-options':
          if (ifMust == 1) {
            if (content[index].customFeature.multiSelection) {
              if (!form_data || !form_data[segment] || form_data[segment].length < content[index].customFeature.minSelect) {
                _this.showModal({
                  content: content[index].customFeature.name + '是多选必选项'
                })
                return;
              }
            } else {
              if (!form_data || !form_data[segment]) {
                _this.showModal({
                  content: content[index].customFeature.name + '是必选项'
                })
                return;
              }
            }
          } else {
            if (content[index].customFeature.multiSelection && form_data && form_data[segment] && form_data[segment].length && form_data[segment].length < content[index].customFeature.minSelect) {
              _this.showModal({
                content: content[index].customFeature.name + '至少选择' + content[index].customFeature.minSelect + '项'
              })
              return;
            }
          }
          break;
        case 'input-ele':
        case 'textarea-ele':
          if (ifMust == 1) {
            if (!form_data || !form_data[segment] || form_data[segment].length == 0){
              _this.showModal({
                content: field_info[segment].title + ' 没有填写'
              });
              return;
            }else{
              if( _this.formRegex(content[index].customFeature.dataType, form_data[segment])){
                return;
              }
            }
          }else{
            if (form_data && segment && form_data[segment] && form_data[segment].length && _this.formRegex(content[index].customFeature.dataType, form_data[segment])) {
              return;
            }
          }
          break;
        case 'select-ele':
          if (content[index].customFeature.type === undefined ){break}
          else if (content[index].customFeature.type === 0){
            if (ifMust == 1) {
              if (content[index].customFeature.multiSelection) {
                if (!form_data || !form_data[segment] || content[index].selectedData.itemLength < content[index].customFeature.minSelect) {
                  _this.showModal({
                    content: content[index].content.title + '是多选必选项'
                  })
                  return;
                }
              } else {
                if (!form_data || !form_data[segment]) {
                  _this.showModal({
                    content: content[index].content.title + '是必选项'
                  })
                  return;
                }
              }
            } else {
              if (content[index].customFeature.multiSelection && form_data && form_data[segment] && content[index].selectedData.itemLength && content[index].selectedData.itemLength < content[index].customFeature.minSelect) {
                _this.showModal({
                  content: content[index].content.title + '至少选择' + content[index].customFeature.minSelect + '项'
                })
                return;
              }
            }
          } else if (content[index].customFeature.type === 1){
            if (!content[index].selectedValue) {
              if (ifMust == 1){
                _this.showModal({
                  content: content[index].content.title + ' 没有填写'
                });
                return;
              }
            }else{
              let arrLength = 0;
              for (let i=0;i < content[index].selectedValue.length;i++){
                if (content[index].selectedValue[i] != null){arrLength++}
              }
              if (ifMust == 1) {
                if (content[index].customFeature.multiSelection) {
                  if (!form_data || !form_data[segment] || arrLength < content[index].customFeature.minSelect) {
                    _this.showModal({
                      content: content[index].content.title + '是多选必选项'
                    })
                    return;
                  }
                } else {
                  if (!form_data || !form_data[segment]) {
                    _this.showModal({
                      content: content[index].content.title + '是必选项'
                    })
                    return;
                  }
                }
              } else {
                if (content[index].customFeature.multiSelection && form_data && form_data[segment] && arrLength && arrLength < content[index].customFeature.minSelect) {
                  _this.showModal({
                    content: content[index].content.title + '至少选择' + content[index].customFeature.minSelect + '项'
                  })
                  return;
                }
              }
            }
          }
          break;
        case 'time-ele':
          if ((!form_data || !form_data[segment] || form_data[segment].length == 0) && ifMust == 1) { // 提示错误
            _this.showModal({
              content: field_info[segment].title + ' 没有填写'
            });
            return;
          }
          if (!content[index].customFeature.ifAllDay && ((content[index].date && !content[index].time) || (!content[index].date && content[index].time))) {
            _this.showModal({
              content: '请选择具体时间'
            });
            return;
          }
          break;
        default:
          if (ifMust == 1 && (!form_data || !form_data[segment] || form_data[segment].length == 0)) { // 提示错误
            _this.showModal({
              content: field_info[segment].title + ' 没有填写'
            });
            return;
          }
          break;
      }
    }

    if(pageInstance.data[compid].submitting) return;
    let newdata = {};
    let countNum = 0;
    let countEmptyNum = 0;
    if (!form_data) {
      _this.showModal({
        content: '数据为空'
      });
      return;
    } else {
      for (let i in form_data) {
        countNum++;
        if (form_data[i] && typeof form_data[i] == 'number') {
          continue;
        }
        if (!form_data[i] || (form_data[i] instanceof Array && form_data[i].length == 0)) { countEmptyNum++ }
      }
      if (countNum == countEmptyNum) {
        _this.showModal({
          content: '数据为空'
        });
        return;
      }
    }
    let submitData = {
      form_id: form_id,
      button_info: button_info,
      operation: (operation != 'inner-link' && operation != 'plugin-link') ? operation : '',
      form: form,
      form_data: form_data
    };
    newdata[compid + '.submitting'] = true;
    if (button_info.pay){
      _this.submitFormByPay({
        price:button_info.price,
        isDiscount: button_info.isDiscount,
        submitData: submitData,
        url: url,
        compid: compid,
        contentTip: contentTip
      });
      return;
    }
    pageInstance.setData(newdata);
    
    _this.submitFormRequest({
      url: url,
      data: submitData,
      compid: compid,
      contentTip: contentTip
    })
  },
  formRegex: function(dataType, data){
    let _this = this;
    switch (dataType) {
      case 'phone':
        if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(data)) {
          _this.showModal({
            content: '请输入正确的手机号'
          });
          return true;
        }
        break;
      case 'IDcard':
        if (!(/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/.test(data) || /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(data))) {
          _this.showModal({
            content: '请输入正确的身份证'
          });
          return true;
        }
        break;
      case 'email':
        if (!/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(data)) {
          _this.showModal({
            content: '请输入正确的邮箱'
          });
          return true;
        }
        break;
      case 'chinese':
        if (!/^[\u4e00-\u9fa5]*$/.test(data)) {
          _this.showModal({
            content: '请输入中文'
          });
          return true;
        }
        break;
      case 'number':
        if (!/^[0-9]*$/.test(data)) {
          _this.showModal({
            content: '请输入数字'
          });
          return true;
        }
        break;
      case 'english':
        if (!/^[a-zA-Z]*$/.test(data)) {
          _this.showModal({
            content: '请输入英文'
          });
          return true;
        }
        break;
      default:
        return false;
        break;
    }
  },
  submitFormRequest: function(options, successFun){
    let _this = this;
    let pageInstance = this.getAppCurrentPage();
    this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppData/addData',
      data: options.data,
      method: 'POST',
      success: function (res) {
        successFun && successFun()
        if (options.data.operation === 'inner-link' || options.data.operation === 'plugin-link') {
          _this.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 3000,
            success: function () {
              if (options.url) {
                _this.turnToPage(options.url);
              }
            }
          });
          return;
        }
        if(!res.msg){
          _this.showModal({
            content: options.contentTip || '提交成功',
            confirmText: options.data.operation ? '去查看' : '确认',
            confirm: function(){
              if (options.url) {
                _this.turnToPage(options.url);
              }
            }
          });
        } else {
          _this.showModal({
            content: res.msg
          });
        }
      },
      complete: function () {
        let newdata = {};
        newdata[options.compid + '.submitting'] = false;
        pageInstance.setData(newdata);
        _this.formVessel(pageInstance);
      }
    })
  },
  submitFormByPay: function (options) {
    let that = this;
    let pageInstance = this.getAppCurrentPage();
    let _data = {  };
    if (!options.isDiscount) {
      _data = {
        price: options.price,
        is_balance: 0,
        selected_benefit: {
          no_use_benefit: 1
        }
      }
    } else {
      _data = {
        price: options.price,
        is_balance: 0,
        selected_benefit: ''
      }
    }
    this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppShop/calculationPrice',
      method: 'post',
      data: _data,
      success: function (res) {
        let data = res.data;
        let benefits = data.can_use_benefit.data;
        let selected_benefit = data.selected_benefit_info;
        let selectDiscountIndex;

        if (benefits.length) {
          benefits.unshift({
            title: '不使用优惠',
            name: '无',
            no_use_benefit: 1
          });
        }

        for (let i = 0; i <= benefits.length - 1; i++) {
          let select_discount_type = selected_benefit.discount_type;
          if (select_discount_type === benefits[i].discount_type) {
            if (select_discount_type === 'coupon') {
              if (benefits[i].coupon_id == selected_benefit.coupon_id) {
                selectDiscountIndex = i;
                break;
              }
            } else {
              selectDiscountIndex = i;
              break;
            }
          }
        }
        pageInstance.setData({
          formInfo: {
            calculData: _data,
            contentTip: options.contentTip,
            isDiscount: options.isDiscount,
            price: +options.price,
            submitData: options.submitData,
            url: options.url,
            show: true,
            logo: that.globalData.appLogo,
            name: that.getAppTitle(),
            discountList: benefits,
            totalPayment: data.price,
            selectDiscountInfo: selected_benefit,
            selectDiscountIndex: selectDiscountIndex,
            balance: data.balance,
            use_balance_count: data.use_balance,
            discount_cut_price: data.discount_cut_price
          }
        });
      }
    })
  },
  udpateVideoSrc: function (event) {
    let dataset      = event.currentTarget.dataset;
    let pageInstance = this.getAppCurrentPage();
    let compid       = dataset.compid;

    this.chooseVideo(function(filePath){
      let newdata = {};
      newdata[compid + '.src'] = filePath;
      pageInstance.setData(newdata);
    });
  },
  tapMapDetail: function (event) {
    let dataset = event.currentTarget.dataset;
    let params  = dataset.eventParams;
    if(!params) return;

    params = JSON.parse(params)[0];
    this.openLocation({
      latitude: +params.latitude,
      longitude: +params.longitude,
      name: params.desc || '',
      address: params.name || ''
    });
  },
  uploadFormImg: function (event) {
    let dataset      = event.currentTarget.dataset;
    let pageInstance = this.getAppCurrentPage();
    let datakey      = dataset.datakey;
    let segment      = dataset.segment;

    if (!segment) {
      this.showModal({
        content: '该组件未绑定字段 请在电脑编辑页绑定后使用'
      })
      console.log('segment empty 请绑定数据对象字段');
      return;
    }
    this.chooseImage((res) => {
      let newdata = {};
      newdata[datakey] = res;
      pageInstance.setData(newdata);
    }, 9);
  },
  deleteUploadImg: function (event) {
    let dataset      = event.currentTarget.dataset;
    let pageInstance = this.getAppCurrentPage();
    let formcompid   = dataset.formcompid;
    let index        = dataset.index;
    let datakey      = dataset.datakey;
    let newdata      = {};
    let segment      = dataset.segment;
    this.showModal({
      content: '确定删除该图片？',
      showCancel: true,
      confirm: function () {
        pageInstance.data[formcompid].form_data[segment].splice(index, 1)
        newdata[datakey] = pageInstance.data[formcompid].form_data[segment];
        pageInstance.setData(newdata);
      }
    })
  },
  listVesselTurnToPage: function (event) {
    let dataset      = event.currentTarget.dataset;
    let pageInstance = this.getAppCurrentPage();
    let data_id      = dataset.dataid;
    let router       = dataset.router;
    let isseckill    = dataset.isseckill; // 是否是商品秒杀
    let compid       = dataset.compid;
    let index        = dataset.index;
    let list         = pageInstance.data[compid].list_data[index];
    let form_data    = list.form_data || list;


    if (router == '' || router == -1 || router == '-1') {
      return;
    }
    if(router == 'tostoreDetail'){
      this.turnToPage('/pages/toStoreDetail/toStoreDetail?detail=' + data_id);
    }else if (router == 'goodsDetail') {
      if(isseckill == 1){
        this.turnToPage('/pages/goodsDetail/goodsDetail?detail=' + data_id + '&goodsType=seckill');
      }else if(form_data.is_group_buy && form_data.is_group_buy[0].text == 1){
        this.turnToPage('/pages/groupGoodsDetail/groupGoodsDetail?detail=' + data_id);
      }else{
        this.turnToPage('/pages/goodsDetail/goodsDetail?detail=' + data_id );
      }
    }else if (router == 'videoDetail') {
      this.turnToPage('/video/pages/videoDetail/videoDetail?detail=' + data_id );
    } else if (router == 'groupGoodsDetail') {
      data_id = pageInstance.data[compid].list_data[index].form_data.goods_id[0].text;//模板上不存在goodsId，需要通过页面数据获取
      this.turnToPage('/pages/groupGoodsDetail/groupGoodsDetail?detail=' + data_id);
    }else if (router == 'franchiseeDetail') {
      let mode = form_data.mode_id[0].text;
      this.goToFranchisee(mode, {
        detail: data_id
      });
    }else{
      this.turnToPage('/pages/' + router + '/' + router + '?detail=' + data_id);
    }
  },
  dynamicVesselTurnToPage: function (event) {
    let dataset      = event.currentTarget.dataset;
    let pageInstance = this.getAppCurrentPage();
    let data_id      = dataset.dataid;
    let router       = dataset.router;
    let page_form    = pageInstance.page_form;
    let isGroup      = dataset.isGroup;
    let isSeckill    = dataset.isSeckill;
    let compid       = dataset.compid;
    let index        = dataset.index;
    let list         = pageInstance.data[compid].list_data[index];
    let form_data    = list.form_data || list;

    if (router == '' || router == -1 || router == '-1') {
      return;
    }
    if (isGroup && isGroup == 1) {
      this.turnToPage('/pages/groupGoodsDetail/groupGoodsDetail?detail=' + data_id);
      return;
    }
    if (isSeckill && isSeckill == 1) {
      this.turnToPage('/pages/goodsDetail/goodsDetail?detail=' + data_id +'&goodsType=seckill');
      return;
    }
    if (page_form != '') {
      if(router == 'tostoreDetail'){
        this.turnToPage('/pages/toStoreDetail/toStoreDetail?detail=' + data_id);
      }else if (router == 'goodsDetail'){
        this.turnToPage('/pages/goodsDetail/goodsDetail?detail=' + data_id);
      }else if (router == 'videoDetail') {
        this.turnToPage('/video/pages/videoDetail/videoDetail?detail=' + data_id );
      } else if (router == 'franchiseeDetail') {
        let mode = form_data.mode_id[0].text;
        this.goToFranchisee(mode, {
          detail: data_id
        });
      }else{
        this.turnToPage('/pages/' + router + '/' + router + '?detail=' + data_id);
      }
    }
  },
  userCenterTurnToPage: function (event) {
    let that = this;
    if (this.isLogin()) {
      this._userCenterToPage(event);
    } else {
      this.goLogin({
        success: function () {
          that._userCenterToPage(event);
        }
      });
    }
  },
  _userCenterToPage: function (event) {
    let dataset         = event.currentTarget.dataset;
    let router          = dataset.router;
    let openVerifyPhone = dataset.openVerifyPhone;
    let that            = this;
    let param           = dataset.eventParams;
    let goodsType       = dataset.goodsType;
    let currentIndex    = event.target.dataset.index;

    if (router === '/pages/userCenter/userCenter' && this.isLogin() !== true) {
      this.goLogin({
        success: function () {
          that.turnToPage('/pages/userCenter/userCenter?from=userCenterEle');
        }
      })
      return;
    }
    if (router === 'newsPocketsBalance') {
      if (this.isLogin()) {
        that.turnToPage('/userCenter/pages/newsPocketsBalance/newsPocketsBalance');
      }else {
        this.goLogin({
          success: function () {
            that.turnToPage('/userCenter/pages/newsPocketsBalance/newsPocketsBalance');
          }
        });
      }
      return;
    }
    if (openVerifyPhone) {
      if (!this.getUserInfo().phone) {
        this.turnToPage('/default/pages/bindCellphone/bindCellphone?r='+this.getAppCurrentPage().page_router, 1);
      } else {
        if (router === '/promotion/pages/promotionMyPromotion/promotionMyPromotion' || router === 'myPromotion' || router === 'promotionMyPromotion') {
          that._isOpenPromotion();
          return;
        }
        if ((router === 'myOrder' || router === '/eCommerce/pages/myOrder/') && goodsType != undefined) {
          this.turnToPage('/eCommerce/pages/myOrder/?from=userCenterEle&goodsType=' + goodsType + '&currentIndex=' + currentIndex);
          return;
        } else if ((router === '/eCommerce/pages/vipCard/vipCard' || router === "vipCard") && this.globalData.hasFranchiseeList){
          router = this.returnSubPackageRouter('vipCardList');
        } else if (router.indexOf('/') !== 0) {
          router = this.returnSubPackageRouter(router) + '?from=userCenterEle&' + (param || '');
        }
        this.turnToPage(router + '?from=userCenterEle');
      }
    } else {
      if (router === 'promotionMyPromotion' || router === 'myPromotion') {
        that._isOpenPromotion();
        return;
      }
      if ((router === 'myOrder' || router === '/eCommerce/pages/myOrder/') && goodsType != undefined) {
        this.turnToPage(this.returnSubPackageRouter('myOrder') + '?from=userCenterEle&goodsType=' + goodsType + '&currentIndex=' + currentIndex);
        return;
      } else if ((router === 'vipCardList' || router === '/userCenter/pages/vipCardList/vipCardList') && this.globalData.hasFranchiseeList){
        router = this.returnSubPackageRouter('vipCardList');
      } else if (router.indexOf('/') !== 0) {
        router = this.returnSubPackageRouter(router) + '?from=userCenterEle&' + (param || '');
      }
      this.turnToPage(router+'?from=userCenterEle');
    }
  },
  turnToGoodsDetail: function (event) {
    let dataset   = event.currentTarget.dataset;
    let id        = dataset.id;
    let contact   = dataset.contact;
    let goodsType = dataset.goodsType;
    let group     = dataset.group;
    let hidestock = dataset.hidestock;
    let isShowVirtualPrice = dataset.isshowvirtualprice;

    if (group && group == 1) {
      this.turnToPage('/pages/groupGoodsDetail/groupGoodsDetail?detail=' + id + '&contact=' + contact);
      return;
    }
    switch (+goodsType) {
      case 0: this.turnToPage('/pages/goodsDetail/goodsDetail?detail=' + id + '&contact=' + contact + '&hidestock=' + hidestock + '&isShowVirtualPrice=' + isShowVirtualPrice);
        break;
      case 1: this.turnToPage('/pages/goodsDetail/goodsDetail?detail=' + id +'&contact=' + contact +'&hidestock=' + hidestock);
        break;
      case 3: this.turnToPage('/pages/toStoreDetail/toStoreDetail?detail=' + id);
        break;
    }
  },
  turnToFranchiseeDetail: function (event) {
    let dataset = event.currentTarget.dataset;
    let appid = dataset.appid;
    let mode = dataset.mode;
    let param = {};

    param.detail = appid;
    if (dataset.audit == 2){
      param.shop_id = dataset.id;
    }

    this.goToFranchisee(mode, param);
  },
  goToFranchisee: function (mode, param = {}, is_redirect = false){
    let r = '';
    let rArr = [];
    for(let i in param){
      if (param[i]){
        rArr.push( i + '=' + param[i]);
      }
    }
    if (rArr.length > 0){
      r = '?' + rArr.join('&');
    }
    if (mode == 1) {
      this.turnToPage('/franchisee/pages/franchiseeWaimai/franchiseeWaimai' + r, is_redirect);
    } else if (mode == 3) {
      this.turnToPage('/franchisee/pages/franchiseeTostore/franchiseeTostore' + r, is_redirect);
    } else if (mode == 2){
      this.turnToPage('/franchisee/pages/franchiseeDetail4/franchiseeDetail4' + r, is_redirect);
    }else {
      this.turnToPage('/franchisee/pages/franchiseeDetail/franchiseeDetail' + r,  is_redirect);
    }
  },
  callFranchiseePhone: function(e){
    let phone = e.currentTarget.dataset.phone;
    this.makePhoneCall(phone);
  },
  turnToSeckillDetail: function (event) {
    let id      = event.currentTarget.dataset.id;
    let contact = event.currentTarget.dataset.contact;
    this.turnToPage('/pages/goodsDetail/goodsDetail?detail=' + id +'&goodsType=seckill&contact=' + contact);
  },
  turnToNewsDetail: function (event) {
    if (event.currentTarget.dataset.articleType == 3) {
      let form = event.currentTarget.dataset.eventParams;
      let action = form.action;
      customEvent.clickEventHandler[action] && customEvent.clickEventHandler[action](form);
      return;
    }
    let id = event.currentTarget.dataset.id;
    this.turnToPage('/informationManagement/pages/newsDetail/newsDetail?detail=' + id);
  },
  sortListFunc: function (event) {
    let dataset       = event.currentTarget.dataset;
    let pageInstance  = this.getAppCurrentPage();
    let listid        = dataset.listid;
    let idx           = dataset.idx;
    let listParams    = {
      'list-vessel': pageInstance.list_compids_params,
      'goods-list': pageInstance.goods_compids_params,
      'franchisee-list': pageInstance.franchiseeComps,
      'video-list' : pageInstance.videoListComps
    };
    let component_params, listType,new_component_params='';

    for (let key in listParams) {
      if(listType !== undefined) break;
      component_params = listParams[key];
      if(component_params.length){
        for (let j = 0; j < component_params.length; j++) {
          if(component_params[j].param.id === listid){
            listType = key;
            new_component_params = component_params[j];
          }
        }
      }
    }

    if(!new_component_params) return;
    new_component_params.param.page = 1;

    if (idx != 0) {
      new_component_params.param.sort_key       = dataset.sortkey;
      new_component_params.param.sort_direction = dataset.sortdirection;
    } else {
      new_component_params.param.sort_key       = '';
      new_component_params.param.sort_direction = 0;
    }
    this._updateSortStatus(dataset);

    switch (listType) {
      case 'list-vessel': this._sortListVessel(new_component_params, dataset); break;
      case 'goods-list': this._sortGoodsList(new_component_params, dataset); break;
      case 'franchisee-list': this._sortFranchiseeList(new_component_params, dataset); break;
      case 'video-list': this._sortVideoList(new_component_params, dataset); break;
    }
  },
  _sortListVessel: function (component_params) {
    let that = this;
    let pageInstance  = this.getAppCurrentPage();
    let compid  = component_params['compid'];
    let newdata = {};

    newdata[compid + '.loading'] = true;
    newdata[compid + '.loadingFail'] = false;
    newdata[compid + '.list_data'] = [];
    pageInstance.setData(newdata);

    this.sendRequest({
      url: '/index.php?r=AppData/getFormDataList',
      data: component_params.param,
      method: 'post',
      hideLoading: true,
      success: function (res) {
        let newdata = {};
        let listField = pageInstance.data[compid].listField;

        for (let j in res.data) {
          for (let k in res.data[j].form_data) {
            if (k == 'category') continue;

            if(/region/.test(k)){
              continue;
            }
            if(k == 'goods_model') {
              res.data[j].form_data.virtual_price = that.formVirtualPrice(res.data[j].form_data);
            }

            let description = res.data[j].form_data[k];
            if (listField.indexOf(k) < 0 && /<("[^"]*"|'[^']*'|[^'">])*>/.test(description)) { //没有绑定的字段的富文本置为空
              res.data[j].form_data[k] = '';
            } else if (that.needParseRichText(description)) {
              res.data[j].form_data[k] = that.getWxParseResult(description);
            }
          }
        }

        newdata[compid + '.list_data'] = res.data;
        newdata[compid + '.is_more']   = res.is_more;
        newdata[compid + '.curpage']   = 1;
        newdata[compid + '.loading'] = false;
        newdata[compid + '.loadingFail'] = false;

        pageInstance.setData(newdata);
      },
      fail: function (res) {
        let newdata = {};
        newdata[compid + '.loadingFail'] = true;
        newdata[compid + '.loading'] = false;
        pageInstance.setData(newdata);
      }
    });
  },
  _sortGoodsList: function (component_params) {
    let that = this;
    let pageInstance  = this.getAppCurrentPage();
    let compid = component_params['compid'];
    let newdata = {};

    newdata[compid + '.loading'] = true;
    newdata[compid + '.loadingFail'] = false;
    newdata[compid + '.goods_data'] = [];
    pageInstance.setData(newdata);

    this.sendRequest({
      url: '/index.php?r=AppShop/GetGoodsList',
      data: component_params.param,
      method: 'post',
      hideLoading: true,
      success: function (res) {
        if (res.status == 0) {
          newdata[compid + '.goods_data'] = res.data;
          newdata[compid + '.is_more'] = res.is_more;
          newdata[compid + '.curpage'] = 1;
          newdata[compid + '.loading'] = false;
          newdata[compid + '.loadingFail'] = false;

          pageInstance.setData(newdata);
        }
      },
      fail: function (res) {
        let newdata = {};
        newdata[compid + '.loadingFail'] = true;
        newdata[compid + '.loading'] = false;
        pageInstance.setData(newdata);
      }
    });
  },
  _sortFranchiseeList: function (component_params) {
    let that = this;
    let pageInstance  = this.getAppCurrentPage();
    let compid = component_params['compid'];
    let newdata = {};

    newdata[compid + '.loading'] = true;
    newdata[compid + '.loadingFail'] = false;
    newdata[compid + '.franchisee_data'] = [];
    pageInstance.setData(newdata);

    this.sendRequest({
      url: '/index.php?r=AppShop/GetAppShopByPage',
      data: component_params.param,
      method: 'post',
      success: function (res) {
        if (res.status == 0) {
          let newdata = {};

          for(let index in res.data){
            let distance = res.data[index].distance;
            res.data[index].distance = util.formatDistance(distance);
          }
          newdata[compid + '.franchisee_data'] = res.data;
          newdata[compid + '.is_more'] = res.is_more;
          newdata[compid + '.curpage'] = 1;
          newdata[compid + '.loading'] = false;
          newdata[compid + '.loadingFail'] = false;

          pageInstance.setData(newdata);
        }
      },
      fail: function (res) {
        let newdata = {};
        newdata[compid + '.loadingFail'] = true;
        newdata[compid + '.loading'] = false;
        pageInstance.setData(newdata);
      }
    });
  },
  _sortVideoList : function(component_params) {
    let that = this;
    let pageInstance  = this.getAppCurrentPage();
    let compid = component_params['compid'];

    let newdata = {};
    newdata[compid + '.loading'] = true;
    newdata[compid + '.loadingFail'] = false;
    newdata[compid + '.video_data'] = [];
    pageInstance.setData(newdata);
    this.sendRequest({
      url: '/index.php?r=AppVideo/GetVideoList',
      data: component_params.param,
      method: 'post',
      hideLoading: true,
      success: function (res) {
        let rdata = res.data;
        let newdata = {};
        
        for (let i = 0; i < rdata.length; i++) {
          rdata[i].video_view = that.handlingNumber(rdata[i].video_view);
        }

        newdata[compid + '.video_data'] = rdata;
        newdata[compid + '.is_more'] = res.is_more;
        newdata[compid + '.curpage'] = res.current_page;
        newdata[compid + '.loading'] = false;
        newdata[compid + '.loadingFail'] = false;

        pageInstance.setData(newdata);
      },
      fail: function (res) {
        let newdata = {};
        newdata[compid + '.loadingFail'] = true;
        newdata[compid + '.loading'] = false;
        pageInstance.setData(newdata);
      }
    });
  },
  _updateSortStatus: function (dataset) {
    let pageInstance  = this.getAppCurrentPage();
    let sortCompid = dataset.compid;
    let selectSortIndex = dataset.idx;
    let newdata = {};

    newdata[sortCompid + '.customFeature.selected'] = selectSortIndex;
    if (selectSortIndex != 0 && dataset.sortdirection == 1) {
      newdata[sortCompid + '.content[' + selectSortIndex + '].customFeature.sort_direction'] = 0;
    } else if (selectSortIndex != 0) {
      newdata[sortCompid + '.content[' + selectSortIndex + '].customFeature.sort_direction'] = 1;
    } else if (selectSortIndex == 0) {
      newdata[sortCompid + '.content[' + selectSortIndex + '].customFeature.sort_direction'] = 0;
    }

    pageInstance.setData(newdata);
  },
  bbsInputComment: function (event) {
    let dataset      = event.target.dataset;
    let comment      = event.detail.value;
    let pageInstance = this.getAppCurrentPage();
    let compid       = dataset.compid;
    let data         = {};

    data[compid+'.comment.text'] = comment;
    pageInstance.setData(data);
  },
  bbsInputReply: function (event) {
    let dataset      = event.target.dataset;
    let comment      = event.detail.value;
    let pageInstance = this.getAppCurrentPage();
    let compid       = dataset.compid;
    let index        = dataset.index;
    let data         = {};

    data[compid+'.content.data['+index+'].replyText'] = comment;
    pageInstance.setData(data);
  },
  uploadBbsCommentImage: function (event) {
    let dataset      = event.currentTarget.dataset;
    let pageInstance = this.getAppCurrentPage();
    let compid       = dataset.compid;
    let data         = {};

    this.chooseImage(function(res){
      data[compid+'.comment.img'] = res;
      pageInstance.setData(data);
    }, 3);
  },
  uploadBbsReplyImage: function (event) {
    let dataset      = event.currentTarget.dataset;
    let pageInstance = this.getAppCurrentPage();
    let compid       = dataset.compid;
    let index        = dataset.index;
    let data         = {};

    this.chooseImage(function(res){
      data[compid+'.content.data['+index+'].replyImg'] = res;
      pageInstance.setData(data);
    }, 3);
  },
  deleteCommentImage: function (event) {
    let dataset      = event.currentTarget.dataset;
    let pageInstance = this.getAppCurrentPage();
    let compid       = dataset.compid;
    let index        = dataset.index;
    let oldData = pageInstance.data[compid].comment.img
    let data         = {};
    oldData.splice(index, 1)
    data[compid + '.comment.img'] = oldData;
    pageInstance.setData(data);
  },
  deleteReplyImage: function (event) {
    let dataset      = event.currentTarget.dataset;
    let pageInstance = this.getAppCurrentPage();
    let compid       = dataset.compid;
    let index        = dataset.index;
    let data         = {};

    data[compid+'.content.data['+index+'].replyImg'] = '';
    pageInstance.setData(data);
  },
  bbsPublishComment: function (event) {
    let dataset      = event.currentTarget.dataset;
    let _this        = this;
    let pageInstance = this.getAppCurrentPage();
    let compid       = dataset.compid;
    let bbsData      = pageInstance.data[compid];
    let comment      = bbsData.comment;
    let param;

    if (!comment.text || !comment.text.trim()) {
      this.showModal({
        content: '请输入评论内容'
      })
      return;
    }

    comment.text = encodeURIComponent(comment.text);

    delete comment.showReply;
    comment.addTime = util.formatTime();

    param = {};
    param.nickname = _this.globalData.userInfo.nickname;
    param.cover_thumb = _this.globalData.userInfo.cover_thumb;
    param.user_token = _this.globalData.userInfo.user_token;
    param.page_url = pageInstance.page_router;
    param.content = comment;
    param.rel_obj = '';
    if (bbsData.customFeature.ifBindPage && bbsData.customFeature.ifBindPage !== 'false') {
      if (pageInstance.page_form && pageInstance.page_form != 'none') {
        param.rel_obj = pageInstance.page_form + '_' + pageInstance.dataId;
      } else {
        param.rel_obj = pageInstance.page_router;
      }
    } else {
      param.rel_obj = _this.getAppId();
    }

    this.sendRequest({
      url: '/index.php?r=AppData/addData',
      method: 'post',
      data: {
        form: 'bbs',
        form_data: param
      },
      success: function (res) {
        let commentList = pageInstance.data[compid].content.data || [],
            newdata = {};

        param.id = res.data;
        param.content.text = decodeURIComponent(param.content.text)
        newdata[compid+'.content.data'] = [{
          form_data: param,
          count_num: 0
        }].concat(commentList);
        let count = '';
        if (+pageInstance.data[compid].content.count + 1 <= 99){
          count = +pageInstance.data[compid].content.count + 1
        }else if (+pageInstance.data[compid].content.count + 1 > 99) {
          count = '99+'
        } else if (+pageInstance.data[compid].content.count + 1 > 999) {
          count = '999+'
        } else if (+pageInstance.data[compid].content.count + 1 > 10000) {
          count = '1w+'
        }
        newdata[compid + '.content.count'] = count;
        newdata[compid+'.comment'] = {};
        newdata[compid + '.isShowReplyDialog'] = false;
        newdata[compid + '.bbsFocus'] = false;
        newdata[compid + '.replyIndex'] = 'undefined';
        pageInstance.setData(newdata);
      }
    })
  },
  clickBbsReplyBtn: function (event) {
    let dataset      = event.currentTarget.dataset;
    let pageInstance = this.getAppCurrentPage();
    let compid       = dataset.compid;
    let index        = dataset.index;
    let data         = {};
    data[compid+'.replyIndex'] = index;
    data[compid + '.bbsFocus'] = true;
    data[compid + '.isShowReplyDialog'] = true;
    pageInstance.setData(data);
  },
  bbsPublishReply: function (event) {
    let dataset      = event.currentTarget.dataset;
    let _this        = this;
    let pageInstance = this.getAppCurrentPage();
    let compid       = dataset.compid;
    let index        = pageInstance.data[compid].replyIndex;
    let bbsData      = pageInstance.data[compid];
    let form_data    = bbsData.content.data[index].form_data;
    let comment      = bbsData.comment;
    let param;
    if (!comment.text || !comment.text.trim()) {
      this.showModal({
        content: '请输入回复内容'
      })
      return;
    }

    comment.text = encodeURIComponent(comment.text);

    comment.addTime = util.formatTime();
    comment.reply = {
      nickname: form_data.nickname,
      text: form_data.content.text,
      img: form_data.content.img,
      user_token: form_data.user_token,
      reply: form_data.content.reply
    };

    param = {};
    param.nickname = _this.globalData.userInfo.nickname;
    param.cover_thumb = _this.globalData.userInfo.cover_thumb;
    param.user_token = _this.globalData.userInfo.user_token;
    param.page_url = pageInstance.page_router;
    param.content = comment;
    param.rel_obj = '';
    if (bbsData.customFeature.ifBindPage && bbsData.customFeature.ifBindPage !== 'false') {
      if (pageInstance.page_form && pageInstance.page_form != 'none') {
        param.rel_obj = pageInstance.page_form + '_' + pageInstance.dataId;
      } else {
        param.rel_obj = pageInstance.page_router;
      }
    } else {
      param.rel_obj = _this.getAppId();
    }

    this.sendRequest({
      url: '/index.php?r=AppData/addData',
      method: 'post',
      data: {
        form: 'bbs',
        form_data: param,
      },
      success: function(res){
        let commentList = pageInstance.data[compid].content.data || [],
            newdata = {};

        param.id = res.data;
        param.content.text = decodeURIComponent(param.content.text)
        if(commentList.length){
          delete commentList[index].replyText;
          delete commentList[index].showReply;
        }
        newdata[compid+'.content.data'] = [{
          form_data: param,
          count_num: 0
        }].concat(commentList);
        let count = '';
        if (+pageInstance.data[compid].content.count+1<=99){
          count = +pageInstance.data[compid].content.count + 1;
        }else if (+pageInstance.data[compid].content.count + 1 > 99) {
          count = '99+'
        } else if (+pageInstance.data[compid].content.count + 1 > 999) {
          count = '999+'
        } else if (+pageInstance.data[compid].content.count + 1 > 10000) {
          count = '1w+'
        }
        newdata[compid + '.content.count'] = count;
        newdata[compid+'.comment'] = {};
        newdata[compid + '.isShowReplyDialog'] = false;
        newdata[compid + '.bbsFocus'] = false;
        newdata[compid + '.replyIndex'] = 'undefined';
        pageInstance.setData(newdata);
      }
    })
  },
  showBbsReplyDialog: function(e){
    let compid = e.currentTarget.dataset.compid,
        pageInstance = this.getAppCurrentPage(),
        newdata = {};
    newdata[compid + '.isShowReplyDialog'] = true;
    newdata[compid +'.bbsFocus'] = true;
    pageInstance.setData(newdata);
  },
  hideBbsReplyDialog: function(e){
    let compid = e.currentTarget.dataset.compid,
      pageInstance = this.getAppCurrentPage(),
      newdata = {};
    newdata[compid + '.isShowReplyDialog'] = false;
    newdata[compid + '.bbsFocus'] = false;
    newdata[compid + '.replyIndex'] = 'undefined';
    pageInstance.setData(newdata);
  },
  searchList: function (event, scompid, sevent) {
    let pageInstance = this.getAppCurrentPage();
    let that         = this;
    let compid       = !scompid ? event.currentTarget.dataset.compid : event;
    let compData     = pageInstance.data[compid];
    let customFeature = compData.customFeature;
    let listid       = customFeature.searchObject.customFeature.id;
    let listType     = customFeature.searchObject.type;
    let form         = customFeature.searchObject.customFeature.form;
    let keyword      = pageInstance.keywordList[compid];
    let search_compid = '';
    let search_compData = {};
    let search_customFeature = {};
    let page         = '';

    if(listType == 'news') {
      for (let index in pageInstance.newsComps) {
        let params = pageInstance.newsComps[index];
        if (params.param.id === listid) {
          search_compid = params.compid;
          form = params.param.form;
          break;
        }
      }

      pageInstance.setData({
        [search_compid + '.pageObj']: {
          isLoading: false,
          noMore: false,
          page: 1
        },
        [search_compid + '.newslist']: []
      });

      this.getNewsList(
        {
          compid: search_compid,
          page: keyword ? -1 : 1,
          search_value: keyword
        },
        function (res) {
          if (keyword) {
            setTimeout(function () {
              that.showModal({
                content: '搜索到'+ res.data.length +'条资讯'
              });
            },0);
          }
        }
      )

      return;
    }

    let newdata = {};

    if( scompid ){
      search_compid = scompid;
      search_compData = pageInstance.data[search_compid];
      search_customFeature = search_compData.customFeature;

      page = search_compData.curpage + 1;

      if(!search_compData.is_more && typeof sevent == 'object' && sevent.type == 'tap'){
        that.showModal({
          content: '已经加载到最后了'
        });
      }

      if (pageInstance.requesting || !search_compData.is_more) {
        return;
      }
      pageInstance.requesting = true;

    }else{

      page = 1;

      if(listType === 'list-vessel'){
        for (let index in pageInstance.list_compids_params) {
          let params = pageInstance.list_compids_params[index];
          if (params.param.id === listid) {
            search_compid = params.compid;
            form = params.param.form;
            newdata[search_compid + '.list_data'] = [];
            break;
          }
        }
      }else if(listType === 'goods-list'){
        for (let index in pageInstance.goods_compids_params) {
          let params = pageInstance.goods_compids_params[index];
          if (params.param.id === listid) {
            search_compid = params.compid;
            form = params.param.form;
            newdata[search_compid + '.goods_data'] = [];
            break;
          }
        }
      }else if(listType === 'franchisee-list'){
        for (let index in pageInstance.franchiseeComps) {
          let params = pageInstance.franchiseeComps[index];
          if (params.param.id === listid) {
            search_compid = params.compid;
            form = params.param.form;
            newdata[search_compid + '.franchisee_data'] = [];
            break;
          }
        }
      }else if(listType === 'video-list'){
        for (let index in pageInstance.videoListComps) {
          let params = pageInstance.videoListComps[index];
          if (params.param.id === listid) {
            search_compid = params.compid;
            form = params.param.form;
            newdata[search_compid + '.video_data'] = [];
            break;
          }
        }
      }

      search_compData = pageInstance.data[search_compid];
      search_customFeature = search_compData.customFeature;
    }
    newdata[search_compid + '.loading'] = true;
    newdata[search_compid + '.loadingFail'] = false;
    pageInstance.setData(newdata);


    let url = '/index.php?r=appData/search';
    let param = {
      "search":{
          "data":[{"_allkey":keyword,"form": form}],
          "app_id": that.getAppId()
        },
      no_wrap: listType === 'video-list' || listType === 'franchisee-list' ? 1 : '',
      page_size : 20,
      page: page
    };
    param.page_size = search_customFeature.loadingNum || 20;

    if(listType === 'franchisee-list'){
      let info = this.getLocationInfo();
      param.search.longitude = info.longitude;
      param.search.latitude = info.latitude;
    }

    this.sendRequest({
      url: url,
      data: param,
      hideLoading: true,
      success: function (res) {
        let newdata = {};

        if(res.data.length == 0){
          setTimeout(function () {
            that.showModal({
              content: '没有找到与“'+keyword+'”相关的内容'
            });
          },0);
        }
        if (listType === "goods-list") {
          newdata[search_compid + '.goods_data'] = page == 1 ? res.data : search_compData.goods_data.concat(res.data);
        } else if (listType === 'list-vessel') {
          let listField = search_compData.listField;
          for (let j in res.data) {
            for (let k in res.data[j].form_data) {
              if (k == 'category') {
                continue;
              }
              if (/region/.test(k)) {
                continue;
              }
              if(k == 'goods_model') {
                res.data[j].form_data.virtual_price = that.formVirtualPrice(res.data[j].form_data);
              }
              let description = res.data[j].form_data[k];
              if (listField.indexOf(k) < 0 && /<("[^"]*"|'[^']*'|[^'">])*>/.test(description)) { //没有绑定的字段的富文本置为空
                res.data[j].form_data[k] = '';
              }else if(that.needParseRichText(description)) {
                res.data[j].form_data[k] = that.getWxParseResult(description);
              }
            }
          }
          newdata[search_compid + '.list_data'] = page == 1 ? res.data : search_compData.list_data.concat(res.data);
        } else if (listType === 'franchisee-list') {
          for(let index in res.data){
            let distance = res.data[index].distance;
            res.data[index].distance = util.formatDistance(distance);
          }
          newdata[search_compid + '.franchisee_data'] = page == 1 ? res.data : search_compData.franchisee_data.concat(res.data);
        }else if(listType == 'video-list'){
          let rdata = res.data;

          for (let i = 0; i < rdata.length; i++) {
            rdata[i].video_view = that.handlingNumber(rdata[i].video_view);
          }
          newdata[search_compid + '.video_data'] = page == 1 ? rdata : search_compData.video_data.concat(rdata);

        }

        newdata[search_compid + '.is_search'] = true;
        newdata[search_compid + '.searchEle'] = compid;
        newdata[search_compid + '.is_more']   = res.is_more;
        newdata[search_compid + '.curpage']   = res.current_page;
        newdata[search_compid + '.loading'] = false;
        newdata[search_compid + '.loadingFail'] = false;

        pageInstance.setData(newdata);
        
      },
      fail: function (err) {
        let newdata = {};
        newdata[search_compid + '.loadingFail'] = true;
        newdata[search_compid + '.loading'] = false;
        pageInstance.setData(newdata);
      },
      complete: function () {
        setTimeout(function () {
          pageInstance.requesting = false;
        }, 300);
      }
    })
  },
  selectLocal: function (event) {
    let id           = event.currentTarget.dataset.id;
    let pageInstance = this.getAppCurrentPage();
    let compdata = pageInstance.data[id];
    let newdata      = {};

    newdata[id + '.citylocationHidden'] = typeof (compdata.citylocationHidden) == undefined ? false : !compdata.citylocationHidden;
    newdata[id + '.provinces'] = ['请选择'];
    newdata[id + '.citys'] =['请选择'];
    newdata[id + '.districts'] = ['请选择']
    newdata[id + '.provinces_ids'] =[null];
    newdata[id + '.city_ids'] =[null];
    newdata[id + '.district_ids'] = [null];
    for (let i in compdata.areaList){
      newdata[id + '.provinces'].push(compdata.areaList[i].name);
      newdata[id + '.provinces_ids'].push(compdata.areaList[i].region_id);
    }
    newdata[id + '.newlocal'] = '';
    pageInstance.setData(newdata);
  },
  cancelCity: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let id           = event.currentTarget.dataset.id;
    let compdata = pageInstance.data[id];
    let newdata      = {};
    newdata[id + '.citylocationHidden'] = !compdata.citylocationHidden;
    newdata[id + '.province'] = '';
    newdata[id + '.city'] = '';
    newdata[id + '.district'] = '';
    pageInstance.setData(newdata);
  },
  bindCityChange: function (event) {
    let val          = event.detail.value;
    let id           = event.currentTarget.dataset.id;
    let pageInstance = this.getAppCurrentPage();
    let compdata      = pageInstance.data[id];
    let newdata      = {};
    let cityList = compdata.areaList;
    if (!compdata.newlocal){
      if (compdata.value && (compdata.value[0] == val[0])){
        let province = compdata.provinces[val[0]] == '请选择' ? '' : compdata.provinces[val[0]];
        newdata[id + '.province'] = province;
        newdata[id + '.citys'] = province == '' ? ['请选择'] : this._getCityList(cityList[val[0] - 1].cities);
        newdata[id + '.city_ids'] = province == '' ? [null] : this._getCityList(cityList[val[0] - 1].cities, 1);
        let city = province == '' ? '' : newdata[id + '.citys'][val[1]];
        newdata[id + '.city'] = city
        newdata[id + '.districts'] = city == '' ? ['请选择'] : this._getCityList(cityList[val[0] - 1].cities[val[1]].towns);
        newdata[id + '.district_ids'] = city == '' ? [null] : this._getCityList(cityList[val[0] - 1].cities[val[1]].towns, 1);
        newdata[id + '.region_id'] = newdata[id + '.district_ids'][val[2]];
        newdata[id + '.district'] = city == '' ? '' : newdata[id + '.districts'][val[2]];
        newdata[id + '.value'] = val;
      }else{
        let province = compdata.provinces[val[0]] == '请选择' ? '' : compdata.provinces[val[0]];
        newdata[id + '.province'] = province;
        newdata[id + '.citys'] = province == '' ? ['请选择'] : this._getCityList(cityList[val[0] - 1].cities);
        newdata[id + '.city_ids'] = province == '' ? [null] : this._getCityList(cityList[val[0] - 1].cities, 1);
        let city = province == '' ? '' : newdata[id + '.citys'][0];
        newdata[id + '.city'] = city
        newdata[id + '.districts'] = city == '' ? ['请选择'] : this._getCityList(cityList[val[0] - 1].cities[val[1]].towns);
        newdata[id + '.district_ids'] = city == '' ? [null] : this._getCityList(cityList[val[0] - 1].cities[val[1]].towns, 1);
        newdata[id + '.region_id'] = newdata[id + '.district_ids'][val[2]];
        newdata[id + '.district'] = city == '' ? '' : newdata[id + '.districts'][val[2]];
        newdata[id + '.value'] = val;
      }
      pageInstance.setData(newdata)
    }
  },
  _getCityList:function (province, id) {
    let cityList = [];
    let cityList_id = [];
    for(let i in province){
      if(typeof(province[i]) == 'object'){
        cityList.push(province[i].name)
        cityList_id.push(province[i].region_id);
      }else{
        cityList[1] = province.name;
        cityList_id[1]=province.region_id;
      }
    }
    if(id){
      return cityList_id;
    }else{
      return cityList;
    }
  },
  submitCity: function (event) {
    let id = event.currentTarget.dataset.id;
    let pageInstance = this.getAppCurrentPage();
    let compdata = pageInstance.data[id];
    let newdata = {};
    if (!compdata.districts) {
      this.showModal({content: '您未选择城市!'});
      newdata[id + '.province'] = '';
      newdata[id + '.city'] = '';
      newdata[id + '.district'] = '';
    } else {
      newdata[id + '.citylocationHidden'] = !compdata.citylocationHidden;
      newdata[id + '.newlocal'] = compdata.province + ' ' + compdata.city + ' ' + compdata.district;
      newdata[id + '.value'] = [0,0,0];
      this._citylocationList(event.currentTarget.dataset, compdata.region_id);
    }
    pageInstance.setData(newdata);
  },
  _citylocationList: function (dataset, region_id) {
    let compid       = dataset.id;
    let listid       = dataset.listid;
    let listType     = dataset.listtype;
    let form         = dataset.form;
    let index        = '';
    let targetList   = '';
    let that         = this;
    let pageInstance = this.getAppCurrentPage();
    let newdata = {};

    if (listType === 'list-vessel') {
      for (index in pageInstance.list_compids_params) {
        if (pageInstance.list_compids_params[index].param.id === listid) {
          pageInstance.list_compids_params[index].param.page = 1;
          targetList = pageInstance.list_compids_params[index];
          newdata[targetList.compid + '.list_data'] = [];
          break;
        }
      }
    }

    if (listType === 'goods-list') {
      for (index in pageInstance.goods_compids_params) {
        if (pageInstance.goods_compids_params[index].param.id === listid) {
          pageInstance.goods_compids_params[index].param.page = 1;
          targetList = pageInstance.goods_compids_params[index];
          newdata[targetList.compid + '.goods_data'] = [];
          break;
        }
      }
    }

    if (listType === 'franchisee-list') {
      for (index in pageInstance.franchiseeComps) {
        if (pageInstance.franchiseeComps[index].param.id === listid) {
          pageInstance.franchiseeComps[index].param.page = 1;
          targetList = pageInstance.franchiseeComps[index];
          newdata[targetList.compid + '.franchisee_data'] = [];
          break;
        }
      }
    }

    let targetCompid = targetList.compid;
    newdata[targetCompid + '.loading'] = true;
    newdata[targetCompid + '.loadingFail'] = false;
    newdata[targetCompid + '.is_more'] = 1;
    pageInstance.setData(newdata);

    let url = '/index.php?r=AppData/GetFormDataList&idx_arr[idx]=region_id&idx_arr[idx_value]='+region_id+'&extra_cond_arr[latitude]='+this.globalData.locationInfo.latitude+'&extra_cond_arr[longitude]='+this.globalData.locationInfo.longitude + '&extra_cond_arr[county_id]='+region_id,
        param = {'form':form};
    this.sendRequest({
      url: url,
      data: param,
      hideLoading: true,
      success: function (res) {
        if(res.data.length == 0){
          setTimeout(function () {
            that.showModal({
              content: '没有找到与所选区域的相关的内容'
            });
          },0)
        }
        if (res.status == 0) {
          let newdata = {};

          if (listType === "goods-list") {
            newdata[targetCompid + '.goods_data'] = res.data;
          } else if (listType === 'list-vessel') {
            if(param.form !== 'form'){
              let listField = pageInstance.data[targetCompid].listField;
              for (let j in res.data) {
                for (let k in res.data[j].form_data) {
                  if (k == 'category') {
                    continue;
                  }
                  if(/region/.test(k)){
                    continue;
                  }
                  if(k == 'goods_model') {
                    res.data[j].form_data.virtual_price = that.formVirtualPrice(res.data[j].form_data);
                  }

                  let description = res.data[j].form_data[k];
                  if (listField.indexOf(k) < 0 && /<("[^"]*"|'[^']*'|[^'">])*>/.test(description)) { //没有绑定的字段的富文本置为空
                    res.data[j].form_data[k] = '';
                  } else if (that.needParseRichText(description)) {
                    res.data[j].form_data[k] = that.getWxParseResult(description);
                  }
                }
              }
            }
            newdata[targetCompid+ '.list_data'] = res.data;
          } else if (listType === 'franchisee-list') {
            for(let index in res.data){
              let distance = res.data[index].distance;
              res.data[index].distance = util.formatDistance(distance);
            }
            newdata[targetCompid + '.franchisee_data'] = res.data;
          }

          newdata[targetCompid + '.is_more']   = res.is_more;
          newdata[targetCompid + '.curpage']   = 1;
          newdata[targetCompid + '.loading'] = false;
          newdata[targetCompid + '.loadingFail'] = false;

          pageInstance.setData(newdata);
        }
      },
      fail: function (res) {
        let newdata = {};
        newdata[targetCompid + '.loadingFail'] = true;
        newdata[targetCompid + '.loading'] = false;
        pageInstance.setData(newdata);
      }
    })
  },
  openTakeoutLocation: function (event) {
    let dataset = event.currentTarget.dataset;
    this.openLocation({
      latitude: +dataset.lat,
      longitude: +dataset.lng,
      name: dataset.name,
      address: dataset.address
    })
  },
  callTakeout: function (event) {
    let phone = event.currentTarget.dataset.phone;
    this.makePhoneCall(phone);
  },
  getMoreAssess: function (event) {
    let dataset      = event.currentTarget.dataset;
    let page         = dataset.nextpage;
    let compid       = dataset.compid;
    let pageInstance = this.getAppCurrentPage();
    let newdata      = pageInstance.data;
    let assessIndex  = newdata[compid].assessActive;
    this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppShop/getAssessList',
      method: 'post',
      data: {
        idx_arr: {
          idx: 'goods_type',
          idx_value: 2
        },
        page: page,
        page_size: 10,
        obj_name: 'app_id'
      },
      success: function (res) {
        for(let i in res.data){
          newdata[compid].assessList.push(res.data[i]);
        }
        let commentNums = [],
            showAssess = [],
            hasImgAssessList = 0,
            goodAssess = 0,
            normalAssess = 0,
            badAssess = 0;
        for (let i = 0; i < newdata[compid].assessList.length; i++) {
          newdata[compid].assessList[i].assess_info.has_img == 1 ? hasImgAssessList++ : null;
          newdata[compid].assessList[i].assess_info.level == 3 ? goodAssess++ : (newdata[compid].assessList[i].assess_info.level == 1 ? badAssess++ : normalAssess++)
          if (newdata[compid].assessList[i].assess_info.has_img == 1 && newdata[compid].assessActive == 0) {
            showAssess.push(newdata[compid].assessList[i]);
          } else if (newdata[compid].assessList[i].assess_info.level == 3 && newdata[compid].assessActive == 1) {
            showAssess.push(newdata[compid].assessList[i]);
          } else if (newdata[compid].assessList[i].assess_info.level == 1 && newdata[compid].assessActive == 3) {
            showAssess.push(newdata[compid].assessList[i]);
          } else if (newdata[compid].assessList[i].assess_info.level == 2 && newdata[compid].assessActive == 2) {
            showAssess.push(newdata[compid].assessList[i]);
          }
        }
        commentNums = [hasImgAssessList, goodAssess, normalAssess, badAssess]
        newdata[compid].commentNums = commentNums;
        newdata[compid].assessCurrentPage = page;
        newdata[compid].showAssess = showAssess;
        newdata[compid].moreAssess = res.is_more;
        pageInstance.setData(newdata);
      }
    })
  },
  changeEvaluate: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let newdata = {};
    let compid = event.currentTarget.dataset.compid;
    if (event.currentTarget.dataset.index == 2 && !pageInstance.hasRequireAssess && /tostore/.test(compid)) {
      pageInstance.hasRequireAssess = true;
      this._getAssessList(pageInstance, compid);
    }
    newdata[compid + '.selected'] = event.currentTarget.dataset.index;
    pageInstance.setData(newdata);
  },
  _getAssessList: function(pageInstance, compid){
    this.sendRequest({
      hideLoading: true,   // 页面第一个请求才展示loading
      url: '/index.php?r=AppShop/getAssessList&idx_arr[idx]=goods_type&idx_arr[idx_value]=3',
      data: { page: 1, page_size: 10, obj_name: 'app_id' },
      success: function (res) {
        let newdata = {},
          showAssess = [],
          hasImgAssessList = 0,
          goodAssess = 0,
          normalAssess = 0,
          badAssess = 0;
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].assess_info.has_img == 1 ? (hasImgAssessList++ , showAssess.push(res.data[i])) : null;
          res.data[i].assess_info.level == 3 ? goodAssess++ : (res.data[i].assess_info.level == 1 ? badAssess++ : normalAssess++ )
        }
        for (let j = 0; j < res.num.length;j++) {
          res.num[j] = parseInt(res.num[j])
        }
        newdata[compid + '.assessActive'] = 0;
        newdata[compid + '.assessList'] = res.data;
        newdata[compid + '.showAssess'] = showAssess;
        newdata[compid + '.assessNum'] = res.num;
        newdata[compid + '.moreAssess'] = res.is_more;
        newdata[compid + '.assessCurrentPage'] = res.current_page;
        pageInstance.setData(newdata);
      }
    })
  },
  deleteAllCarts: function (event) {
    let compid          = event.currentTarget.dataset.compid;
    let pageInstance    = this.getAppCurrentPage();
    let data            = pageInstance.data;
    let newdata         = {};
    let cartList        = data[compid].cartList;
    let that            = this;
    let goods_data_list = data[compid].goods_data_list;
    let goods_model_list= data[compid].goods_model_list;
    let cartIds         = [];
    for (let i in data[compid].cart_data) {
      for (let j in data[compid].cart_data[i]) {
        cartIds.push(data[compid].cart_data[i][j].cart_id)
      }
    }
    if (cartIds.length == 0) {
      this.showModal({
        content: '请先添加商品'
      });
      return;
    }
    this._removeFromCart(cartIds, () => {
      this._removeFromCartCallback({
        data: data,
        compid: compid,
        thisPage: pageInstance
      })
    })
  },
  deleteSingleCarts:function(e){
    let dataset = e.currentTarget.dataset;
    let pageInstance = this.getAppCurrentPage();
    let data = pageInstance.data;
    let compid = dataset.compid;
    let goodsid = dataset.goodsid;
    let modelid = dataset.modelid;
    this._removeFromCart([data[compid].cartList[goodsid][modelid].cart_id], () => {
      let newdata = {};
      let num = data[compid].cartList[goodsid][modelid].num;
      let price = (data[compid].cartList[goodsid][modelid].price * num).toFixed(2)
      delete data[compid].cart_data[goodsid][modelid]
      delete data[compid].cartList[goodsid][modelid]
      if (this.isEmptyObject(data[compid].cart_data[goodsid])) {
        delete data[compid].cart_data[goodsid]
        delete data[compid].cartList[goodsid]
      }
      newdata[compid + '.goods_data_list.' + goodsid + '.totalNum'] = data[compid].goods_data_list[goodsid].totalNum - num;
      newdata[compid + '.cart_data'] = data[compid].cart_data;
      newdata[compid + '.cartList'] = data[compid].cartList;
      newdata[compid + '.TotalNum'] = data[compid].TotalNum - num;
      newdata[compid + '.TotalPrice'] = (data[compid].TotalPrice - +price).toFixed(2);
      pageInstance.setData(newdata);
    })
  },
  clickCategory: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let dataset      = event.currentTarget.dataset;
    let compid       = dataset.compid;
    let index        = dataset.index;
    let id           = dataset.id;
    let newdata      = {};
    let param        = dataset.param;
    let compData = pageInstance.data[compid];
    if (!(compData.show_goods_data && compData.show_goods_data['category'+id])) {
      newdata[compid + '.loading'] = true;
      this._getTakeoutStyleGoodsList(param, pageInstance, compid, 0);
    }
    newdata[compid +'.customFeature.selected'] = index;
    pageInstance.setData(newdata);
  },
  goodsListPlus: function (event) {
    clearTimeout(this.takeoutTimeout);
    let pageInstance   = this.getAppCurrentPage();
    let dataset        = event.target.dataset;
    let data           = pageInstance.data;
    let goodsid        = dataset.goodsid;
    let compid         = dataset.compid;
    if (/waimai/.test(compid)) {
      if (data[compid].in_distance == 0) {
        this.showModal({ content: '不在配送范围内' })
        return;
      } else if (!data[compid].in_distance) {
        this.showModal({ content: '正在定位中' })
        return;
      }
    }
    let model          = dataset.model;
    let goodsInfo      = data[compid].goods_data_list[goodsid];
    let totalNum       = data[compid].TotalNum;
    let totalPrice     = +data[compid].TotalPrice;
    let is_in_business = dataset.isInBusiness;
    let newdata        = {};
    let that           = this;
    newdata[compid + '.modelPrice'] = 0;
    if (!data[compid].in_business_time) {
      this.showModal({ content: '店铺休息中,暂时无法接单' })
      return;
    }
    if (is_in_business == 0){
      this.showModal({ content: '该商品不在出售时间' })
      return;
    }
    if (model) {
      newdata[compid + '.goodsModelShow'] = true;
      newdata[compid + '.modelGoodsId'] = goodsid;
      newdata[compid + '.modelIdArr'] = [];
      for (let index = 0; index < data[compid].goods_model_list[goodsid].modelData.length; index++) {
        newdata[compid + '.modelIdArr'].push(0)
      }
      pageInstance.setData(newdata);
    } else {
      newdata[compid + '.goods_data_list.'+goodsid] = goodsInfo;
      newdata[compid + '.cartList.' + goodsid] = data[compid].cartList[ goodsid] || {};
      if (goodsInfo.totalNum >= goodsInfo.stock){
        this.showModal({ content: '该商品库存不足'});
        return;
      }
      let newNum = goodsInfo.totalNum + 1
      newdata[compid + '.TotalNum'] = +totalNum + 1;
      newdata[compid + '.TotalPrice'] = (+totalPrice + +goodsInfo.price).toFixed(2);
      newdata[compid + '.isDeliver'] = (+data[compid].shopInfo.min_deliver_price - newdata[compid + '.TotalPrice']).toFixed(2);
      newdata[compid + '.goods_data_list.'+goodsid].totalNum ++;
      if (newdata[compid + '.cartList.' + goodsid][0]) {
        newdata[compid + '.cartList.' + goodsid][0].num ++
        newdata[compid + '.cartList.' + goodsid][0].totalPrice = (newdata[compid + '.cartList.'+goodsid][0].num * goodsInfo.price).toFixed(2)
      } else {
        newdata[compid + '.cartList.' + goodsid][0] = {
          list: 'list',
          id: goodsid,
          modelId: 0,
          num: newNum,
          price: goodsInfo.price,
          gooodsName: goodsInfo.name,
          totalPrice: (newNum * goodsInfo.price).toFixed(2),
          stock: goodsInfo.stock,
          cart_id : 0,
          in_business_time: data[compid].goods_data_list[goodsid].in_business_time
        };
      }
      if (data[compid].cartGoodsIdList.indexOf(+goodsid) == -1) {
        newdata[compid + '.cartGoodsIdList'] = data[compid].cartGoodsIdList
        newdata[compid + '.cartGoodsIdList'].push(+goodsid)
      }
      pageInstance.setData(newdata);
      this.takeoutTimeout = setTimeout(() => {
        let options = {
          goods_type: /waimai/.test(compid) ? 2 : 3,
          cartListData: pageInstance.data[compid].cartList,
          thisPage: pageInstance,
          compid: compid
        }
        this._addTakeoutCart(options, this.eachCartList(options))
      }, 300);
    }
  },
  goodsListMinus: function (event) {
    clearTimeout(this.takeoutTimeout);
    let pageInstance = this.getAppCurrentPage();
    let data         = pageInstance.data;
    let dataset      = event.target.dataset;
    let goodsid      = dataset.goodsid;
    let compid       = dataset.compid;
    let that         = this;
    let totalNum     = +data[compid].TotalNum;
    let totalPrice   = +data[compid].TotalPrice;
    let newdata      = {};
    let model        = dataset.model;
    let isInBusiness = dataset.isInBusiness
    if (isInBusiness == 0) {
      this.showModal({
        content: '该商品不在出售时间',
      });
      return;
    }
    if (model) {
      this.showModal({
        content: '多规格商品只能去购物车操作',
      });
      return;
    }
    newdata[compid + '.goods_data_list.'+goodsid] = data[compid].goods_data_list[goodsid];
    newdata[compid + '.cartList.' + goodsid] = data[compid].cartList[goodsid];
    newdata[compid + '.TotalNum']  = --totalNum;
    newdata[compid + '.TotalPrice'] = (+totalPrice - Number(newdata[compid + '.goods_data_list.'+goodsid].price)).toFixed(2);
    newdata[compid + '.isDeliver'] = (+data[compid].shopInfo.min_deliver_price - newdata[compid + '.TotalPrice']).toFixed(2);
    newdata[compid + '.goods_data_list.' + goodsid].totalNum--;
    newdata[compid + '.cartList.' + goodsid][0].num--;
    newdata[compid + '.cartList.' + goodsid][0].totalPrice = Number(newdata[compid + '.cartList.' + goodsid][0].num * newdata[compid + '.cartList.' + goodsid][0].price).toFixed(2);
    pageInstance.setData(newdata);
    this.takeoutTimeout = setTimeout(() => {
      let options = {
        goods_type: /waimai/.test(compid) ? 2 : 3,
        cartListData: pageInstance.data[compid].cartList,
        thisPage: pageInstance,
        compid: compid
      }
      this._addTakeoutCart(options, this.eachCartList(options))
    }, 300);
  },
  cartListPlus: function (event) {
    clearTimeout(this.takeoutTimeout);
    let pageInstance = this.getAppCurrentPage();
    let data         = pageInstance.data;
    let newdata      = {};
    let dataset      = event.currentTarget.dataset;
    let goodsid      = dataset.goodsid;
    let modelid      = dataset.modelid;
    let is_in_business = dataset.isInBusiness;
    let num          = dataset.num;
    let stock        = dataset.stock;
    let that         = this;
    let compid       = dataset.compid;
    if (num == stock){
      this.showModal({ content: '该商品库存不足' });
      return;
    }
    if (is_in_business == 0){
      this.showModal({ content: '该商品不在出售时间' })
      return;
    }
    newdata[compid + '.goods_data_list.'+goodsid] = data[compid].goods_data_list[goodsid]
    newdata[compid + '.cartList.' + goodsid] = data[compid].cartList[goodsid];
    newdata[compid + '.goods_model_list.' + goodsid] = data[compid].goods_model_list[ goodsid];
    if (+modelid) {
      newdata[compid + '.TotalNum'] = data[compid].TotalNum + 1;
      newdata[compid + '.TotalPrice'] = (Number(data[compid].TotalPrice) + Number(data[compid].cartList[goodsid][modelid].price)).toFixed(2);
      newdata[compid + '.isDeliver'] = (+data[compid].shopInfo.min_deliver_price - newdata[compid + '.TotalPrice']).toFixed(2);
      newdata[compid + '.goods_data_list.'+goodsid].totalNum = ++data[compid].goods_data_list[goodsid].totalNum
      newdata[compid + '.cartList.' + goodsid][modelid].num = ++data[compid].cartList[goodsid][modelid].num;
      newdata[compid + '.cartList.' + goodsid][modelid].totalPrice = Number(newdata[compid + '.cartList.' + goodsid][modelid].num * data[compid].cartList[goodsid][modelid].price).toFixed(2);
      newdata[compid + '.goods_model_list.' + goodsid].goods_model[modelid].totalNum ++;
      pageInstance.setData(newdata);
      this.takeoutTimeout = setTimeout(() => {
        let options = {
          goods_type: /waimai/.test(compid) ? 2 : 3,
          cartListData: pageInstance.data[compid].cartList,
          thisPage: pageInstance,
          compid: compid
        }
        this._addTakeoutCart(options, this.eachCartList(options))
      }, 300);
    } else {
      newdata[compid + '.TotalNum'] = data[compid].TotalNum + 1;
      newdata[compid + '.TotalPrice'] = (Number(data[compid].TotalPrice) + Number(data[compid].cartList[goodsid][modelid].price)).toFixed(2);
      newdata[compid + '.isDeliver'] = (+data[compid].shopInfo.min_deliver_price - newdata[compid + '.TotalPrice']).toFixed(2);
      newdata[compid + '.goods_data_list.'+goodsid].totalNum = ++data[compid].goods_data_list[goodsid].totalNum
      newdata[compid + '.cartList.' + goodsid][0].num = newdata[compid + '.goods_data_list.'+goodsid].totalNum;
      newdata[compid + '.cartList.' + goodsid][0].totalPrice = Number(newdata[compid + '.goods_data_list.'+goodsid].totalNum * newdata[compid + '.cartList.' + goodsid][0].price).toFixed(2);
      pageInstance.setData(newdata);
      this.takeoutTimeout = setTimeout(() => {
        let options = {
          goods_type: /waimai/.test(compid) ? 2 : 3,
          cartListData: pageInstance.data[compid].cartList,
          thisPage: pageInstance,
          compid: compid
        }
        this._addTakeoutCart(options, this.eachCartList(options))
      }, 300);
    }
  },
  isEmptyObject: function (obj) {
    for (let name in obj) {
      return false;
    }
    return true;
  },
  cartListMinus: function (event) {
    clearTimeout(this.takeoutTimeout);
    let pageInstance = this.getAppCurrentPage();
    let dataset      = event.currentTarget.dataset;
    let data         = pageInstance.data;
    let newdata      = {};
    let compid       = dataset.compid;
    let goodsid      = dataset.goodsid;
    let price        = dataset.price;
    let num          = dataset.num;
    let cart_id      = dataset.cartid;
    let modelid      = dataset.modelid;
    if (data[compid].cartList[goodsid][modelid].num == 0) {
      return;
    }
    newdata[compid + '.cartList.' + goodsid] = data[compid].cartList[goodsid];
    newdata[compid + '.goods_data_list.'+goodsid] = data[compid].goods_data_list[goodsid];
    newdata[compid + '.goods_model_list.' + goodsid] = data[compid].goods_model_list[goodsid];
    let newNum = num - 1;
    if (modelid != 0) {
      newdata[compid + '.TotalNum'] = --data[compid].TotalNum;
      newdata[compid + '.TotalPrice'] = (Number(data[compid].TotalPrice) - Number(price)).toFixed(2);
      newdata[compid + '.isDeliver'] = (+data[compid].shopInfo.min_deliver_price - newdata[compid + '.TotalPrice']).toFixed(2);
      newdata[compid + '.cartList.' + goodsid][modelid].num--;
      newdata[compid + '.cartList.' + goodsid][modelid].totalPrice = Number(price * newdata[compid + '.cartList.' + goodsid][modelid].num).toFixed(2);
      newdata[compid + '.goods_data_list.' + goodsid].totalNum--;
      newdata[compid + '.goods_model_list.' + goodsid].goods_model[modelid].totalNum--;
      pageInstance.setData(newdata);
      pageInstance.setData(newdata);
        this.takeoutTimeout = setTimeout(() => {
          let options = {
            goods_type: /waimai/.test(compid) ? 2 : 3,
            cartListData: pageInstance.data[compid].cartList,
            thisPage: pageInstance,
            compid: compid
          }
          this._addTakeoutCart(options, this.eachCartList(options))
        }, 300);
    } else {
        newdata[compid + '.TotalNum'] = --data[compid].TotalNum;
        newdata[compid + '.TotalPrice'] = (Number(data[compid].TotalPrice) - Number(price)).toFixed(2);
        newdata[compid + '.isDeliver'] = (+data[compid].shopInfo.min_deliver_price - newdata[compid + '.TotalPrice']).toFixed(2);
        newdata[compid + '.cartList.' + goodsid][modelid].num--;
        newdata[compid + '.cartList.' + goodsid][modelid].totalPrice = Number(price * newdata[compid + '.cartList.' + goodsid][modelid].num).toFixed(2);
        newdata[compid + '.goods_data_list.'+goodsid].totalNum--;
        newdata[compid + '.goods_model_list.' + goodsid][0].num--;
        pageInstance.setData(newdata);
        
        newdata[compid + '.goods_model_list.'+goodsid][0].num--;
        pageInstance.setData(newdata);
        this.takeoutTimeout = setTimeout(() => {
          let options = {
            goods_type: /waimai/.test(compid) ? 2 : 3,
            cartListData: pageInstance.data[compid].cartList,
            thisPage: pageInstance,
            compid: compid
          }
          this._addTakeoutCart(options, this.eachCartList(options))
        }, 300);
    }
  },
  eachCartList: function (options, callback){
    let cart_info = [];
    for (let index in options.cartListData) {
      if (index != undefined) {
        for (let j in options.cartListData[index]){
          if ( (options.cartListData[index][j].in_business_time != 0 && options.goods_type == 3) || options.goods_type == 2) {
            cart_info.push({
              goods_id: index.replace('goods', ''),
              model_id: options.cartListData[index][j].modelId,
              num: options.cartListData[index][j].num
            })
          }
        }
      }
    }
    return cart_info;
  },
  _addTakeoutCart: function (options, cart_info, callback){
    let that = this;
    let pageData = options.thisPage.data;
    this.sendRequest({
      url: '/index.php?r=AppShop/addVerticalCart',
      method: 'post',
      hideLoading: true,
      data: {
        cart_info: cart_info,
        goods_type: options.goods_type
      },
      success: function(res){
        let data = {}
        data[options.compid + '.cart_data'] = res.data;
        let cartIdArr = [];
        let isNotEnouth = true;
        for (let i in res.data) {
          for (let j in res.data[i]) {
            cartIdArr.push(res.data[i][j].cart_id);

          }
        }
        for (let k in cart_info) {
          let item = cart_info[k];
          if (res.data[item.goods_id] && res.data[item.goods_id][item.model_id].stock < item.num){
            isNotEnouth = false;
            data[options.compid + '.cartList.' + item.goods_id + '.' + item.model_id + '.num'] = res.data[item.goods_id][item.model_id].stock;
            data[options.compid + '.cartList.' + item.goods_id + '.' + item.model_id + '.totalPrice'] = (res.data[item.goods_id][item.model_id].stock * pageData[options.compid].cartList[item.goods_id][item.model_id].price).toFixed(2);
          }
        }
        that.changeStock(res.data, options);

        callback && callback(cartIdArr);
        options.thisPage.setData(data);
        if (!isNotEnouth) {
          that.showModal({
            content: '部分商品库存不足，将调整至当前最大库存'
          })
          that.updateGoodsListNum(options.compid)
        }
      }
    })
  },
  changeStock: function (data, options){
    let newdata = {};
    let goodsId = [];
    for(let i in data){
      for(let j in data[i]){
        newdata[options.compid + '.cartList.' + i + '.' + j + '.stock'] = data[i][j].stock;
        newdata[options.compid + '.goods_data_list.' + i + '.stock'] = data[i][j].stock;

      }
    }
    options.thisPage.setData(newdata);
  },
  updateGoodsListNum: function(compid){
    let pageInstance = this.getAppCurrentPage();
    let data = pageInstance.data;
    let newdata = {};
    let totalprice = 0;
    newdata[compid + '.TotalNum'] = 0;
    newdata[compid +'.TotalPrice'] = 0;
    for (let i in data[compid].cartList){
      let num = 0;
      let price = 0;
      for (let j in data[compid].cartList[i]){
        num += +data[compid].cartList[i][j].num
        price = (price + +data[compid].cartList[i][j].num * data[compid].cartList[i][j].price).toFixed(2)
      }
      newdata[compid + '.goods_data_list.' + i + '.totalNum'] = num;
      newdata[compid + '.TotalNum'] += num;
      totalprice = (+totalprice + +price).toFixed(2)
      newdata[compid + '.TotalPrice'] = totalprice
    }
    pageInstance.setData(newdata)
    this.takeoutTimeout = setTimeout(() => {
      let options = {
        goods_type: /waimai/.test(compid) ? 2 : 3,
        cartListData: pageInstance.data[compid].cartList,
        thisPage: pageInstance,
        compid: compid
      }
      this._addTakeoutCart(options, this.eachCartList(options))
    }, 300);
  },
  _removeFromCart: function (cart_id, callback, failCallback) {
    let that = this;
    this.sendRequest({
      url: '/index.php?r=AppShop/deleteCart',
      method: 'post',
      data: {
        cart_id_arr: cart_id,
      },
      hideLoading:true,
      success: function (res) {
        callback && callback()
      },
      fail: function (res) {
        failCallback && failCallback()
        that.showModal({
          content: '清空购物车失败'
        })
      }
    });
  },
  _removeFromCartCallback: function(options){
    let n = {}, c = options.compid;
    let goods_data_list = options.data[c].goods_data_list;
    let goods_model_list = options.data[c].goods_model_list;
    n[c + '.cartList'] = {};
    n[c + '.cart_data'] = [];
    for (let i in goods_data_list) {
      goods_data_list[i].totalNum = 0;
    }
    for (let i in goods_model_list) {
      for (let j in goods_model_list[i].goods_model) {
        goods_model_list[i].goods_model[j].totalNum = 0
      }
    }
    n[c + '.goods_model_list'] = goods_model_list;
    n[c + '.goods_data_list'] = goods_data_list;
    n[c + '.cartGoodsIdList'] = [];
    n[c + '.TotalNum'] = 0;
    n[c + '.TotalPrice'] = 0;
    n[c + '.isDeliver'] = options.data[c].shopInfo.min_deliver_price;
    n[c + '.shoppingCartShow'] = true;
    options.thisPage.setData(n);
  },
  _changeOrderCount: function (id, num, modelid, callback, failCallback) {
    let that = this;
    if (num == 0) {
      return;
    }
    this.sendRequest({
      url: '/index.php?r=AppShop/addCart',
      data: {
        goods_id: id.toString().replace('goods', ''),
        num: num,
        model_id: modelid || 0,
      },
      hideLoading: true,
      success: function (res) {
        callback && callback(res.data);
      },
      fail: function (res) {
        failCallback && failCallback();
        that.showModal({
          content: res.data
        })
      }
    });
  },
  changeAssessType: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let newdata      = pageInstance.data;
    let assessActive = event.currentTarget.dataset.active;
    let showAssess   = [];
    let compid       = event.currentTarget.dataset.compid;
    newdata[compid].assessActive = assessActive;
    for (let i = 0; i < newdata[compid].assessList.length; i++) {
      if (assessActive == 0) {
        newdata[compid].assessList[i].assess_info.has_img == 1 ? showAssess.push(newdata[compid].assessList[i]) : null;
      } else if (newdata[compid].assessList[i].assess_info.level == assessActive) {
        showAssess.push(newdata[compid].assessList[i]);
      }
    }
    newdata[compid].showAssess = showAssess;
    pageInstance.setData(newdata)
  },
  showShoppingCartPop: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let dataset      = event.currentTarget.dataset;
    let compid       = dataset.compid;
    let newdata      = {};
    newdata[compid + '.shoppingCartShow'] = true;
    pageInstance.setData(newdata);
  },
  hideShoppingCart: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let dataset      = event.currentTarget.dataset;
    let compid       = dataset.compid;
    let newdata      = {};
    newdata[compid + '.shoppingCartShow'] = false;
    pageInstance.setData(newdata);
  },
  showGoodsDetail: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let data         = pageInstance.data;
    let dataset      = event.currentTarget.dataset;
    let newdata      = {};
    let id           = dataset.id;
    let index        = dataset.index;
    let compid       = dataset.compid;
    let category     = dataset.category;
    if (/tostore/.test(compid)) {
      let businessTime = data[compid].show_goods_data['category' + category][index].business_time.business_time;
      if(businessTime){
        let business_time = '';
        for (let key in businessTime){
          business_time += businessTime[key].start_time.slice(0, 2) + ':' + businessTime[key].start_time.slice(2, 4) + '-' + businessTime[key].end_time.slice(0, 2) + ':' + businessTime[key].end_time.slice(2, 4) + ' ';
        }
        data[compid].show_goods_data['category' + category][index].businessTime = business_time;
      }
      data[compid].show_goods_data['category' + category][index].des = this.getWxParseResult(data[compid].show_goods_data['category' + category][index].description)
    }
    newdata[compid + '.goodsDetailShow'] = true;
    newdata[compid + '.goodsDetail'] = data[compid].show_goods_data['category'+category][index];
    pageInstance.setData(newdata)
  },
  hideDetailPop: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let dataset      = event.currentTarget.dataset;
    let compid       = dataset.compid;
    let newdata      = {};
    newdata[compid + '.goodsDetailShow'] = false;
    pageInstance.setData(newdata);
  },
  hideModelPop: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let dataset      = event.currentTarget.dataset;
    let compid       = dataset.compid;
    let newdata      = {};
    newdata[compid + '.goodsModelShow'] = false;
    newdata[compid + '.modelPrice'] = 0;
    newdata[compid + '.modelChoose'] = [];
    newdata[compid + '.modelIdArr'] = [];
    pageInstance.setData(newdata);
  },
  chooseModel: function (event) {
    let pageInstance = this.getAppCurrentPage();
    let dataset      = event.currentTarget.dataset;
    let pIndex       = dataset.parentindex;
    let index        = dataset.index;
    let compid       = dataset.compid;
    let goodsid      = dataset.goodsid;
    let data         = pageInstance.data;
    let modelData    = data[compid].goods_model_list[goodsid].modelData;
    let newdata      = {};
    newdata[compid + '.modelChoose'] = data[compid].modelChoose;
    newdata[compid + '.modelIdArr'] = data[compid].modelIdArr;
    newdata[compid + '.modelChoose'][pIndex] = modelData[pIndex].subModelName[index];
    newdata[compid + '.modelIdArr'][pIndex] = modelData[pIndex].subModelId[index];
    pageInstance.setData(newdata);
    this._ModelPirce(dataset, [].concat(newdata[compid + '.modelIdArr']));
  },
  _ModelPirce: function (dataset, modelNameArr) {
    let pageInstance = this.getAppCurrentPage(),
        data = pageInstance.data,
        newdata = {},
        compid = dataset.compid,
        index = dataset.index,
        pIndex = dataset.pIndex,
        goods_model = data[compid].goods_model_list[dataset.goodsid].goods_model,
        price = '';
    for(let i in goods_model){
      if (goods_model[i].model.split(',').sort().join(',') == modelNameArr.sort().join(',')) {
        newdata[compid + '.modelChooseId'] = i;
        newdata[compid + '.modelPrice'] = goods_model[i].price;
      }
    }
    pageInstance.setData(newdata)
  },
  sureChooseModel: function (event) {
    clearTimeout(this.takeoutTimeout);
    let pageInstance = this.getAppCurrentPage();
    let dataset      = event.currentTarget.dataset;
    let data         = pageInstance.data;
    let newdata      = {};
    let compid       = dataset.compid;
    let goodsid      = data[compid].modelGoodsId;
    let price        = +data[compid].modelPrice;
    let modelId      = data[compid].modelChooseId;
    let modelIdArr   = data[compid].modelIdArr;
    let thisModelInfo = data[compid].goods_model_list[goodsid].goods_model[modelId];
    if (!data[compid].modelPrice) {
      this.showModal({
        content: '请选择规格'
      });
      return;
    }
    if (thisModelInfo.stock <= thisModelInfo.totalNum) {
      this.showModal({
        content: '该规格库存不足'
      });
      return
    }
    newdata[compid + '.cartGoodsIdList'] = data[compid].cartGoodsIdList;
    let goods_num = thisModelInfo.totalNum + 1;
    newdata[compid + '.goods_data_list.'+goodsid] = data[compid].goods_data_list[goodsid];
    newdata[compid + '.goods_data_list.'+goodsid].totalNum = data[compid].goods_data_list[goodsid].totalNum + 1;
    newdata[compid + '.goods_data_list.'+goodsid].goods_model[modelId] = thisModelInfo
    newdata[compid + '.goods_data_list.'+goodsid].goods_model[modelId].totalNum++
    newdata[compid + '.TotalPrice'] = (Number(data[compid].TotalPrice) + Number(price)).toFixed(2);
    newdata[compid + '.isDeliver'] = (+data[compid].shopInfo.min_deliver_price - newdata[compid + '.TotalPrice']).toFixed(2);
    newdata[compid + '.TotalNum'] = ++data[compid].TotalNum;
    newdata[compid + '.goodsModelShow'] = false;
    newdata[compid + '.modelPrice'] = 0;
    newdata[compid + '.cartList.'+ goodsid] = data[compid].cartList[goodsid] || {};
    newdata[compid + '.cartList.' + goodsid][modelId] = {
      modelName: data[compid].modelChoose.join(' | '),
      modelId: modelId,
      num: goods_num,
      price: price,
      id: goodsid,
      gooodsName: data[compid].goods_data_list[goodsid].name,
      totalPrice: (data[compid].goods_model_list[goodsid].goods_model[modelId].totalNum * price).toFixed(2),
      stock: data[compid].goods_model_list[goodsid].goods_model[modelId].stock,
      cart_id: 0
    }
    if (newdata[compid + '.cartGoodsIdList'].indexOf(+goodsid) == -1) {
      newdata[compid + '.cartGoodsIdList'].push(+goodsid);
    }
    newdata[compid + '.modelPrice'] = 0;
    newdata[compid + '.modelChoose'] = [];
    pageInstance.setData(newdata);
    this.takeoutTimeout = setTimeout(() => {
      let options = {
        goods_type: /waimai/.test(compid) ? 2 : 3,
        cartListData: pageInstance.data[compid].cartList,
        thisPage: pageInstance,
        compid: compid
      }
      this._addTakeoutCart(options, this.eachCartList(options))
    }, 300)
  },
  clickChooseComplete: function (event) {
    clearTimeout(this.takeoutTimeout);
    let pageInstance    = this.getAppCurrentPage();
    let compid          = event.target.dataset.compid;
    let newData         = pageInstance.data;
    let takeoutGoodsArr = newData[compid].cartList;
    let idArr           = [];
    if (!newData[compid].TotalNum) {
      return;
    }
    if (/waimai/.test(compid)) {
      if (+newData[compid].shopInfo.min_deliver_price > +newData[compid].TotalPrice) {
        this.showModal({
          content: '还没达到起送价哦'
        });
        return;
      }
    }
    this.takeoutTimeout = setTimeout(() => {
      let options = {
        goods_type: /waimai/.test(compid) ? 2 : 3,
        cartListData: pageInstance.data[compid].cartList,
        thisPage: pageInstance,
        compid: compid
      }
      this._addTakeoutCart(options, this.eachCartList(options), (idArr) => {
        if (/waimai/.test(compid)) {
          this.turnToPage('/orderMeal/pages/previewTakeoutOrder/previewTakeoutOrder?cart_arr=' + idArr)
        } else if (/tostore/.test(compid)) {
          pageInstance.returnToVersionFlag = true;
          this.turnToPage('/orderMeal/pages/previewOrderDetail/previewOrderDetail?cart_arr=' + idArr)
        }
      })
    }, 300);
  },
  reLocalAddress: function (event) {
    let dataset = event.currentTarget.dataset;
    this.globalData.takeoutRefresh = true;
    this.globalData.takeoutAddressInfoByLatLng = dataset.latlng;
    this.turnToPage('/eCommerce/pages/searchAddress/searchAddress?from=takeout&locateAddress=' + dataset.address + '&compid=' + dataset.compid);
  },
  tapGoodsTradeHandler: function (event) {
    if (event.currentTarget.dataset.eventParams) {
      let goods = JSON.parse(event.currentTarget.dataset.eventParams),
          goods_id = goods['goods_id'],
          goods_type = goods['goods_type'];
      if (!!goods_id) {
        goods_type == 3 ? this.turnToPage('/pages/toStoreDetail/toStoreDetail?detail=' + goods_id)
          : this.turnToPage('/pages/goodsDetail/goodsDetail?detail=' + goods_id);
      }
    }
  },
  tapVideoHandler: function (event) {
    if (event.currentTarget.dataset.eventParams) {
      let video = JSON.parse(event.currentTarget.dataset.eventParams),
        video_id = video['video_id'];
      this.turnToPage('/video/pages/videoDetail/videoDetail?detail=' + video_id);
    }
  },
  tapVideoPlayHandler:function(event){
    let pageInstance  = this.getAppCurrentPage(),
        video = JSON.parse(event.currentTarget.dataset.eventParams),
        compid = video.compid,
        video_id = video['video_id'];
    this.sendRequest({
      url: '/index.php?r=AppVideo/GetVideoLibURL',
      method: 'get',
      data: {id:video_id},
      success: function (res) {
        let newdata ={}
        newdata[compid +'.videoUrl'] = res.data;
        pageInstance.setData(newdata);
      }
    })
  },
  tapInnerLinkHandler: function (event) {
    let param = event.currentTarget.dataset.eventParams,
        pageRoot = {
          'groupCenter': '/eCommerce/pages/groupCenter/groupCenter',
          'shoppingCart': '/eCommerce/pages/shoppingCart/shoppingCart',
          'myOrder': '/eCommerce/pages/myOrder/myOrder',
        };
    if (param) {
      param = JSON.parse(param);
      let pageLink = param.inner_page_link;
      let url = pageRoot[pageLink] ? pageRoot[pageLink] : '/pages/' + pageLink + '/' + pageLink ;
      if (url.indexOf('/prePage/') >= 0) {
        this.turnBack();
      } else if (url) {
        let is_redirect = param.is_redirect == 1 ? true : false;
        let pageRouter = this.getAppCurrentPage().page_router;

        if(pageRouter == this.globalData.homepageRouter || this.getTabPagePathArr().indexOf('/' + pageRouter) !== -1 ){
          is_redirect = false;
        }
        this.turnToPage(url, is_redirect);
      }
    }
  },
  tapPluginLinkLoading: false,
  tapPluginLinkHandler: function (event){
    let param = event.currentTarget.dataset.eventParams;
    let that = this;
    param = JSON.parse(param);
    if (that.tapPluginLinkLoading){
      return ;
    }
    that.tapPluginLinkLoading = true;
    this.sendRequest({
      url: '/index.php?r=pc/OpenPlugin/GetPluginInfo',
      data: {
        'plugin_name': param['plugin-name']
      },
      success: function (res) {
        let page = res.data.plugin_home_page;
        that.turnToPage('/openPlugin/' + res.data.plugin_name + '/pages/' + page + '/' + page);
      },
      complete: function () {
        that.tapPluginLinkLoading = false;
      }
    });
  },
  tapToPluginHandler: function (event) {
    let param = event.currentTarget.dataset.eventParams;
    if (param) {
      param = JSON.parse(param);
      let url = param.plugin_page;
      if (url) {
        let is_redirect = param.is_redirect == 1 ? true : false;
        this.turnToPage(url, is_redirect);
      }
    }
  },
  tapPhoneCallHandler: function (event) {
    let dataset = event.currentTarget.dataset,
        compdata = dataset.compdata;

    if (compdata && compdata.customFeature.phoneNumberSource === 'dynamic'){
      let phone_num = dataset.realValue ? dataset.realValue[0].text : '';
      if(phone_num === ''){
        return;
      }
      this.makePhoneCall(phone_num);
      return;
    }
    if (dataset.eventParams) {
      let phone_num = JSON.parse(dataset.eventParams)['phone_num'];
      this.makePhoneCall(phone_num);
    }
  },
  tapNewClassifyShowSubClassify: function(event){
    let pageInstance = this.getAppCurrentPage();
    let compid       = event.currentTarget.dataset.compid;
    let compData     = pageInstance.data[compid];
    let index        = event.currentTarget.dataset.index;
    let newdata      = {};
    newdata[compid + '.selectedIndex'] = index;
    if (compData.selectedIndex === index){
      newdata[compid + '.showSubClassify'] = !compData.showSubClassify;
    } else {
      newdata[compid + '.showSubClassify'] = true;
    }
    pageInstance.setData(newdata);
  },
  tapNewClassifyRefreshHandler: function(event, componentId, categoryId, pageIn){
    let pageInstance = pageIn || this.getAppCurrentPage();
    let compid       = componentId || event.currentTarget.dataset.compid;
    let compData     = pageInstance.data[compid];
    let newData      = {};
    let eventParams  = {
      refresh_object: compData.customFeature.refresh_object,
      index_segment: 'category',
      index_value: categoryId === undefined ? event.currentTarget.dataset.categoryId : categoryId
    };
    if(event && event.currentTarget && event.currentTarget.dataset.index !== undefined){
      newData[compid + '.selectedIndex'] = event.currentTarget.dataset.index;
    }
    newData[compid + '.selectedCateId'] = eventParams.index_value;
    newData[compid + '.showSubClassify'] = false;
    pageInstance.setData(newData);
    this.tapRefreshListHandler(null, eventParams);
  },
  tapRefreshListHandler: function (event, params) {
    let pageInstance  = this.getAppCurrentPage();
    let eventParams   = params || JSON.parse(event.currentTarget.dataset.eventParams);
    let refreshObject = eventParams.refresh_object;
    let compids_params;
    if (eventParams.parent_type == 'classify') {
      var classify_selected_index = {};
      classify_selected_index[eventParams.parent_comp_id + '.customFeature.selected'] = eventParams.item_index;
      pageInstance.setData(classify_selected_index);
    }

    if ((compids_params = pageInstance.goods_compids_params).length) {
      for (let index in compids_params) {
        if (compids_params[index].param.id === refreshObject) {
          this._refreshPageList('goods-list', eventParams, compids_params[index], pageInstance);
          return;
        }
      }
    }
    if ((compids_params = pageInstance.list_compids_params).length) {
      for (let index in compids_params) {
        if (compids_params[index].param.id === refreshObject) {
          this._refreshPageList('list-vessel', eventParams, compids_params[index], pageInstance);
          return;
        }
      }
    }
    if ((compids_params = pageInstance.franchiseeComps).length) {
      for (let index in compids_params) {
        if (compids_params[index].param.id === refreshObject) {
          this._refreshPageList('franchisee-list', eventParams, compids_params[index], pageInstance);
          return;
        }
      }
    }
    if ((compids_params = pageInstance.topicComps).length) {
      for (let index in compids_params) {
        if (compids_params[index].param.id === refreshObject) {
          eventParams.index_segment = pageInstance.data[eventParams.comp_id].customFeature.plateId;
          this._refreshPageList('topic-list', eventParams, compids_params[index], pageInstance);
          return;
        }
      }
    }
    if ((compids_params = pageInstance.newsComps).length) {
      for (let index in compids_params) {
        if (compids_params[index].param.id === refreshObject) {
          this._refreshPageList('news-list', eventParams, compids_params[index], pageInstance);
          return;
        }
      }
    }
  },
  _refreshPageList: function (eleType, eventParams, compids_params, pageInstance) {
    let index_value = eventParams.index_value == -1 ? '' : eventParams.index_value;
    let requestData = {
      page: 1,
      form: compids_params.param.form,
      is_integral: compids_params.param.is_integral,
      is_count: compids_params.param.form && compids_params.param.form.is_count ? 1 : 0,
      idx_arr: {
        idx: eventParams.index_segment,
        idx_value: index_value
      }
    };
    let newdata = {};
    newdata[compids_params['compid'] + '.is_search'] = false;
    pageInstance.setData(newdata);
    
    compids_params.param.idx_arr = requestData.idx_arr;
    
    if (eleType === 'goods-list' || eleType === 'list-vessel' || eleType === 'topic-list') {
      let customFeature = pageInstance.data[compids_params.compid].customFeature;
      requestData.page_size = customFeature.loadingNum || 10;
    }
    switch (eleType) {
      case 'goods-list': this._refreshGoodsList(compids_params['compid'], requestData, pageInstance); break;
      case 'list-vessel': this._refreshListVessel(compids_params['compid'], requestData, pageInstance); break;
      case 'franchisee-list': this._refreshFranchiseeList(compids_params['compid'], requestData, pageInstance); break;
      case 'topic-list': this._refreshTopicList(compids_params['compid'], requestData, pageInstance); break;
      case 'news-list': this._refreshNewsList(compids_params['compid'], requestData, pageInstance); break;
    }
  },
  _refreshGoodsList: function (targetCompId, requestData, pageInstance) {
    let _this = this;
    let customFeature = pageInstance.data[targetCompId].customFeature;
    let newData = {};

    newData[targetCompId + '.loading'] = true;
    newData[targetCompId + '.loadingFail'] = false;
    newData[targetCompId + '.is_more'] = 1;
    newData[targetCompId + '.goods_data'] = [];
    pageInstance.setData(newData);

    requestData.page_size = customFeature.loadingNum || 10;

    this.sendRequest({
      url: '/index.php?r=AppShop/GetGoodsList',
      method: 'post',
      hideLoading: true,
      data: requestData,
      success: function(res){
        let newData = {};
        for (let i in res.data) {
          if (res.data[i].form_data.goods_model) {
            let modelVP = [];
            for (let j in res.data[i].form_data.goods_model) {
              modelVP.push(res.data[i].form_data.goods_model[j].virtual_price == '' ? 0 : Number(res.data[i].form_data.goods_model[j].virtual_price))
            }
            Math.min(...modelVP) == Math.max(...modelVP) ? res.data[i].form_data.virtual_price = Math.min(...modelVP).toFixed(2) :
              res.data[i].form_data.virtual_price = Math.min(...modelVP).toFixed(2) + '~' + Math.max(...modelVP).toFixed(2);
          }
        }
        newData[targetCompId + '.goods_data'] = res.data;
        newData[targetCompId + '.is_more'] = res.is_more;
        newData[targetCompId + '.curpage'] = 1;
        newData[targetCompId + '.scrollTop'] = 0;
        newData[targetCompId + '.loading'] = false;
        newData[targetCompId + '.loadingFail'] = false;
        pageInstance.setData(newData);
      },
      fail: function (res) {
        let newData = {};
        newData[targetCompId + '.loadingFail'] = true;
        newData[targetCompId + '.loading'] = false;
        pageInstance.setData(newData);
      }
    })
  },
  _refreshListVessel: function (targetCompId, requestData, pageInstance) {
    let _this = this;
    let customFeature = pageInstance.data[targetCompId].customFeature;
    requestData.page_size = customFeature.loadingNum || 10;

    let newdata = {};
    newdata[targetCompId + '.loading'] = true;
    newdata[targetCompId + '.loadingFail'] = false;
    newdata[targetCompId + '.list_data'] = [];
    newdata[targetCompId + '.is_more'] = 1;
    pageInstance.setData(newdata);

    this.sendRequest({
      url: '/index.php?r=AppData/getFormDataList',
      method: 'post',
      data: requestData,
      hideLoading: true,
      success: function (res) {
        let newData = {};
        let listField = pageInstance.data[targetCompId].listField;
        for (let j in res.data) {
          for (let k in res.data[j].form_data) {
            if (k == 'category') {
              continue;
            }
            if(/region/.test(k)){
              continue;
            }
            if(k == 'goods_model') {
              res.data[j].form_data.virtual_price = _this.formVirtualPrice(res.data[j].form_data);
            }

            let description = res.data[j].form_data[k];
            if (listField.indexOf(k) < 0 && /<("[^"]*"|'[^']*'|[^'">])*>/.test(description)) { //没有绑定的字段的富文本置为空
              res.data[j].form_data[k] = '';
            }else if(_this.needParseRichText(description)) {
              res.data[j].form_data[k] = _this.getWxParseResult(description);
            }
            
          }
        }
        newData[targetCompId + '.list_data'] = res.data;
        newData[targetCompId + '.is_more'] = res.is_more;
        newData[targetCompId + '.curpage'] = 1;
        newData[targetCompId + '.scrollTop'] = 0;
        newData[targetCompId + '.loading'] = false;
        newData[targetCompId + '.loadingFail'] = false;
        pageInstance.setData(newData);
      },
      fail: function (res) {
        let newdata = {};
        newdata[targetCompId + '.loadingFail'] = true;
        newdata[targetCompId + '.loading'] = false;
        pageInstance.setData(newdata);
      }
    })
  },
  _refreshFranchiseeList: function (targetCompId, requestData, pageInstance) {
    let _this = this;
    let newdata = {};
    newdata[targetCompId + '.loading'] = true;
    newdata[targetCompId + '.loadingFail'] = false;
    newdata[targetCompId + '.franchisee_data'] = [];
    newdata[targetCompId + '.is_more'] = 1;
    pageInstance.setData(newdata);

    requestData.latitude = _this.globalData.locationInfo.latitude;
    requestData.longitude = _this.globalData.locationInfo.longitude;

    this.sendRequest({
      url: '/index.php?r=AppShop/GetAppShopByPage',
      method: 'post',
      data: requestData,
      success: function (res) {
        let newData = {};

        for(let index in res.data){
          let distance = res.data[index].distance;
          res.data[index].distance = util.formatDistance(distance);
        }
        newData[targetCompId + '.franchisee_data'] = res.data;
        newData[targetCompId + '.is_more'] = res.is_more;
        newData[targetCompId + '.curpage'] = 1;
        newData[targetCompId + '.scrollTop'] = 0;
        pageInstance.setData(newData);
      },
      fail: function (res) {
        let newdata = {};
        newdata[targetCompId + '.loadingFail'] = true;
        newdata[targetCompId + '.loading'] = false;
        pageInstance.setData(newdata);
      }
    })
  },
  _refreshTopicList: function (targetCompId, requestData, pageInstance) {
    let sectionId = requestData.idx_arr.idx || '',
      categoryId = requestData.idx_arr.idx_value || '';
    pageInstance.setData({
      [targetCompId + '.listStatus']: {
        loading: false,
        isMore: true
      }
    });
    this.getTopListData(pageInstance, { page: 1, section_id: sectionId, category_id: categoryId }, targetCompId);
  },
  _refreshNewsList: function (targetCompId, requestData, pageInstance) {
    pageInstance.setData({
      [targetCompId + '.pageObj']: {
        isLoading: false,
        noMore: false,
        page: 1
      },
      [targetCompId + '.selectedCateId']: requestData.idx_arr.idx_value
    });
    this.getNewsList({page: 1, compid: targetCompId, category_id: requestData.idx_arr.idx_value});
  },
  tapGetCouponHandler: function (event) {
    if (event.currentTarget.dataset.eventParams) {
      let coupon_id = JSON.parse(event.currentTarget.dataset.eventParams)['coupon_id'];
      this.turnToPage('/pages/couponDetail/couponDetail?detail=' + coupon_id);
    }
  },
  tapToCouponListHandler: function (event) {
    this.turnToPage('/eCommerce/pages/couponList/couponList');
  },
  tapCommunityHandler: function (event) {
    if (event.currentTarget.dataset.eventParams) {
      let community_id = JSON.parse(event.currentTarget.dataset.eventParams)['community_id'];
      if(!community_id){
        return;
      }
      this.turnToPage('/informationManagement/pages/communityPage/communityPage?detail=' + community_id);
    }
  },
  tapTopicHandler: function (event) {
    if (event.currentTarget.dataset.eventParams) {
      let topic_id = JSON.parse(event.currentTarget.dataset.eventParams)['topic_id'];
      if(!topic_id){
        return;
      }
      this.turnToPage('/informationManagement/pages/communityDetail/communityDetail?detail=' + topic_id);
    }
  },
  tapNewsHandler: function (event) {
    if (event.currentTarget.dataset.eventParams) {
      let news_id = JSON.parse(event.currentTarget.dataset.eventParams)['news_id'];
      if(!news_id){
        return;
      }
      this.turnToPage('/informationManagement/pages/newsDetail/newsDetail?detail=' + news_id);
    }
  },
  tapPageShareHandler: function (event) {
    // 页面二维码
    let pageInstance = this.getAppCurrentPage();
    let eventParams = JSON.parse(event.currentTarget.dataset.eventParams);
    let animation = wx.createAnimation({
      timingFunction: "ease",
      duration: 400,
    })
    let params = '';
    for (let i in pageInstance.sharePageParams) {
      params += '&' + i + '=' + pageInstance.sharePageParams[i]
    }
    let objId = pageInstance.route.split('/')[2] == 'newsDetail' ? pageInstance.options.detail : pageInstance.route.split('/')[2];
    let shareType = pageInstance.route.split('/')[2] == 'newsDetail' ? 17 : 11;
    this.sendRequest({
      url: '/index.php?r=AppShop/ShareQRCode',
      data: {
        obj_id: objId,
        type: shareType,
        text: eventParams.pageShareCustomText,
        goods_img: eventParams.pageShareImgUrl,
        params: params
      },
      success: function (res) {
        animation.bottom("0").step();
        pageInstance.setData({
          "pageQRCodeData.shareDialogShow": 0,
          "pageQRCodeData.shareMenuShow": true,
          "pageQRCodeData.imageUrl": res.data,
          "pageQRCodeData.animation": animation.export()
        })
      }
    })
  },
  turnToCommunityPage: function (event) {
    let id = event.currentTarget.dataset.id;
    this.turnToPage('/informationManagement/pages/communityPage/communityPage?detail=' + id);
  },
  tapToFranchiseeHandler: function (event) {
    let that = this;
    if (event.currentTarget.dataset.eventParams) {
      let franchisee_id = JSON.parse(event.currentTarget.dataset.eventParams)['franchisee_id'];
      that.sendRequest({
        url: '/index.php?r=AppShop/GetAppShopByAppId',
        data: {
          parent_app_id: that.getAppId(),
          sub_app_id: franchisee_id
        },
        success: function (res) {
          let data = res.data;
          if (data) {
            let mode = data.mode_id;
            let shop = '';
            let param = {};

            param.detail = franchisee_id;
            if (data.audit == 2) {
              param.shop_id = data.id;
            }
            that.goToFranchisee(mode, param);
          }
        }
      })
    }
  },
  tapToTransferPageHandler: function () {
    this.turnToPage('/eCommerce/pages/transferPage/transferPage');
  },
  tapToSeckillHandler: function (event) {
    if (event.currentTarget.dataset.eventParams) {
      let goods = JSON.parse(event.currentTarget.dataset.eventParams),
          seckill_id = goods['seckill_id'],
          seckill_type = goods['seckill_type'];
      if (!!seckill_id) {
        this.turnToPage('/pages/goodsDetail/goodsDetail?goodsType=seckill&detail=' + seckill_id);
      }
    }
  },
  tapToPromotionHandler: function (event) {
    this._isOpenPromotion();
  },
  _isOpenPromotion: function () {
    let that = this;
    this.sendRequest({
      url: '/index.php?r=AppDistribution/getDistributionInfo',
      success: function (res) {
        if(res.data){
          that._isPromotionPerson();
          that.globalData.getDistributionInfo = res.data;
        }else{
          that.showModal({
            content: '暂未开启推广'
          })
        }
      }
    })
  },
  _isPromotionPerson: function () {
    let that = this;
    this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppDistribution/getDistributorInfo',
      success: function (res) {
        if (res.data){
          that.turnToPage('/promotion/pages/promotionUserCenter/promotionUserCenter');
          that.globalData.getDistributorInfo = res.data;
        }else{
          that.turnToPage('/promotion/pages/promotionApply/promotionApply');
        }
      }
    })
  },
  tapToCouponReceiveListHandler: function () {
    this.turnToPage('/eCommerce/pages/couponReceiveListPage/couponReceiveListPage');
  },
  tapToRechargeHandler: function () {
    this.turnToPage('/eCommerce/pages/recharge/recharge');
  },
  tapToXcx: function (event) {
    if(event.currentTarget.dataset.eventParams){
      let params = JSON.parse(event.currentTarget.dataset.eventParams);
      this.navigateToXcx({
        appId: params['xcx_appid'],
        path: params['xcx_page_url']
      });
    }
  },
  tapFranchiseeLocation: function (event) {
    let _this        = this;
    let compid       = event.currentTarget.dataset.compid;
    let pageInstance = this.getAppCurrentPage();

    function success(res) {
      let name    = res.name || res.address || ' ';
      let lat     = res.latitude;
      let lng     = res.longitude;
      let newdata = {};
      let param, requestData;

      newdata[compid +'.location_address'] = name;
      pageInstance.setData(newdata);

      for (let index in pageInstance.franchiseeComps) {
        if (pageInstance.franchiseeComps[index].compid == compid) {
          param = pageInstance.franchiseeComps[index].param;
          param.latitude = lat;
          param.longitude = lng;
        }
      }
      requestData = {
        id: compid,
        form: 'app_shop',
        page: 1,
        sort_key: param.sort_key,
        sort_direction: param.sort_direction,
        latitude: param.latitude,
        longitude: param.longitude,
        idx_arr: param.idx_arr
      }

      _this._refreshFranchiseeList(compid, requestData, pageInstance);

      _this.sendRequest({
        url: '/index.php?r=Map/GetAreaInfoByLatAndLng',
        data: {
          latitude: lat,
          longitude: lng
        },
        success: function (data) {

          _this.setLocationInfo({
            latitude: lat,
            longitude: lng,
            address: name,
            info: data.data
          });
        }
      });
    }

    function cancel() {
      console.log('cancel');
    }

    function fail() {
      console.log('fail');
    }
    this.chooseLocation({
      success: success,
      fail: fail,
      cancel: cancel
    });
  },
  popupWindowControlHandler: function(event){
    let pageInstance = this.getAppCurrentPage();
    let windowControl = JSON.parse(event.currentTarget.dataset.eventParams).windowControl;
    let newData = {};
    let windowCompId, windowCustomFeature;

    for (let windowConfig of pageInstance.popupWindowComps) {
      if (windowConfig.id === windowControl.popupWindowId) {
        windowCompId = windowConfig.compid;
        windowCustomFeature = pageInstance.data[windowCompId].customFeature;
      }
    }
    if (windowControl.action === 'show') {
      newData[windowCompId+'.showPopupWindow'] = true;
    } else if (windowControl.action === 'hide') {
      newData[windowCompId+'.showPopupWindow'] = false;
    }
    pageInstance.setData(newData);

    if (windowCustomFeature.autoClose === true) {
      setTimeout(() => {
        newData[windowCompId+'.showPopupWindow'] = false;
        pageInstance.setData(newData);
      }, +windowCustomFeature.closeDelay*1000);
    }
  },
  tapMaskClosePopupWindow: function(event){
    let pageInstance = this.getAppCurrentPage();
    let compdata = event.currentTarget.dataset.compdata;
    let newData = {};

    if(compdata.customFeature.tapMaskClose === true){
      newData[compdata.compId+'.showPopupWindow'] = false;
      pageInstance.setData(newData);
    }
  },
  showGoodsShoppingcart: function(event) {
    let pageInstance = this.getAppCurrentPage();
    let dataset = event.currentTarget.dataset;
    let goodsId = dataset.id;
    let buynow = dataset.buynow;
    let showVirtualPrice = dataset.isshowvirtualprice || '';
    let newData = {
      goodsId: goodsId,
      showBuynow: buynow,
      showVirtualPrice: showVirtualPrice
    }
    pageInstance.selectComponent('#component-goodsShoppingCart').showDialog(newData);
  },
  showAddShoppingcart: function (event) {
    let _this = this;
    let pageInstance = this.getAppCurrentPage();
    let dataset      = event.currentTarget.dataset;
    let goods_id     = dataset.id;
    this.sendRequest({
      url: '/index.php?r=AppShop/getGoods',
      data: {
        data_id: goods_id
      },
      method: 'post',
      success: function (res) {
        if (res.status == 0) {
          let goods         = res.data[0].form_data;
          let defaultSelect = goods.model_items[0];
          let goodsModel    = [];
          let selectModels  = [];
          let goodprice     = 0;
          let goodstock     = 0;
          let goodid;
          let selectText    = '';
          let goodimgurl    = '';
          if (goods.model_items.length) {
            goodprice = defaultSelect.price;
            goodstock = defaultSelect.stock;
            goodid = defaultSelect.id;
            goodimgurl = defaultSelect.img_url;
          } else {
            goodprice = goods.price;
            goodstock = goods.stock;
            goodimgurl = goods.cover;
          }
          for (let key in goods.model) {
            if (key) {
              let model = goods.model[key];
              goodsModel.push(model);
              selectModels.push(model.subModelId[0]);
              selectText += '“' + model.subModelName[0] + '” ';
            }
          }
          goods.model = goodsModel;
          if (goods.goods_type == 3) {
            let businesssTimeString = '';
            if (goods.business_time && goods.business_time.business_time) {
              let goodBusinesssTime = goods.business_time.business_time;
              for (let i = 0; i < goodBusinesssTime.length; i++) {
                businesssTimeString += goodBusinesssTime[i].start_time.substring(0, 2) + ':' + goodBusinesssTime[i].start_time.substring(2, 4) + '-' + goodBusinesssTime[i].end_time.substring(0, 2) + ':' + goodBusinesssTime[i].end_time.substring(2, 4) + '/';
              }
              businesssTimeString = '出售时间：' + businesssTimeString.substring(0, businesssTimeString.length - 1);
              pageInstance.setData({

              })
            }
            pageInstance.getCartList();
            pageInstance.setData({
              'addTostoreShoppingCartShow': true,
              businesssTimeString: businesssTimeString
            })
          }
          pageInstance.setData({
            goodsInfo: goods ,
            'selectGoodsModelInfo.price': goodprice,
            'selectGoodsModelInfo.stock': goodstock,
            'selectGoodsModelInfo.buyTostoreCount': 0,
            'selectGoodsModelInfo.cart_id':'',
            'selectGoodsModelInfo.models': selectModels,
            'selectGoodsModelInfo.modelId': goodid || '',
            'selectGoodsModelInfo.models_text' : selectText,
            'selectGoodsModelInfo.imgurl' : goodimgurl
          });
        }
      }
    });
  },
  hideAddShoppingcart: function () {
    let pageInstance = this.getAppCurrentPage();
    pageInstance.setData({
      addShoppingCartShow: false,
      addTostoreShoppingCartShow:false
    });
  },
  selectGoodsSubModel: function (event) {
    let pageInstance  = this.getAppCurrentPage();
    let dataset       = event.target.dataset;
    let modelIndex    = dataset.modelIndex;
    let submodelIndex = dataset.submodelIndex;
    let data          = {};
    let selectModels  = pageInstance.data.selectGoodsModelInfo.models;
    let model         = pageInstance.data.goodsInfo.model;
    let text          = '';

    selectModels[modelIndex] = model[modelIndex].subModelId[submodelIndex];

    for (let i = 0; i < selectModels.length; i++) {
      let selectSubModelId = model[i].subModelId;
      for (let j = 0; j < selectSubModelId.length; j++) {
        if( selectModels[i] == selectSubModelId[j] ){
          text += '“' + model[i].subModelName[j] + '” ';
        }
      }
    }
    data['selectGoodsModelInfo.models'] = selectModels;
    data['selectGoodsModelInfo.models_text'] = text;

    pageInstance.setData(data);
    pageInstance.resetSelectCountPrice();
  },
  resetSelectCountPrice: function () {
    let pageInstance   = this.getAppCurrentPage();
    let selectModelIds = pageInstance.data.selectGoodsModelInfo.models.join(',');
    let modelItems     = pageInstance.data.goodsInfo.model_items;
    let data           = {};
    let cover          = pageInstance.data.goodsInfo.cover;

    data['selectGoodsModelInfo.buyCount'] = 1;
    data['selectGoodsModelInfo.buyTostoreCount'] = 0;
    for (let i = modelItems.length - 1; i >= 0; i--) {
      if(modelItems[i].model == selectModelIds){
        data['selectGoodsModelInfo.stock'] = modelItems[i].stock;
        data['selectGoodsModelInfo.price'] = modelItems[i].price;
        data['selectGoodsModelInfo.modelId'] = modelItems[i].id || '';
        data['selectGoodsModelInfo.imgurl'] = modelItems[i].img_url || cover;
        data['selectGoodsModelInfo.virtual_price'] = modelItems[i].virtual_price
        break;
      }
    }
    pageInstance.setData(data);
  },
  //到店弹窗
  clickTostoreMinusButton: function () {
    let pageInstance = this.getAppCurrentPage();
    let count        = pageInstance.data.selectGoodsModelInfo.buyTostoreCount;
    if (count <= 0) {
      return;
    }
    if (count <= 1) {
      this.sendRequest({
        hideLoading: true,
        url: '/index.php?r=AppShop/deleteCart',
        method: 'post',
        data: {
          cart_id_arr: [pageInstance.data.selectGoodsModelInfo.cart_id],
          sub_shop_app_id: pageInstance.franchiseeId || ''
        }
      });
      pageInstance.setData({
        'selectGoodsModelInfo.buyTostoreCount': count - 1
      });
      this.getTostoreCartList();
      return;
    }
    pageInstance.setData({
      'selectGoodsModelInfo.buyTostoreCount': count
    });
    this._sureAddTostoreShoppingCart('mins');
  },
  clickTostorePlusButton: function () {
    let pageInstance         = this.getAppCurrentPage();
    let selectGoodsModelInfo = pageInstance.data.selectGoodsModelInfo;
    let count                = selectGoodsModelInfo.buyTostoreCount;
    let stock                = selectGoodsModelInfo.stock;

    if (count >= stock) {
      this.showModal({
        content: '库存不足'
      });
      return;
    }
    pageInstance.setData({
      'selectGoodsModelInfo.buyTostoreCount': count
    });
    this._sureAddTostoreShoppingCart('plus');
  },
  _sureAddTostoreShoppingCart: function (type) {
    let pageInstance = this.getAppCurrentPage();
    let that         = this;
    let goodsNum     = pageInstance.data.selectGoodsModelInfo.buyTostoreCount;
    if (type == 'plus') {
      goodsNum = goodsNum + 1;
    } else {
      goodsNum = goodsNum - 1;
    }
    let param = {
      goods_id: pageInstance.data.goodsInfo.id,
      model_id: pageInstance.data.selectGoodsModelInfo.modelId || '',
      num: goodsNum,
      sub_shop_app_id: ''
    };

    that.sendRequest({
      url: '/index.php?r=AppShop/addCart',
      data: param,
      success: function (res) {
        let data = res.data;
        pageInstance.setData({
          'selectGoodsModelInfo.cart_id': data,
          'selectGoodsModelInfo.buyTostoreCount': goodsNum
        });
        that.getTostoreCartList();
      },
      successStatusAbnormal: function (res) {
        pageInstance.setData({
          'selectGoodsModelInfo.buyTostoreCount': 0
        });
        that.showModal({
          content: res.data
        })
      }
    })
  },
  readyToTostorePay: function () {
    let pageInstance = this.getAppCurrentPage();
    let franchiseeId = pageInstance.franchiseeId;
    let pagePath = '/orderMeal/pages/previewOrderDetail/previewOrderDetail' + (franchiseeId ? '?franchisee=' + franchiseeId : '');
    if (pageInstance.data.cartGoodsNum <= 0 || !pageInstance.data.tostoreTypeFlag) {
      return;
    }
    this.turnToPage(pagePath);
    pageInstance.hideAddShoppingcart();
  },
  getValidateTostore: function () {
    let pageInstance = this.getAppCurrentPage();
    let that         = this;
    this.sendRequest({
      url: '/index.php?r=AppShop/precheckShoppingCart',
      data: {
        sub_shop_app_id: pageInstance.franchiseeId || '',
        parent_shop_app_id: pageInstance.franchiseeId ? that.getAppId() : ''
      },
      success: function (res) {
        that.readyToTostorePay();
      },
      successStatusAbnormal: function (res) {
        that.showModal({
          content: res.data,
          confirm: function () {
            res.status === 1 && that.goToShoppingCart();
          }
        })
      }
    })
  },
  goToShoppingCart: function () {
    let pageInstance = this.getAppCurrentPage();
    let franchiseeId = pageInstance.franchiseeId;
    let pagePath = '/eCommerce/pages/shoppingCart/shoppingCart' + (franchiseeId ? '?franchisee=' + franchiseeId : '');
    pageInstance.hideAddShoppingcart();
    this.turnToPage(pagePath);
  },
  getTostoreCartList: function () {
    let pageInstance = this.getAppCurrentPage();
    this.sendRequest({
      url: '/index.php?r=AppShop/cartList',
      data: {
        page: 1,
        page_size: 100,
        sub_shop_app_id: pageInstance.franchiseeId || ''
      },
      success: function (res) {
        let price = 0,
          num = 0,
          addToShoppingCartCount = 0,
          tostoreTypeFlag = false;

        for (let i = res.data.length - 1; i >= 0; i--) {
          let data = res.data[i];
          price += +data.num * +data.price;
          num += +data.num;
          if (data.goods_type == 3) {
            tostoreTypeFlag = true;
          }
          if (pageInstance.goodsId == data.goods_id) {
            addToShoppingCartCount = data.num;
            pageInstance.cart_id = data.id;
          }
        }
        pageInstance.setData({
          tostoreTypeFlag: tostoreTypeFlag,
          cartGoodsNum: num,
          cartGoodsTotalPrice: price.toFixed(2),
          addToShoppingCartCount: addToShoppingCartCount,

        });
      }
    })
  },
  turnToSearchPage: function (event) {
    let listid = event.target.dataset.listid;
    let param = '';
    let goodsListId = '';
    let pageInstance = this.getAppCurrentPage();
    if (listid) {
      let goodsCompids = pageInstance.goods_compids_params;
      for(let i in goodsCompids){
        if (listid == goodsCompids[i].param.id){
          goodsListId = goodsCompids[i].compid;
          break;
        }
      }
      let customFeature = pageInstance.data[goodsListId].customFeature;
      param = '&isHideStock=' + customFeature.isHideStock + '&isHideSales=' + customFeature.isHideSales + '&isShowVirtualPrice=' + customFeature.isShowVirtualPrice + '&isShoppingCart=' + customFeature.isShoppingCart + '&isBuyNow=' + customFeature.isBuyNow;
      if (customFeature.source && customFeature.source !== 'none'){
        param += '&category=' + customFeature.source;
      }
    }
    if (event.target.dataset.param) {
      this.turnToPage('/default/pages/advanceSearch/advanceSearch?param=' + event.target.dataset.param + param);
    } else {
      this.turnToPage('/default/pages/advanceSearch/advanceSearch?form=' + event.target.dataset.form + param);
    }
  },
  suspensionTurnToPage: function (event) {
    let router = event.currentTarget.dataset.router,
      pageRoot = {
        'groupCenter': '/eCommerce/pages/groupCenter/groupCenter',
        'shoppingCart': '/eCommerce/pages/shoppingCart/shoppingCart',
        'myOrder': '/eCommerce/pages/myOrder/myOrder',
      };
    this.turnToPage(pageRoot[router] || '/pages/' + router + '/' + router + '?from=suspension');
  },
  // 跳转大转盘
  tapToLuckyWheel: function (event) {
    this.turnToPage('/awardManagement/pages/luckyWheelDetail/luckyWheelDetail');
  },
  // 跳转大转盘
  tapToGoldenEggs: function (event) {
    this.turnToPage('/awardManagement/pages/goldenEggs/goldenEggs');
  },
  // 跳转刮刮乐
  tapToScratchCard: function (event) {
    this.turnToPage('/awardManagement/pages/scratch/scratch');
  },
  // 动态分类: 点击不同分类对应的数据
  tapDynamicClassifyFunc: function (event) {
    let _this = this;
    let pageInstance = this.getAppCurrentPage();
    let compId = event.currentTarget.dataset.compid;
    let level = event.currentTarget.dataset.level;
    let categoryId = event.currentTarget.dataset.categoryId;
    let hideSubclass = event.currentTarget.dataset.hideSubclass;
    let compData = pageInstance.data[compId];
    let currentClassifyLevel = compData.classifyType.charAt(5);
    let newData = {};
    if (hideSubclass == 1) {
      newData[compId + '.classifyAreaLevel2Show'] = false;
      pageInstance.setData(newData);
      return;
    }
    if (currentClassifyLevel == 2) {
      if (categoryId == '') {
        compData.currentCategory[0] = categoryId;
        newData[compId + '.classifyAreaLevel2Show'] = false;
      } else if (compData.currentCategory[level - 1] == categoryId) {
        newData[compId + '.classifyAreaLevel2Show'] = !compData['classifyAreaLevel2Show'];
      } else if(level == 1) {
        newData[compId + '.classifyAreaLevel2Show'] = true;
      } else if (level == 2) {
        newData[compId + '.classifyAreaLevel2Show'] = false;
      }
    }
    compData.currentCategory[level - 1] = categoryId;
    newData[compId + '.currentCategory'] = compData.currentCategory;
    pageInstance.setData(newData);
    if(compData.classifyType == 'level2-vertical-withpic'){
      if(level == 2){
        _this.turnToPage('/pages/classifyGoodsListPage/classifyGoodsListPage?form=' + compData.classifyGroupForm + '&category_id=' + categoryId, false);
      }
      return;
    }
    if (currentClassifyLevel != level) { // 点击非最后一级的分类不请求新数据
      return;
    }
    newData = {};
    newData[compId + '.loading'] = true;
    newData[compId + '.loadingFail'] = false;
    newData[compId + '.list_data'] = [];
    newData[compId + '.is_more'] = 1;
    pageInstance.setData(newData);

    // 根据groupId请求第一个分类绑定的数据
    let param = {
      page: 1,
      page_size: 15,
      form: compData.classifyGroupForm,
      idx_arr: {
        idx: 'category',
        idx_value: categoryId == -1 ? '' : categoryId
      }
    };
    param.page_size = compData.customFeature.loadingNum || 20;
    _this.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppData/getFormDataList',
      data: param,
      method: 'post',
      success: function (res) {
        let newdata = {};
        if (param.form !== 'form') { // 动态列表绑定表单则不调用富文本解析
          for (let j in res.data) {
            for (let k in res.data[j].form_data) {
              if (k == 'category') {
                continue;
              }
              if(/region/.test(k)){
                continue;
              }
              if(k == 'goods_model') {
                res.data[j].form_data.virtual_price = _this.formVirtualPrice(res.data[j].form_data);
              }

              let description = res.data[j].form_data[k];
              let listField = compData.listField;
              if (listField && listField.indexOf(k) < 0 && /<("[^"]*"|'[^']*'|[^'">])*>/.test(description)) { //没有绑定的字段的富文本置为空
                res.data[j].form_data[k] = '';
              } else if (_this.needParseRichText(description)) {
                res.data[j].form_data[k] = _this.getWxParseResult(description);
              }
            }
          }
        }
        newdata[compId + '.list_data'] = res.data;
        newdata[compId + '.is_more'] = res.is_more;
        newdata[compId + '.curpage'] = 1;
        newdata[compId + '.loading'] = false;
        newdata[compId + '.loadingFail'] = false;
        pageInstance.setData(newdata);
      },
      fail: function () {
        let newdata = {};
        newdata[compId + '.loadingFail'] = true;
        newdata[compId + '.loading'] = false;
        pageInstance.setData(newdata);
      }
    });
  },
  beforeSeckillDownCount: function (formData, page, path) {
    let _this = this,
        downcount ;
    downcount = _this.seckillDownCount({
      startTime : formData.server_time,
      endTime : formData.seckill_start_time,
      callback : function () {
        let newData = {};
        newData[path+'.seckill_start_state'] = 1;
        newData[path+'.server_time'] = formData.seckill_start_time;
        page.setData(newData);
        formData.server_time = formData.seckill_start_time;
        _this.duringSeckillDownCount(formData , page ,path);
      }
    } , page , path + '.downCount');

    return downcount;
  },
  duringSeckillDownCount: function (formData, page, path) {
    let _this = this,
        downcount;
    downcount = _this.seckillDownCount({
      startTime : formData.server_time,
      endTime : formData.seckill_end_time ,
      callback : function () {
        let newData = {};
        newData[path+'.seckill_start_state'] = 2;
        page.setData(newData);
      }
    } , page , path + '.downCount');

    return downcount;
  },
  seckillFunc: [],
  seckillInterval: '',
  seckillDownCount: function(opts, page, path){
    let that = this;
    let opt = {
      startTime: opts.startTime || null,
      endTime: opts.endTime || null,
      callback: opts.callback
    };
    let systemInfo = this.getSystemInfoData().system;
    let isiphone = systemInfo.indexOf('iOS') != -1;

    if (isiphone && /\-/g.test(opt.endTime)) {
      opt.endTime = opt.endTime.replace(/\-/g, '/');
    }
    if (isiphone && /\-/g.test(opt.startTime)) {
      opt.startTime = opt.startTime.replace(/\-/g, '/');
    }
    if (/^\d+$/.test(opt.endTime)) {
      opt.endTime = opt.endTime * 1000;
    }
    if (/^\d+$/.test(opt.startTime)) {
      opt.startTime = opt.startTime * 1000;
    }

    let target_date = new Date(opt.endTime);
    let current_date = new Date(opt.startTime);
    let interval;
    let difference = target_date - current_date;
    let data = {};
    let len = that.seckillFunc.length;
    data = {
      opts: opts,
      page: page,
      path: path,
      difference: difference,
      index: len
    }
    that.seckillFunc.push(data);

    if(!that.seckillInterval){
      that.seckillInterval = setInterval(function(){
        let newdata = {};
        let func = that.seckillFunc.concat();
        for (let i = 0; i < func.length; i++) {
          let f = func[i];
          let difference = f.difference;
          let _path = f.path;
          let _page = f.page;
          let router = _page.route;

          if (!newdata[router]){
            newdata[router] = {
              page: _page,
              data: {}
            }
          }
          if (difference < 0){
            let callback = func[i].opts.callback;
            if (callback && typeof callback === 'function') { callback(); };
            that.seckillFunc.splice(i, 1);
            continue;
          }
          let time = that.seckillCountTime(difference);
          newdata[router].data[_path + '.hours'] = time[0];
          newdata[router].data[_path + '.minutes'] = time[1];
          newdata[router].data[_path + '.seconds'] = time[2];

          that.seckillFunc[i].difference -= 1000;
        }
        for(let j in newdata){

          newdata[j].page.setData(newdata[j].data);
        }
      }, 1000);
    }

    return {
      isClear: false,
      clear: function () {
        if (this.isClear){
          return;
        }
        this.isClear = true;
        that.seckillFunc.splice(len, 1);
        if (that.seckillFunc.length == 0){
          clearInterval(that.seckillInterval);
          that.seckillInterval = '';
        }
      }
    };
  },
  seckillCountTime: function (difference){
    if (difference < 0) {
      return ['00', '00', '00'];
    }

    let _second = 1000,
      _minute = _second * 60,
      _hour = _minute * 60,
      time = [];

    let hours = Math.floor(difference / _hour),
      minutes = Math.floor((difference % _hour) / _minute),
      seconds = Math.floor((difference % _minute) / _second);

    hours = (String(hours).length >= 2) ? hours : '0' + hours;
    minutes = (String(minutes).length >= 2) ? minutes : '0' + minutes;
    seconds = (String(seconds).length >= 2) ? seconds : '0' + seconds;

    time[0] = hours;
    time[1] = minutes;
    time[2] = seconds;

    return time;
  },
  getAssessList: function (param) {
    param.url = '/index.php?r=AppShop/GetAssessList';
    this.sendRequest(param);
  },
  getOrderDetail: function (param) {
    param.url = '/index.php?r=AppShop/getOrder';
    this.sendRequest(param);
  },
  showUpdateTip: function () {
    this.showModal({
      title: '提示',
      content: '您的微信版本不支持该功能，请升级更新后重试'
    });
  },
  // 文字组件跳到地图
  textToMap: function (event) {
    let dataset = event.currentTarget.dataset;
    let latitude  = +dataset.latitude;
    let longitude = +dataset.longitude;
    let address = dataset.address;

    if(!latitude || !longitude){
      return ;
    }

    this.openLocation({
      latitude: latitude,
      longitude: longitude,
      address: address
    });
  },
  // 跳转到视频详情
  turnToVideoDetail : function(event) {
    let id = event.currentTarget.dataset.id;

    this.turnToPage('/video/pages/videoDetail/videoDetail?detail=' + id);
  },
  // 处理数字
  handlingNumber : function(num) {
    num = +num;
    if(num > 1000000){ //大于百万直接用万表示
      return Math.floor(num / 10000) + '万';
    }else if(num > 10000){ //大于一万小于百万的保留一位小数
      return (num / 10000).toString().replace(/([0-9]+.[0-9]{1})[0-9]*/,"$1") + '万';
    }else{
      return num;
    }
  },
  startPlayVideo: function(event) {
    let compid = event.currentTarget.dataset.compid;
    let id = 'videoele-' + compid;
    let video = wx.createVideoContext(id);
    let pageInstance = this.getAppCurrentPage();
    let newdata = {};

    newdata[compid + '.videoPoster'] = true;
    pageInstance.setData(newdata);

    video.play();
  },
  // 视频项目播放事件
  videoProjectPlay: function(e) {
    let compid = e.currentTarget.dataset.compid;
    let pageInstance = this.getAppCurrentPage();
    for (let i in pageInstance.data) {
      if (/video[\d]/.test(i) && i != compid) {
        let data = pageInstance.data[i];
        let old_id = 'videoele-' + data.compId;
        let old_video = wx.createVideoContext(old_id);
        old_video.pause();
      }
    }
  },
  // 视频项目暂停事件
  videoProjectPause: function(e) {
    // console.log(e);
  },
  audioElePlay: function(e){
    let compid = e.currentTarget.dataset.compid;
    let pageInstance = this.getAppCurrentPage();
    let audioCtx = wx.createAudioContext('audioele-' + compid);
    let isplay = pageInstance.data[compid].isplay;
    let newdata = {};
    if (isplay) {
      audioCtx.pause();
      newdata[compid + '.isplay'] = false;
    } else {
      audioCtx.play();
      newdata[compid + '.isplay'] = true;
    }
    pageInstance.setData(newdata);
  },
  needParseRichText: function(data) {
    if (typeof data == 'number') {
      return true;
    }
    if (typeof data == 'string') {
      if (!data) {
        return false;
      }
      if (!/^https?:\/\/(.*)\.(jpg|jpeg|png|gif|bmp|svg|swf)/g.test(data)) {
        return true;
      }
    }
    return false;
  },
  calculationDistanceByLatLng: function(lat1, lng1, lat2, lng2){
    const EARTH_RADIUS = 6378137.0;
    const PI = Math.PI;
    let a = (lat1 - lat2) * PI / 180.0;
    let b = (lng1 - lng2) * PI / 180.0;
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(lat1 * PI / 180.0) * Math.cos(lat2 * PI / 180.0) * Math.pow(Math.sin(b / 2), 2)));
    s  =  s * EARTH_RADIUS;
    s  =  Math.round(s * 10000) / 10000.0;
    return s;
  },
  franchiseeEnterHandler: function() {
    this.turnToPage('/franchisee/pages/franchiseeEnter/franchiseeEnter');
  },
  franchiseeCooperationHandler: function() {
    this.turnToPage('/franchisee/pages/franchiseeCooperation/franchiseeCooperation');
  },
  // 判断是否需要弹窗
  isNeedRewardModal: function () {
    let that = this;
    that.sendRequest({
      hideLoading: true,
      url: '/index.php?r=appShop/isNeedLogin',
      data: {},
      success: function (res) {
        if (res.status == 0 && res.data == 1) {
          that.goLogin({});
        }
      }
    });
  },
  loginForRewardPoint: function (addTime) {
    let that = this;
    that.sendRequest({
      hideLoading: true,
      url: '/index.php?r=appShop/getIntegralLog',
      data: { add_time: addTime, login: 1 },
      success: function (res) {
        if (res.status == 0) {
          let vipLevel = res.vip_level,
            rewardCount = res.data,
            pageInstance = that.getAppCurrentPage(),
            newData = {};
          if (rewardCount > 0 && vipLevel > 0) {
            newData.rewardPointObj = {
              showModal: true,
              count: rewardCount,
              callback: (vipLevel > 1 ? 'showVipUp' : 'showVip')
            }
            pageInstance.setData(newData);
          } else {
            if (rewardCount > 0) {
              newData.rewardPointObj = {
                showModal: true,
                count: rewardCount,
                callback: ''
              }
            }
            if (vipLevel > 0) {
              newData.shopVipModal = {
                showModal: true,
                isUp: vipLevel > 1
              }
            }
            pageInstance.setData(newData);
          }
        }
      }
    });
  },
  // 积分弹窗回调
  rewardPointCB: function (cbTy) {
    let that = this,
        pageInstance = that.getAppCurrentPage();
        pageInstance.setData({
          'rewardPointObj.showModal': false
        });
    switch (cbTy) {
      case 'turnBack'://回到上一个页面
        that.turnBack();
      break;
      case 'showVip'://成为会员
        pageInstance.setData({
          'shopVipModal': {
            showModal: true,
            isUp: false
          }
        });
      break;
      case 'showVipUp'://会员升级
        pageInstance.setData({
          'shopVipModal': {
            showModal: true,
            isUp: true
          }
        });
      break;
      default:
      break;
    }
  },
  shopVipModalCB(cbTy) {
    let that = this,
        pageInstance = that.getAppCurrentPage();
        pageInstance.setData({
          'shopVipModal.showModal': false
        });
  },
  // 获取我的店铺列表
  // reset 是否是重新加载
  getMyAppShopList: function (compid, pageInstance, reset) {
    let that = this;

    that.sendRequest({
      url: '/index.php?r=AppShop/GetMyAppShopList',
      data: {
        parent_app_id: that.getAppId()
      },
      hideLoading: true,
      success: function (res) {
        let newdata = {};
        let oldList = pageInstance.data[compid].franchisee_data || [];
        let list = res.data;
        let listId = [];
        if(reset){
          let l = 0;
          for (let i = 0; i < oldList.length; i++){
            if (oldList[i].is_audit == 2){
              l++;
            }else{
              break;
            }
          }
          oldList.splice(0, l);
        }
        for (let i = 0; i < list.length; i++){
          if (list[i].is_audit == 2){
            oldList.unshift(list[i]);
            listId.push(list[i].id);
          }
        }
        if(reset){
          for (let i = 0; i < oldList.length; i++) {
            if (oldList[i].is_audit == 1 && listId.indexOf(oldList[i].id) > -1 ) {
              oldList.splice(i, 1);
            }
          }
        }
        newdata[compid + '.franchisee_data'] = oldList;

        pageInstance.setData(newdata)
      }
    });
  },
  
  // 筛选组件 综合排序tab = 0
  sortByDefault: function (e) {
    let pageInstance = this.getAppCurrentPage();
    let compid = e.currentTarget.dataset.compid;
    let newdata = {};
    let goods_compids = pageInstance.goods_compids_params;
    let goods_compid = '';
    let param = {};
    let addGroup_object = pageInstance.data[compid].customFeature.addGroup_object;

    for(let i in goods_compids){
      if(goods_compids[i].param.id == addGroup_object){
        goods_compid = goods_compids[i].compid;
        param = goods_compids[i].param;
      }
    }

    newdata[compid + '.tab'] = 0;
    newdata[compid + '.sortKey'] = '';
    newdata[compid + '.sortDirection'] = '';
    newdata[goods_compid + '.curpage'] = 0;
    newdata[goods_compid + '.is_more'] = 1;
    newdata[goods_compid + '.goods_data'] = [];
    param.sort_key = '';
    param.sort_direction = '';
    
    pageInstance.setData(newdata);

    if(goods_compid == ''){
      this.showModal({
        content: '找不到关联的列表'
      });
      return;
    }

    this._goodsScrollFunc(goods_compid);

  },
  // 筛选组件 按销量排序 tab = 1
  sortBySales: function (e) {
    let pageInstance = this.getAppCurrentPage();
    let compid = e.currentTarget.dataset.compid;
    let newdata = {};
    let goods_compids = pageInstance.goods_compids_params;
    let goods_compid = '';
    let param = {};
    let addGroup_object = pageInstance.data[compid].customFeature.addGroup_object;

    for(let i in goods_compids){
      if(goods_compids[i].param.id == addGroup_object){
        goods_compid = goods_compids[i].compid;
        param = goods_compids[i].param;
      }
    }

    newdata[compid + '.tab'] = 1;
    newdata[compid + '.sortKey'] = 'sales';
    newdata[compid + '.sortDirection'] = 0;
    newdata[goods_compid + '.curpage'] = 0;
    newdata[goods_compid + '.is_more'] = 1;
    newdata[goods_compid + '.goods_data'] = [];
    param.sort_key = 'sales';
    param.sort_direction = 0;
    
    pageInstance.setData(newdata);

    if(goods_compid == ''){
      this.showModal({
        content: '找不到关联的列表'
      })
      return;
    }

    this._goodsScrollFunc(goods_compid);
  },
  // 筛选组件 按价格排序 tab = 2
  sortByPrice: function (e) {
    let pageInstance = this.getAppCurrentPage();
    let compid = e.currentTarget.dataset.compid;
    let newdata = {};
    let sd = pageInstance.data[compid].sortDirection;
    let goods_compids = pageInstance.goods_compids_params;
    let goods_compid = '';
    let param = {};
    let addGroup_object = pageInstance.data[compid].customFeature.addGroup_object;

    for(let i in goods_compids){
      if(goods_compids[i].param.id == addGroup_object){
        goods_compid = goods_compids[i].compid;
        param = goods_compids[i].param;
      }
    }

    sd = (!sd || sd == 0) ? 1 : 0

    newdata[compid + '.tab'] = 2;
    newdata[compid + '.sortKey'] = 'price';
    newdata[compid + '.sortDirection'] = sd;
    newdata[goods_compid + '.curpage'] = 0;
    newdata[goods_compid + '.is_more'] = 1;
    newdata[goods_compid + '.goods_data'] = [];
    param.sort_key = 'price';
    param.sort_direction = sd;
    
    pageInstance.setData(newdata);

    if(goods_compid == ''){
      this.showModal({
        content: '找不到关联的列表'
      })
      return;
    }

    this._goodsScrollFunc(goods_compid);
  },
  // 筛选组件 展示侧边筛选
  filterList: function(e){
    let pageInstance = this.getAppCurrentPage();
    let compid = e.currentTarget.dataset.compid;
    pageInstance.setData({
      filterShow: true,
      filterCompid: compid
    });
  },
  // 筛选侧栏确定
  filterConfirm: function(e){
    let detail = e.detail;
    let hasFilter = (detail.leastPrice || detail.mostPrice || detail.chooseCateId || detail.currentRegionId) ?  true : false;
    let pageInstance = this.getAppCurrentPage();
    let compid = pageInstance.data.filterCompid;
    let newdata = {};
    let goods_compids = pageInstance.goods_compids_params;
    let goods_compid = '';
    let param = {};
    let addGroup_object = pageInstance.data[compid].customFeature.addGroup_object;

    for (let i in goods_compids) {
      if (goods_compids[i].param.id == addGroup_object) {
        goods_compid = goods_compids[i].compid;
        param = goods_compids[i].param;
      }
    }
    let idx = detail.chooseCateId ? {
      idx: 'category',
      idx_value: detail.chooseCateId
    } : '';

    newdata[compid + '.hasFilter'] = hasFilter;
    newdata[goods_compid + '.curpage'] = 0;
    newdata[goods_compid + '.is_more'] = 1;
    newdata[goods_compid + '.goods_data'] = [];
    param.least_price = detail.leastPrice || '';
    param.most_price = detail.mostPrice || '';
    param.region_id = detail.currentRegionId || '';
    param.idx_arr = idx;

    pageInstance.setData(newdata);
    if(goods_compid == ''){
      this.showModal({
        content: '找不到关联的列表'
      })
      return;
    }
    this._goodsScrollFunc(goods_compid);
  },
  sidebarControlHandler: function(e){
    let pageInstance = this.getAppCurrentPage();
    let sidebarControl = JSON.parse(e.currentTarget.dataset.eventParams).sidebarControl;
    let newData = {};
    let sidebarCompId;

    for (let sidebarConfig of pageInstance.sidebarComps) {
      let sidebarCustomFeature = pageInstance.data[sidebarConfig.compid].customFeature
      if (sidebarCustomFeature.id === sidebarControl.sidebarId) {
        sidebarCompId = sidebarConfig.compid;
      }
    }
    if (sidebarControl.action === 'show') {
      newData[sidebarCompId + '.showSidebar'] = true;
    } else if (sidebarControl.action === 'hide') {
      newData[sidebarCompId + '.hideSidebar'] = true;
    }
    pageInstance.setData(newData);
  },
  tapMaskCloseSidebar: function(event){
    let pageInstance = this.getAppCurrentPage();
    let compdata = event.currentTarget.dataset.compdata;
    let newData = {};
    newData[compdata.compId + '.hideSidebar']= true;
    pageInstance.setData(newData);
  },
  hideCompeletSidebar: function(e){
    let pageInstance = this.getAppCurrentPage();
    let compid = e.target.dataset.compid;
    let data = {};
    if (/^hide/g.test(e.detail.animationName)) {
      data[compid + '.showSidebar'] = false;
      data[compid + '.hideSidebar'] = false;
      pageInstance.setData(data);
    }
  },
  animationEnd: function(e){
    let pageInstance = this.getAppCurrentPage();
    if (/^disappear_/g.test(e.detail.animationName)){
      let compid = e.target.dataset.compid;
      let data = {};

      data[compid+'.hidden'] = true;
      pageInstance.setData(data);
    }
  },
  checkCanUse: function(attr, dataName, compNameArr){
    let pageInstance = this.getAppCurrentPage();
    // let use = wx.canIUse(attr);
    let nowVersion = this.getSystemInfoData().SDKVersion || '2.0.7';
    let use = this.compareVersion(nowVersion, '2.0.7') > -1 ;
    let data = pageInstance.data;
    let canUseCompPath = [];
    let newdata = {};

    canUseCompPath = this.isCanUse(data, compNameArr, '');

    for(let i = 0; i < canUseCompPath.length; i++){
      newdata[canUseCompPath[i] + '.' + dataName] = use;
    }

    pageInstance.setData(newdata);
  },
  isCanUse: function(comp, compNameArr, path){
    let that = this;
    let canUseCompPath = [];
    for (let i in comp) {
      let cp = comp[i];
      let p = path == '' ? i : (path + '[' + i + ']');
      if (Object.prototype.toString.call(cp.content) == "[object Array]"){
        let r = that.isCanUse(cp.content, compNameArr, p + '.content');
        canUseCompPath = canUseCompPath.concat(r);
      } else if (Object.prototype.toString.call(cp.content) == "[object Object]"){
        for(let j in cp.content){
          let cpj = cp.content[j];
          let r = that.isCanUse(cpj, compNameArr, p + '.content.' + j );
          canUseCompPath = canUseCompPath.concat(r);
        }
      }
      if (compNameArr.indexOf(cp.type) > -1) {
        canUseCompPath.push(p);
      }
    }
    return canUseCompPath;
  },
  compareVersion: function(v1, v2) {
    v1 = v1.split('.')
    v2 = v2.split('.')
    var len = Math.max(v1.length, v2.length)
    while (v1.length < len) {
      v1.push('0')
    }
    while (v2.length < len) {
      v2.push('0')
    }
    for (var i = 0; i < len; i++) {
      var num1 = parseInt(v1[i])
      var num2 = parseInt(v2[i])
      if (num1 > num2) {
        return 1
      } else if (num1 < num2) {
        return -1
      }
    }
    return 0
  },
  // 排号
  isOpenRowNumber: function (pageInstance){
    let _this = this;
    for (let rowNumber of pageInstance.rowNumComps) {
      let newData = {};
      let compId = rowNumber.compid;
      this.sendRequest({
        url: '/index.php?r=AppTostore/getTostoreLineUpSetting',
        success: function (res) {
          if(res.status == 0){
            newData[compId + '.numbertypeData'] = res.data;
            pageInstance.setData(newData);
            _this.rowNumber(pageInstance, compId);
          }
        }
      });
    }
  },
  rowNumber: function (pageInstance, compId) {
    let _this = this;
    let newData = {};
    this.sendRequest({
      url: '/index.php?r=AppTostore/getLiningUpQueueByUserToken',
      method: 'post',
      success: function (res) {
        if (res.status == 0) {
          newData[compId + '.currentRowNumberData'] = res.data;
          pageInstance.setData(newData);
        }
      }
    })
  },
  showTakeNumberWindow: function (e) {
    let pageInstance = this.getAppCurrentPage();
    let compid = e.currentTarget.dataset.compid;
    let newData = {};
    newData[compid + '.selectRowNumberTypeId'] = '';
    newData[compid + '.isShowTakeNumberWindow'] = true;
    pageInstance.setData(newData);
  },
  hideTakeNumberWindow: function (e) {
    let pageInstance = this.getAppCurrentPage();
    let compid = e.currentTarget.dataset.compid;
    let newData = {};
    newData[compid + '.isShowTakeNumberWindow'] = false;
    pageInstance.setData(newData);
  },
  goToPreviewRowNumberOrder: function(e){
    let pageInstance = this.getAppCurrentPage();
    let compid = e.currentTarget.dataset.compid;
    let id = pageInstance.data[compid].selectRowNumberTypeId;
    let franchiseeId = pageInstance.franchiseeId;
    let newData = {};
    if (!id) {
      this.showToast({
        title: '请选择排号类型',
        icon: 'none'
      })
      return;
    }
    newData[compid + '.isShowTakeNumberWindow'] = false;
    pageInstance.setData(newData);
    this.turnToPage('/orderMeal/pages/previewRowNumberOrder/previewRowNumberOrder?detail=' + id + (franchiseeId ? '&franchisee=' + franchiseeId : ''));
  },
  selectRowNumberType: function(e){
    let pageInstance = this.getAppCurrentPage();
    let compid = e.currentTarget.dataset.compid;
    let newData = {};
    newData[compid + '.selectRowNumberTypeId'] = e.currentTarget.dataset.id;
    pageInstance.setData(newData);
  },
  sureTakeNumber: function(e){
    let that = this;
    let pageInstance = this.getAppCurrentPage();
    let compid = e.currentTarget.dataset.compid;
    let newData = {};
    let id = pageInstance.data[compid].selectRowNumberTypeId;
    if(!id){
      this.showToast({
        title: '请选择排号类型',
        icon: 'none'
      })
      return;
    }
    if (pageInstance.data[compid].isClick){return}
    newData[compid + '.isClick'] = true;
    pageInstance.setData(newData);
    this.sendRequest({
      url: '/index.php?r=AppTostore/addLineUpOrder',
      data: {
        line_up_type_id: id,
        formId: e.detail.formId,
        total_price: 0
      },
      method: 'post',
      success: function (res) {
        that.sendRequest({
          url: '/index.php?r=AppShop/paygoods',
          data: {
            order_id: res.data,
            total_price: 0
          },
          success: function (res) {
            newData[compid + '.isClick'] = false;
            newData[compid + '.isShowTakeNumberWindow'] = false;
            pageInstance.setData(newData);
            that.isOpenRowNumber(pageInstance);
            that.showToast({
              title: '取号成功，请耐心等待',
              icon: 'none'
            })
          }
        });
      }
    });
  },
  goToCheckRowNunberDetail: function(e){
    let pageInstance = this.getAppCurrentPage();
    let orderId = e.currentTarget.dataset.orderId;
    let franchiseeId = pageInstance.franchiseeId;
    this.turnToPage('/orderMeal/pages/checkRowNumberDetail/checkRowNumberDetail?orderId=' + orderId + (franchiseeId ? '&franchisee=' + franchiseeId : ''));
  },
  cancelCheckRowNunber: function(e){
    let that = this;
    let orderId = e.currentTarget.dataset.orderId;
    let pageInstance = this.getAppCurrentPage();
    let compid = e.currentTarget.dataset.compid;
    let newData = {};
    this.sendRequest({
      url: '/index.php?r=AppTostore/lineUpOrderRefund',
      method: 'post',
      data: {
        order_id: orderId
      },
      success: function (res) {
        that.isOpenRowNumber(pageInstance);
        newData[compid + '.isShowCancelWindow'] = false;
        pageInstance.setData(newData);
      }
    });
  },
  rowNumberRefresh: function(){
    let pageInstance = this.getAppCurrentPage();
    this.isOpenRowNumber(pageInstance);
  },
  showCancelWindow: function(e){
    let pageInstance = this.getAppCurrentPage();
    let compid = e.currentTarget.dataset.compid;
    let newData = {};
    newData[compid + '.isShowCancelWindow'] = true;
    pageInstance.setData(newData);
  },
  hideCancelWindow: function(e){
    let pageInstance = this.getAppCurrentPage();
    let compid = e.currentTarget.dataset.compid;
    let newData = {};
    newData[compid + '.isShowCancelWindow'] = false;
    pageInstance.setData(newData);
  },
  tapGetWxCouponHandler: function(event){
    let _this = this;
    let data = JSON.parse(event.currentTarget.dataset.eventParams)
    let wxcouponId = data.wxcoupon_id;
    this.sendRequest({
      url: '/index.php?r=appWeChatCoupon/getSignature',
      data: {
        card_id: wxcouponId
      },
      success: function (res) {
        wx.addCard({
          cardList: [
            {
              cardId: wxcouponId,
              cardExt: '{"nonce_str":"' + res.data.timestamp + '","timestamp":"' + res.data.timestamp + '", "signature":"' + res.data.signature + '"}'
            }
          ],
          success: function (res) {
            _this.sendRequest({
              url: '/index.php?r=appWeChatCoupon/recvCoupon',
              data: {
                code: res.cardList[0].code,
                card_id: res.cardList[0].cardId
              },
              success: function (res) {
                _this.showModal({
                  content: '领取卡券成功'
               })
              }
            });
          }
        })
      }
    });
  },
  tapVipListHandler: function(){
    let router = '/eCommerce/pages/vipCard/vipCard';
    this.turnToPage(router);
  },
  getAppECStoreConfig: function (callback) {
    let _this = this;
    if (this.globalData.goodsStoreConfig){
      callback(this.globalData.goodsStoreConfig);
      return;
    }
    this.sendRequest({
      url: '/index.php?r=appShop/getAppECStoreConfig',
      success: function (res) {
        _this.globalData.goodsStoreConfig = res.data;
        callback && callback(res.data)
      }
    })
  },
  goodsScanCodeHandler: function(){
    let path = '/eCommerce/pages/shoppingCart/shoppingCart?goodsScanCode=true';
    this.getAppECStoreConfig((res) => {
      if (res.cart_config.shopping_by_scanning_code == 1){
        this.turnToPage(path);
      }else{
        this.showModal({
          content: '暂未开通扫码购'
        })
      }
    })
  },





  /**
   *  全局参数get、set部分 start
   *
   */

  // 获取首页router
  getHomepageRouter: function () {
    return this.globalData.homepageRouter;
  },
  getAppId: function () {
    return this.globalData.appId;
  },
  getDefaultPhoto: function () {
    return this.globalData.defaultPhoto;
  },
  getSessionKey: function () {
    return this.globalData.sessionKey;
  },
  setSessionKey: function (session_key) {
    this.globalData.sessionKey = session_key;
    this.setStorage({
      key: 'session_key',
      data: session_key
    })
  },
  getUserInfo: function (key) {
    return key ? this.globalData.userInfo[key] : this.globalData.userInfo;
  },
  setUserInfoStorage: function (info) {
    for (let key in info) {
      this.globalData.userInfo[key] = info[key];
    }
    this.setStorage({
      key: 'userInfo',
      data: this.globalData.userInfo
    })
  },
  setPageUserInfo: function () {
    let currentPage = this.getAppCurrentPage();
    let newdata     = {};

    newdata['userInfo'] = this.getUserInfo();
    currentPage.setData(newdata);
  },
  getAppCurrentPage: function () {
    let pages = getCurrentPages();
    return pages[pages.length - 1];
  },
  getTabPagePathArr: function () {
    return JSON.parse(this.globalData.tabBarPagePathArr);
  },
  getWxParseOldPattern: function () {
    return this.globalData.wxParseOldPattern;
  },
  getWxParseResult: function (data, setDataKey) {
    let page = this.getAppCurrentPage();
    data = typeof data == 'number' ? ''+data : data.replace(/\u00A0|\u2028|\u2029|\uFEFF/g, '');
    return WxParse.wxParse(setDataKey || this.getWxParseOldPattern(),'html', data, page);
  },
  getAppTitle: function () {
    return this.globalData.appTitle;
  },
  getAppDescription: function () {
    return this.globalData.appDescription;
  },
  setLocationInfo: function (info) {
    this.globalData.locationInfo = info;
  },
  getLocationInfo: function () {
    return this.globalData.locationInfo;
  },
  getSiteBaseUrl: function () {
    return this.globalData.siteBaseUrl;
  },
  getCdnUrl: function () {
    return this.globalData.cdnUrl;
  },
  getUrlLocationId: function () {
    return this.globalData.urlLocationId;
  },
  getPreviewGoodsInfo: function () {
    return this.globalData.previewGoodsOrderGoodsInfo;
  },
  setPreviewGoodsInfo: function (goodsInfoArr) {
    this.globalData.previewGoodsOrderGoodsInfo = goodsInfoArr;
  },
  getGoodsAdditionalInfo: function () {
    return this.globalData.goodsAdditionalInfo;
  },
  setGoodsAdditionalInfo: function (additionalInfo) {
    this.globalData.goodsAdditionalInfo = additionalInfo;
  },
  getIsLogin: function () {
    return this.globalData.isLogin;
  },
  setIsLogin: function (isLogin) {
    this.globalData.isLogin = isLogin;
  },
  getSystemInfoData: function () {
    let res;
    if (this.globalData.systemInfo) {
      return this.globalData.systemInfo;
    }
    try {
      res = this.getSystemInfoSync();
      this.setSystemInfoData(res);
    } catch (e) {
      this.showModal({
        content: '获取系统信息失败 请稍后再试'
      })
    }
    return res || {};
  },
  setSystemInfoData: function (res) {
    this.globalData.systemInfo = res;
  },
    subPackagePages: {"customPackage2":["X5MZwm348I_page10011"]},
    globalData:{
    appId: 'ox5QhF5g3g',
    historyDataId: '48324',
        tabBarPagePathArr: '["/pages/X5MZwm348I_page10002/X5MZwm348I_page10002","/pages/X5MZwm348I_page10015/X5MZwm348I_page10015","/pages/userCenterComponentPage/userCenterComponentPage"]',
        homepageRouter: 'X5MZwm348I_page10002',
    formData: null,
    userInfo: {},
    systemInfo: null,
    sessionKey: '',
    notBindXcxAppId: false,
    waimaiTotalNum: 0,
    waimaiTotalPrice: 0,
    takeoutLocate:{},
    takeoutRefresh : false,
    isLogin: false,
    locationInfo: {
      latitude: '',
      longitude: '',
      address: '',
      info: {}
    },
    getDistributionInfo: '',
    getDistributorInfo: '',
    PromotionUserToken: '',
    previewGoodsOrderGoodsInfo: [],  
    goodsAdditionalInfo: {},  
    urlLocationId:'',
    turnToPageFlag: false,
    wxParseOldPattern: '_listVesselRichText_',
    cdnUrl: 'http://cdn.jisuapp.cn',
    defaultPhoto: 'http://cdn.jisuapp.cn/zhichi_frontend/static/webapp/images/default_photo.png',
    siteBaseUrl: 'https://jisuapp.zhichiweiye.com', //这里不要写死
    appTitle: '我的应用6',
    appDescription: '',
    appLogo: 'http://cdn.jisuapp.cn/zhichi_frontend/static/invitation/images/logo.png',
    p_u: '', //扫描二维码进入小程序所带参数代理商的user-token
    hasFranchiseeList: '0' == '1' ? true : false, //是否有多商家列表
    hasTopicCom: false,
    pageScrollTop: 0,
    topicRefresh: false,
    kbHeight: '',
    goodsStoreConfig: '',
  },
    })
