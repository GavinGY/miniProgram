
var app = getApp()

Page({
  data: {
    userInfo: {
      nickname: '',
      sex: 0,
      cover_thumb: 'http://img.zhichiwangluo.com/zc_app_default_photo.png',
      phone: '',
      birthday: '',
    },
    today: new Date(),
    genderArr: ['男', '女'],
    isFromBack: false
  },
  page_router: 'userCenter',
  onLoad: function(){
    var userInfo = app.getUserInfo(),
        data = {
          'userInfo.nickname': userInfo.nickname,
          'userInfo.sex': userInfo.sex,
          'userInfo.cover_thumb': userInfo.cover_thumb,
          'userInfo.birthday': userInfo.birthday,
        };
    this.setData(data);
    this.getXcxUserInfo();
  },
  onShow: function(){
    if(this.data.isFromBack){
      this.getXcxUserInfo();
    } else {
      this.setData({
        isFromBack: true
      });
    }
  },
  getXcxUserInfo: function(){
    var that = this;
    app.sendRequest({
      url:'/index.php?r=AppData/getXcxUserInfo',
      success: res=>{
        if(res.status == 0){
          var data = res.data;
          that.setData({
            'userInfo.phone': data.phone || '',
          })
        }
      }
    })
  },
  choosePhoto: function(){
    var that = this;
    app.chooseImage(function(imgUrl){
      that.setData({
        'userInfo.cover_thumb': imgUrl[0]
      })
    });
  },
  changeGender: function(e){
    this.setData({
      'userInfo.sex': e.detail.value
    })
  },
  changeBirthday: function(e){
    this.setData({
      'userInfo.birthday':e.detail.value
    })
  },
  inputNickname: function(e){
    this.setData({
      'userInfo.nickname': e.detail.value
    })
  },
  saveUserInfo: function(){
    var data = this.data.userInfo;

    app.sendRequest({
      url: '/index.php?r=AppData/saveUserInfo',
      method: 'post',
      data: data,
      success: function(res){
        if(res.status === 0){
          app.setUserInfoStorage(data);
          app.turnBack();
        }
      }
    });
  },
  bindCellphonePage: function(){
    app.turnToPage('/default/pages/bindCellphone/bindCellphone?r='+app.getAppCurrentPage().page_router, 1);
  },
  times: 0,
  time: '',
  openDebug: function(){
    this.times++;
    if(this.times > 5){
      wx.setEnableDebug({
        enableDebug: true
      })
    }
    if(!this.time){
      this.time = setTimeout(()=>{
        this.time = '';
        this.times = 0;
      }, 1000);
    }
  }
})
