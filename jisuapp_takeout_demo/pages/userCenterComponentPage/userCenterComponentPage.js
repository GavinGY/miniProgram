var app      = getApp();

var pageData = {
  data: {"user_center1":{"type":"user-center","style":"opacity:1;color:#333;margin-top:0;font-size:37.5rpx;height:auto;margin-left:auto;","content":[{"name":"\u4f1a\u5458\u4e2d\u5fc3","blockArr":[{"name":"\u4f1a\u5458\u5361","actionName":"\u4f1a\u5458\u5361","icon":"icon-vip-card","actionType":"default","router":"vipCardList","bindtap":"userCenterTurnToPage"},{"name":"\u4f18\u60e0\u5238","actionName":"\u4f18\u60e0\u5238","icon":"icon-coupon","actionType":"default","router":"couponList","bindtap":"userCenterTurnToPage"},{"name":"\u50a8\u503c\u91d1","actionName":"\u50a8\u503c\u91d1","icon":"icon-balance","actionType":"default","router":"balance","bindtap":"userCenterTurnToPage"},{"name":"\u6211\u7684\u8ba2\u5355","actionName":"\u6211\u7684\u8ba2\u5355","icon":"icon-notebook","bindtap":"userCenterTurnToPage","actionType":"default","router":"myOrder"},{"name":"\u7cfb\u7edf\u901a\u77e5","actionName":"\u7cfb\u7edf\u901a\u77e5","icon":"icon-notify","actionType":"default","router":"myMessage","bindtap":"userCenterTurnToPage"}],"col":4,"height":"117.1875rpx","color":"#333","showName":false,"imgHeight":"37.5rpx","line-height":"117.1875rpx","font-size":"28.125rpx","margin-top":"5px","mode":2,"parentCompid":"user_center1","style":"","content":""}],"customFeature":{"mode":1,"personal-mode":1,"blockStyle":{"margin-top":"6px","opacity":1},"topSectionStyle":{"background-color":"","background-image":"url(http:\/\/img.zhichiwangluo.com\/zcimgdir\/album\/file_5b602dc47127d.png)","topHeight":"100px","coverHeight":"40px","opacity":1,"font-size":"16px","color":"rgb(51, 51, 51)"},"actionList":[],"subWidget":["myOrder","myAddress","myMessage","vipCard","coupon","myGroup","myVideo","balance","winningRecord","myPromotion"]},"animations":[],"hidden":false,"page_form":"","compId":"user_center1"},"has_tabbar":1,"page_hidden":true,"page_form":"","top_nav":{"navigationBarTitleText":"\u4e2a\u4eba\u4e2d\u5fc3"},"dataId":""},
    need_login: false,
      bind_phone: false,
    page_router: 'userCenterComponentPage',
    page_form: 'none',
      dataId: '',
      list_compids_params: [],
      user_center_compids_params: [{"compid":"user_center1","param":{"orderType":null}}],
      goods_compids_params: [],
  prevPage:0,
      tostoreComps: [],
      carouselGroupidsParams: [],
      relobj_auto: [],
      bbsCompIds: [],
      dynamicVesselComps: [],
      communityComps: [],
      franchiseeComps: [],
      cityLocationComps: [],
      seckillOnLoadCompidParam: [],
      dynamicClassifyGroupidsParams: [],
      newClassifyGroupidsParams: [],
      videoListComps: [],
      videoProjectComps: [],
      newsComps: [],
      popupWindowComps: [],
        formVesselComps: [],
      searchComponentParam: [],
      topicComps: [],
      topicClassifyComps: [],
      topicSortComps: [],
      rowNumComps: [],
      sidebarComps: [],
      slidePanelComps: [],
    returnToVersionFlag: true,
  requesting: false,
  requestNum: 1,
  modelChoose: [],
  modelChooseId: '',
  modelChooseName: [],
  onLoad: function (e) {
    if (e.statisticsType == 11) {
      delete e.statisticsType
      delete e.needStatistics
    }
    app.onPageLoad(e);
    app.isNeedRewardModal();

    app.checkCanUse('navigator.target', 'canIUseNavigatorTarget', ['button', 'picture', 'text', 'layout-vessel', 'static-vessel', 'free-vessel', 'title-ele', 'album', 'carousel', 'suspension', 'list', 'announce']);
  },
  dataInitial: function () {
    app.pageDataInitial();
  },
  onPageScroll: function(e) {
    app.onPageScroll(e);
  },
  onShareAppMessage: function (e) {
    if (e.from == 'button') {
      if (e.target.dataset.from == 'topicButton') {
        return app.shareAppMessage({
          path: '/informationManagement/pages/communityDetail/communityDetail?detail=' + e.target.dataset.id,
          desc: e.target.dataset.desc,
          success: function(addTime) {
            app.getIntegralLog(addTime);
            app.CountSpreadCount(e.target.dataset.id);
          }
        });
      }
    };
    return app.onPageShareAppMessage(e, app.getIntegralLog);
  },
  onShow: function () {
    app.onPageShow();
  },
  onHide: function () {
    app.onPageHide();
  },
  reachBottomFuc: [],
  onReachBottom: function () {
    app.onPageReachBottom( this.reachBottomFuc );
  },
  onUnload: function () {
    app.onPageUnload();
  },
  slidePanelStart: function (e) {
    app.slidePanelStart(e);
  },
  slidePanelEnd: function (e) {
    app.slidePanelEnd(e);
  },
  onPullDownRefresh : function(){
    app.onPagePullDownRefresh();
  },
  changeDropDown:function(e){
    app.changeDropDown(e);
  },
  connectWifiHandler:function(e){
    app.connectWifiHandler(e)
  },
  tapPrevewPictureHandler: function (e) {
    app.tapPrevewPictureHandler(e);
  },
  suspensionBottom: function () {
    app.suspensionBottom(this);
  },
  pageScrollFunc: function (e) {
    app.pageScrollFunc(e);
  },
  dynamicVesselScrollFunc: function (e) {
    app.dynamicVesselScrollFunc(e);
  },
  goodsScrollFunc: function (e) {
    app.goodsScrollFunc(e);
  },
  takeoutStyleScrollFunc: function(e){
    app.takeoutStyleScrollFunc(e);
  },
  franchiseeScrollFunc: function (e) {
    app.franchiseeScrollFunc(e);
  },
  seckillScrollFunc: function (e) {
    app.seckillScrollFunc(e);
  },
  videoScrollFunc: function (e) {
    app.videoScrollFunc(e);
  },
  carouselVideoClose: function(e) {
    app.carouselVideoClose(e);
  },
  changeCount: function (e) {
    app.changeCount(e);
  },
  inputChange: function (e) {
    app.inputChange(e);
  },
  bindDateChange: function (e) {
    app.bindDateChange(e);
  },
  bindTimeChange: function (e) {
    app.bindTimeChange(e);
  },
  bindSelectChange: function (e) {
    app.bindSelectChange(e);
  },
  bindScoreChange: function (e) {
    app.bindScoreChange(e);
  },
  bindSliderChange: function (e) {
    app.bindSliderChange(e);
  },
  selectPicOption:function(e){
    app.selectPicOption(e);
  },
  formAddress: function(e){
    app.formAddress(e);
  },
  selectOptionOne: function (e) {
    app.selectOptionOne(e);
  },
  selectOptionSecond: function (e) {
    app.selectOptionSecond(e);
  },
  submitForm: function (e) {
    app.submitForm(e);
  },
  udpateVideoSrc: function (e) {
    app.udpateVideoSrc(e);
  },
  tapMapDetail: function (e) {
    app.tapMapDetail(e);
  },
  uploadFormImg: function (e) {
    app.uploadFormImg(e);
  },
  deleteUploadImg: function (e) {
    app.deleteUploadImg(e);
  },
  listVesselTurnToPage: function (e) {
    app.listVesselTurnToPage(e);
  },
  dynamicVesselTurnToPage: function (e) {
    app.dynamicVesselTurnToPage(e);
  },
  userCenterTurnToPage: function (e) {
    app.userCenterTurnToPage(e);
  },
  turnToGoodsDetail: function (e) {
    app.turnToGoodsDetail(e);
  },
  turnToFranchiseeDetail: function (e) {
    app.turnToFranchiseeDetail(e);
  },
  callFranchiseePhone: function(e){
    app.callFranchiseePhone(e);
  },
  turnToSeckillDetail: function (e) {
    app.turnToSeckillDetail(e);
  },
  sortListFunc: function (e) {
    app.sortListFunc(e);
  },
  bbsInputComment: function (e) {
    app.bbsInputComment(e);
  },
  bbsInputReply: function (e) {
    app.bbsInputReply(e);
  },
  uploadBbsCommentImage: function (e) {
    app.uploadBbsCommentImage(e);
  },
  uploadBbsReplyImage: function (e) {
    app.uploadBbsReplyImage(e);
  },
  deleteCommentImage: function (e) {
    app.deleteCommentImage(e);
  },
  deleteReplyImage: function (e) {
    app.deleteReplyImage(e);
  },
  bbsPublishComment: function (e) {
    app.bbsPublishComment(e);
  },
  clickBbsReplyBtn: function (e) {
    app.clickBbsReplyBtn(e);
  },
  bbsPublishReply: function (e) {
    app.bbsPublishReply(e);
  },
  searchList: function (e) {
    app.searchList(e);
  },
  selectLocal: function (e) {
    app.selectLocal(e);
  },
  cancelCity: function (e) {
    app.cancelCity(e);
  },
  bindCityChange: function (e) {
    app.bindCityChange(e);
  },
  submitCity: function (e) {
    app.submitCity(e);
  },
  openTakeoutLocation: function (e) {
    app.openTakeoutLocation(e);
  },
  callTakeout: function (e) {
    app.callTakeout(e);
  },
  getMoreAssess: function (e) {
    app.getMoreAssess(e);
  },
  changeEvaluate: function (e) {
    app.changeEvaluate(e)
  },
  deleteAllCarts: function (e) {
    app.deleteAllCarts(e);
  },
  deleteSingleCarts:function (e) {
    app.deleteSingleCarts(e);
  },
  clickCategory: function (e) {
    app.clickCategory(e);
  },
  goodsListMinus: function (e) {
    app.goodsListMinus(e);
  },
  goodsListPlus: function (e) {
    app.goodsListPlus(e);
  },
  cartListMinus: function (e) {
    app.cartListMinus(e);
  },
  cartListPlus: function (e) {
    app.cartListPlus(e);
  },
  changeAssessType: function (e) {
    app.changeAssessType(e);
  },
  showShoppingCartPop: function (e) {
    app.showShoppingCartPop(e);
  },
  hideShoppingCart: function (e) {
    app.hideShoppingCart(e);
  },
  showGoodsDetail: function (e) {
    app.showGoodsDetail(e);
  },
  hideDetailPop: function (e) {
    app.hideDetailPop(e);
  },
  hideModelPop: function (e) {
    app.hideModelPop(e);
  },
  chooseModel: function (e) {
    app.chooseModel(e);
  },
  sureChooseModel: function (e) {
    app.sureChooseModel(e);
  },
  clickChooseComplete: function (e) {
    app.clickChooseComplete(e);
  },
  reLocalAddress: function(e){
    app.reLocalAddress(e);
  },
  tapGoodsTradeHandler: function (e) {
    app.tapGoodsTradeHandler(e);
  },
  tapVideoHandler: function(e){
    app.tapVideoHandler(e);
  },
  tapVideoPlayHandler: function(e){
    app.tapVideoPlayHandler(e);
  },
  audioElePlay: function(e){
    app.audioElePlay(e);
  },
  tapInnerLinkHandler: function (e) {
    app.tapInnerLinkHandler(e);
  },
  tapToPluginHandler: function (e) {
    app.tapToPluginHandler(e);
  },
  tapPhoneCallHandler: function (e) {
    app.tapPhoneCallHandler(e);
  },
  tapNewClassifyShowSubClassify: function(e){
    app.tapNewClassifyShowSubClassify(e);
  },
  tapNewClassifyRefreshHandler: function(e){
    app.tapNewClassifyRefreshHandler(e);
  },
  tapRefreshListHandler: function (e) {
    app.tapRefreshListHandler(e);
  },
  tapGetCouponHandler: function (e) {
    app.tapGetCouponHandler(e);
  },
  tapCommunityHandler: function (e) {
    app.tapCommunityHandler(e);
  },
  tapTopicHandler: function (e) {
    app.tapTopicHandler(e);
  },
  tapNewsHandler: function (e) {
    app.tapNewsHandler(e);
  },
  tapPageShareHandler:function(e) {
    app.tapPageShareHandler(e);
  },
  turnToCommunityPage: function (e) {
    app.turnToCommunityPage(e);
  },
  tapToFranchiseeHandler: function (e) {
    app.tapToFranchiseeHandler(e);
  },
  tapToTransferPageHandler: function () {
    app.tapToTransferPageHandler();
  },
  tapToSeckillHandler: function (e) {
    app.tapToSeckillHandler(e);
  },
  tapToPromotionHandler: function () {
    app.tapToPromotionHandler();
  },
  tapToCouponReceiveListHandler: function () {
    app.tapToCouponReceiveListHandler();
  },
  tapToRechargeHandler: function () {
    app.tapToRechargeHandler();
  },
  tapToXcx: function (e) {
    app.tapToXcx(e);
  },
  tapFranchiseeLocation: function (e) {
    app.tapFranchiseeLocation(e);
  },
  showGoodsShoppingcart: function(e){
    app.showGoodsShoppingcart(e);
  },
  showAddShoppingcart: function (e) {
    app.showAddShoppingcart(e);
  },
  hideAddShoppingcart: function () {
    app.hideAddShoppingcart();
  },
  selectGoodsSubModel: function (e) {
    app.selectGoodsSubModel(e);
  },
  resetSelectCountPrice: function () {
    app.resetSelectCountPrice();
  },
  clickTostoreMinusButton: function (e) {
    app.clickTostoreMinusButton(e);
  },
  clickTostorePlusButton: function (e) {
    app.clickTostorePlusButton(e);
  },
  readyToPay: function () {
    app.readyToTostorePay();
  },
  getValidateTostore: function () {
    app.getValidateTostore();
  },
  goToShoppingCart: function () {
    app.goToShoppingCart();
  },
  getCartList: function () {
    app.getTostoreCartList();
  },
  stopPropagation: function () {
  },
  turnToSearchPage:function (e) {
    app.turnToSearchPage(e);
  },
  previewImage: function (e) {
    var dataset = e.currentTarget.dataset;
    app.previewImage({
      current : dataset.src,
      urls: dataset.previewImgarr,
    });
  },
  scrollPageTop: function () {
    app.pageScrollTo(0);
  },
  suspensionTurnToPage: function (e) {
    app.suspensionTurnToPage(e);
  },
  tapToLuckyWheel: function (e) {
    app.tapToLuckyWheel(e);
  },
  tapToGoldenEggs: function (e) {
    app.tapToGoldenEggs(e);
  },
  tapToScratchCard: function (e) {
    app.tapToScratchCard(e);
  },
  keywordList:{},
  bindSearchTextChange: function (e) {
    this.keywordList[e.currentTarget.dataset.compid] = e.detail.value;
  },
  // 文字组件跳到地图
  textToMap: function(e) {
    app.textToMap(e);
  },
  tapDynamicClassifyFunc: function(e){
    app.tapDynamicClassifyFunc(e);
  },
  // 跳转到视频详情
  turnToVideoDetail : function(e) {
    app.turnToVideoDetail(e);
  },
  // 单个视频组件播放视频
  startPlayVideo : function(e) {
    app.startPlayVideo(e);
  },
  // 视频播放报错
  videoError: function(e) {
    app.showModal({
      content: e.detail.errMsg
    });
  },
  // 视频项目播放事件
  videoProjectPlay: function(e){
    app.videoProjectPlay(e);
  },
  // 视频项目暂停事件
  videoProjectPause: function(e) {
    app.videoProjectPause(e);
  },
  // 跳转到资讯详情
  turnToNewsDetail: function (e) {
    app.turnToNewsDetail(e)
  },
  //切换资讯分类
  getNewsCateList: function (e) {
    app.getNewsCateList(e);
  },
  // 跳转多商家入驻
  franchiseeEnterHandler: function () {
    app.franchiseeEnterHandler();
  },
  // 跳转多商家代理推广合作联系
  franchiseeCooperationHandler: function () {
    app.franchiseeCooperationHandler();
  },
  //bbs评论
  showBbsReplyDialog: function(e){
    app.showBbsReplyDialog(e);
  },
  hideBbsReplyDialog: function(e){
    app.hideBbsReplyDialog(e);
  },
  popupWindowControlHandler: function(e){
    app.popupWindowControlHandler(e);
  },
  tapMaskClosePopupWindow: function(e){
    app.tapMaskClosePopupWindow(e);
  },
  //话题组件
  topicEleScrollFunc: function (e) {
    app.topicEleScrollFunc(e);
  },
  switchTopiclistOrderBy: function (e) {
    app.switchTopiclistOrderBy(e);
  },
  switchTopicCategory: function (e) {
    app.switchTopicCategory(e);
  },
  topicSearchInputAct: function (e) {
    app.topicSearchInputAct(e);
  },
  searchForTopicAct: function (e) {
    app.searchForTopicAct(e);
  },
  turnToTopicUserCenter: function (e) {
    app.turnToTopicUserCenter(e);
  },
  turnToTopicNotify: function (e) {
    app.turnToTopicNotify(e);
  },
  turnToTopicDetail: function (e) {
    app.turnToTopicDetail(e);
  },
  pageBackTopAct: function (e) {
    app.pageBackTopAct(e);
  },
  turnToTopicPublish: function (e) {
    app.turnToTopicPublish(e);
  },
  showTopicCommentBox: function (e) {
    app.showTopicCommentBox(e);
  },
  showTopicPhoneModal: function (e) {
    app.showTopicPhoneModal(e);
  },
  topicMakePhoneCall: function (e) {
    app.topicMakePhoneCall(e);
  },
  showTopicReplyComment: function (e) {
    app.showTopicReplyComment(e);
  },
  topicCommentReplyInput: function (e) {
    app.topicCommentReplyInput(e);
  },
  topicReplycommentSubmit: function (e) {
    app.topicReplycommentSubmit(e);
  },
  topicPerformLikeAct: function (e) {
    app.topicPerformLikeAct(e);
  },
  topicImgLoad: function (e) {
    app.topicImgLoad(e);
  },
  topicCommentReplyfocus:function (e) {
    app.topicCommentReplyfocus(e);
  },
  topicCommentReplyblur:function (e) {
    app.topicCommentReplyblur(e);
  },

  // 筛选组件 综合排序tab = 0
  sortByDefault: function (e) {
    app.sortByDefault(e);
  },
  // 筛选组件 按销量排序 tab = 1
  sortBySales: function (e) {
    app.sortBySales(e);
  },
  // 筛选组件 按价格排序 tab = 2
  sortByPrice: function (e) {
    app.sortByPrice(e);
  },
  // 筛选组件 展示侧边筛选
  filterList: function(e){
    app.filterList(e);
  },
  // 筛选侧栏确定
  filterConfirm: function(e){
    app.filterConfirm(e);
  },
  //侧边栏
  sidebarControlHandler: function (e) {
    app.sidebarControlHandler(e);
  },
  tapMaskCloseSidebar: function (e) {
    app.tapMaskCloseSidebar(e);
  },
  hideCompeletSidebar: function (e) {
    app.hideCompeletSidebar(e);
  },
  // 动画结束回调函数
  animationEnd: function(e){
    app.animationEnd(e);
  },
  //排号
  showTakeNumberWindow: function(e){
    app.showTakeNumberWindow(e);
  },
  hideTakeNumberWindow: function(e){
    app.hideTakeNumberWindow(e);
  },
  goToPreviewRowNumberOrder: function(e){
    app.goToPreviewRowNumberOrder(e);
  },
  selectRowNumberType: function(e){
    app.selectRowNumberType(e);
  },
  sureTakeNumber: function(e){
    app.sureTakeNumber(e);
  },
  goToCheckRowNunberDetail: function(e){
    app.goToCheckRowNunberDetail(e);
  },
  cancelCheckRowNunber: function(e){
    app.cancelCheckRowNunber(e);
  },
  rowNumberRefresh: function(e){
    app.rowNumberRefresh(e);
  },
  showCancelWindow: function (e) {
    app.showCancelWindow(e)
  },
  hideCancelWindow: function (e) {
    app.hideCancelWindow(e)
  },
  tapPluginLinkHandler: function(e){
    app.tapPluginLinkHandler(e);
  },
  tapGetWxCouponHandler: function (e){
    app.tapGetWxCouponHandler(e);
  },
  tapVipListHandler: function(){
    app.tapVipListHandler();
  },
  tapEventCommonHandler: function(e){
    app.tapEventCommonHandler(e);
  },
  goodsScanCodeHandler: function(){
    app.goodsScanCodeHandler();
  },
  getCarouselData: function(e) {
    let compid = e.currentTarget.dataset.compid;
    app._initialCarouselData(this, compid );
  },
  bbsScrollFuc: function(e){
    let compid = e.currentTarget.dataset.compid;
    app.bbsScrollFuc(compid);
  },
  getNewsList: function(e) {
    let compid = e.currentTarget.dataset.compid;
    app.getNewsList({ compid: compid });
  },
  getCommunityList: function (e) {
    let compid = e.currentTarget.dataset.compid;
    app.initialCommunityList(compid);
  },
  };
Page(pageData);
