var app = getApp(), util = require("../../utils/util.js");

Page({
    data: {
        tabs: [ "外卖", "点餐", "预定" ],
        wm: "外卖",
        dc: "点餐",
        yd: "预定",
        activeIndex: 0,
        dndd: [],
        wmdd: []
    },
    tabClick: function(t) {
        this.setData({
            activeIndex: t.currentTarget.id
        });
    },
    onLoad: function(t) {
        var e = wx.getStorageSync("imglink"), o = t.activeindex;
        this.setData({
            activeIndex: o,
            imglink: e
        });
    },
    onReady: function() {},
    onShow: function() {
        var t = wx.getStorageSync("bqxx");
        console.log(t);
        var e = this;
        if (app.util.request({
            url: "entry/wxapp/system",
            cachetime: "0",
            success: function(t) {
                console.log(t), "" != t.data.wm_name && e.setData({
                    wm: t.data.wm_name
                }), "" != t.data.dc_name && e.setData({
                    dc: t.data.dc_name
                }), "" != t.data.yd_name && e.setData({
                    yd: t.data.yd_name
                });
                var o = Number(t.data.day);
                console.log(o), 0 == o && (o = 1), e.setData({
                    day: o
                });
            }
        }), "1" == t.more) o = wx.getStorageSync("bqxx").color;
        if ("2" == t.more) var o = wx.getStorageSync("nbcolor");
        wx.setNavigationBarColor({
            frontColor: "#ffffff",
            backgroundColor: o
        }), this.setData({
            color: o
        }), console.log("ddonShow"), this.reLoad();
    },
    reLoad: function() {
        var t = wx.getStorageSync("users").id, e = this;
        app.util.request({
            url: "entry/wxapp/MyReservation",
            cachetime: "0",
            data: {
                user_id: t
            },
            success: function(t) {
                console.log(t), e.setData({
                    ydlist: t.data
                });
            }
        }), app.util.request({
            url: "entry/wxapp/myorder",
            cachetime: "0",
            data: {
                user_id: t
            },
            success: function(t) {
                console.log(t);
                for (var o = [], a = [], n = 0; n < t.data.length; n++) "1" == t.data[n].type ? (a.push(t.data[n]), 
                e.setData({
                    dndd: o,
                    wmdd: a
                })) : (o.push(t.data[n]), e.setData({
                    dndd: o,
                    wmdd: a
                }));
                for (var c = 0; c < a.length; c++) if ("3" == a[c].state) {
                    var s = util.formatTime(new Date()).substring(0, 10).replace(/\//g, "-"), d = a[c].time.substring(0, 10);
                    console.log(d, s);
                    var i = util.DateDiff(d, s);
                    console.log(i, e.data.day), i >= e.data.day && app.util.request({
                        url: "entry/wxapp/Complete",
                        cachetime: "0",
                        data: {
                            id: a[c].id
                        },
                        success: function(t) {
                            console.log(t.data), "1" == t.data && (console.log("自动确认收货"), e.reLoad());
                        }
                    });
                }
                console.log(o, a);
            }
        });
    },
    qxyy: function(t) {
        var e = this;
        console.log("取消预约" + t.currentTarget.dataset.yyid), wx.showModal({
            title: "提示",
            content: "确定取消预约么",
            success: function(o) {
                o.confirm ? (console.log("用户点击确定"), app.util.request({
                    url: "entry/wxapp/CancelReservation",
                    cachetime: "0",
                    data: {
                        id: t.currentTarget.dataset.yyid
                    },
                    success: function(t) {
                        console.log(t.data), "1" == t.data ? (wx.showToast({
                            title: "取消成功",
                            icon: "success",
                            duration: 1e3
                        }), setTimeout(function() {
                            e.reLoad();
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
    ckxq: function(t) {
        console.log("查看详情" + t.currentTarget.dataset.yyid), wx.navigateTo({
            url: "reserveinfo/reserveinfo?yyid=" + t.currentTarget.dataset.yyid
        });
    },
    qxdd: function(t) {
        var e = this;
        console.log("取消订单" + t.currentTarget.dataset.wmddid), wx.showModal({
            title: "提示",
            content: "确定取消订单么",
            success: function(o) {
                o.confirm ? (console.log("用户点击确定"), app.util.request({
                    url: "entry/wxapp/CancelOrder",
                    cachetime: "0",
                    data: {
                        order_id: t.currentTarget.dataset.wmddid
                    },
                    success: function(t) {
                        console.log(t.data), "1" == t.data ? (wx.showToast({
                            title: "取消成功",
                            icon: "success",
                            duration: 1e3
                        }), setTimeout(function() {
                            e.reLoad();
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
    ljzf: function(t) {
        console.log("立即支付" + t.currentTarget.dataset.wmddid), wx.navigateTo({
            url: "waim/waim?wmddid=" + t.currentTarget.dataset.wmddid
        });
    },
    txsj: function(t) {
        console.log("提醒商家" + t.currentTarget.dataset.wmddtel), wx.makePhoneCall({
            phoneNumber: t.currentTarget.dataset.wmddtel
        });
    },
    lxsj: function(t) {
        console.log("联系商家" + t.currentTarget.dataset.wmddtel), wx.makePhoneCall({
            phoneNumber: t.currentTarget.dataset.wmddtel
        });
    },
    qrsh: function(t) {
        var e = this;
        console.log("确认收货" + t.currentTarget.dataset.wmddid), wx.showModal({
            title: "提示",
            content: "确定收货么",
            success: function(o) {
                o.confirm ? (console.log("用户点击确定"), app.util.request({
                    url: "entry/wxapp/Complete",
                    cachetime: "0",
                    data: {
                        id: t.currentTarget.dataset.wmddid
                    },
                    success: function(t) {
                        console.log(t.data), "1" == t.data ? (wx.showToast({
                            title: "收货成功",
                            icon: "success",
                            duration: 1e3
                        }), setTimeout(function() {
                            e.reLoad();
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
    scdd: function(t) {
        var e = this;
        console.log("删除订单" + t.currentTarget.dataset.wmddid), wx.showModal({
            title: "提示",
            content: "删除订单么",
            success: function(o) {
                o.confirm ? (console.log("用户点击确定"), app.util.request({
                    url: "entry/wxapp/DelOrder",
                    cachetime: "0",
                    data: {
                        order_id: t.currentTarget.dataset.wmddid
                    },
                    success: function(t) {
                        console.log(t.data), "1" == t.data ? (wx.showToast({
                            title: "删除成功",
                            icon: "success",
                            duration: 1e3
                        }), setTimeout(function() {
                            e.reLoad();
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
    scyy: function(t) {
        var e = this;
        console.log("删除订单" + t.currentTarget.dataset.yyid), wx.showModal({
            title: "提示",
            content: "删除订单么",
            success: function(o) {
                o.confirm ? (console.log("用户点击确定"), app.util.request({
                    url: "entry/wxapp/DelYd",
                    cachetime: "0",
                    data: {
                        id: t.currentTarget.dataset.yyid
                    },
                    success: function(t) {
                        console.log(t.data), "1" == t.data ? (wx.showToast({
                            title: "删除成功",
                            icon: "success",
                            duration: 1e3
                        }), setTimeout(function() {
                            e.reLoad();
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
    sqtk: function(t) {
        var e = this;
        console.log("申请退款" + t.currentTarget.dataset.wmddid), wx.showModal({
            title: "提示",
            content: "申请退款么",
            success: function(o) {
                o.confirm ? (console.log("用户点击确定"), app.util.request({
                    url: "entry/wxapp/Tuik",
                    cachetime: "0",
                    data: {
                        order_id: t.currentTarget.dataset.wmddid
                    },
                    success: function(t) {
                        console.log(t.data), "1" == t.data ? (wx.showToast({
                            title: "申请成功",
                            icon: "success",
                            duration: 1e3
                        }), setTimeout(function() {
                            e.reLoad();
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
    yysqtk: function(t) {
        var e = this;
        console.log("预约申请退款" + t.currentTarget.dataset.yyid), wx.showModal({
            title: "提示",
            content: "申请退款么",
            success: function(o) {
                o.confirm ? (console.log("用户点击确定"), app.util.request({
                    url: "entry/wxapp/YdRefund",
                    cachetime: "0",
                    data: {
                        id: t.currentTarget.dataset.yyid
                    },
                    success: function(t) {
                        console.log(t.data), "1" == t.data ? (wx.showToast({
                            title: "申请成功",
                            icon: "success",
                            duration: 1e3
                        }), setTimeout(function() {
                            e.reLoad();
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
    zlyd: function(t) {
        wx.switchTab({
            url: "../home/home"
        });
    },
    pingjia: function(t) {
        console.log("评价" + t.currentTarget.dataset.wmddid), wx.navigateTo({
            url: "../comment/comment?wmddid=" + t.currentTarget.dataset.wmddid
        });
    },
    dnljzf: function(t) {
        console.log("立即支付" + t.currentTarget.dataset.dnddid), wx.navigateTo({
            url: "choose/choose?dnddid=" + t.currentTarget.dataset.dnddid
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        this.reLoad(), setTimeout(function() {
            wx.stopPullDownRefresh();
        }, 1e3);
    },
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});