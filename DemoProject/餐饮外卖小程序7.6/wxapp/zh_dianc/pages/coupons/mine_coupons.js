function _defineProperty(e, o, t) {
    return o in e ? Object.defineProperty(e, o, {
        value: t,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[o] = t, e;
}

var _Page, app = getApp();

Page((_Page = {
    data: {
        close: !1,
        current_time: ""
    },
    onLoad: function(e) {
        var o = wx.getStorageSync("bqxx");
        if ("1" == o.more) t = wx.getStorageSync("bqxx").color;
        if ("2" == o.more) var t = wx.getStorageSync("nbcolor");
        wx.setNavigationBarColor({
            frontColor: "#ffffff",
            backgroundColor: t
        }), this.setData({
            color: t,
            options: e
        }), console.log(e);
        var n = this;
        if (null == e.totalPrice) a = 0; else var a = Number(e.totalPrice);
        if (null == e.state) {
            console.log("状态是空的");
            var r = 0;
        } else {
            console.log("有状态");
            var i = e.state;
        }
        console.log(i), n.setData({
            state: i,
            states: r,
            totalPrice: a
        });
        var s = wx.getStorageSync("users").id, l = function() {
            var e = new Date(), o = e.getMonth() + 1, t = e.getDate();
            return o >= 1 && o <= 9 && (o = "0" + o), t >= 0 && t <= 9 && (t = "0" + t), e.getFullYear() + "-" + o + "-" + t + " " + e.getHours() + ":" + e.getMinutes() + ":" + e.getSeconds();
        }().slice(0, 10);
        console.log(l), n.setData({
            current_time: l
        }), app.util.request({
            url: "entry/wxapp/Coupons",
            cachetime: "0",
            data: {
                user_id: s
            },
            success: function(o) {
                console.log(o);
                for (var t = o.data.ok, a = [], r = 0; r < t.length; r++) t[r].conditions = Number(t[r].conditions), 
                l <= t[r].end_time && 2 == t[r].state && a.push(t[r]);
                if (null == e.dnjr && null == e.state) console.log("从个人中心进入"), n.setData({
                    coupon: a
                }); else {
                    console.log("从门店进入");
                    for (var i = [], s = 0; s < a.length; s++) a[s].store_id == getApp().sjid && i.push(a[s]);
                    n.setData({
                        coupon: i
                    });
                }
            }
        }), app.util.request({
            url: "entry/wxapp/Voucher",
            cachetime: "0",
            data: {
                user_id: s
            },
            success: function(o) {
                console.log(o);
                for (var t = o.data.ok, a = [], r = 0; r < t.length; r++) t[r].conditions = Number(t[r].conditions), 
                l <= t[r].end_time && 2 == t[r].state && (console.log(), a.push(t[r]));
                if (null == e.dnjr && null == e.state) console.log("从个人中心进入"), n.setData({
                    Vouchers: a
                }); else {
                    console.log("从门店进入");
                    for (var i = [], s = 0; s < a.length; s++) a[s].store_id == getApp().sjid && i.push(a[s]);
                    n.setData({
                        Vouchers: i
                    });
                }
            }
        });
    },
    select: function(e) {
        var o = this;
        "2" == o.data.state ? wx.redirectTo({
            url: "../order/order?&tableid=" + o.data.options.tableid,
            success: function(e) {},
            fail: function(e) {},
            complete: function(e) {}
        }) : wx.redirectTo({
            url: "../pay/pay",
            success: function(e) {},
            fail: function(e) {},
            complete: function(e) {}
        });
    },
    use: function(e) {
        var o = this, t = e.currentTarget.id;
        console.log(e), console.log(o.data);
        for (var n = o.data.coupon, a = 0; a < n.length; a++) if (t == n[a].id) {
            console.log(n[a]);
            var r = n[a];
            "2" == o.data.state ? wx.redirectTo({
                url: "../order/order?coupons_id=" + r.coupons_id + "&preferential=" + r.preferential + "&tableid=" + o.data.options.tableid,
                success: function(e) {},
                fail: function(e) {},
                complete: function(e) {}
            }) : wx.redirectTo({
                url: "../pay/pay?coupons_id=" + r.coupons_id + "&preferential=" + r.preferential,
                success: function(e) {},
                fail: function(e) {},
                complete: function(e) {}
            });
        }
        console.log(e), console.log(o.data);
    },
    user: function(e) {
        var o = this;
        console.log(o.data);
        for (var t = e.currentTarget.id, n = o.data.Vouchers, a = 0; a < n.length; a++) if (t == n[a].id) {
            console.log(n[a]);
            var r = n[a];
            "2" == o.data.state ? wx.redirectTo({
                url: "../order/order?vouchers_id=" + r.vouchers_id + "&preferential=" + r.preferential + "&tableid=" + o.data.options.tableid,
                success: function(e) {},
                fail: function(e) {},
                complete: function(e) {}
            }) : wx.redirectTo({
                url: "../pay/pay?vouchers_id=" + r.vouchers_id + "&preferential=" + r.preferential,
                success: function(e) {},
                fail: function(e) {},
                complete: function(e) {}
            });
        }
        console.log(e), console.log(o.data);
    },
    tzsj: function(e) {
        var o = e.currentTarget.dataset.sjid;
        console.log(o, this.data.options), null == this.data.options.dnjr ? (console.log("从个人中心进入"), 
        wx.switchTab({
            url: "../home/home"
        })) : (console.log("从门店进入"), wx.navigateBack({
            delta: 1
        }));
    },
    details: function(e) {
        console.log(e);
        var o = e.currentTarget.id;
        wx.navigateTo({
            url: "coupons_details?id=" + o + "&type=1&state=2"
        });
    },
    detail: function(e) {
        console.log(e);
        var o = e.currentTarget.id;
        wx.navigateTo({
            url: "coupons_details?id=" + o + "&type=2&state=2"
        });
    },
    onPullDownRefresh: function() {
        this.onLoad(), wx.stopPullDownRefresh();
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {}
}, _defineProperty(_Page, "onPullDownRefresh", function() {
    this.onLoad(), wx.stopPullDownRefresh();
}), _defineProperty(_Page, "onReachBottom", function() {}), _defineProperty(_Page, "onShareAppMessage", function() {}), 
_Page));