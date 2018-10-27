var app = getApp(), util = require("../../../utils/util.js");

Page({
    data: {
        havecode: !1,
        fwxy: !0,
        wdtd: 0
    },
    ljyq: function() {
        var t = this, a = this.data.fxset, e = this.data.wdsq;
        console.log(a, e), "1" == a.is_fx ? e ? ("1" == e.state && wx.showModal({
            title: "提示",
            content: "您的申请正在审核中，请耐心等待"
        }), "2" == e.state && t.setData({
            share_modal_active: "active"
        }), "3" == e.state && wx.showModal({
            title: "提示",
            content: "您的申请已被拒绝，点击确定重新申请",
            success: function(t) {
                t.confirm ? (console.log("用户点击确定"), wx.navigateTo({
                    url: "distribution"
                })) : t.cancel && console.log("用户点击取消");
            }
        })) : (console.log("不是分销商"), wx.navigateTo({
            url: "distribution"
        })) : (console.log("未开启审核"), t.setData({
            share_modal_active: "active"
        }));
    },
    onLoad: function(t) {},
    onReady: function() {},
    onShow: function() {
        var t = this, a = wx.getStorageSync("users").id, e = wx.getStorageSync("users").name, s = wx.getStorageSync("imglink");
        console.log(a), app.util.request({
            url: "entry/wxapp/FxSet",
            cachetime: "0",
            success: function(e) {
                console.log(e.data), t.setData({
                    img: e.data.img,
                    url: s,
                    fxset: e.data
                }), "1" == e.data.is_fx && (console.log("开启分销审核"), app.util.request({
                    url: "entry/wxapp/MyDistribution",
                    cachetime: "0",
                    data: {
                        user_id: a
                    },
                    success: function(a) {
                        console.log(a.data), t.setData({
                            wdsq: a.data
                        }), a.data ? "2" == a.data.state && t.setData({
                            havecode: !0
                        }) : (console.log("不是分销商"), t.setData({
                            havecode: !1
                        }));
                    }
                })), "2" == e.data.is_fx && (console.log("未开启审核"), t.setData({
                    havecode: !0
                }));
            }
        }), app.util.request({
            url: "entry/wxapp/MyCode",
            cachetime: "0",
            data: {
                user_id: a
            },
            success: function(a) {
                console.log(a.data), t.setData({
                    code: a.data
                });
            }
        }), app.util.request({
            url: "entry/wxapp/system",
            cachetime: "0",
            success: function(s) {
                console.log(s), t.setData({
                    link_logo: s.data.link_logo,
                    pt_name: s.data.pt_name,
                    userid: a,
                    username: e
                });
            }
        }), app.util.request({
            url: "entry/wxapp/UserInfo",
            cachetime: "0",
            data: {
                user_id: a
            },
            success: function(a) {
                console.log(a), t.setData({
                    userinfo: a.data
                });
            }
        }), app.util.request({
            url: "entry/wxapp/YjtxList",
            cachetime: "0",
            data: {
                user_id: a
            },
            success: function(a) {
                console.log(a), t.setData({
                    txmx: a.data
                });
            }
        }), app.util.request({
            url: "entry/wxapp/Earnings",
            cachetime: "0",
            data: {
                user_id: a
            },
            success: function(a) {
                console.log(a);
                for (var e = 0; e < a.data.length; e++) a.data[e].time = util.ormatDate(a.data[e].time);
                t.setData({
                    symx: a.data
                });
            }
        }), app.util.request({
            url: "entry/wxapp/MyTeam",
            cachetime: "0",
            data: {
                user_id: a
            },
            success: function(a) {
                console.log(a), t.setData({
                    wdtd: a.data.one.length + a.data.two.length
                });
            }
        });
    },
    showShareModal: function() {
        this.setData({
            share_modal_active: "active",
            no_scroll: !0
        });
    },
    shareModalClose: function() {
        this.setData({
            share_modal_active: "",
            no_scroll: !1
        });
    },
    mdmfx: function() {
        this.setData({
            share_modal_active: "",
            no_scroll: !1,
            fwxy: !1
        });
    },
    yczz: function() {
        this.setData({
            fwxy: !0
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        this.setData({
            havecode: !1
        }), this.onShow();
    },
    onReachBottom: function() {},
    onShareAppMessage: function(t) {
        return console.log(this.data.pt_name, this.data.userid, this.data.username), console.log(t), 
        "menu" !== t.from && {
            title: this.data.username + "邀请你来看看" + this.data.pt_name,
            path: "zh_dianc/pages/home/home?userid=" + this.data.userid,
            success: function(t) {},
            fail: function(t) {}
        };
    }
});