var dsq, app = getApp();

Page({
    data: {
        tabbar: {},
        jtsy: 0,
        ztsy: 0,
        zgsy: 0
    },
    onLoad: function(t) {
        app.editTabBar();
        var a = wx.getStorageSync("sjdsjid");
        console.log(a);
        var e = wx.getStorageSync("imglink");
        console.log(e);
        var n = this;
        app.util.request({
            url: "entry/wxapp/StoreOrder",
            cachetime: "0",
            data: {
                store_id: a
            },
            success: function(t) {
                console.log(t);
                for (var a = [], e = [], d = [], o = 0; o < t.data.length; o++) "2" == t.data[o].order.state && a.push(t.data[o]), 
                "3" == t.data[o].order.state && e.push(t.data[o]), "7" != t.data[o].order.state && "8" != t.data[o].order.state && "9" != t.data[o].order.state || d.push(t.data[o]);
                console.log(a, e, d), n.setData({
                    djd: a,
                    dps: e,
                    tkdd: d
                });
            }
        }), app.util.request({
            url: "entry/wxapp/AppDnOrder",
            cachetime: "0",
            data: {
                store_id: a
            },
            success: function(t) {
                console.log(t);
                for (var a = [], e = [], d = [], o = 0; o < t.data.length; o++) "1" == t.data[o].dn_state && a.push(t.data[o]), 
                "2" == t.data[o].dn_state && e.push(t.data[o]), "3" == t.data[o].dn_state && d.push(t.data[o]);
                console.log(a, e, d), n.setData({
                    dzf: a,
                    ywc: e,
                    ygb: d
                });
            }
        }), app.util.request({
            url: "entry/wxapp/store",
            cachetime: "0",
            data: {
                id: a
            },
            success: function(t) {
                console.log(t), n.setData({
                    url: e,
                    sjinfo: t.data
                });
            }
        }), app.util.request({
            url: "entry/wxapp/WmSale",
            cachetime: "0",
            data: {
                store_id: a
            },
            success: function(t) {
                console.log(t), n.setData({
                    jtsy: t.data
                });
            }
        }), app.util.request({
            url: "entry/wxapp/WmSale2",
            cachetime: "0",
            data: {
                store_id: a
            },
            success: function(t) {
                console.log(t), n.setData({
                    ztsy: t.data
                });
            }
        }), app.util.request({
            url: "entry/wxapp/WmSale3",
            cachetime: "0",
            data: {
                store_id: a
            },
            success: function(t) {
                console.log(t), n.setData({
                    zgsy: t.data
                });
            }
        }), app.util.request({
            url: "entry/wxapp/WmOrder",
            cachetime: "0",
            data: {
                store_id: a
            },
            success: function(t) {
                console.log(t), n.setData({
                    jrdd: t.data
                });
            }
        }), app.util.request({
            url: "entry/wxapp/WmOrder2",
            cachetime: "0",
            data: {
                store_id: a
            },
            success: function(t) {
                console.log(t), n.setData({
                    jrcj: t.data
                });
            }
        }), app.util.request({
            url: "entry/wxapp/Traffic",
            cachetime: "0",
            data: {
                store_id: a
            },
            success: function(t) {
                console.log(t), n.setData({
                    fwl: t.data
                });
            }
        }), wx.getStorageSync("yybb") && (dsq = setInterval(function() {
            app.util.request({
                url: "entry/wxapp/NewOrder",
                cachetime: "0",
                data: {
                    store_id: a
                },
                success: function(t) {
                    console.log(t), 1 == t.data && wx.playBackgroundAudio({
                        dataUrl: wx.getStorageSync("url2") + "addons/zh_dianc/template/images/wm.wav",
                        title: "语音播报"
                    }), 2 == t.data && wx.playBackgroundAudio({
                        dataUrl: wx.getStorageSync("url2") + "addons/zh_dianc/template/images/dn.wav",
                        title: "语音播报"
                    }), 3 == t.data && wx.playBackgroundAudio({
                        dataUrl: wx.getStorageSync("url2") + "addons/zh_dianc/template/images/yy.wav",
                        title: "语音播报"
                    });
                }
            });
        }, 1e4));
    },
    djd: function() {
        wx.navigateTo({
            url: "dd/wmdd?activeIndex=0"
        });
    },
    dps: function() {
        wx.navigateTo({
            url: "dd/wmdd?activeIndex=1"
        });
    },
    tkdd: function() {
        wx.navigateTo({
            url: "dd/wmdd?activeIndex=2"
        });
    },
    dzf: function() {
        wx.navigateTo({
            url: "dd/tndd?activeIndex=0"
        });
    },
    ywc: function() {
        wx.navigateTo({
            url: "dd/tndd?activeIndex=1"
        });
    },
    ygb: function() {
        wx.navigateTo({
            url: "dd/tndd?activeIndex=2"
        });
    },
    tzsz: function() {
        wx.redirectTo({
            url: "shezhi"
        });
    },
    wytx: function() {
        wx.navigateTo({
            url: "wytx"
        });
    },
    smhx: function() {
        wx.scanCode({
            success: function(t) {
                console.log(t);
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {
        clearInterval(dsq);
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});