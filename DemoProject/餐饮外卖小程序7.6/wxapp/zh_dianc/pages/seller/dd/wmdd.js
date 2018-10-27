var dsq, app = getApp();

Page({
    data: {
        tabbar: {},
        tabs: [ "待接单", "待配送", "退款订单", "已完成" ],
        activeIndex: 0,
        isuu: !1,
        fwxy: !0,
        date: "",
        pagenum: 1,
        ddlist: [],
        mygd: !1,
        jzgd: !0,
        jzwb: !1
    },
    bindDateChange: function(t) {
        this.setData({
            date: t.detail.value
        });
    },
    sousuo: function() {
        this.setData({
            pagenum: 1,
            ddlist: [],
            mygd: !1,
            jzgd: !0,
            jzwb: !1
        }), this.reLoad(this.data.date);
    },
    lookck: function(t) {
        var e = this, a = t.currentTarget.dataset.oid, o = t.currentTarget.dataset.istake;
        console.log(a, o), "2" == o ? (this.setData({
            fwxy: !1
        }), app.util.request({
            url: "entry/wxapp/GetOrderPrice",
            cachetime: "0",
            data: {
                order_id: t.currentTarget.dataset.oid
            },
            success: function(t) {
                console.log(t), console.log("uu信息", JSON.parse(t.data)), e.setData({
                    uuinfo: JSON.parse(t.data),
                    oid: a
                });
            }
        })) : wx.showModal({
            title: "提示",
            content: "确定接单吗？",
            success: function(t) {
                t.confirm ? (console.log("用户点击确定"), app.util.request({
                    url: "entry/wxapp/JieOrder",
                    cachetime: "0",
                    data: {
                        order_id: a
                    },
                    success: function(t) {
                        console.log(t), 1 == t.data && (wx.showToast({
                            title: "接单成功",
                            duration: 1e3
                        }), setTimeout(function() {
                            e.setData({
                                pagenum: 1,
                                ddlist: [],
                                mygd: !1,
                                jzgd: !0,
                                jzwb: !1
                            }), e.reLoad(e.data.date);
                        }, 1e3));
                    }
                })) : t.cancel && console.log("用户点击取消");
            }
        });
    },
    qx: function() {
        this.setData({
            fwxy: !0,
            uuinfo: ""
        });
    },
    queren: function() {
        var t = this, e = this.data.oid, a = this.data.uuinfo;
        console.log(e, a), null != a ? app.util.request({
            url: "entry/wxapp/UuAddOrder",
            cachetime: "0",
            data: {
                order_id: e,
                price_token: a.price_token,
                total_money: a.total_money,
                need_paymoney: a.need_paymoney
            },
            success: function(e) {
                console.log(e, JSON.parse(e.data)), "ok" == JSON.parse(e.data).return_code && "订单发布成功" == JSON.parse(e.data).return_msg ? (wx.showToast({
                    title: "接单成功",
                    duration: 1e3
                }), t.setData({
                    fwxy: !0,
                    uuinfo: ""
                }), setTimeout(function() {
                    t.setData({
                        pagenum: 1,
                        ddlist: [],
                        mygd: !1,
                        jzgd: !0,
                        jzwb: !1
                    }), t.reLoad(t.data.date);
                }, 1e3)) : "账户余额不足，请使用在线支付方式" == JSON.parse(e.data).return_msg ? (wx.showToast({
                    title: "账户余额不足",
                    icon: "loading"
                }), t.setData({
                    fwxy: !0,
                    uuinfo: ""
                })) : (wx.showToast({
                    title: "网络错误",
                    icon: "loading"
                }), t.setData({
                    fwxy: !0,
                    uuinfo: ""
                }));
            }
        }) : wx.showToast({
            title: "网络错误"
        });
    },
    tabClick: function(t) {
        this.setData({
            activeIndex: t.currentTarget.id
        });
    },
    dw: function(t) {
        console.log(t.currentTarget.dataset), wx.openLocation({
            latitude: Number(t.currentTarget.dataset.lat),
            longitude: Number(t.currentTarget.dataset.lng),
            scale: 28,
            address: t.currentTarget.dataset.wz
        });
    },
    tel: function(t) {
        console.log(t.currentTarget.dataset.tel), wx.makePhoneCall({
            phoneNumber: t.currentTarget.dataset.tel
        });
    },
    jied: function(t) {
        var e = this, a = t.currentTarget.dataset.oid;
        console.log(a), wx.showModal({
            title: "提示",
            content: "确定接单吗？",
            success: function(a) {
                a.confirm ? (console.log("用户点击确定"), app.util.request({
                    url: "entry/wxapp/JieOrder",
                    cachetime: "0",
                    data: {
                        order_id: t.currentTarget.dataset.oid
                    },
                    success: function(t) {
                        console.log(t), 1 == t.data && (wx.showToast({
                            title: "接单成功",
                            duration: 1e3
                        }), setTimeout(function() {
                            e.setData({
                                pagenum: 1,
                                ddlist: [],
                                mygd: !1,
                                jzgd: !0,
                                jzwb: !1
                            }), e.reLoad(e.data.date);
                        }, 1e3));
                    }
                })) : a.cancel && console.log("用户点击取消");
            }
        });
    },
    wcps: function(t) {
        var e = this;
        console.log("完成配送" + t.currentTarget.dataset.oid), wx.showModal({
            title: "提示",
            content: "确定完成配送吗？",
            success: function(a) {
                a.confirm ? (console.log("用户点击确定"), app.util.request({
                    url: "entry/wxapp/Complete",
                    cachetime: "0",
                    data: {
                        id: t.currentTarget.dataset.oid
                    },
                    success: function(t) {
                        console.log(t.data), "1" == t.data ? (wx.showToast({
                            title: "提交成功",
                            icon: "success",
                            duration: 1e3
                        }), setTimeout(function() {
                            e.setData({
                                pagenum: 1,
                                ddlist: [],
                                mygd: !1,
                                jzgd: !0,
                                jzwb: !1
                            }), e.reLoad(e.data.date);
                        }, 1e3)) : wx.showToast({
                            title: "请重试",
                            icon: "loading",
                            duration: 1e3
                        });
                    }
                })) : a.cancel && console.log("用户点击取消");
            }
        });
    },
    tgtk: function(t) {
        var e = this;
        console.log("通过退款" + t.currentTarget.dataset.oid), wx.showModal({
            title: "提示",
            content: "确定通过退款吗？",
            success: function(a) {
                a.confirm ? (console.log("用户点击确定"), app.util.request({
                    url: "entry/wxapp/Tg",
                    cachetime: "0",
                    data: {
                        order_id: t.currentTarget.dataset.oid
                    },
                    success: function(t) {
                        console.log(t.data), "1" == t.data ? (wx.showToast({
                            title: "提交成功",
                            icon: "success",
                            duration: 1e3
                        }), setTimeout(function() {
                            e.setData({
                                pagenum: 1,
                                ddlist: [],
                                mygd: !1,
                                jzgd: !0,
                                jzwb: !1
                            }), e.reLoad(e.data.date);
                        }, 1e3)) : wx.showToast({
                            title: "请重试",
                            icon: "loading",
                            duration: 1e3
                        });
                    }
                })) : a.cancel && console.log("用户点击取消");
            }
        });
    },
    jjtk: function(t) {
        var e = this;
        console.log("拒绝退款" + t.currentTarget.dataset.oid), wx.showModal({
            title: "提示",
            content: "确定拒绝退款吗？",
            success: function(a) {
                a.confirm ? (console.log("用户点击确定"), app.util.request({
                    url: "entry/wxapp/Jj",
                    cachetime: "0",
                    data: {
                        order_id: t.currentTarget.dataset.oid
                    },
                    success: function(t) {
                        console.log(t.data), "1" == t.data ? (wx.showToast({
                            title: "提交成功",
                            icon: "success",
                            duration: 1e3
                        }), setTimeout(function() {
                            e.setData({
                                pagenum: 1,
                                ddlist: [],
                                mygd: !1,
                                jzgd: !0,
                                jzwb: !1
                            }), e.reLoad(e.data.date);
                        }, 1e3)) : wx.showToast({
                            title: "请重试",
                            icon: "loading",
                            duration: 1e3
                        });
                    }
                })) : a.cancel && console.log("用户点击取消");
            }
        });
    },
    scdd: function(t) {
        var e = this;
        console.log("删除订单" + t.currentTarget.dataset.oid), wx.showModal({
            title: "提示",
            content: "确定删除吗？",
            success: function(a) {
                a.confirm ? (console.log("用户点击确定"), app.util.request({
                    url: "entry/wxapp/Del",
                    cachetime: "0",
                    data: {
                        order_id: t.currentTarget.dataset.oid
                    },
                    success: function(t) {
                        console.log(t.data), "1" == t.data ? (wx.showToast({
                            title: "提交成功",
                            icon: "success",
                            duration: 1e3
                        }), setTimeout(function() {
                            e.setData({
                                pagenum: 1,
                                ddlist: [],
                                mygd: !1,
                                jzgd: !0,
                                jzwb: !1
                            }), e.reLoad(e.data.date);
                        }, 1e3)) : wx.showToast({
                            title: "请重试",
                            icon: "loading",
                            duration: 1e3
                        });
                    }
                })) : a.cancel && console.log("用户点击取消");
            }
        });
    },
    onLoad: function(t) {
        app.editTabBar();
        var e = this;
        t.activeIndex && this.setData({
            activeIndex: parseInt(t.activeIndex)
        });
        var a = wx.getStorageSync("sjdsjid");
        console.log(a), app.util.request({
            url: "entry/wxapp/Store",
            cachetime: "0",
            data: {
                id: a
            },
            success: function(t) {
                console.log("商家信息", t), "3" == t.data.ps_mode && e.setData({
                    isuu: !0
                });
            }
        }), this.reLoad(this.data.date);
    },
    reLoad: function(t) {
        app.editTabBar();
        var e = wx.getStorageSync("sjdsjid");
        console.log(e);
        var a = this;
        app.util.request({
            url: "entry/wxapp/StoreOrder",
            cachetime: "0",
            data: {
                store_id: e,
                page: a.data.pagenum,
                time: t
            },
            success: function(t) {
                console.log("分页返回的数据", t.data), 0 == t.data.length ? a.setData({
                    mygd: !0,
                    jzgd: !0,
                    jzwb: !0
                }) : a.setData({
                    jzgd: !0,
                    pagenum: a.data.pagenum + 1
                });
                var e = a.data.ddlist;
                e = e.concat(t.data);
                for (var o = [], s = [], n = [], d = [], i = 0; i < e.length; i++) "2" == e[i].order.state && o.push(e[i]), 
                "3" == e[i].order.state && s.push(e[i]), "7" != e[i].order.state && "8" != e[i].order.state && "9" != e[i].order.state || n.push(e[i]), 
                "4" != e[i].order.state && "6" != e[i].order.state || d.push(e[i]);
                console.log(o, s, n, d), a.setData({
                    djd: o,
                    dps: s,
                    tkdd: n,
                    ywc: d,
                    ddlist: e
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {
        clearInterval(dsq);
    },
    onPullDownRefresh: function() {
        this.setData({
            date: "",
            pagenum: 1,
            ddlist: [],
            mygd: !1,
            jzgd: !0,
            jzwb: !1
        }), this.reLoad(this.data.date), wx.stopPullDownRefresh();
    },
    onReachBottom: function() {
        console.log("上拉加载", this.data.pagenum);
        !this.data.mygd && this.data.jzgd && (this.setData({
            jzgd: !1
        }), this.reLoad(this.data.date));
    },
    onShareAppMessage: function() {}
});