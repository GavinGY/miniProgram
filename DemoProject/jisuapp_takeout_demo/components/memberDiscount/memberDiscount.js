let app = getApp();
Component({
  properties: {
    discountType: {            // 优惠类型+优惠对应的数据 默认全部开启 value是优惠列表数据
      type: Array,
      value: [{
        label: 'coupon',
        value: []
      }, {
        label: 'vip',
        value: []
      }, {
        label: 'integral',
        value: []
      }]
    },
    isShowTip: {               // 是否显示提示语 默认开启
      type: Boolean,
      value: true
    },
    franchisee: {
      type: String,
      value: ''
    }
  },

  data: {
    isVisibled: false,         // 弹窗开关
    selectedDiscount: {},      // 选中的优惠
    currentDiscount: {         // 当前选中优惠的类型和下标
      type: '',
      index: 0,
    },
    isShowTarbar: true
  },
  ready: function () {    
  },
  methods: {
    showDialog: function (selectedDiscount, franchisee = '') {
      let discountType = selectedDiscount.discount_type;
      let currentDiscount = this.data.currentDiscount;
      let num = 0;

      if(!discountType){
        let discount_type = '';
        this.data.discountType.map((val) => {
          if(val.value.length > 0){
            discount_type = val.label
          }
        })
        this.setData({
          isVisibled: true,
          selectedDiscount: {
            discount_type: discount_type
          }
        })
        return;
      }      
      
      this.data.discountType.map((val) => {
        if(val.label === discountType){
          console.log(selectedDiscount);
          if(selectedDiscount.no_use_benefit === 1){
            currentDiscount = {
              type: '',
              index: 0
            }
            return;
          }
          if(discountType === 'coupon'){
            val.value.forEach((item, index) => {
              if(item.coupon_id == selectedDiscount.coupon_id){
                currentDiscount = {
                  type: 'coupon',
                  index: index
                }
              }
            })
          } else if(discountType === 'vip') {
            this.getVipCardInfo();
            currentDiscount = {
              type: 'vip',
              index: 0
            }
          } else if(discountType === 'integral') {
            currentDiscount = {
              type: 'integral',
              index: 0
            }
          }
        }
        if(val.value instanceof Array && val.value.length > 0){
          num++
        }
      })

      this.setData({
        isVisibled: true,
        selectedDiscount: selectedDiscount,
        currentDiscount: currentDiscount,
        isShowTarbar: num !== 1
      })
    },
    // 选择优惠
    selectedDiscount: function (e) {
      let type = e.currentTarget.dataset.type;
      let index = e.currentTarget.dataset.index;
      let selectedDiscount = this.data.selectedDiscount;
      let currentDiscount = this.data.currentDiscount;

      this.data.discountType.map((val) => {
        if (val.label === type) {
          if(type === currentDiscount.type && index === currentDiscount.index){    // 反选不使用优惠
            if(selectedDiscount.type === 'combine'){
              selectedDiscount.no_use_benefit = 1;
            }else {
              selectedDiscount = {
                title: "不使用优惠",
                name: '无',
                no_use_benefit: 1
              };
            }
            currentDiscount = {
              type: '',
              index: 0,
            }
          }else {
            if(selectedDiscount.type === 'combine'){
              selectedDiscount.no_use_benefit = 0;
              selectedDiscount.discount_type === 'coupon' ? selectedDiscount.coupon_id = val.value[index].coupon_id : '';
            }else {
              selectedDiscount = val.value[index];
            }
            currentDiscount = {
              type: type,
              index: index
            }
          }

          this.setData({
            selectedDiscount: selectedDiscount,
            currentDiscount: currentDiscount
          })
        }
      })

      this.triggerEvent('afterSelectedDiscount', { selectedDiscount: selectedDiscount });

      this.setData({
        isVisibled: false
      })
    },
    hiddenDialog: function (e) {
      if(e.target.dataset.type === 'close'){
        this.setData({
          isVisibled: false
        })
      }
    },
    // 不使用优惠
    noUseDiscount: function () {
      let selectedDiscount = this.data.selectedDiscount;
      if(selectedDiscount.type === 'combine'){
        selectedDiscount.no_use_benefit = 1;
      }else {
        selectedDiscount = {
          title: "不使用优惠",
          name: '无',
          no_use_benefit: 1
        };
      }
      this.setData({
        selectedDiscount: selectedDiscount,
        currentDiscount: {
          type: '',
          index: 0,
        },
        isVisibled: false
      })
      this.triggerEvent('afterSelectedDiscount', { selectedDiscount: selectedDiscount });
    },
    // 导航选择
    checkType: function (e) {
      let label = e.currentTarget.dataset.label;

      this.setData({
        'selectedDiscount.discount_type': label
      });
    },
    isShowTipChange: function () {
      this.setData({ isShowTip: false })
    },
    // 获取用户会员卡信息
    getVipCardInfo: function(){
      let _this = this;
      app.sendRequest({
        url: '/index.php?r=AppShop/GetVIPInfo',
        data: {
          sub_shop_app_id: _this.data.franchisee
        },
        hideLoading: true,
        success: (res) => {
          let discountType = _this.data.discountType;
          discountType.map((val) => {
            if(val.label === 'vip'){
              val.value[0].logo = res.data.logo
            }
          })
          _this.setData({
            discountType: discountType
          })
        }
      })
    }
  }
})
