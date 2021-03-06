var dsq, app = getApp();

Page({
    data: {
        tabbar: {},
        tabs: [ "待确认", "已确认", "已取消" ],
        activeIndex: 0,
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
    tabClick: function(t) {
        this.setData({
            activeIndex: t.currentTarget.id
        });
    },
    tel: function(t) {
        console.log(t.currentTarget.dataset.tel), wx.makePhoneCall({
            phoneNumber: t.currentTarget.dataset.tel
        });
    },
    qrdd: function(t) {
        var a = this, e = t.currentTarget.dataset.oid;
        console.log(e), wx.showModal({
            title: "提示",
            content: "确认订单吗？",
            success: function(e) {
                e.confirm ? (console.log("用户点击确定"), app.util.request({
                    url: "entry/wxapp/OkYdOrder",
                    cachetime: "0",
                    data: {
                        order_id: t.currentTarget.dataset.oid
                    },
                    success: function(t) {
                        console.log(t), 1 == t.data && (wx.showToast({
                            title: "操作成功",
                            duration: 1e3
                        }), setTimeout(function() {
                            a.setData({
                                pagenum: 1,
                                ddlist: [],
                                mygd: !1,
                                jzgd: !0,
                                jzwb: !1
                            }), a.reLoad(a.data.date);
                        }, 1e3));
                    }
                })) : e.cancel && console.log("用户点击取消");
            }
        });
    },
    tgtk: function(t) {
        var a = this;
        console.log("通过退款" + t.currentTarget.dataset.oid), wx.showModal({
            title: "提示",
            content: "确定通过退款吗？",
            success: function(e) {
                e.confirm ? (console.log("用户点击确定"), app.util.request({
                    url: "entry/wxapp/Ydtk",
                    cachetime: "0",
                    data: {
                        order_id: t.currentTarget.dataset.oid
                    },
                    success: function(t) {
                        console.log(t.data), "1" == t.data ? (wx.showToast({
                            title: "操作成功",
                            icon: "success",
                            duration: 1e3
                        }), setTimeout(function() {
                            a.setData({
                                pagenum: 1,
                                ddlist: [],
                                mygd: !1,
                                jzgd: !0,
                                jzwb: !1
                            }), a.reLoad(a.data.date);
                        }, 1e3)) : wx.showToast({
                            title: "请重试",
                            icon: "loading",
                            duration: 1e3
                        });
                    }
                })) : e.cancel && console.log("用户点击取消");
            }
        });
    },
    jjtk: function(t) {
        var a = this;
        console.log("拒绝退款" + t.currentTarget.dataset.oid), wx.showModal({
            title: "提示",
            content: "确定拒绝退款吗？",
            success: function(e) {
                e.confirm ? (console.log("用户点击确定"), app.util.request({
                    url: "entry/wxapp/Tkjj",
                    cachetime: "0",
                    data: {
                        order_id: t.currentTarget.dataset.oid
                    },
                    success: function(t) {
                        console.log(t.data), "1" == t.data ? (wx.showToast({
                            title: "操作成功",
                            icon: "success",
                            duration: 1e3
                        }), setTimeout(function() {
                            a.setData({
                                pagenum: 1,
                                ddlist: [],
                                mygd: !1,
                                jzgd: !0,
                                jzwb: !1
                            }), a.reLoad(a.data.date);
                        }, 1e3)) : wx.showToast({
                            title: "请重试",
                            icon: "loading",
                            duration: 1e3
                        });
                    }
                })) : e.cancel && console.log("用户点击取消");
            }
        });
    },
    scdd: function(t) {
        var a = this;
        console.log("删除订单" + t.currentTarget.dataset.oid), wx.showModal({
            title: "提示",
            content: "确定删除吗？",
            success: function(e) {
                e.confirm ? (console.log("用户点击确定"), app.util.request({
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
                            a.setData({
                                pagenum: 1,
                                ddlist: [],
                                mygd: !1,
                                jzgd: !0,
                                jzwb: !1
                            }), a.reLoad(a.data.date);
                        }, 1e3)) : wx.showToast({
                            title: "请重试",
                            icon: "loading",
                            duration: 1e3
                        });
                    }
                })) : e.cancel && console.log("用户点击取消");
            }
        });
    },
    onLoad: function(t) {
        app.editTabBar();
        t.activeIndex && this.setData({
            activeIndex: parseInt(t.activeIndex)
        });
        var a = wx.getStorageSync("sjdsjid");
        console.log(a), this.reLoad(this.data.date);
    },
    reLoad: function(t) {
        var a = wx.getStorageSync("sjdsjid");
        console.log(a);
        var e = this;
        app.util.request({
            url: "entry/wxapp/AppYdOrder",
            cachetime: "0",
            data: {
                store_id: a,
                page: e.data.pagenum,
                time: t
            },
            success: function(t) {
                console.log("分页返回的数据", t.data), 0 == t.data.length ? e.setData({
                    mygd: !0,
                    jzgd: !0,
                    jzwb: !0
                }) : e.setData({
                    jzgd: !0,
                    pagenum: e.data.pagenum + 1
                });
                var a = e.data.ddlist;
                a = a.concat(t.data);
                for (var o = [], n = [], s = [], d = 0; d < a.length; d++) "1" == a[d].state && o.push(a[d]), 
                "2" == a[d].state && n.push(a[d]), "4" != a[d].state && "5" != a[d].state && "6" != a[d].state && "7" != a[d].state || s.push(a[d]);
                console.log(o, n, s), e.setData({
                    dqr: o,
                    yqr: n,
                    yqx: s,
                    ddlist: a
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