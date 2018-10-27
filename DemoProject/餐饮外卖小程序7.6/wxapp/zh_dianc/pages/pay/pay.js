var distance, form_id, qqmapsdk, app = getApp(), QQMapWX = require("../../utils/qqmap-wx-jssdk.js"), util = require("../../utils/util.js");

Page({
    data: {
        totalPrice: 0,
        distance: "0",
        form_id: "",
        beizhu: "",
        dnzt: !1,
        qlq: !0,
        sdindex: 0,
        qzf: !0,
        showModal: !1,
        zffs: 1,
        zfz: !1,
        zfwz: "微信支付",
        btntype: "btn_ok1"
    },
    radioChange: function(e) {
        console.log("radio发生change事件，携带value值为：", e.detail.value), "wxzf" == e.detail.value && this.setData({
            zffs: 1,
            zfwz: "微信支付",
            btntype: "btn_ok1"
        }), "yezf" == e.detail.value && this.setData({
            zffs: 2,
            zfwz: "余额支付",
            btntype: "btn_ok2"
        }), "jfzf" == e.detail.value && this.setData({
            zffs: 3,
            zfwz: "积分支付",
            btntype: "btn_ok3"
        });
    },
    jsmj: function(e, t) {
        for (var a, o = 0; o < t.length; o++) if (Number(e) >= Number(t[o].full)) {
            a = o;
            break;
        }
        return a;
    },
    onLoad: function(e) {
        console.log(e);
        var t = this;
        if (null == e.preferential) a = 0; else var a = Number(e.preferential);
        var o = wx.getStorageSync("users"), s = wx.getStorageSync("new_user");
        t.setData({
            coupons_id: e.coupons_id,
            pre: a,
            new_user: s,
            users: o,
            vouchers_id: e.vouchers_id
        }), app.util.request({
            url: "entry/wxapp/system",
            cachetime: "0",
            success: function(e) {
                console.log(e), qqmapsdk = new QQMapWX({
                    key: e.data.map_key
                }), t.setData({
                    ptxx: e.data,
                    jf_proportion: e.data.jf_proportion
                }), "1" == e.data.is_yue ? t.setData({
                    ptkqyue: !0
                }) : t.setData({
                    ptkqyue: !1
                }), "1" == e.data.is_jfpay ? t.setData({
                    ptkqjf: !0
                }) : t.setData({
                    ptkqjf: !1
                });
            }
        });
        l = wx.getStorageSync("users").id;
        app.util.request({
            url: "entry/wxapp/UserInfo",
            cachetime: "0",
            data: {
                user_id: l
            },
            success: function(e) {
                console.log(e), t.setData({
                    wallet: e.data.wallet,
                    total_score: e.data.total_score
                });
            }
        }), app.util.request({
            url: "entry/wxapp/Store",
            cachetime: "0",
            data: {
                id: getApp().sjid
            },
            success: function(e) {
                console.log(e), "1" == e.data.is_yue ? t.setData({
                    sjkqyue: !0
                }) : t.setData({
                    sjkqyue: !1
                }), "1" == e.data.is_jfpay ? t.setData({
                    sjkqjf: !0
                }) : t.setData({
                    sjkqjf: !1
                }), console.log(e.data.coordinates.split(","));
                var o = e.data.coordinates.split(",");
                wx.setNavigationBarColor({
                    frontColor: "#ffffff",
                    backgroundColor: e.data.color
                }), t.setData({
                    color: e.data.color,
                    sd_time: e.data.sd_time
                }), app.util.request({
                    url: "entry/wxapp/Reduction",
                    cachetime: "0",
                    data: {
                        id: getApp().sjid
                    },
                    success: function(o) {
                        console.log(o);
                        for (var n = [], l = 0; l < o.data.length; l++) "1" != o.data[l].type && "3" != o.data[l].type || n.push(o.data[l]);
                        console.log(n);
                        var i = Number(e.data.freight);
                        if (0 == n.length) c = [ {
                            full: "1000000"
                        } ]; else var c = n;
                        var r, u = c.length - 1, d = wx.getStorageSync("order");
                        console.log(d);
                        for (var f = 0, p = 0, g = 0; g < d.length; g++) f += Number(d[g].money) * d[g].num + Number(d[g].box_fee) * d[g].num, 
                        p += Number(d[g].box_fee) * d[g].num;
                        console.log(f, c);
                        m = Number(e.data.freight);
                        if (console.log("配送费为" + m), m > 0) m = Number(e.data.freight); else var m = 0;
                        var h = Number(e.data.xyh_open), _ = Number(e.data.xyh_money);
                        if (1 == h) if (1 == s) console.log("这是一个新用户"), (w = f - _ + m) <= 0 && (w = .01), 
                        console.log("商家开启了下单立减优惠，而且用户是一个新用户，不享受满减活动以及优惠券，支付的金额为" + w); else if (Number(f) >= Number(c[c.length - 1].full)) if (console.log(t.jsmj(f, c)), 
                        u = t.jsmj(f, c), r = Number(c[u].reduction), console.log(r), 0 == a) {
                            w = f + m - r;
                            console.log("商家开启了下单立减优惠，而且用户是一老用户，没有使用优惠券，支付的金额为" + w);
                        } else if (f + m - r - a <= 0) {
                            w = .01;
                            console.log("商家开启了下单立减优惠，而且用户是一老用户，使用了优惠券并且优惠超出总价，支付的金额为" + w);
                        } else {
                            w = f + m - r - a;
                            console.log("商家开启了下单立减优惠，而且用户是一老用户，使用了优惠券并且总价大于优惠，支付的金额为" + w);
                        } else {
                            if (0 == a) w = f + m; else if (f + m - a <= 0) w = .01; else w = f + m - a;
                            console.log("用户是一个老用户，不享受新用户下单立减活动，订单的金额小于满减的金额" + w, c);
                        } else if (Number(f) >= Number(c[c.length - 1].full)) {
                            if (console.log(t.jsmj(f, c)), u = t.jsmj(f, c), r = Number(c[u].reduction), console.log(r), 
                            0 == a) w = f + m - r; else if (f + m - r - a <= 0) w = .01; else w = f + m - r - a;
                            console.log("商家没有开启新用户立减，而且用户是一个老用户，订单的金额大于满减的金额，用户支付的金额为" + w);
                        } else {
                            if (0 == a) w = f + m; else if (f + m - a <= 0) w = .01; else var w = f + m - a;
                            console.log("商家没有开启开启新用户立减，而且用户是一个老用户，订单的金额小于满减的金额，用户支付的金额为" + w, c);
                        }
                        t.setData({
                            xyh_open: h,
                            xyh_money: _,
                            store: e.data,
                            money: w.toFixed(2),
                            money1: w.toFixed(2),
                            totalPrice: f,
                            totalbox: p,
                            freight: m,
                            fre: i,
                            order: d,
                            con: c,
                            yh: Number(c[u].full),
                            cut: r,
                            seller_id: e.data.id
                        }), console.log(t.data);
                    }
                }), distance = 1e3 * Number(e.data.distance), qqmapsdk.reverseGeocoder({
                    location: {
                        latitude: o[0],
                        longitude: o[1]
                    },
                    coord_type: 3,
                    success: function(e) {
                        console.log(e), console.log("坐标转地址后的经纬度起点：", e.result.ad_info.location), t.setData({
                            start: e.result.ad_info.location,
                            qzf: !1
                        });
                    },
                    fail: function(e) {
                        console.log(e);
                    },
                    complete: function(e) {
                        console.log(e);
                    }
                });
            }
        });
        var n = wx.getStorageSync("openid");
        console.log(n);
        var l = wx.getStorageSync("users").id;
        t.setData({
            openid: n,
            user_id: l
        });
    },
    reload: function(e) {},
    distance: function(e, t, a) {
        var o;
        qqmapsdk.calculateDistance({
            mode: "driving",
            from: {
                latitude: e.lat,
                longitude: e.lng
            },
            to: [ {
                latitude: t.lat,
                longitude: t.lng
            } ],
            success: function(e) {
                console.log(e), 0 == e.status && (o = Math.round(e.result.elements[0].distance), 
                a(o));
            },
            fail: function(e) {
                console.log(e), 373 == e.status && (o = 15e3, a(o));
            },
            complete: function(e) {
                console.log(e);
            }
        });
    },
    ddbz: function(e) {
        console.log(e.detail.value), this.setData({
            beizhu: e.detail.value
        });
    },
    xszz: function() {
        this.setData({
            showModal: !0
        });
    },
    yczz: function() {
        this.setData({
            showModal: !1
        });
    },
    onReady: function() {},
    onShow: function() {
        var e = util.formatTime(new Date()), t = util.formatTime(new Date()).substring(0, 10).replace(/\//g, "-"), a = util.formatTime(new Date()).substring(11, 16);
        console.log(e, t.toString(), a.toString()), this.setData({
            datestart: t,
            timestart: a,
            date: t,
            time: a
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
    },
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    map: function(e) {
        var t = this, a = wx.getStorageSync("users").id;
        wx.chooseAddress({
            success: function(e) {
                console.log(e.userName), console.log(e.postalCode), console.log(e.provinceName), 
                console.log(e.cityName), console.log(e.countyName), console.log(e.detailInfo), console.log(e.nationalCode), 
                console.log(e.telNumber);
                var o = e.telNumber, s = e.cityName + e.countyName + e.detailInfo, n = e.userName;
                console.log(s), t.setData({
                    user_tel: o,
                    user_address: s,
                    user_name: n
                }), app.util.request({
                    url: "entry/wxapp/UpdAdd",
                    cachetime: "0",
                    data: {
                        user_id: a,
                        user_tel: o,
                        user_address: s,
                        user_name: n
                    },
                    success: function(e) {
                        console.log(e);
                    }
                });
            },
            fail: function(e) {
                console.log(e), wx.showModal({
                    title: "警告",
                    content: "您点击了拒绝授权,无法获取您的地址信息,点击确定重新获取授权。",
                    showCancel: !1,
                    success: function(e) {
                        e.confirm && wx.openSetting({
                            success: function(e) {
                                e.authSetting["scope.address"] && t.map();
                            },
                            fail: function(e) {}
                        });
                    }
                });
            }
        });
    },
    jksd: function() {
        this.setData({
            sdindex: 0,
            qlq: !0
        });
    },
    xzsj: function() {
        this.setData({
            sdindex: 1,
            qlq: !0
        });
    },
    qlq: function() {
        this.setData({
            qlq: !1
        });
    },
    qdzz: function() {
        this.setData({
            qlq: !0
        });
    },
    bindDateChange: function(e) {
        console.log("date 发生 change 事件，携带值为", e.detail.value, this.data.datestart), this.setData({
            date: e.detail.value
        }), e.detail.value == this.data.datestart ? console.log("日期没有修改") : (console.log("修改了日期"), 
        this.setData({
            timestart: "00:01"
        }));
    },
    bindTimeChange: function(e) {
        console.log("time 发生 change 事件，携带值为", e.detail.value), this.setData({
            time: e.detail.value
        });
    },
    switch1Change: function(e) {
        var t = this;
        console.log("switch1 发生 change 事件，携带值为", e.detail.value), t.setData({
            dnzt: e.detail.value
        }), e.detail.value ? t.setData({
            money: (t.data.money1 - t.data.freight).toFixed(2)
        }) : t.setData({
            money: t.data.money1
        });
    },
    formSubmit: function(e) {
        if (console.log("form发生了submit事件，携带数据为：", e.detail.value.radiogroup), "yezf" == e.detail.value.radiogroup) {
            var t = Number(this.data.wallet), a = Number(this.data.money);
            if (console.log(t, a), t < a) return void wx.showToast({
                title: "余额不足支付",
                icon: "loading"
            });
        }
        var o = 0;
        if ("jfzf" == e.detail.value.radiogroup) {
            var s = Number(this.data.total_score) / Number(this.data.jf_proportion), a = Number(this.data.money);
            if (o = a * Number(this.data.jf_proportion), console.log(s, a, o), s < a) return void wx.showToast({
                title: "积分不足支付",
                icon: "loading"
            });
        }
        if ("yezf" == e.detail.value.radiogroup) n = 1;
        if ("wxzf" == e.detail.value.radiogroup) n = 2;
        if ("jfzf" == e.detail.value.radiogroup) var n = 3;
        console.log("是否余额", n);
        var l = this, i = l.data.freight;
        if (l.data.dnzt) {
            var c = 1, r = l.data.date + "日" + l.data.time + "分";
            i = 0;
        } else {
            c = 2;
            if (0 == l.data.sdindex) r = "尽快送达,预计" + l.data.sd_time + "内送达"; else r = l.data.date + "日" + l.data.time + "分";
        }
        console.log(l.data, "自提", c, "送达时间", r, "配送费", i, "总计费用", l.data.money, "pre", l.data.pre, "cut", l.data.cut);
        l.data.totalPrice;
        a = l.data.money;
        if (1 == l.data.xyh_open) {
            if (1 == l.data.new_user) u = l.data.xyh_money;
            if (2 == l.data.new_user && l.data.totalPrice >= l.data.yh) u = l.data.cut + l.data.pre;
            if (2 == l.data.new_user && l.data.totalPrice < l.data.yh) u = l.data.pre;
        }
        if (2 == l.data.xyh_open) {
            if (l.data.totalPrice >= l.data.yh) u = l.data.cut + l.data.pre;
            if (l.data.totalPrice < l.data.yh) var u = l.data.pre;
        }
        console.log(u);
        var d = l.data.beizhu, f = l.data.order;
        console.log(f);
        var p = [];
        f.map(function(e) {
            if (e.num > 0) {
                var t = {};
                t.name = e.name, t.img = e.icon, t.num = e.num, t.money = e.money, t.dishes_id = e.id, 
                p.push(t);
            }
        }), console.log(p);
        l.data.con, l.data.cut;
        if (null == l.data.coupons_id) {
            console.log("用户没有选择优惠券");
            g = "";
        } else {
            console.log("用户选择了优惠券");
            var g = l.data.coupons_id;
        }
        if (null == l.data.vouchers_id) {
            console.log("用户没有选择代金券");
            m = "";
        } else {
            console.log("用户选择了代金券");
            var m = l.data.vouchers_id;
        }
        console.log("代金券id" + m), console.log("优惠券id" + g);
        l.data.xyh_open, l.data.xyh_money, l.data.new_user;
        var h = e.detail.formId, _ = l.data.user_id, w = l.data.openid;
        if (null != l.data.user_name) y = l.data.user_name; else var y = l.data.users.user_name;
        if (null != l.data.user_address) x = l.data.user_address; else var x = l.data.users.user_address;
        if (null != l.data.user_tel) v = l.data.user_tel; else var v = l.data.users.user_tel;
        console.log("用户的名字为" + y), console.log("用户的地址为" + x), console.log("用户的电话号码为" + v);
        var q = l.data.totalbox, b = l.data.seller_id;
        if (console.log(b), "" == w) wx.showToast({
            title: "id为空",
            icon: "",
            image: "",
            duration: 500,
            mask: !0,
            success: function(e) {},
            fail: function(e) {},
            complete: function(e) {}
        }); else if ("" == x) wx.showToast({
            title: "请先选择地址",
            icon: "",
            image: "",
            duration: 1e3,
            mask: !0,
            success: function(e) {},
            fail: function(e) {},
            complete: function(e) {}
        }); else {
            this.setData({
                zfz: !0
            });
            var z = x.replace(" ", "");
            console.log(z);
            var D = z.indexOf("市");
            console.log(z.substring(0, D));
            var j = z.substring(0, D);
            qqmapsdk.geocoder({
                address: z,
                success: function(t) {
                    console.log(t), console.log("终点:", t.result.location), console.log(t.result.location.lat + "," + t.result.location.lng);
                    var s = t.result.location.lat, f = t.result.location.lng, z = t.result.location;
                    console.log(s, f), l.distance(l.data.start, z, function(t) {
                        console.log(t, distance), distance < t && 2 == c ? (wx.showModal({
                            title: "提示",
                            content: "超出商家配送距离",
                            showCancel: !1
                        }), l.setData({
                            zfz: !1,
                            showModal: !1
                        })) : "" == h ? (wx.showToast({
                            title: "网络不好",
                            icon: "",
                            image: "",
                            duration: 500,
                            mask: !0,
                            success: function(e) {},
                            fail: function(e) {},
                            complete: function(e) {}
                        }), l.setData({
                            zfz: !1
                        })) : app.util.request({
                            url: "entry/wxapp/AddOrder",
                            cachetime: "0",
                            data: {
                                type: 1,
                                seller_id: b,
                                money: a,
                                user_id: _,
                                preferential: u,
                                freight: i,
                                name: y,
                                address: x,
                                tel: v,
                                box_fee: q,
                                sz: p,
                                coupons_id: g,
                                voucher_id: m,
                                note: d,
                                area: j,
                                lat: s,
                                lng: f,
                                is_take: c,
                                delivery_time: r,
                                is_yue: n,
                                form_id: h,
                                jf: o
                            },
                            success: function(t) {
                                console.log(t);
                                var o = t.data;
                                console.log("本次的订单id为" + o), "下单失败" != o ? (l.setData({
                                    zfz: !1,
                                    showModal: !1
                                }), "yezf" == e.detail.value.radiogroup ? (console.log("余额支付流程"), console.log(l.data.store), 
                                app.util.request({
                                    url: "entry/wxapp/PayOrder",
                                    cachetime: "0",
                                    data: {
                                        user_id: _,
                                        order_id: o,
                                        coupons_id: g,
                                        voucher_id: m
                                    },
                                    success: function(e) {
                                        console.log(e), wx.showModal({
                                            title: "提示",
                                            content: "支付成功",
                                            showCancel: !1
                                        }), setTimeout(function() {
                                            wx.switchTab({
                                                url: "../list/list"
                                            });
                                        }, 1e3), console.log(h), "1" != l.data.store.ps_mode || l.data.dnzt || app.util.request({
                                            url: "entry/wxapp/dada",
                                            cachetime: "0",
                                            data: {
                                                area: j,
                                                order_id: o,
                                                lat: s,
                                                lng: f
                                            },
                                            success: function(e) {
                                                console.log(e);
                                            }
                                        }), "1" == l.data.ptxx.is_email && app.util.request({
                                            url: "entry/wxapp/email",
                                            cachetime: "0",
                                            data: {
                                                store_id: b,
                                                type: "外卖"
                                            },
                                            success: function(e) {
                                                console.log(e);
                                            }
                                        }), app.util.request({
                                            url: "entry/wxapp/Print",
                                            cachetime: "0",
                                            data: {
                                                order_id: o
                                            },
                                            success: function(e) {
                                                console.log(e);
                                            }
                                        }), app.util.request({
                                            url: "entry/wxapp/Print2",
                                            cachetime: "0",
                                            data: {
                                                order_id: o
                                            },
                                            success: function(e) {
                                                console.log(e);
                                            }
                                        }), app.util.request({
                                            url: "entry/wxapp/message",
                                            cachetime: "0",
                                            data: {
                                                openid: w,
                                                form_id: h,
                                                id: o
                                            },
                                            success: function(e) {
                                                console.log(e);
                                            }
                                        }), app.util.request({
                                            url: "entry/wxapp/SmsSet",
                                            cachetime: "0",
                                            data: {
                                                store_id: b
                                            },
                                            success: function(e) {
                                                console.log(e), "1" == e.data.is_wmsms && app.util.request({
                                                    url: "entry/wxapp/sms",
                                                    cachetime: "0",
                                                    data: {
                                                        store_id: b
                                                    },
                                                    success: function(e) {
                                                        console.log(e);
                                                    }
                                                });
                                            }
                                        });
                                    }
                                })) : "jfzf" == e.detail.value.radiogroup ? (console.log("积分支付流程"), console.log(l.data.store), 
                                app.util.request({
                                    url: "entry/wxapp/PayOrder",
                                    cachetime: "0",
                                    data: {
                                        user_id: _,
                                        order_id: o,
                                        coupons_id: g,
                                        voucher_id: m
                                    },
                                    success: function(e) {
                                        console.log(e), wx.showModal({
                                            title: "提示",
                                            content: "支付成功",
                                            showCancel: !1
                                        }), setTimeout(function() {
                                            wx.switchTab({
                                                url: "../list/list"
                                            });
                                        }, 1e3), console.log(h), "1" != l.data.store.ps_mode || l.data.dnzt || app.util.request({
                                            url: "entry/wxapp/dada",
                                            cachetime: "0",
                                            data: {
                                                area: j,
                                                order_id: o,
                                                lat: s,
                                                lng: f
                                            },
                                            success: function(e) {
                                                console.log(e);
                                            }
                                        }), "1" == l.data.ptxx.is_email && app.util.request({
                                            url: "entry/wxapp/email",
                                            cachetime: "0",
                                            data: {
                                                store_id: b,
                                                type: "外卖"
                                            },
                                            success: function(e) {
                                                console.log(e);
                                            }
                                        }), app.util.request({
                                            url: "entry/wxapp/Print",
                                            cachetime: "0",
                                            data: {
                                                order_id: o
                                            },
                                            success: function(e) {
                                                console.log(e);
                                            }
                                        }), app.util.request({
                                            url: "entry/wxapp/Print2",
                                            cachetime: "0",
                                            data: {
                                                order_id: o
                                            },
                                            success: function(e) {
                                                console.log(e);
                                            }
                                        }), app.util.request({
                                            url: "entry/wxapp/message",
                                            cachetime: "0",
                                            data: {
                                                openid: w,
                                                form_id: h,
                                                id: o
                                            },
                                            success: function(e) {
                                                console.log(e);
                                            }
                                        }), app.util.request({
                                            url: "entry/wxapp/SmsSet",
                                            cachetime: "0",
                                            data: {
                                                store_id: b
                                            },
                                            success: function(e) {
                                                console.log(e), "1" == e.data.is_wmsms && app.util.request({
                                                    url: "entry/wxapp/sms",
                                                    cachetime: "0",
                                                    data: {
                                                        store_id: b
                                                    },
                                                    success: function(e) {
                                                        console.log(e);
                                                    }
                                                });
                                            }
                                        });
                                    }
                                })) : (console.log("微信支付流程"), app.util.request({
                                    url: "entry/wxapp/pay",
                                    cachetime: "0",
                                    data: {
                                        openid: w,
                                        order_id: o,
                                        money: a
                                    },
                                    success: function(e) {
                                        console.log(e), wx.hideLoading(), wx.requestPayment({
                                            timeStamp: e.data.timeStamp,
                                            nonceStr: e.data.nonceStr,
                                            package: e.data.package,
                                            signType: e.data.signType,
                                            paySign: e.data.paySign,
                                            success: function(e) {
                                                console.log("支付成功", e), wx.showModal({
                                                    title: "提示",
                                                    content: "支付成功",
                                                    showCancel: !1
                                                });
                                            },
                                            complete: function(e) {
                                                console.log("支付完成", e), "requestPayment:fail cancel" == e.errMsg && (wx.showToast({
                                                    title: "取消支付",
                                                    icon: "loading",
                                                    duration: 1e3
                                                }), setTimeout(function() {
                                                    wx.switchTab({
                                                        url: "../list/list"
                                                    });
                                                }, 1e3)), "requestPayment:ok" == e.errMsg && setTimeout(function() {
                                                    wx.switchTab({
                                                        url: "../list/list"
                                                    });
                                                }, 1e3);
                                            }
                                        });
                                    }
                                }))) : wx.showToast({
                                    title: "下单失败"
                                });
                            }
                        });
                    });
                },
                fail: function(e) {
                    console.log(e);
                },
                complete: function(e) {
                    console.log(e);
                }
            });
        }
    },
    coupon: function(e) {
        var t = this;
        console.log(t.data), wx.navigateTo({
            url: "../coupons/mine_coupons?totalPrice=" + t.data.totalPrice + "&state=1",
            success: function(e) {},
            fail: function(e) {},
            complete: function(e) {}
        });
    }
});