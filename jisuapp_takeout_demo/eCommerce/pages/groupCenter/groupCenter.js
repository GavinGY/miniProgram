var appInstance = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    franchisee: ''
  },
  isMore:1,
  page:1,
  franchisee: '',
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;

    _this.franchisee = options.franchisee || '';

    appInstance.sendRequest({
      url: '/index.php?r=AppGroupBuy/GetGroupBuyGoodsList',
      data: {
        page:_this.page,
        page_size: 10,
        current_status: 0,
        sub_app_id: _this.franchisee
      },
      success: function(data){
        //console.log(data);
        _this.setData({list:data.data});
        _this.page++;
        _this.isMore = data.is_more;
      }
    })
  },

  turnToGoodsDetail:function(e){
    let id = e.currentTarget.dataset.id;
    let franchisee = e.currentTarget.dataset.appid;
    let queryStr = franchisee == appInstance.getAppId() ? '' : '&franchisee=' + franchisee
    appInstance.turnToPage('/pages/groupGoodsDetail/groupGoodsDetail?detail=' + id + queryStr);
  },

  getMore:function(){
    let _this = this;
    appInstance.sendRequest({
      url: '/index.php?r=AppGroupBuy/GetGroupBuyGoodsList',
      data: {
        page: _this.page,
        page_size: 10,
        current_status: 0,
        sub_app_id: _this.franchisee
      },
      success: function (data) {
        //console.log(data);
        if(_this.isMore === 0){return;};
        let list = _this.data.list.concat(data.data);
        _this.setData({ list: list });
        _this.page++;
        _this.isMore = data.is_more;
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.isMore){
      this.getMore();
    }
  }

})
