var app = getApp();
var util = require('../../../utils/util.js');
var WxParse = require('../../../components/wxParse/wxParse.js');
var likeTap = false; //防止重复点击
var isReply = false; //防止重复点击
var redPocketUserInput = '';
var kbHeight = '';
var eventSource = [{ action: "get-coupon", name: "优惠券详情", local_icon: "icon-news-coupon" }, { action: "goods-trade", name: "商品详情", local_icon: "icon-news-goodsdetail" }, { action: "community", name: "社区详情", local_icon: "icon-news-community" }, { action: "to-franchisee", name: "商家详情", local_icon: "icon-news-business" }, { action: "coupon-receive-list", name: "优惠券列表", local_icon: "icon-news-coupon" }, { action: "recharge", name: "储值", local_icon: "icon-news-storage" }, { action: "transfer", name: "付款", local_icon: "icon-news-payment" }, { action: "to-promotion", name: "代言人中心", local_icon: "icon-news-extension" }, { action: "scratch-card", name: "刮刮乐", local_icon: "icon-news-scratch" }, { action: "lucky-wheel", name: "大转盘", local_icon: "icon-news-turntable" }, { action: "golden-eggs", name: "砸金蛋", local_icon: "icon-news-goldegg" }, { action: "call", name: "拨打电话", local_icon: "icon-news-callphone" }, { action: "turn-to-xcx", name: "跳转action小程序", local_icon: "icon-news-jump" }, { action: "share", name: "分享好友", local_icon: "icon-news-sharefriends" }, { action: "page-share", name: "分享朋友圈", local_icon: "icon-news-sharecircle" }, { action: "refresh-list", name: "刷新列表", local_icon: "icon-news-refreshlist" }, { action: "refresh-page", name: "刷新页面", local_icon: "icon-news-refreshpage" }, { action: "contact", name: "联系客服", local_icon: "icon-news-custom" }, { action: "preview-picture", name: "预览大图", local_icon: "icon-news-coupon" }, { action: "to-seckill", name: "秒杀", local_icon: "icon-news-kill" }, { action: "video-detail", name: "视频详情", local_icon: "icon-news-videodetail" }, { action: "topic", name: "话题详情", local_icon: "icon-news-topic" }, { action: "news", name: "资讯详情", local_icon: "icon-news-news" }];
var customEvent = require('../../../utils/custom_event.js');

