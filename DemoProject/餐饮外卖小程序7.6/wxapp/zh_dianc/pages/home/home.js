var qqmapsdk, app = getApp(), QQMapWX = require("../../utils/qqmap-wx-jssdk.js"), amapFile = require("../../utils/amap-wx.js"), util = require("../../utils/util.js");

Page({
    data: {
        huise: !1,
        huangse: !0,
        hdnum: 0,
        kpgg: !0,
        slider: [],
        currentTab: 0,
        swiperCurrent: 0,
        listarr: [ "距离", "推荐", "销量", "评分" ],
        activeIndex: 0,
        qqsj: !1,
        scrollHeight: 0,
        pagenum: 1,
        storelist: [],
        mygd: !1,
        jzgd: !0,
        jzwb: !1,
        bjyylb: "laba"
    },
    onLoad: function(t) {
        console.log(t);
        var a = decodeURIComponent(t.scene);
        if (console.log("scene", a), "undefined" != a) e = a;
        if (null != t.userid) {
            console.log("转发获取到的userid:", t.userid);
            var e = t.userid;
        }
        console.log("fxzuid", e);
        var o = util.formatTime(new Date()).slice(11, 16);
        console.log(o), this.setData({
            current_time: o
        });
        var s = this;
        new amapFile.AMapWX({
            key: "d03d1ecd781de95397abc7c9f60273e2"
        }).getWeather({
            success: function(t) {
                console.log(t), s.setData({
                    tianqi: t
                });
            },
            fail: function(t) {
                console.log(t);
            }
        }), wx.getSystemInfo({
            success: function(t) {
                s.setData({
                    scrollHeight: t.windowHeight
                });
            }
        }), app.util.request({
            url: "entry/wxapp/system",
            cachetime: "0",
            success: function(t) {
                console.log(t), qqmapsdk = new QQMapWX({
                    key: t.data.map_key
                }), s.setData({
                    mdxx: t.data
                }), "1" == t.data.more && (s.dwreLoad(), wx.setNavigationBarTitle({
                    title: t.data.pt_name
                })), "2" == t.data.more && s.danreLoad(), wx.setStorageSync("bqxx", t.data);
            }
        }), app.util.request({
            url: "entry/wxapp/Url",
            cachetime: "0",
            success: function(t) {
                wx.setStorageSync("imglink", t.data), s.setData({
                    url: t.data
                });
            }
        }), app.util.request({
            url: "entry/wxapp/Url2",
            cachetime: "0",
            success: function(t) {
                console.log(t.data), s.setData({
                    url2: t.data
                });
            }
        }), app.util.request({
            url: "entry/wxapp/ad2",
            cachetime: "0",
            success: function(t) {
                console.log(t);
                for (var a = [], e = [], o = 0; o < t.data.length; o++) "1" == t.data[o].type && a.push(t.data[o]), 
                "2" == t.data[o].type && e.push(t.data[o]);
                console.log(a, e), s.setData({
                    slider: a
                }), 0 != e.length && s.setData({
                    kpgg: !1,
                    kpggimg: e
                });
            }
        }), app.util.request({
            url: "entry/wxapp/storetype",
            cachetime: "0",
            success: function(t) {
                console.log(t.data);
                for (var a = [], e = 0, o = t.data.length; e < o; e += 8) a.push(t.data.slice(e, e + 8));
                console.log(a), s.setData({
                    navs: a
                });
            }
        }), wx.getUserInfo({
            success: function(t) {
                console.log(t.userInfo);
                var a = t.userInfo;
                s.setData({
                    nickName: a.nickName,
                    avatarUrl: a.avatarUrl
                });
            },
            fail: function() {
                wx.showModal({
                    title: "警告",
                    content: "您点击了拒绝授权,无法正常显示个人信息,点击确定重新获取授权。",
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.openSetting({
                            success: function(t) {
                                t.authSetting["scope.userInfo"] ? wx.getUserInfo({
                                    success: function(t) {
                                        console.log(t.userInfo);
                                        var a = t.userInfo;
                                        s.setData({
                                            nickName: a.nickName,
                                            avatarUrl: a.avatarUrl
                                        });
                                    }
                                }) : s.setData({
                                    nickName: "",
                                    avatarUrl: ""
                                });
                            },
                            fail: function(t) {}
                        });
                    }
                });
            },
            complete: function(t) {}
        }), wx.login({
            success: function(t) {
                var a = t.code;
                wx.setStorageSync("code", t.code), app.util.request({
                    url: "entry/wxapp/openid",
                    cachetime: "0",
                    data: {
                        code: a
                    },
                    success: function(t) {
                        console.log(t), wx.setStorageSync("key", t.data.session_key), wx.setStorageSync("openid", t.data.openid);
                        var a = t.data.openid;
                        console.log(a), "" == a ? wx.showToast({
                            title: "没有获取到openid",
                            icon: "",
                            image: "",
                            duration: 1e3,
                            mask: !0,
                            success: function(t) {},
                            fail: function(t) {},
                            complete: function(t) {}
                        }) : app.util.request({
                            url: "entry/wxapp/Login",
                            cachetime: "0",
                            data: {
                                openid: a,
                                img: s.data.avatarUrl,
                                name: s.data.nickName
                            },
                            success: function(t) {
                                console.log(t), wx.setStorageSync("users", t.data), app.util.request({
                                    url: "entry/wxapp/New",
                                    cachetime: "0",
                                    data: {
                                        user_id: t.data.id,
                                        store_id: s.data.mdxx.default_store
                                    },
                                    success: function(t) {
                                        console.log(t), wx.setStorageSync("new_user", t.data);
                                    }
                                }), null != e && app.util.request({
                                    url: "entry/wxapp/Binding",
                                    cachetime: "0",
                                    data: {
                                        fx_user: t.data.id,
                                        user_id: e
                                    },
                                    success: function(t) {
                                        console.log(t);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    },
    dwreLoad: function() {
        var t = this;
        wx.getLocation({
            type: "wgs84",
            success: function(a) {
                var e = a.latitude, o = a.longitude, s = e + "," + o;
                console.log(s), qqmapsdk.reverseGeocoder({
                    location: {
                        latitude: e,
                        longitude: o
                    },
                    coord_type: 1,
                    success: function(a) {
                        var e = a.result.ad_info.location;
                        console.log(a), console.log(a.result.formatted_addresses.recommend), console.log("坐标转地址后的经纬度：", a.result.ad_info.location), 
                        t.setData({
                            weizhi: a.result.formatted_addresses.recommend,
                            startjwd: e
                        }), t.duoreLoad(e);
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
                    success: function(a) {
                        a.confirm && wx.openSetting({
                            success: function(a) {
                                a.authSetting["scope.userLocation"] ? wx.getLocation({
                                    type: "wgs84",
                                    success: function(a) {
                                        var e = a.latitude, o = a.longitude, s = e + "," + o;
                                        console.log(s), qqmapsdk.reverseGeocoder({
                                            location: {
                                                latitude: e,
                                                longitude: o
                                            },
                                            coord_type: 1,
                                            success: function(a) {
                                                var e = a.result.ad_info.location;
                                                console.log(a), console.log(a.result.formatted_addresses.recommend), console.log("坐标转地址后的经纬度：", a.result.ad_info.location), 
                                                t.setData({
                                                    weizhi: a.result.formatted_addresses.recommend,
                                                    startjwd: e
                                                }), t.duoreLoad(e);
                                            },
                                            fail: function(t) {
                                                console.log(t);
                                            },
                                            complete: function(t) {
                                                console.log(t);
                                            }
                                        });
                                    }
                                }) : t.dwreLoad();
                            },
                            fail: function(t) {}
                        });
                    }
                });
            },
            complete: function(t) {}
        });
    },
    closekpgg: function() {
        this.setData({
            kpgg: !0
        });
    },
    duoreLoad: function(t) {
        console.log(t);
        var a = this;
        app.util.request({
            url: "entry/wxapp/StoreList",
            cachetime: "0",
            data: {
                lat: t.lat,
                lng: t.lng,
                page: a.data.pagenum,
                pagesize: 10
            },
            success: function(t) {
                console.log("分页返回的商家列表数据", t.data), t.data.length < 10 ? a.setData({
                    mygd: !0,
                    jzgd: !0,
                    jzwb: !0
                }) : a.setData({
                    jzgd: !0,
                    pagenum: a.data.pagenum + 1
                });
                var e = a.data.storelist;
                e = function(t) {
                    for (var a = [], e = 0; e < t.length; e++) -1 == a.indexOf(t[e]) && a.push(t[e]);
                    return a;
                }(e = e.concat(t.data));
                for (var o = 0; o < t.data.length; o++) {
                    "0.0" == t.data[o].score && (t.data[o].score = "5.0");
                    var s = parseFloat(t.data[o].juli);
                    console.log(s), console.log(), s < 1e3 ? (t.data[o].aa = s + "m", t.data[o].aa1 = s) : (t.data[o].aa = (s / 1e3).toFixed(2) + "km", 
                    t.data[o].aa1 = s), a.setData({
                        jlstorelist: e,
                        tjpx: e,
                        xlpx: e,
                        pfpx: e,
                        storelist: e,
                        qqsj: !0
                    }), a.setData({
                        tjstorelist: a.data.tjpx.sort(a.comparesx("number")),
                        xlstorelist: a.data.xlpx.sort(a.comparejx("sales")),
                        pfstorelist: a.data.pfpx.sort(a.comparejx("score"))
                    });
                }
                console.log(e);
            }
        });
    },
    tabClick: function(t) {
        var a = this, e = t.currentTarget.id;
        console.log(e), this.setData({
            activeIndex: t.currentTarget.id
        }), "1" == e && a.setData({
            tjstorelist: a.data.tjpx.sort(a.comparesx("number")),
            qqsj: !0
        }), "2" == e && (console.log(a.data.xlpx), a.setData({
            xlstorelist: a.data.xlpx.sort(a.comparejx("sales")),
            qqsj: !0
        })), "3" == e && (console.log(a.data.pfpx), a.setData({
            pfstorelist: a.data.pfpx.sort(a.comparejx("score")),
            qqsj: !0
        })), "0" == e && a.setData({
            qqsj: !0
        });
    },
    bindChange: function(t) {
        this.setData({
            currentTab: t.detail.current
        });
    },
    comparesx: function(t) {
        return function(a, e) {
            var o = a[t], s = e[t];
            return isNaN(Number(o)) || isNaN(Number(s)) || (o = Number(o), s = Number(s)), o < s ? -1 : o > s ? 1 : 0;
        };
    },
    comparejx: function(t) {
        return function(a, e) {
            var o = a[t], s = e[t];
            return isNaN(Number(o)) || isNaN(Number(s)) || (o = Number(o), s = Number(s)), o < s ? 1 : o > s ? -1 : 0;
        };
    },
    distance: function(t, a, e) {
        var o;
        qqmapsdk.calculateDistance({
            mode: "driving",
            from: {
                latitude: t.lat,
                longitude: t.lng
            },
            to: [ {
                latitude: a.lat,
                longitude: a.lng
            } ],
            success: function(t) {
                console.log(t), 0 == t.status && (o = Math.round(t.result.elements[0].distance), 
                e(o));
            },
            fail: function(t) {
                console.log(t), 373 == t.status && (o = 15e3, e(o));
            },
            complete: function(t) {
                console.log(t);
            }
        });
    },
    changejwd: function(t, a, e) {
        var o;
        qqmapsdk.reverseGeocoder({
            location: {
                latitude: t,
                longitude: a
            },
            coord_type: 3,
            success: function(t) {
                console.log(t), console.log("坐标转地址后的经纬度：", t.result.ad_info.location), o = t.result.ad_info.location, 
                e(o);
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
        var a = t.currentTarget.dataset.sjid;
        getApp().sjid = t.currentTarget.dataset.sjid.id, "0" == a.is_dn && "0" == a.is_pd && "0" == a.is_yy && "1" == a.is_wm && "0" == a.is_sy ? wx.navigateTo({
            url: "../index/index?type=2"
        }) : wx.navigateTo({
            url: "../info/info"
        });
    },
    tzfl: function(t) {
        console.log(t.currentTarget.dataset.flinfo), wx.navigateTo({
            url: "sjfl?flid=" + t.currentTarget.dataset.flinfo.id + "&flname=" + t.currentTarget.dataset.flinfo.type_name
        });
    },
    danreLoad: function() {
        this.setData({
            hdnum: 0
        });
        var t = this, a = util.formatTime(new Date()).slice(11, 16);
        console.log(a), console.log(t.data);
        var e = t.data.current_time;
        app.util.request({
            url: "entry/wxapp/Store",
            cachetime: "0",
            data: {
                id: t.data.mdxx.default_store,
                user_id: wx.getStorageSync("users").id
            },
            success: function(a) {
                console.log(a), "" != a.data.store_mp3 && "1" == a.data.is_mp3 && (wx.playBackgroundAudio({
                    dataUrl: a.data.store_mp3
                }), wx.getBackgroundAudioPlayerState({
                    success: function(t) {
                        console.log(t);
                        t.status, t.dataUrl, t.currentPosition, t.duration, t.downloadPercent;
                    },
                    fail: function(t) {
                        console.log(t);
                    },
                    complete: function(t) {
                        console.log(t);
                    }
                })), wx.setStorageSync("nbcolor", a.data.color), getApp().sjid = a.data.id, wx.setNavigationBarTitle({
                    title: a.data.name
                }), wx.setNavigationBarColor({
                    frontColor: "#ffffff",
                    backgroundColor: a.data.color
                }), t.setData({
                    color: a.data.color
                }), app.util.request({
                    url: "entry/wxapp/Reduction",
                    cachetime: "0",
                    data: {
                        id: getApp().sjid
                    },
                    success: function(e) {
                        console.log(e), t.setData({
                            mj: e.data
                        }), 0 != e.data.length && "1" == a.data.xyh_open ? t.setData({
                            hdnum: 2
                        }) : 0 != e.data.length && "1" != a.data.xyh_open || 0 == e.data.length && "1" == a.data.xyh_open ? t.setData({
                            hdnum: 1
                        }) : t.setData({
                            hdnum: 0
                        });
                    }
                });
                var o = a.data.time, s = a.data.time2, n = a.data.time3, c = a.data.time4, i = a.data.is_rest;
                console.log("当前的系统时间为" + e), console.log("商家的营业时间从" + o + "至" + s, n + "至" + c), 
                t.setData({
                    rest: a.data.is_rest
                }), 1 == i ? console.log("商家正在休息") : (console.log("商家没有休息"), c > o ? e > o && e < s || e > n && e < c ? (console.log("商家正常营业"), 
                t.setData({
                    time: 1
                })) : e < o || e > s && e < n ? (console.log("商家还没开店呐，稍等一会儿可以吗？"), t.setData({
                    time: 2
                })) : e > c && (console.log("商家以及关店啦，明天再来吧"), t.setData({
                    time: 3
                })) : c < o && (e > o && e < s || e > n && e > c || e < n && e < c ? (console.log("商家正常营业"), 
                t.setData({
                    time: 1
                })) : e < o || e > s && e < n ? (console.log("商家还没开店呐，稍等一会儿可以吗？"), t.setData({
                    time: 2
                })) : e > c && (console.log("商家以及关店啦，明天再来吧"), t.setData({
                    time: 3
                }))));
                var l = Number(a.data.distance);
                t.setData({
                    store: a.data,
                    distance: l
                }), app.util.request({
                    url: "entry/wxapp/zhuanh",
                    cachetime: "0",
                    data: {
                        op: a.data.coordinates
                    },
                    success: function(a) {
                        console.log(a), console.log(a.data.locations[0].lat + "," + a.data.locations[0].lng), 
                        t.setData({
                            sjdzlat: a.data.locations[0].lat,
                            sjdzlng: a.data.locations[0].lng
                        });
                    }
                });
            }
        });
    },
    facing: function(t) {
        wx.navigateTo({
            url: "../fukuan/fukuan"
        });
    },
    breakout: function(t) {
        wx.scanCode({
            success: function(t) {
                console.log(t);
                var a = "../" + t.path.substring(15);
                wx.navigateTo({
                    url: a
                });
            },
            fail: function(t) {
                console.log("扫码fail");
            }
        });
    },
    takeOut: function(t) {
        wx.navigateTo({
            url: "../index/index?type=2"
        });
    },
    call_phone: function() {
        var t = this;
        wx.makePhoneCall({
            phoneNumber: t.data.store.tel
        });
    },
    tomap: function(t) {
        var a = this;
        wx.openLocation({
            latitude: a.data.sjdzlat,
            longitude: a.data.sjdzlng,
            name: a.data.store.name,
            address: a.data.store.address
        });
    },
    tzsjhj: function(t) {
        console.log(t.currentTarget.dataset.sjid), wx.navigateTo({
            url: "../info/sjhj"
        });
    },
    tzxcx: function(t) {
        console.log(t.currentTarget.dataset.appid), wx.navigateToMiniProgram({
            appId: t.currentTarget.dataset.appid,
            success: function(t) {
                console.log(t);
            }
        });
    },
    tzweb: function(t) {
        console.log(t.currentTarget.dataset.index, this.data.slider);
        var a = this.data.slider[t.currentTarget.dataset.index];
        console.log(a), "1" == a.item && wx.navigateTo({
            url: a.src
        }), "2" == a.item && wx.navigateTo({
            url: "webhtml?weburl=" + a.id
        }), "3" == a.item && wx.navigateToMiniProgram({
            appId: a.tz_appid,
            success: function(t) {
                console.log(t);
            }
        });
    },
    ggtzweb: function(t) {
        console.log(t.currentTarget.dataset.index, this.data.kpggimg);
        var a = this.data.kpggimg[t.currentTarget.dataset.index];
        console.log(a), "1" == a.item && wx.navigateTo({
            url: a.src
        }), "2" == a.item && wx.navigateTo({
            url: "webhtml?weburl=" + a.id
        }), "3" == a.item && wx.navigateToMiniProgram({
            appId: a.tz_appid,
            success: function(t) {
                console.log(t);
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
    getGoodsQrcode: function() {
        var t = this;
        t.setData({
            goods_qrcode_active: "active",
            share_modal_active: ""
        }), app.util.request({
            url: "entry/wxapp/StoreCode",
            cachetime: "0",
            data: {
                store_id: getApp().sjid
            },
            success: function(a) {
                t.setData({
                    goods_qrcode: t.data.url2 + a.data
                });
            }
        });
    },
    goodsQrcodeClose: function() {
        this.setData({
            goods_qrcode_active: "",
            no_scroll: !1
        });
    },
    goodsQrcodeClick: function(t) {
        var a = t.currentTarget.dataset.src;
        wx.previewImage({
            urls: [ a ]
        });
    },
    saveGoodsQrcode: function() {
        var t = this;
        wx.saveImageToPhotosAlbum ? (wx.showLoading({
            title: "正在保存图片",
            mask: !1
        }), console.log(t.data.goods_qrcode), wx.downloadFile({
            url: t.data.goods_qrcode,
            success: function(a) {
                console.log(a), wx.showLoading({
                    title: "正在保存图片",
                    mask: !1
                }), wx.saveImageToPhotosAlbum({
                    filePath: a.tempFilePath,
                    success: function() {
                        t.goodsQrcodeClose(), wx.showModal({
                            title: "提示",
                            content: "商家海报保存成功",
                            showCancel: !1
                        });
                    },
                    fail: function(a) {
                        wx.showModal({
                            title: "警告",
                            content: "您点击了拒绝授权,无法正常保存图片,点击确定重新获取授权。",
                            showCancel: !1,
                            success: function(e) {
                                e.confirm ? wx.openSetting({
                                    success: function(a) {
                                        a.authSetting["scope.writePhotosAlbum"] && t.saveGoodsQrcode();
                                    },
                                    fail: function(t) {}
                                }) : wx.showModal({
                                    title: "图片保存失败",
                                    content: a.errMsg,
                                    showCancel: !1
                                });
                            }
                        });
                    },
                    complete: function(t) {
                        console.log(t), wx.hideLoading();
                    }
                });
            },
            fail: function(a) {
                wx.showModal({
                    title: "图片下载失败",
                    content: a.errMsg + ";" + t.data.goods_qrcode,
                    showCancel: !1
                });
            },
            complete: function(t) {
                console.log(t), wx.hideLoading();
            }
        })) : wx.showModal({
            title: "提示",
            content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。",
            showCancel: !1
        });
    },
    onReady: function() {},
    onShow: function() {
        var t = wx.getStorageSync("bqxx");
        if ("1" == t.more) a = wx.getStorageSync("bqxx").color;
        if ("2" == t.more) var a = wx.getStorageSync("nbcolor");
        wx.setNavigationBarColor({
            frontColor: "#ffffff",
            backgroundColor: a
        }), this.setData({
            color: a
        });
    },
    onHide: function() {
        this.setData({
            kpgg: !0
        }), wx.stopBackgroundAudio();
    },
    gbbjyy: function() {
        var t = this.data.bjyylb, a = this;
        "laba" == t && (wx.stopBackgroundAudio(), this.setData({
            bjyylb: "laba1"
        }), wx.showToast({
            title: "音乐已关闭"
        })), "laba1" == t && (wx.playBackgroundAudio({
            dataUrl: a.data.store.store_mp3
        }), this.setData({
            bjyylb: "laba"
        }), wx.showToast({
            title: "音乐已开启"
        }));
    },
    onUnload: function() {},
    onPullDownRefresh: function() {
        var t = this;
        "1" == t.data.mdxx.more && (this.setData({
            activeIndex: 0,
            pagenum: 1,
            storelist: [],
            qqsj: !1,
            jzgd: !0,
            jzwb: !1,
            mygd: !1
        }), console.log("下拉刷新", this.data.pagenum), this.data.jzgd && (this.setData({
            jzgd: !1
        }), this.dwreLoad())), "2" == t.data.mdxx.more && t.danreLoad(), wx.stopPullDownRefresh();
    },
    onReachBottom: function() {
        console.log("上拉加载", this.data.pagenum);
        !this.data.mygd && this.data.jzgd && (this.setData({
            jzgd: !1
        }), this.duoreLoad(this.data.startjwd));
    },
    onShareAppMessage: function() {}
});