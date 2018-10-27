var app = getApp(), util = require("../../utils/util.js");

Page({
    data: {
        currentTab: 0,
        swiperCurrent: 0,
        huise: !1,
        huangse: !0,
        hdnum: 0,
        kpgg: !0,
        bjyylb: "laba"
    },
    onLoad: function(t) {
        console.log(t);
        var a = decodeURIComponent(t.scene);
        console.log("scene", a), "undefined" != a && (getApp().sjid = a), null != t.id && (console.log("转发获取到的sjid:", t.id), 
        getApp().sjid = t.id);
        var o = this, e = wx.getStorageSync("bqxx");
        console.log(e), this.setData({
            bqxx: e
        });
        var n = util.formatTime(new Date()).slice(11, 16);
        console.log(n), o.setData({
            current_time: n
        }), this.reLoad();
    },
    reLoad: function() {
        this.setData({
            hdnum: 0
        });
        var t = this, a = util.formatTime(new Date()).slice(11, 16);
        console.log(a), wx.getUserInfo({
            success: function(a) {
                console.log(a.userInfo);
                var o = a.userInfo;
                t.setData({
                    nickName: o.nickName,
                    avatarUrl: o.avatarUrl
                });
            },
            fail: function() {
                wx.showModal({
                    title: "警告",
                    content: "您点击了拒绝授权,无法正常显示个人信息,点击确定重新获取授权。",
                    showCancel: !1,
                    success: function(a) {
                        a.confirm && wx.openSetting({
                            success: function(a) {
                                a.authSetting["scope.userInfo"] ? wx.getUserInfo({
                                    success: function(a) {
                                        console.log(a.userInfo);
                                        var o = a.userInfo;
                                        t.setData({
                                            nickName: o.nickName,
                                            avatarUrl: o.avatarUrl
                                        });
                                    }
                                }) : t.setData({
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
            success: function(a) {
                var o = a.code;
                wx.setStorageSync("code", a.code), app.util.request({
                    url: "entry/wxapp/openid",
                    cachetime: "0",
                    data: {
                        code: o
                    },
                    success: function(a) {
                        console.log(a), wx.setStorageSync("key", a.data.session_key), wx.setStorageSync("openid", a.data.openid);
                        var o = a.data.openid;
                        console.log(o), "" == o ? wx.showToast({
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
                                openid: o,
                                img: t.data.avatarUrl,
                                name: t.data.nickName
                            },
                            success: function(t) {
                                console.log(t), wx.setStorageSync("users", t.data), app.util.request({
                                    url: "entry/wxapp/New",
                                    cachetime: "0",
                                    data: {
                                        user_id: t.data.id,
                                        store_id: getApp().sjid
                                    },
                                    success: function(t) {
                                        console.log(t), wx.setStorageSync("new_user", t.data);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }), console.log(t.data);
        var o = t.data.current_time;
        app.util.request({
            url: "entry/wxapp/Store",
            cachetime: "0",
            data: {
                id: getApp().sjid,
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
                })), wx.setStorageSync("nbcolor", a.data.color), wx.setNavigationBarColor({
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
                    success: function(o) {
                        console.log(o), t.setData({
                            mj: o.data
                        }), 0 != o.data.length && "1" == a.data.xyh_open ? t.setData({
                            hdnum: 2
                        }) : 0 != o.data.length && "1" != a.data.xyh_open || 0 == o.data.length && "1" == a.data.xyh_open ? t.setData({
                            hdnum: 1
                        }) : t.setData({
                            hdnum: 0
                        });
                    }
                });
                var e = a.data.time, n = a.data.time2, s = a.data.time3, c = a.data.time4, i = a.data.is_rest;
                console.log("当前的系统时间为" + o), console.log("商家的营业时间从" + e + "至" + n, s + "至" + c), 
                t.setData({
                    rest: a.data.is_rest
                }), 1 == i ? console.log("商家正在休息") : (console.log("商家没有休息"), c > e ? o > e && o < n || o > s && o < c ? (console.log("商家正常营业"), 
                t.setData({
                    time: 1
                })) : o < e || o > n && o < s ? (console.log("商家还没开店呐，稍等一会儿可以吗？"), t.setData({
                    time: 2
                })) : o > c && (console.log("商家以及关店啦，明天再来吧"), t.setData({
                    time: 3
                })) : c < e && (o > e && o < n || o > s && o > c || o < s && o < c ? (console.log("商家正常营业"), 
                t.setData({
                    time: 1
                })) : o < e || o > n && o < s ? (console.log("商家还没开店呐，稍等一会儿可以吗？"), t.setData({
                    time: 2
                })) : o > c && (console.log("商家以及关店啦，明天再来吧"), t.setData({
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
        }), app.util.request({
            url: "entry/wxapp/Url",
            cachetime: "0",
            success: function(a) {
                console.log(a.data), wx.setStorageSync("imglink", a.data), t.setData({
                    url: a.data
                });
            }
        }), app.util.request({
            url: "entry/wxapp/Url2",
            cachetime: "0",
            success: function(a) {
                console.log(a.data), t.setData({
                    url2: a.data
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
            url: "sjhj"
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
                            success: function(o) {
                                o.confirm ? wx.openSetting({
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
    onShow: function() {},
    onHide: function() {},
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
    onUnload: function() {
        wx.stopBackgroundAudio();
    },
    onPullDownRefresh: function() {
        this.reLoad(), wx.stopPullDownRefresh();
    },
    onReachBottom: function() {},
    onShareAppMessage: function() {
        var t = this;
        return t.setData({
            share_modal_active: "",
            no_scroll: !1
        }), {
            title: t.data.store.name,
            path: "/zh_dianc/pages/info/info?id=" + getApp().sjid,
            success: function(a) {
                t.setData({
                    share_modal_active: ""
                }), wx.showToast({
                    title: "转发成功"
                });
            },
            fail: function(t) {}
        };
    },
    closekpgg: function() {
        this.setData({
            kpgg: !0
        });
    }
});