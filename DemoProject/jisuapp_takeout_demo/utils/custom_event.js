var app = '';
var tapPluginLinkLoading = false;

setTimeout(function(){
  app = getApp();
}, 100);

var clickEventHandler = {
  "goods-trade": function(param, franchisee) {
    let gtype = param['goods-type'] || param['goods_type'];
    let id = param['goods-id'] || param['goods_id'];
    if(!id){
      return;
    }
    let queryStr = franchisee ? '&franchisee=' + franchiseeId : '';
    if (gtype == 3) {
      app.turnToPage('/pages/toStoreDetail/toStoreDetail?detail=' + id + queryStr);
    } else {
      app.turnToPage('/pages/goodsDetail/goodsDetail?detail=' + id + queryStr);
    }
  },
  "to-seckill": function (param, franchisee) {
    let id = param['seckill-id'] || param['seckill_id'];
    if (!id) {
      return;
    }
    let queryStr = franchisee ? '&franchisee=' + franchiseeId : '';
    app.turnToPage('/pages/goodsDetail/goodsDetail?goodsType=seckill&detail=' + id + queryStr);
  },
  "inner-link": function (param, franchisee) {
    let pageRoot = {
      'groupCenter': '/eCommerce/pages/groupCenter/groupCenter',
      'shoppingCart': '/eCommerce/pages/shoppingCart/shoppingCart',
      'myOrder': '/eCommerce/pages/myOrder/myOrder',
    };
    let pageLink = param['page-link'] || param['inner-page-link'] || param['inner_page_link'];
    let url = pageRoot[pageLink] ? pageRoot[pageLink] : '/pages/' + pageLink + '/' + pageLink;
    let queryStr = franchisee ? '&franchisee=' + franchiseeId : '';

    if (url.indexOf('/prePage/') >= 0) {
      app.turnBack();
    } else{
      let is_redirect = param.is_redirect == 1 ? true : false;
      let pageRouter = app.getAppCurrentPage().page_router;

      if (pageRouter == app.globalData.homepageRouter || app.getTabPagePathArr().indexOf('/' + pageRouter) !== -1) {
        is_redirect = false;
      }
      app.turnToPage(url + queryStr, is_redirect);
    }
  },
  "call": function (param, franchisee) {
    if (param && param.phoneNumberSource === 'dynamic') {
      let phone_num = dataset.realValue ? dataset.realValue[0].text : '';
      if (phone_num === '') {
        return;
      }
      app.makePhoneCall(phone_num);
      return;
    }
    let phone_num = param['phone-num'] || param['phone_num'];
    app.makePhoneCall(phone_num);
  },
  "get-coupon": function (param, franchisee) {
    let coupon_id = param['coupon-id'] || param['coupon_id'];
    let queryStr = franchisee ? '&franchisee=' + franchiseeId : '';
    app.turnToPage('/pages/couponDetail/couponDetail?detail=' + coupon_id + queryStr);
  },
  "community": function (param, franchisee) {
    let community_id = param['community-id'] || param['community_id'];
    let queryStr = franchisee ? '&franchisee=' + franchiseeId : '';
    app.turnToPage('/informationManagement/pages/communityPage/communityPage?detail=' + community_id + queryStr)
  },
  "franchisee-enter": function(param, franchisee){
    app.turnToPage('/franchisee/pages/franchiseeEnter/franchiseeEnter');
  },
  "to-franchisee": function (param, franchisee) {
    let franchisee_id = param['franchisee-id'] || param['franchisee_id'];
    app.sendRequest({
      url: '/index.php?r=AppShop/GetAppShopByAppId',
      data: {
        parent_app_id: app.getAppId(),
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
          app.goToFranchisee(mode, param);
        }
      }
    })
  },
  "to-promotion": function (param, franchisee) {
    app._isOpenPromotion();
  },
  "coupon-receive-list": function (param, franchisee) {
    app.turnToPage('/eCommerce/pages/couponReceiveListPage/couponReceiveListPage');
  },
  "recharge": function (param, franchisee) {
    app.turnToPage('/eCommerce/pages/recharge/recharge');
  },
  "lucky-wheel": function (param, franchisee) {
    let queryStr = franchisee ? '?franchisee=' + franchisee : '';
    app.turnToPage('/awardManagement/pages/luckyWheelDetail/luckyWheelDetail' + queryStr);
  },
  "golden-eggs": function (param, franchisee) {
    let queryStr = franchisee ? '?franchisee=' + franchisee : '';
    app.turnToPage('/awardManagement/pages/goldenEggs/goldenEggs' + queryStr);
  },
  "scratch-card": function (param, franchisee) {
    let queryStr = franchisee ? '?franchisee=' + franchisee : '';
    app.turnToPage('/awardManagement/pages/scratch/scratch' + queryStr);
  },
  "video": function (param, franchisee) {
    let video_id = param['video-id'];
    app.turnToPage('/video/pages/videoDetail/videoDetail?detail=' + video_id);
  },
  "video-detail": function (param, franchisee) {
    let video_id = param['video_id'] || param['video-id'];
    app.turnToPage('/video/pages/videoDetail/videoDetail?detail=' + video_id);
  },
  "video-play": function (param, franchisee) {
    let pageInstance = app.getAppCurrentPage(),
        compid = param.compid,
        video_id = param['video-id'];
    app.sendRequest({
      url: '/index.php?r=AppVideo/GetVideoLibURL',
      method: 'get',
      data: { id: video_id },
      success: function (res) {
        let newdata = {}
        newdata[compid + '.videoUrl'] = res.data;
        pageInstance.setData(newdata);
      }
    })
  },
  "transfer": function (param, franchisee) {
    let queryStr = franchisee ? '?franchisee=' + franchiseeId : '';
    app.turnToPage('/eCommerce/pages/transferPage/transferPage' + queryStr);
  },
  "turn-to-xcx": function (param, franchisee) {
    app.navigateToXcx({
      appId: param['xcx-appid'] || param['xcx_appid'],
      path: param['xcx-page-url'] || param['xcx_page_url'] || ''
    });
  },
  "wifi": function (param, franchisee) {
    let system = app.getSystemInfoData().system;

    app.startWifi({
      success: function (res) {
        if (/ios/i.test(system)) {
          wx.showLoading({
            title: '连接中'
          })
        }
        console.log('wifi connectWifi');
        app.connectWifi({
          SSID: param.wifi['wifi-name'],
          BSSID: param.wifi['wifi-address'],
          password: param.wifi['wifi-password'],
          success: function (res) {
            setTimeout(function () {
              app.showToast({
                title: '连接成功',
                icon: 'success',
                duration: 3000
              });
            }, 1000)
          },
          fail: function (res) {
            console.log(res);
            if (res.errCode) {
              app.showModal({
                content: app.wifiErrCode(res.errCode)
              })
            } else if (res.errMsg == 'connectWifi:fail the api is only supported in iOS 11 or above') {
              app.showModal({
                content: '连接WiFi功能，仅Android 与 iOS 11 以上版本支持'
              })
            } else if (/connectWifi:fail/.test(res.errMsg)) {
              app.showModal({
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
        app.showModal({
          content: res.errMsg
        })
      }
    })
  },
  "plugin-link": function (param, franchisee) {
    if (tapPluginLinkLoading) {
      return;
    }
    tapPluginLinkLoading = true;
    app.sendRequest({
      url: '/index.php?r=pc/OpenPlugin/GetPluginInfo',
      data: {
        'plugin_name': param['plugin-name']
      },
      success: function (res) {
        let page = res.data.plugin_home_page;
        app.turnToPage('/openPlugin/' + res.data.plugin_name + '/pages/' + page + '/' + page);
      },
      complete: function () {
        tapPluginLinkLoading = false;
      }
    });
  },
  "topic": function (param, franchisee) {
    let topic_id = param['topic-id'];
    if (!topic_id) {
      return;
    }
    let queryStr = franchisee ? '&franchisee=' + franchiseeId : '';
    app.turnToPage('/informationManagement/pages/communityDetail/communityDetail?detail=' + topic_id + queryStr);
  },
  "news": function (param, franchisee) {
    let news_id = param['news-id'];
    if (!news_id) {
      return;
    }
    let queryStr = franchisee ? '&franchisee=' + franchiseeId : '';
    app.turnToPage('/informationManagement/pages/newsDetail/newsDetail?detail=' + news_id + queryStr);
  },
  "page-share": function (param, franchisee) {
    let pageInstance = app.getAppCurrentPage();
    let animation = wx.createAnimation({
      timingFunction: "ease",
      duration: 400,
    })
    let queryStr = '';
    for (let i in pageInstance.sharePageParams) {
      queryStr += '&' + i + '=' + pageInstance.sharePageParams[i]
    }
    let router = pageInstance.route.split('/')[2];
    let objId = router == 'newsDetail' ? pageInstance.options.detail : router;
    let shareType = router == 'newsDetail' ? 17 : 11;
    app.sendRequest({
      url: '/index.php?r=AppShop/ShareQRCode',
      data: {
        obj_id: objId,
        type: shareType,
        text: param.pageShareCustomText,
        goods_img: param.pageShareImgUrl,
        params: queryStr
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
  "wx-coupon": function (param, franchisee) {
    let wxcouponId = param['wxcoupon-id'] || param['wxcoupon_id'];
    app.sendRequest({
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
            app.sendRequest({
              url: '/index.php?r=appWeChatCoupon/recvCoupon',
              data: {
                code: res.cardList[0].code,
                card_id: res.cardList[0].cardId
              },
              success: function (res) {
                app.showModal({
                  content: '领取卡券成功'
                })
              }
            });
          }
        })
      }
    });
  },
  "vip-card-list": function (param, franchisee) {
    app.turnToPage('/eCommerce/pages/vipCard/vipCard');
  },
}


module.exports = {
  clickEventHandler: clickEventHandler
}