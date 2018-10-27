var qqmapsdk, app = getApp(), QQMapWX = require("../../utils/qqmap-wx-jssdk.js"), util = require("../../utils/util.js");

Page({
    data: {
        listarr: [ "推荐排序", "销量", "评分", "距离" ],
        activeIndex: 0,
        qqsj: !1,
        scrollHeight: 0,
        pagenum: 1,
        storelist: [],
        mygd: !1,
        jzgd: !0,
        jzwb: !1
    },
    onLoad: function(t) {
        var e = wx.getStorageSync("bqxx");
        if ("1" == e.more) o = wx.getStorageSync("bqxx").color;
        if ("2" == e.more) var o = wx.getStorageSync("nbcolor");
        wx.setNavigationBarColor({
            frontColor: "#ffffff",
            backgroundColor: o
        }), console.log(t), wx.setNavigationBarTitle({
            title: t.flname
        });
        var a = wx.getStorageSync("imglink");
        this.setData({
            flid: t.flid,
            url: a
        }), console.log(this.data.flid);
        var s = this;
        qqmapsdk = new QQMapWX({
            key: e.map_key
        }), wx.getSystemInfo({
            success: function(t) {
                s.setData({
                    scrollHeight: t.windowHeight
                });
            }
        }), this.reLoad();
    },
    tabClick: function(t) {
        var e = this, o = t.currentTarget.id;
        console.log(o), this.setData({
            activeIndex: t.currentTarget.id,
            qqsj: !1
        }), "0" == o && e.setData({
            tjstorelist: e.data.tjpx.sort(e.comparesx("number")),
            qqsj: !0
        }), "1" == o && (console.log(e.data.xlpx), e.setData({
            xlstorelist: e.data.xlpx.sort(e.comparejx("sales")),
            qqsj: !0
        })), "2" == o && (console.log(e.data.pfpx), e.setData({
            pfstorelist: e.data.pfpx.sort(e.comparejx("score")),
            qqsj: !0
        })), "3" == o && e.setData({
            qqsj: !0
        });
    },
    comparesx: function(t) {
        return function(e, o) {
            var a = e[t], s = o[t];
            return isNaN(Number(a)) || isNaN(Number(s)) || (a = Number(a), s = Number(s)), a < s ? -1 : a > s ? 1 : 0;
        };
    },
    comparejx: function(t) {
        return function(e, o) {
            var a = e[t], s = o[t];
            return isNaN(Number(a)) || isNaN(Number(s)) || (a = Number(a), s = Number(s)), a < s ? 1 : a > s ? -1 : 0;
        };
    },
    sljz: function() {
        console.log("上拉加载", this.data.pagenum);
        !this.data.mygd && this.data.jzgd && (this.setData({
            jzgd: !1
        }), this.reLoad());
    },
    reLoad: function() {
        console.log(this.data.flid);
        var t = this;
        wx.getLocation({
            type: "wgs84",
            success: function(e) {
                var o = e.latitude, a = e.longitude, s = o + "," + a;
                console.log(s), qqmapsdk.reverseGeocoder({
                    location: {
                        latitude: o,
                        longitude: a
                    },
                    coord_type: 1,
                    success: function(e) {
                        var o = e.result.ad_info.location;
                        console.log(e), console.log(e.result.formatted_addresses.recommend), console.log("坐标转地址后的经纬度：", e.result.ad_info.location), 
                        t.setData({
                            weizhi: e.result.formatted_addresses.recommend
                        }), app.util.request({
                            url: "entry/wxapp/StoreList",
                            cachetime: "0",
                            data: {
                                lat: o.lat,
                                lng: o.lng,
                                type_id: t.data.flid,
                                page: t.data.pagenum,
                                pagesize: 10
                            },
                            success: function(e) {
                                console.log("分页返回的商家列表数据", e.data), e.data.length < 10 && (t.setData({
                                    mygd: !0,
                                    jzwb: !0
                                }), wx.showToast({
                                    title: "没有更多了",
                                    icon: "loading",
                                    duration: 1e3
                                })), t.setData({
                                    jzgd: !0,
                                    pagenum: t.data.pagenum + 1
                                });
                                var a = t.data.storelist;
                                if (a = a.concat(e.data), 0 == e.data.length) t.setData({
                                    tjstorelist: a,
                                    jlpx: a,
                                    xlpx: a,
                                    pfpx: a,
                                    qqsj: !0
                                }); else for (var s = 0; s < a.length; s++) {
                                    "0.0" == a[s].score && (a[s].score = "5.0");
                                    var n = a[s].coordinates.split(",");
                                    console.log(n, o);
                                    var i = util.getDistance(o.lat, o.lng, n[0], n[1]).toFixed(1);
                                    console.log(i), i < 1e3 ? (a[s].aa = i + "m", a[s].aa1 = i) : (a[s].aa = (i / 1e3).toFixed(2) + "km", 
                                    a[s].aa1 = i), t.setData({
                                        jlstorelist: a,
                                        tjpx: a,
                                        xlpx: a,
                                        pfpx: a,
                                        storelist: a,
                                        qqsj: !0
                                    }), t.setData({
                                        tjstorelist: t.data.tjpx.sort(t.comparesx("number")),
                                        xlstorelist: t.data.xlpx.sort(t.comparejx("sales")),
                                        pfstorelist: t.data.pfpx.sort(t.comparejx("score"))
                                    });
                                }
                                console.log(a);
                            }
                        });
                    },
                    fail: function(t) {
                        console.log(t);
                    },
                    complete: function(t) {
                        console.log(t);
                    }
                });
            },
            fail: function() {
                wx.showModal({
                    title: "警告",
                    content: "您点击了拒绝授权,无法正常使用功能，点击确定重新获取授权。",
                    showCancel: !1,
                    success: function(e) {
                        e.confirm && wx.openSetting({
                            success: function(e) {
                                e.authSetting["scope.userLocation"], t.reLoad();
                            },
                            fail: function(t) {}
                        });
                    }
                });
            },
            complete: function(t) {}
        });
    },
    distance: function(t, e, o) {
        var a;
        qqmapsdk.calculateDistance({
            mode: "driving",
            from: {
                latitude: t.lat,
                longitude: t.lng
            },
            to: [ {
                latitude: e.lat,
                longitude: e.lng
            } ],
            success: function(t) {
                console.log(t), 0 == t.status && (a = Math.round(t.result.elements[0].distance), 
                o(a));
            },
            fail: function(t) {
                console.log(t), 373 == t.status && (a = 15e3, o(a));
            },
            complete: function(t) {
                console.log(t);
            }
        });
    },
    changejwd: function(t, e, o) {
        var a;
        qqmapsdk.reverseGeocoder({
            location: {
                latitude: t,
                longitude: e
            },
            coord_type: 3,
            success: function(t) {
                console.log(t), console.log("坐标转地址后的经纬度：", t.result.ad_info.location), a = t.result.ad_info.location, 
                o(a);
            },
            fail: function(t) {
                console.log(t);
            },
            complete: function(t) {
                console.log(t);
            }
        });
    },
    tzsj: function(t) {
        console.log(t.currentTarget.dataset.sjid);
        var e = t.currentTarget.dataset.sjid;
        getApp().sjid = t.currentTarget.dataset.sjid.id, "0" == e.is_dn && "0" == e.is_pd && "0" == e.is_yy && "1" == e.is_wm && "0" == e.is_sy ? wx.navigateTo({
            url: "../index/index?type=2"
        }) : wx.navigateTo({
            url: "../info/info"
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        var t = this;
        this.setData({
            activeIndex: 0,
            qqsj: !1,
            pagenum: 1,
            storelist: [],
            mygd: !1,
            jzgd: !0,
            jzwb: !1
        }), t.reLoad(), wx.stopPullDownRefresh();
    },
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});