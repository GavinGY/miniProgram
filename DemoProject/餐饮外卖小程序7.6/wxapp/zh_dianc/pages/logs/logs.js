var app = getApp();

Page({
    data: {
        coupon: 0,
        Vouchers: 0
    },
    onLoad: function(o) {
        var e = wx.getStorageSync("bqxx");
        if ("1" == e.more) t = wx.getStorageSync("bqxx").color;
        if ("2" == e.more) var t = wx.getStorageSync("nbcolor");
        wx.setNavigationBarColor({
            frontColor: "#ffffff",
            backgroundColor: t
        });
        var n = this, a = wx.getStorageSync("bqxx");
        console.log(a), this.setData({
            bqxx: a,
            color: t
        });
        wx.getStorageSync("users").id;
        wx.login({
            success: function(o) {
                console.log(o.data), wx.getUserInfo({
                    success: function(o) {
                        console.log(o);
                        var e = o.userInfo;
                        e.nickName, e.avatarUrl, e.gender, e.province, e.city, e.country;
                        console.log(e), n.setData({
                            avatarUrl: e.avatarUrl,
                            nickName: e.nickName
                        });
                    },
                    fail: function() {
                        console.log("111");
                    }
                });
            }
        }), app.util.request({
            url: "entry/wxapp/Url",
            cachetime: "0",
            success: function(o) {
                n.setData({
                    url: o.data
                });
            }
        }), app.util.request({
            url: "entry/wxapp/Url2",
            cachetime: "0",
            success: function(o) {
                console.log(o.data), wx.setStorageSync("url2", o.data);
            }
        }), app.util.request({
            url: "entry/wxapp/FxSet",
            cachetime: "0",
            success: function(o) {
                console.log(o.data), n.setData({
                    fxset: o.data
                });
            }
        }), app.util.request({
            url: "entry/wxapp/Signset",
            cachetime: "0",
            success: function(o) {
                console.log(o.data), n.setData({
                    qdset: o.data[0]
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {
        var o = wx.getStorageSync("bqxx");
        if ("1" == o.more) e = wx.getStorageSync("bqxx").color;
        if ("2" == o.more) var e = wx.getStorageSync("nbcolor");
        wx.setNavigationBarColor({
            frontColor: "#ffffff",
            backgroundColor: e
        });
        var t = this, n = wx.getStorageSync("bqxx");
        console.log(n), this.setData({
            bqxx: n,
            color: e
        });
        var a = wx.getStorageSync("users").id;
        app.util.request({
            url: "entry/wxapp/UserInfo",
            cachetime: "0",
            data: {
                user_id: a
            },
            success: function(o) {
                console.log(o), t.setData({
                    integral: o.data.total_score,
                    wallet: o.data.wallet
                });
            }
        });
        var c = function() {
            var o = new Date(), e = o.getMonth() + 1, t = o.getDate();
            return e >= 1 && e <= 9 && (e = "0" + e), t >= 0 && t <= 9 && (t = "0" + t), o.getFullYear() + "-" + e + "-" + t + " " + o.getHours() + ":" + o.getMinutes() + ":" + o.getSeconds();
        }().slice(0, 10);
        app.util.request({
            url: "entry/wxapp/Coupons",
            cachetime: "0",
            data: {
                user_id: a
            },
            success: function(o) {
                console.log(o);
                var e = o.data.ok, n = [];
                if (console.log(e.length), e.length > 0) for (var a = 0; a < e.length; a++) console.log(e[a]), 
                e[a].conditions = Number(e[a].conditions), c <= e[a].end_time ? (console.log("有可以用的优惠券"), 
                2 == e[a].state && (n.push(e[a].length), console.log(e[a]), t.setData({
                    coupon: n.length
                }))) : (console.log("没有可以用的优惠券"), t.setData({
                    coupon: 0
                })); else t.setData({
                    coupon: 0
                });
            }
        }), app.util.request({
            url: "entry/wxapp/Voucher",
            cachetime: "0",
            data: {
                user_id: a
            },
            success: function(o) {
                console.log(o);
                var e = o.data.ok, n = [];
                if (e.length > 0) for (var a = 0; a < e.length; a++) e[a].conditions = Number(e[a].conditions), 
                console.log(e[a]), c <= e[a].end_time && (2 == e[a].state ? (console.log("有可以用的代金券"), 
                n.push(e[a]), t.setData({
                    Vouchers: n.length
                })) : (console.log("没有可以用的代金券"), t.setData({
                    Vouchers: 0
                }))); else t.setData({
                    Vouchers: 0
                });
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        var o = this;
        o.onLoad(), o.onShow(), wx.stopPullDownRefresh();
    },
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    map: function(o) {
        var e = wx.getStorageSync("users").id;
        wx.chooseAddress({
            success: function(o) {
                console.log(o.userName), console.log(o.postalCode), console.log(o.provinceName), 
                console.log(o.cityName), console.log(o.countyName), console.log(o.detailInfo), console.log(o.nationalCode), 
                console.log(o.telNumber);
                var t = o.telNumber, n = o.countyName + o.detailInfo, a = o.userName;
                app.util.request({
                    url: "entry/wxapp/UpdAdd",
                    cachetime: "0",
                    data: {
                        user_id: e,
                        user_tel: t,
                        user_address: n,
                        user_name: a
                    },
                    success: function(o) {
                        console.log(o);
                    }
                });
            }
        });
    },
    seller: function(o) {
        wx.navigateTo({
            url: "../seller/login"
        });
    },
    zxkf: function() {
        wx.navigateTo({
            url: "kfzx"
        });
    },
    bzzx: function() {
        wx.navigateTo({
            url: "bzzx"
        });
    },
    wallet: function(o) {
        wx.navigateTo({
            url: "wallet"
        });
    },
    youhui: function(o) {
        wx.navigateTo({
            url: "../coupons/shop_coupons"
        });
    },
    youhui2: function(o) {
        wx.navigateTo({
            url: "../coupons/mine_coupons"
        });
    },
    jfsc: function(o) {
        wx.navigateTo({
            url: "../integral/integral"
        });
    },
    integral: function(o) {
        wx.navigateTo({
            url: "integral"
        });
    },
    wyrz: function(o) {
        wx.navigateTo({
            url: "wyrz/authen"
        });
    },
    fx: function(o) {
        wx.navigateTo({
            url: "distribution/yaoqing"
        });
    },
    czzx: function(o) {
        wx.navigateTo({
            url: "cash"
        });
    },
    tzxcx: function(o) {
        var e = this.data.bqxx.tz_appid;
        console.log(e), wx.navigateToMiniProgram({
            appId: e,
            success: function(o) {
                console.log(o);
            }
        });
    }
});