Page({
  data: {
    articleId: '',
    articleInfo: {},
    likeLogCount: '',
    likeLogItems: [],
    is_liked: '',
    commentWidth: '',
    commentList: [],
    commentTop: '',
    commentBottom: '',
    couponList: '',
    payPrice: '',
    replyContent: '',
    radioCheckVal: 0,
    child_comment: [],
    article_style: '',
    showMask: false,
    contentDescription: '',
    showReplyBox: false,
    replyBoxFocus: false,
    keyboardHeight: '50%',
    showCustom: false,
    pricePay: false,
    getCommentData: {
      page: 1,
      loading: false,
      nomore: false
    },
    strechHeight: '',
    strech: false,
    commentCount: '',
    imgData: {},
    showAddArticleBtn: true,
    theme_color: '#00b6f8',
    thumbUpBackgroundColor: '#3091f2',
    thumbUpColor: '#fff',
    address: '',
    scrollInto: '',
    coverThumbShow: true,
    cdnUrl: app.globalData.cdnUrl,
    haveRedPocket: false,
    showRedPocket: false,
    redPocketStatus: 0,
    redPocketAnimation: {},
    redPocketUserInput: '',
    redPocketObject: {},
    redAnimate: false,
    innerAudioContext: {
      currentTime: 0,
      duration: 0,
      canPlay: false,
      play: false
    },
  },
  onLoad: function (options) {
    let that = this,
      articleId = options.detail,
      thumbUpBackgroundColor = options.dataLiked == '1' ? '#f2f2f2' : '#3091f2',
      thumbUpColor = options.dataLiked == '1' ? '#3091f2' : '#fff',
      likeLogCount = options.dataLiked == '1' ? '' : '赞';
    let franchisee = options.franchisee || '';

    this.setData({
      articleId: articleId,
      thumbUpBackgroundColor: thumbUpBackgroundColor,
      thumbUpColor: thumbUpColor,
      likeLogCount: likeLogCount,
      franchisee: franchisee
    });
    this.getArticleInfo();
    this.countRead();
    // this.getLikeLog();
    this.getComment();

    app.globalData.communityDetailRefresh = false;
  },
  onShow: function () {
    if (app.globalData.communityDetailRefresh) {
      this.setData({
        getCommentData: {
          page: 1,
          loading: false,
          nomore: false
        },
        commentList: []
      });
      app.globalData.communityDetailRefresh = false;
      this.getComment();
    }
  },
  getRectBottom: function () {
    var that = this;
    wx.createSelectorQuery().select('#news-main').boundingClientRect(function (rect) {
      var bottom = rect.bottom; // 节点的上边界坐标
      that.setData({
        commentBottom: bottom
      })
    }).exec()
  },
  getArticleInfo: function () {
    var that = this;
    var _this = this;
    app.sendRequest({
      url: '/index.php?r=AppNews/GetArticleByPage',
      data: {
        article_id: that.data.articleId,
        page: 1,
        is_detail: 1,
        page_size: 100,
        sub_app_id: that.data.franchisee
      },
      method: 'post',
      success: function (res) {
        if (res.status == 0) {
          let info = res.data[0],
            description = info.article_type == 2 ? (info.form_data.url.article && info.form_data.url.article.body) : info.content,
            couponList = info.recommend || [];

          delete info.content;

          if (/[>]\s+/.test(description)) {
            description = description.replace(/(?![>])\s+/g, ($0) => {
              for (var rp = '', i = 0; i < $0.length; i++) {
                rp += '&nbsp;'
              }
              return rp;
            });
            if (info.article_type == 2) {
              if (info.form_data.url.article) {
                delete info.form_data.url.article.body;
              }
            }
          }
          if (/\'/.test(description)) {
            description = description.replace(/\'/g, '"');
          }
          if (/<mpvoice/.test(description)) {
            description = description.replace(/\<mpvoice[^<>]*\>\<\/mpvoice\>/g, ($0,$1) => {
              return $0.replace(/\s(\w+)\=\"([^"]*)\"/g, ($00,$01,$03) => {
                if (/voice\_encode\_fileid/.test($01)) {
                  return ' src="https://res.wx.qq.com/voice/getvoice?mediaid='+$03+'"';
                } else if (/name|author/.test($01)) {
                  return $00;
                } else {}
                return '';
              })
            })
          }
          info.form_data.recommend = info.form_data.recommend.map(rg => {
            if (rg.recommend_good_type == 3) {
              rg.recommend_goods = rg.recommend_goods.map(ri => {
                if (!ri.name) {
                  ri.name = ri.pageRouterName ? ri.pageRouterName.split('/').pop() : '';
                }
                ri.iconImg = ri.iconImg ? ri.iconImg : ri.icon;
                if (!ri.name || !ri.iconImg || /click_event.*svg$/.test(ri.iconImg)) {
                  let eventObj = eventSource.find(eb => eb.action == ri.action);
                  if (eventObj) {
                    ri.name || (ri.name = eventObj.name);
                    if (!ri.iconImg || /click_event.*svg$/.test(ri.iconImg)) {
                      ri.local_icon = eventObj.local_icon;
                    }
                  }
                }
                return ri;
              });
            }
            else if (rg.recommend_good_type == 0) {
              rg.recommend_goods = rg.recommend_goods.map(ri => {
                if (ri.article_type == 3 && ri.form_data.event.action) {
                  let oldEventParams = ri.form_data.event,
                  newEventParams = {};
                  Object.keys(oldEventParams).forEach(k => {
                    if (/\-/.test(k)) {
                      newEventParams[k.replace(/\-/g, '_')] = oldEventParams[k];
                    }else {
                      newEventParams[k] = oldEventParams[k];
                    }
                  });
                  ri.event_params = newEventParams;
                }else {
                  ri.event_params = '';
                }
                if (ri.form_data && ri.form_data.recommend) {
                  delete ri.form_data.recommend;
                }
                return ri;
              });
            }
            else {};

            return rg;
          });

          that.setData({
            articleInfo: info,
            couponList: couponList,
            haveRedPocket: info.form_data.red_package.command ? true : false,
            redPocketObject: info.form_data.red_package,
            contentDescription: description || '',
            wechatAdver: res.wechat_advertise || ''
          });
          WxParse.wxParse('wxParseDescription', 'html', description, _this, 10);

          if (info.form_data.red_package.grab_money > 0) {
            that.setData({redPocketStatus: 1});
          }else if (info.form_data.red_package.is_empty == 1) {
            that.setData({redPocketStatus: 2});
          }else {}

          if (info.form_data.url.article && info.form_data.url.article.type == 3) {
            that.createAudioPlayer(info.form_data.url.article);
          }

          if (info.article_type == 2 && info.form_data.url.video) {
            that.getCurVideoUrl(info.form_data.url.video.url);
          }
        }
      }
    });
  },
  countRead: function () {
    var that = this;
    app.sendRequest({
      url: '/index.php?r=AppNews/CountReadCount',
      data: {
        article_id: that.data.articleId,
        sub_app_id: that.data.franchisee
      },
      method: 'post',
    });
  },
  rewardCancel: function () {
    var showMask = false;
    this.setData({
      showMask: showMask
    })
  },
  radioCheckedChange: function (e) {
    this.setData({
      radioCheckVal: e.detail.value
    })
  },
  customPriceBlur: function (e) {
    this.setData({
      payPrice: e.detail.value
    })
  },
  payPrice: function (event) {
    this.setData({
      payPrice: event.currentTarget.dataset.price,
    })
  },
  confirmationOfpayment: function (e) {
    var list = this.data.goodsList,
      that = this,
      selected_benefit = this.data.selectDiscountInfo,
      hasWritedAdditionalInfo = false;
    if (this.data.payPrice < 1 || this.data.payPrice > 200) {
      app.showModal({
        content: '请输入1-200的数值',
      })
      return false;
    }
    app.sendRequest({
      url: '/index.php?r=AppNews/AddRewardOrder',
      method: 'post',
      data: {
        article_id: that.data.articleId,
        price: that.data.payPrice,
        sub_app_id: that.data.franchisee
      },
      success: function (res) {
        that.payOrder(res.data);
      },
      fail: function () {
        that.requesting = false;
      },
      successStatusAbnormal: function () {
        that.requesting = false;
      }
    });
  },
  payOrder: function (orderId) {
    var that = this;

    function paySuccess() {
      app.turnToPage('/informationManagement/pages/newsDetail/newsDetail?detail=' + that.data.articleId, 1);
      wx.showToast({
        title: '打赏成功',
        icon: 'success',
      })
    }

    function payFail() {
      var showCustom = false;
      that.setData({
        showCustom: showCustom
      })
    }
    app.sendRequest({
      url: '/index.php?r=AppNews/GetWxWebappPaymentCode',
      data: {
        order_id: orderId,
        sub_app_id: that.data.franchisee
      },
      success: function (res) {
        var param = res.data;

        param.orderId = orderId;
        param.success = paySuccess;
        param.fail = payFail;
        that.wxPay(param);
      },
      fail: function () {
        payFail();
      },
      successStatusAbnormal: function () {
        payFail();
      }
    })
  },
  wxPay: function (param) {
    var that = this;
    wx.requestPayment({
      'timeStamp': param.timeStamp,
      'nonceStr': param.nonceStr,
      'package': param.package,
      'signType': 'MD5',
      'paySign': param.paySign,
      success: function (res) {
        app.wxPaySuccess(param);
        param.success();
      },
      fail: function (res) {
        if (res.errMsg === 'requestPayment:fail cancel') {
          param.fail();
          return;
        }
        app.showModal({
          content: '支付失败',
          complete: param.fail
        })
        app.wxPayFail(param, res.errMsg);
      }
    })
  },
  rewardPlay: function () {
    var showMask = true;
    this.setData({
      showMask: showMask
    })
  },
  customByReward: function () {
    var showMask = false,
      showCustom = true;
    this.setData({
      showMask: showMask,
      showCustom: showCustom
    })
  },
  cancelPay: function () {
    var showCustom = false;
    this.setData({
      showCustom: showCustom
    })
  },
  getComment: function () {
    var that = this,
      sdata = that.data.getCommentData;

    if (sdata.loading || sdata.nomore) {
      return;
    }
    sdata.loading = true;
    app.sendRequest({
      url: '/index.php?r=AppNews/GetCommentByPage',
      data: {
        page: sdata.page,
        obj_id: that.data.articleId,
        page_size: 10,
        // article_style : 0          
        article_style: that.data.article_style,
        sub_app_id: that.data.franchisee
      },
      method: 'post',
      success: function (res) {
        if (res.status == 0) {
          let info = res.data,
            oldData = that.data.commentList,
            newData = info;

          for (var i = 0; i < newData.length; i++) {
            let item = newData[i],
              likecount = item.like_count;

            item.like_count_text = likecount <= 0 ? '赞' : (likecount > 10000 ? (Math.floor(likecount / 10000) + '万') : likecount);
            item.likeAnimateShow = true;
          }

          newData = oldData.concat(newData);

          that.setData({
            commentList: newData,
            commentCount: res.count,
            'getCommentData.page': sdata.page + 1
          });
        }
        that.setData({
          'getCommentData.loading': false,
          'getCommentData.nomore': res.is_more == 0 ? true : false
        });
      },
      fail: function (res) {
        that.setData({
          'getCommentData.loading': false
        });
      }
    });
  },
  scrollTolower: function (event) {
    this.getComment();
  },
  oldscrolltop: 0,
  scrollEvent: function (event) {
    let scrolltop = event.detail.scrollTop,
      oldscrolltop = this.oldscrolltop;

    if (scrolltop - oldscrolltop > 60) {
      this.oldscrolltop = scrolltop;
      this.setData({
        showAddArticleBtn: false
      });
    } else if (oldscrolltop - scrolltop > 60) {
      this.oldscrolltop = scrolltop;
      this.setData({
        showAddArticleBtn: true
      });
    }
  },
  imgLoad: function (event, ) {
    let owidth = event.detail.width,
      oheight = event.detail.height,
      oscale = owidth / oheight,
      cwidth = 290,
      cheight = 120,
      ewidth, eheight,
      newData = {};

    if (oscale > cwidth / cheight) {
      ewidth = cwidth;
      eheight = cwidth / oscale;
    } else {
      ewidth = cheight * oscale;
      eheight = cheight;
    }

    newData['imgData'] = {
      imgWidth: ewidth * 2.34,
      imgHeight: eheight * 2.34
    }
    this.setData(newData);
  },
  turnReply: function (event) {
    this.turnComment(event);
  },
  turnComment: function (event) {
    let articleId = this.data.articleId,
      replyto = event.currentTarget.dataset.replyto;

    this.setData({
      showReplyBox: true,
      replyPlaceholder: "@" + replyto,
      replyParam: {
        obj_id: articleId, // 话题id
      }
    });
    setTimeout(() => {
      this.setData({
        replyBoxFocus: true
      });
    }, 500);
  },
  articleLike: function (event) {
    var that = this,
      liked = event.currentTarget.dataset.liked;

    if (likeTap) { return; };
    likeTap = true;

    app.sendRequest({
      url: '/index.php?r=AppNews/PerformLike',
      data: {
        obj_type: 1, // obj_type 1-话题 2-评论
        obj_id: that.data.articleId, // obj_id 话题或评论的id
        sub_app_id: that.data.franchisee
      },
      method: 'post',
      success: function (res) {
        if (res.status == 0) {

          if (liked == 1) {
            that.setData({
              'articleInfo.is_liked': 0,
              thumbUpBackgroundColor: '#3091f2',
              thumbUpColor: '#fff',
              is_liked: '0',
            });
            app.showToast({
              title: '点赞取消'
            });
          } else {
            that.setData({
              'articleInfo.is_liked': 1,
              'articleInfo.like_count': that.data.articleInfo.like_count * 1 + 1,
              thumbUpBackgroundColor: '#f2f2f2',
              thumbUpColor: '#3091f2',
              is_liked: '1'
            });
            app.showToast({
              title: '点赞成功'
            });
          }

          app.globalData.communityPageRefresh = true;
        }
      },
      complete: function () {
        likeTap = false;
      }
    });
  },
  commentLike: function (event) {
    var that = this,
      liked = event.currentTarget.dataset.liked,
      id = event.currentTarget.dataset.id,
      index = +event.currentTarget.dataset.index;
    
    if (likeTap) { return; };
    likeTap = true;
    
    app.sendRequest({
      url: '/index.php?r=AppNews/PerformLike',
      data: {
        obj_type: 2, // obj_type 1-话题 2-评论
        obj_id: id, // obj_id 话题或评论的id
        sub_app_id: that.data.franchisee
      },
      method: 'post',
      success: function (res) {
        if (res.status == 0) {

          if (liked == 1) {
            var newData = {},
              likecount = +that.data.commentList[index].like_count - 1;
            newData['commentList[' + index + '].is_liked'] = 0;
            newData['commentList[' + index + '].like_count'] = likecount;
            newData['commentList[' + index + '].like_count_text'] = likecount <= 0 ? '赞' : (likecount > 10000 ? (Math.floor(likecount / 10000) + '万') : likecount);
            newData['commentList[' + index + '].likeAnimateShow'] = false;

            that.setData(newData);
            app.showToast({
              title: '点赞取消成功'
            });
          } else {
            var newData = {},
              likecount = +that.data.commentList[index].like_count + 1;
            newData['commentList[' + index + '].is_liked'] = 1;
            newData['commentList[' + index + '].like_count'] = likecount;
            newData['commentList[' + index + '].like_count_text'] = likecount <= 0 ? '赞' : (likecount > 10000 ? (Math.floor(likecount / 10000) + '万') : likecount);
            newData['commentList[' + index + '].likeAnimateShow'] = false;

            that.setData(newData);
            app.showToast({
              title: '点赞成功'
            });
          }
          setTimeout(function () {
            let newData = {};
            newData['commentList[' + index + '].likeAnimateShow'] = true;
            that.setData(newData);
          }, 480);
        }
      },
      complete: function () {
        likeTap = false;
      }
    });
  },
  previewImage: function (event) {
    let that = this,
      curImg = event.currentTarget.dataset.src;
    app.previewImage({
      current: curImg,
      urls: that.data.articleInfo.content.imgs
    });
  },

  historyBack: function () {
    app.turnBack();
  },
  onShareAppMessage: function (res) {
    let shareTitle = this.data.articleInfo.title;
    let sharePath = util.getCurrentPageUrlWithArgs();
    console.log(shareTitle, sharePath)
    return {
      title: shareTitle,
      path: sharePath,
      success: function (res) {
        app.showToast({
          title: '转发成功'
        });
      },
      fail: function (res) {}
    }
  },
  turnToReport: function () {
    let franchiseeParam = this.data.franchisee ? ('&franchisee=' + this.data.franchisee) : '';
    app.turnToPage('/informationManagement/pages/communityReport/communityReport?detail=' + this.data.articleId + franchiseeParam);
  },
  gotoCouponDetail: function (event) {
    let id = event.currentTarget.dataset.couponId;
    let franchiseeParam = this.data.franchisee ? ('&franchisee=' + this.data.franchisee) : '';
    app.turnToPage('/pages/couponDetail/couponDetail?couponStatus=recieve&detail=' + id + franchiseeParam);
  },
  turnToArticle: function (event) {
    if (event.currentTarget.dataset.articleType == 3) {
      this.bindEventTapHandler(event);
      return;
    }
    let id = event.currentTarget.dataset.id;
    let franchiseeParam = this.data.franchisee ? ('&franchisee=' + this.data.franchisee) : '';
    app.turnToPage('/informationManagement/pages/newsDetail/newsDetail?detail=' + id + franchiseeParam);
  },
  turnToGoodsDetail: function (event) {
    let id = event.currentTarget.dataset.id,
      style = event.currentTarget.dataset.style;
    let franchiseeParam = this.data.franchisee ? ('&franchisee=' + this.data.franchisee) : '';
    if (style == 3) {
      app.turnToPage('/pages/toStoreDetail/toStoreDetail?detail=' + id + franchiseeParam);
    } else {
      app.turnToPage('/pages/goodsDetail/goodsDetail?detail=' + id + franchiseeParam);
    }
  },
  turntovideo: function () {
    let coverThumbShow = false;
    this.setData({
      coverThumbShow: coverThumbShow
    })
  },
  receiveCoupon: function (event) {
    let _this = this;
    let couponId = event.currentTarget.dataset.couponId;
    app.sendRequest({
      url: '/index.php?r=AppShop/recvCoupon',
      data: {
        coupon_id: event.currentTarget.dataset.couponId,
        sub_app_id: that.data.franchisee
      },
      hideLoading: true,
      success: function (res) {
        _this.setData({
          receiveSuccess: 1,
          receiveCount: res.data.recv_count,
          receiveLimitNum: res.data.limit_num
        });
        setTimeout(function () {
          _this.hideToast();
        }, 3000);
        if (res.data.is_already_recv == 1) {
          let couponList = _this.data.couponList;
          for (var i = 0; i < couponList.length; i++) {
            if (couponList[i]['id'] == couponId) {
              let newData = {};
              newData['couponList[' + i + '].recv_status'] = 0;
              _this.setData(newData);
            }
          }
        }
      }
    })
  },
  cancelReply: function () {
    this.setData({
      showReplyBox: false,
      replyBoxFocus: false
    });
  },
  submitReply: function () {
    let that = this,
        replyParam = that.data.replyParam,
        replyText = replyParam.content;

    if (/^\s*$/.test(replyText) || !replyText) {
      app.showModal({
        content: '请填写回复内容'
      });
      return;
    }

    if (isReply) { return; };
    isReply = true;

    replyParam.sub_app_id = that.data.franchisee;
    app.sendRequest({
      url: '/index.php?r=AppNews/AddComment',
      data: replyParam,
      method: 'post',
      success: function (res) {
        if (res.status == 0) {
          app.showToast({
            title: '回复成功',
            success: function () {
              that.setData({
                showReplyBox: false,
                replyBoxFocus: false,
              });
              delete that.data.replyParam;
            }
          });
          app.globalData.communityDetailRefresh = true;
          that.onShow();
        }
      },
      complete: function () {
        isReply = false;
      }
    });
  },
  replyInput: function (event) {
    this.setData({
      'replyParam.content': event.detail.value
    });
  },
  scrollTo: function (e) {
    wx.createSelectorQuery().select('#news-main').boundingClientRect(function (rect) {
      var height = rect.height + 15; // 节点的上边界坐标
      app.pageScrollTo(height);
    }).exec()
  },
  streching: function () {
    let strechHeight = '',
      strech = this.data.strech;
    if (strech == false) {
      strechHeight = '38rpx';
      strech = true;
    } else {
      strech = false;
    }
    this.setData({
      strechHeight: strechHeight,
      strech: strech
    })
  },
  tapGetCouponList: function () {
    let franchiseeParam = this.data.franchisee ? ('&franchisee=' + this.data.franchisee) : '';
    app.turnToPage('/eCommerce/pages/couponList/couponList?from=newsDetail' + franchiseeParam);
  },
  turnToCoupon: function (event) {
    let franchiseeParam = this.data.franchisee ? ('&franchisee=' + this.data.franchisee) : '';
    app.turnToPage('/pages/couponDetail/couponDetail?detail=' + event.currentTarget.dataset.id + franchiseeParam, 1);
  },
  tapToRechargeHandler: function () {
    app.tapToRechargeHandler();
  },
  tapToTransferPageHandler: function (event) {
    app.tapToTransferPageHandler();
  },
  tapPhoneCallHandler: function (event) {
    let eventParams = event.currentTarget.dataset.eventParams,
      phone_num = eventParams['phone_num'] || eventParams['phone-num'] || '';
    app.makePhoneCall(phone_num);
  },
  turnToSeckill: function (event) {
    let goodsInfo = event.currentTarget.dataset.eventParams,
      goodsType = goodsInfo['goods_type'] || goodsInfo['goods-type'],
      goodsId = goodsInfo['goods_id'] || goodsInfo['goods-id'],
      pageSite;
      let franchiseeParam = this.data.franchisee ? ('&franchisee=' + this.data.franchisee) : '';
    switch (goodsType) {
      case 2:
        pageSite = '/pages/goodsDetail/goodsDetail?detail=';
        break;
      case 3:
        pageSite = '/pages/toStoreDetail/toStoreDetail?detail=';
        break;
      default:
        pageSite = '/pages/goodsDetail/goodsDetail?detail=';
        break;
    }
    app.turnToPage(pageSite + goodsId +'&goodsType=seckill' + franchiseeParam);
  },
  tapToXcx: function (event) {
    var eventParams = JSON.stringify(event.currentTarget.dataset.eventParams),
      str = eventParams.replace(/-/g, "_"),
      newsEvent = {
        currentTarget: {
          dataset: {
            eventParams: str
          }
        }
      }
    app.navigateToXcx(newsEvent)
  },
  tapGetCouponHandler: function (event) {
    var eventParams = JSON.stringify(event.currentTarget.dataset.eventParams),
      str = eventParams.replace(/-/g, "_"),
      newsEvent = {
        currentTarget: {
          dataset: {
            eventParams: str
          }
        }
      };
    app.tapGetCouponHandler(newsEvent)
  },
  tapToLuckyWheel: function (event) {
    let franchiseeParam = this.data.franchisee ? ('?franchisee=' + this.data.franchisee) : '';
    app.turnToPage('/awardManagement/pages/luckyWheelDetail/luckyWheelDetail' + franchiseeParam);
  },
  tapToScratchCard: function (event) {
    let franchiseeParam = this.data.franchisee ? ('?franchisee=' + this.data.franchisee) : '';
    app.turnToPage('/awardManagement/pages/scratch/scratch' + franchiseeParam);
  },
  tapToGoldenEggs: function (event) {
    let franchiseeParam = this.data.franchisee ? ('?franchisee=' + this.data.franchisee) : '';
    app.turnToPage('/awardManagement/pages/goldenEggs/goldenEggs' + franchiseeParam);
  },
  tapGoodsTradeHandler: function (event) {
    var eventParams = JSON.stringify(event.currentTarget.dataset.eventParams),
      str = eventParams.replace(/-/g, "_"),
      newsEvent = {
        currentTarget: {
          dataset: {
            eventParams: str
          }
        }
      };
    app.tapGoodsTradeHandler(newsEvent);
  },

  tapCommunityHandler: function (event) {
    var eventParams = JSON.stringify(event.currentTarget.dataset.eventParams),
      str = eventParams.replace(/-/g, "_"),
      newsEvent = {
        currentTarget: {
          dataset: {
            eventParams: str
          }
        }
      }
    app.tapCommunityHandler(newsEvent)
  },

  tapToFranchiseeHandler: function (event) {
    var eventParams = JSON.stringify(event.currentTarget.dataset.eventParams),
      str = eventParams.replace(/-/g, "_"),
      newsEvent = {
        currentTarget: {
          dataset: {
            eventParams: str
          }
        }
      };
    app.tapToFranchiseeHandler(newsEvent)
  },
  tapToPromotionHandler: function (event) {
    var eventParams = JSON.stringify(event.currentTarget.dataset.eventParams),
      str = eventParams.replace(/-/g, "_"),
      newsEvent = {
        currentTarget: {
          dataset: {
            eventParams: str
          }
        }
      }
    app.tapToPromotionHandler(newsEvent);
  },
  connectWifi: function (event) {
    app.connectWifi(event)
  },
  tapInnerLinkHandler: function (event) {
    var eventParams = JSON.stringify(event.currentTarget.dataset.eventParams),
      str = eventParams.replace(/-/g, "_"),
      newsEvent = {
        currentTarget: {
          dataset: {
            eventParams: str
          }
        }
      }
    app.tapInnerLinkHandler(newsEvent)
  },
  tapRefreshListHandler: function (event) {
    var eventParams = JSON.stringify(event.currentTarget.dataset.eventParams),
      str = eventParams.replace(/-/g, "_"),
      newsEvent = {
        currentTarget: {
          dataset: {
            eventParams: str
          }
        }
      }
    app.tapRefreshListHandler(newsEvent);
  },
  tapPageShareHandler: function (event) {
    var eventParams = JSON.stringify(event.currentTarget.dataset.eventParams),
      str = eventParams.replace(/-/g, "_"),
      newsEvent = {
        currentTarget: {
          dataset: {
            eventParams: str
          }
        }
      }
    app.tapPageShareHandler(newsEvent);
  },
  tapTopicHandler: function (e) {
    let eventParams = e.currentTarget.dataset.eventParams;
    let franchiseeParam = this.data.franchisee ? ('&franchisee=' + this.data.franchisee) : '';
    app.turnToPage('/informationManagement/pages/communityDetail/communityDetail?detail=' + eventParams.topic_id + '&dataLiked=' + eventParams.is_liked + '&phoneNumber=' + eventParams.phone + '&sectionid=' + eventParams.section_id + franchiseeParam);
  },
  tapNewsHandler: function (e) {
    let eventParams = e.currentTarget.dataset.eventParams;
    let franchiseeParam = this.data.franchisee ? ('&franchisee=' + this.data.franchisee) : '';
    app.turnToPage('/informationManagement/pages/newsDetail/newsDetail?detail=' + eventParams.news_id + franchiseeParam);
  },
  replyFocus: function (e) {
    if (e.detail.height && e.detail.height != kbHeight) {
      let curKbHeight = e.detail.height;
      kbHeight = e.detail.height;
      if (/iPhone\s?X/i.test(app.globalData.systemInfo.model)) {
        curKbHeight = 365;
      }
      this.setData({
        'replyBoxFocus': true,
        'keyboardHeight': curKbHeight + 'px'
      });
      return;
    }
    this.setData({
      'replyBoxFocus': true
    });
  },
  replyBlur: function (e) {
    this.setData({
      'replyBoxFocus': false
    });
  },
  onReachBottom: function () {
    this.scrollTolower();
  },
  bindEventTapHandler: function (e) {
    let form = e.currentTarget.dataset.eventParams;
    let action = form.action;
    customEvent.clickEventHandler[action] && customEvent.clickEventHandler[action](form);
  },
  stopPropagation: function () {

  },
  showRedPocketAct: function () {
    this.setData({showRedPocket: true});
  },
  closeRedPocketModal: function () {
    this.setData({showRedPocket: false});
  },
  openRedPocketAct: function () {
    let command = this.data.redPocketObject.command,
    inputCommand = redPocketUserInput || this.data.redPocketUserInput;
    if (command === inputCommand) {
      this.redPocketOpenSucc();
      return;
    }
    this.redPocketOpenFail();
  },
  turnToRedPocketDetail: function () {
    this.setData({showRedPocket: false});
    let franchiseeParam = this.data.franchisee ? ('&franchisee=' + this.data.franchisee) : '';
    app.turnToPage('/informationManagement/pages/newsPocketsDetail/newsPocketsDetail?detail='+ this.data.redPocketObject.rp_id + franchiseeParam);
  },
  redPocketOpenSucc: function () {
    let that = this;
    let redPocketObject = this.data.redPocketObject;
    redPocketObject.sub_app_id = that.data.franchisee;
    app.sendRequest({
      url: '/index.php?r=AppNews/GrabRP',
      data: redPocketObject,
      complete: function (res) {
        if (!res) {
          return;
        }
        switch (res.status) {
          case 0:
            that.setData({
              redPocketStatus: 1,
              'redPocketObject.grab_money': res.data
            });
            break;
          case 3:
            that.setData({redPocketStatus: 1});
            break;
          case 4:
            that.setData({redPocketStatus: 2});
            break;
          default:
            break;
        }
      }
    });
  },
  redPocketOpenFail: function () {
    this.setData({
      redAnimate: true
    });
    let animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 350,
      timingFunction: "start-end",
      delay: 0
    });

    animation.rotate(3).step({duration: 50})
      .rotate(-3).step({duration: 100})
      .rotate(3).step({duration: 100})
      .rotate(-3).step({duration: 100});
    this.setData({
      redPocketAnimation: animation.export()
    });
    setTimeout(() => {
      animation.rotate(0).step({duration: 0});
      this.setData({
        redPocketAnimation: animation.export()
      });
      setTimeout(() => {
        this.setData({
          redAnimate: false,
          redPocketUserInput: ''
        });
      }, 0);
    }, 350);
  },
  redPocketCmmandInput: function (e) {
    let val = e.detail.value;
    this.setData({redPocketUserInput: val});
  },
  redPocketCmmandBlur: function (e) {
    let val = e.detail.value;
    redPocketUserInput = val;
    this.setData({redPocketUserInput: val});
  },
  createAudioPlayer(article) {
    const innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext = innerAudioContext;
    innerAudioContext.src = article.audio_url;
    innerAudioContext.onCanplay(() => {
      this.setData({
        'innerAudioContext.canPlay': true,
        'innerAudioContext.duration': article.duration || 0
      });
    });
    innerAudioContext.onError((res) => {
      app.showModal({content: res.errCode+ ":" +res.errMsg});
    });
  },
  audioPlayAct: function () {
    if (!this.data.innerAudioContext.canPlay) {
      return;
    }
    this.audioTimer && clearInterval(this.audioTimer);
    if (this.data.innerAudioContext.play) {
      this.setData({
        'innerAudioContext.play': false,
        'innerAudioContext.currentTime': this.innerAudioContext.currentTime
      });
      this.innerAudioContext.pause();
      return;
    }
    this.innerAudioContext.play();
    this.audioTimer = setInterval(() => {
      this.setData({
        'innerAudioContext.play': true,
        'innerAudioContext.currentTime': this.innerAudioContext.currentTime
      });
      if (!this.data.innerAudioContext.duration) {
        this.setData({
          'innerAudioContext.duration': this.innerAudioContext.duration
        });
      }
    }, 1000);
  },
  getCurVideoUrl: function (url) {
    let that = this;
    app.sendRequest({
      url: '/index.php?r=AppNews/GetVideoUrl',
      data: { argv: url },
      success: function (res) {
        that.setData({
          'articleInfo.form_data.url.video.url': res.data
        })
      }
    });
  }
})
