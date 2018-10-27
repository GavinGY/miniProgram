var app = getApp();

Page({
    data: {
        modalHidden: !0
    },
    onLoad: function(o) {
        var t = wx.getStorageSync("nbcolor");
        wx.setNavigationBarColor({
            frontColor: "#ffffff",
            backgroundColor: t
        });
        var n = wx.getStorageSync("imglink"), a = o.ydid;
        console.log(a), this.setData({
            ydid: a,
            imglink: n
        }), this.reLoad();
    },
    reLoad: function() {
        var o = this, t = this.data.ydid;
        console.log(t), app.util.request({
            url: "entry/wxapp/Store",
            cachetime: "0",
            data: {
                id: getApp().sjid
            },
            success: function(t) {
                console.log(t.data), console.log(t.data.logo), o.setData({
                    store: t.data,
                    color: t.data.color
                });
            }
        }), app.util.request({
            url: "entry/wxapp/ReservationInfo",
            cachetime: "0",
            data: {
                id: t
            },
            success: function(t) {
                console.log(t), o.setData({
                    yyinfo: t.data
                });
            }
        });
    },
    call_phone: function() {
        var o = this;
        wx.makePhoneCall({
            phoneNumber: o.data.yyinfo.tel
        });
    },
    cancel: function(o) {
        var t = this;
        console.log(t.data.yyinfo.id), wx.showModal({
            title: "提示",
            content: "确认取消么",
            success: function(o) {
                o.confirm ? (console.log("用户点击确定"), app.util.request({
                    url: "entry/wxapp/CancelReservation",
                    cachetime: "0",
                    data: {
                        id: t.data.yyinfo.id
                    },
                    success: function(o) {
                        console.log(o.data), "1" == o.data ? (wx.showToast({
                            title: "取消成功",
                            icon: "success",
                            duration: 1e3
                        }), setTimeout(function() {
                            wx.switchTab({
                                url: "../list/list?activeindex=2"
                            });
                        }, 1e3)) : wx.showToast({
                            title: "请重试",
                            icon: "loading",
                            duration: 1e3
                        });
                    }
                })) : o.cancel && console.log("用户点击取消");
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        this.reLoad(), wx.stopPullDownRefresh();
    },
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});