var app = getApp(), util = require("../../utils/util.js"), APP_ID = "", APP_SECRET = "", OPEN_ID = "", SESSION_KEY = "";

Page({
    data: {
        xzggindex: "0",
        showModal: !1,
        boxfre: !0,
        changeHidden1: !0,
        changeHidden: !0,
        toastHidden: !0,
        selected1: !0,
        selected2: !1,
        selected3: !1,
        showview: !0,
        hidden1: !1,
        hidden2: !0,
        hidden3: !0,
        catalogSelect: 0,
        store: [],
        http: [],
        showView: !1,
        close: !1,
        login: [],
        rest: "",
        start_at: "",
        conditions: "",
        preferential: "",
        dishes: [],
        link: "",
        toView: "0",
        store_name: "",
        scrollTop: 100,
        totalPrice: 0,
        totalCount: 0,
        carArray: [],
        freight: 0,
        payDesc: 0,
        userInfo: {},
        parentIndex: 0,
        url: "",
        hidden: !1,
        curNav: 1,
        curIndex: 0,
        cart: [],
        cartTotal: 0,
        one: 1,
        ping: "",
        hdnum: 0,
        star1: [ {
            url: "../images/full-star.png"
        }, {
            url: "../images/no-star.png"
        }, {
            url: "../images/no-star.png"
        }, {
            url: "../images/no-star.png"
        }, {
            url: "../images/no-star.png"
        } ],
        star2: [ {
            url: "../images/full-star.png"
        }, {
            url: "../images/full-star.png"
        }, {
            url: "../images/no-star.png"
        }, {
            url: "../images/no-star.png"
        }, {
            url: "../images/no-star.png"
        } ],
        star3: [ {
            url: "../images/full-star.png"
        }, {
            url: "../images/full-star.png"
        }, {
            url: "../images/full-star.png"
        }, {
            url: "../images/no-star.png"
        }, {
            url: "../images/no-star.png"
        } ],
        star4: [ {
            url: "../images/full-star.png"
        }, {
            url: "../images/full-star.png"
        }, {
            url: "../images/full-star.png"
        }, {
            url: "../images/full-star.png"
        }, {
            url: "../images/no-star.png"
        } ],
        star5: [ {
            url: "../images/full-star.png"
        }, {
            url: "../images/full-star.png"
        }, {
            url: "../images/full-star.png"
        }, {
            url: "../images/full-star.png"
        }, {
            url: "../images/full-star.png"
        } ]
    },
    ycgg: function() {
        this.setData({
            showModal: !1
        });
    },
    onLoad: function(a) {
        var t = this;
        wx.getSystemInfo({
            success: function(a) {
                console.log(a.windowWidth), console.log(a.windowHeight), t.setData({
                    height: a.windowHeight / a.windowWidth * 750 - 500
                });
            }
        }), wx.getUserInfo({
            success: function(a) {
                console.log(a.userInfo);
                var e = a.userInfo;
                t.setData({
                    nickName: e.nickName,
                    avatarUrl: e.avatarUrl
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
                                        var e = a.userInfo;
                                        t.setData({
                                            nickName: e.nickName,
                                            avatarUrl: e.avatarUrl
                                        });
                                    }
                                }) : t.setData({
                                    nickName: "",
                                    avatarUrl: ""
                                });
                            },
                            fail: function(a) {}
                        });
                    }
                });
            },
            complete: function(a) {}
        }), wx.login({
            success: function(a) {
                var e = a.code;
                wx.setStorageSync("code", a.code), app.util.request({
                    url: "entry/wxapp/openid",
                    cachetime: "0",
                    data: {
                        code: e
                    },
                    success: function(a) {
                        console.log(a), wx.setStorageSync("key", a.data.session_key), wx.setStorageSync("openid", a.data.openid);
                        var e = a.data.openid;
                        console.log(e), "" == e ? wx.showToast({
                            title: "没有获取到openid",
                            icon: "",
                            image: "",
                            duration: 1e3,
                            mask: !0,
                            success: function(a) {},
                            fail: function(a) {},
                            complete: function(a) {}
                        }) : app.util.request({
                            url: "entry/wxapp/Login",
                            cachetime: "0",
                            data: {
                                openid: e,
                                img: t.data.avatarUrl,
                                name: t.data.nickName
                            },
                            success: function(a) {
                                console.log(a), wx.setStorageSync("users", a.data), app.util.request({
                                    url: "entry/wxapp/New",
                                    cachetime: "0",
                                    data: {
                                        user_id: a.data.id,
                                        store_id: getApp().sjid
                                    },
                                    success: function(a) {
                                        console.log(a), wx.setStorageSync("new_user", a.data);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }), console.log(a);
        var e = Number(a.type);
        1 == e ? console.log("用户选择的是店内点餐") : console.log("用户选择的是外卖点餐"), t.setData({
            types: e
        });
        var s = decodeURIComponent(a.scene).split(",");
        console.log(s), "undefined" != s && (getApp().sjid = s[1], this.setData({
            types: 1,
            tableid: s[0]
        }), app.util.request({
            url: "entry/wxapp/Store",
            cachetime: "0",
            data: {
                id: getApp().sjid
            },
            success: function(a) {
                console.log(a), "1" == a.data.is_czztpd ? app.util.request({
                    url: "entry/wxapp/Zhuohao",
                    cachetime: "0",
                    data: {
                        id: s[0]
                    },
                    success: function(a) {
                        console.log(a), "0" == a.data.status ? (wx.showModal({
                            title: "提示",
                            content: "桌位信息：" + a.data.type_name + "--" + a.data.table_name,
                            showCancel: !1,
                            success: function(a) {},
                            fail: function(a) {},
                            complete: function(a) {}
                        }), t.setData({
                            kt: !1
                        })) : (wx.showModal({
                            title: "提示",
                            content: "此桌已开台暂不能点餐,请选择其他座位",
                            showCancel: !1,
                            success: function(a) {},
                            fail: function(a) {},
                            complete: function(a) {}
                        }), setTimeout(function() {
                            wx.navigateBack({});
                        }, 1e3), t.setData({
                            kt: !0
                        }));
                    }
                }) : app.util.request({
                    url: "entry/wxapp/Zhuohao",
                    cachetime: "0",
                    data: {
                        id: s[0]
                    },
                    success: function(a) {
                        console.log(a), wx.showModal({
                            title: "提示",
                            content: "桌位信息：" + a.data.type_name + "--" + a.data.table_name,
                            showCancel: !1,
                            success: function(a) {},
                            fail: function(a) {},
                            complete: function(a) {}
                        }), t.setData({
                            kt: !1
                        });
                    }
                });
            }
        })), a.showview, a.showView, t.reload();
    },
    reload: function(a) {
        var t = this, e = util.formatTime(new Date()).slice(11, 16);
        this.data.store_name;
        wx.showShareMenu({
            withShareTicket: !0
        }), app.util.request({
            url: "entry/wxapp/Store",
            cachetime: "0",
            data: {
                id: getApp().sjid
            },
            success: function(a) {
                "" != a.data.wm_name && 2 == t.data.types && wx.setNavigationBarTitle({
                    title: a.data.wm_name
                }), "" != a.data.dn_name && 1 == t.data.types && wx.setNavigationBarTitle({
                    title: a.data.dn_name
                }), wx.setNavigationBarColor({
                    frontColor: "#ffffff",
                    backgroundColor: a.data.color
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
                }), console.log(a), app.util.request({
                    url: "entry/wxapp/Reduction",
                    cachetime: "0",
                    data: {
                        id: getApp().sjid
                    },
                    success: function(e) {
                        console.log(e);
                        for (var s = [], o = [], d = 0; d < e.data.length; d++) "2" != e.data[d].type && "3" != e.data[d].type || s.push(e.data[d]), 
                        "1" != e.data[d].type && "3" != e.data[d].type || o.push(e.data[d]);
                        if (1 == t.data.types) {
                            i = s;
                            t.setData({
                                mj: s
                            });
                        }
                        if (2 == t.data.types) {
                            var i = o;
                            t.setData({
                                mj: o
                            });
                        }
                        0 != i.length && "1" == a.data.xyh_open ? t.setData({
                            hdnum: 2
                        }) : 0 != i.length && "1" != a.data.xyh_open || 0 == i.length && "1" == a.data.xyh_open ? t.setData({
                            hdnum: 1
                        }) : t.setData({
                            hdnum: 0
                        });
                    }
                });
                var s = a.data.id, o = a.data.time, d = a.data.time2, i = a.data.time3, n = a.data.time4, r = a.data.is_rest;
                console.log("当前的系统时间为" + e), console.log("商家的营业时间从" + o + "至" + d, i + "至" + n), 
                1 == r ? console.log("商家正在休息" + r) : console.log("商家正在营业" + r), n > o ? e > o && e < d || e > i && e < n ? (console.log("商家正常营业"), 
                t.setData({
                    time: 1
                })) : e < o || e > d && e < i ? (console.log("商家还没开店呐，稍等一会儿可以吗？"), t.setData({
                    time: 2
                })) : e > n && (console.log("商家以及关店啦，明天再来吧"), t.setData({
                    time: 3
                })) : n < o && (e > o && e < d || e > i && e > n || e < i && e < n ? (console.log("商家正常营业"), 
                t.setData({
                    time: 1
                })) : e < o || e > d && e < i ? (console.log("商家还没开店呐，稍等一会儿可以吗？"), t.setData({
                    time: 2
                })) : e > n && (console.log("商家以及关店啦，明天再来吧"), t.setData({
                    time: 3
                }))), console.log("商家的id为" + s), app.util.request({
                    url: "entry/wxapp/Score",
                    cachetime: "0",
                    data: {
                        seller_id: s
                    },
                    success: function(a) {
                        console.log(a);
                        var e = a.data;
                        e = e.toFixed(1), console.log(e), t.setData({
                            score: e
                        });
                    }
                }), app.util.request({
                    url: "entry/wxapp/StorePl",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    cachetime: "0",
                    data: {
                        id: s
                    },
                    success: function(a) {
                        console.log(a.data);
                        var e = a.data.length;
                        console.log(e);
                        for (var s = 0; s < a.data.length; s++) a.data[s].score = a.data[s].score.slice(0, 2);
                        console.log(a.data), t.setData({
                            ping: a.data
                        });
                    }
                }), t.setData({
                    store: a.data,
                    rest: r,
                    color: a.data.color,
                    seller_id: s,
                    start_at: a.data.start_at
                });
            }
        }), app.util.request({
            url: "entry/wxapp/Url",
            cachetime: "0",
            success: function(a) {
                t.setData({
                    url: a.data
                });
            }
        });
        var s = (t = this).data.types;
        console.log(s), app.util.request({
            url: "entry/wxapp/Dishes",
            cachetime: "0",
            data: {
                id: getApp().sjid,
                dishes_type: s
            },
            success: function(a) {
                for (var e = 0; e < a.data.length; e++) for (var s = 0; s < a.data[e].goods.length; s++) a.data[e].goods[s].xs_num = Number(a.data[e].goods[s].xs_num), 
                a.data[e].goods[s].sit_ys_num = Number(a.data[e].goods[s].sit_ys_num);
                console.log(a.data), t.setData({
                    dishes: a.data
                });
            }
        });
    },
    selected1: function(a) {
        this.setData({
            selected2: !1,
            selected3: !1,
            selected1: !0,
            hidden1: !1,
            hidden2: !0,
            hidden3: !0
        });
    },
    selected2: function(a) {
        this.setData({
            selected1: !1,
            selected2: !0,
            selected3: !1,
            hidden1: !0,
            hidden2: !1,
            hidden3: !0
        });
    },
    selected3: function(a) {
        this.setData({
            selected1: !1,
            selected2: !1,
            selected3: !0,
            hidden1: !0,
            hidden2: !0,
            hidden3: !1
        });
    },
    onReady: function() {
        1 == this.data.types ? wx.setNavigationBarTitle({
            title: "堂内点餐"
        }) : 2 == this.data.types && wx.setNavigationBarTitle({
            title: "外卖点餐"
        }), console.log(this.data.types);
    },
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        this.reload(), wx.stopPullDownRefresh();
    },
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    call_phone: function() {
        var a = this;
        wx.makePhoneCall({
            phoneNumber: a.data.store.tel
        });
    },
    tomap: function(a) {
        var t = this;
        wx.openLocation({
            latitude: t.data.sjdzlat,
            longitude: t.data.sjdzlng,
            name: t.data.store.name,
            address: t.data.store.address
        });
    },
    tzsjhj: function(a) {
        console.log(a.currentTarget.dataset.sjid), wx.navigateTo({
            url: "../info/sjhj"
        });
    },
    selectMenu: function(a) {
        var t = a.currentTarget.dataset.itemIndex;
        this.setData({
            toView: "order" + t.toString(),
            catalogSelect: a.currentTarget.dataset.itemIndex
        }), console.log("order" + t.toString());
    },
    close: function() {
        var a = this;
        a.setData({
            showView: !a.data.showView
        });
    },
    zwkc: function() {
        wx.showToast({
            title: "没有库存了"
        });
    },
    addShopCart: function(a) {
        var t = this;
        console.log(this.data.dishes), console.log(this.data.carArray), console.log(a.currentTarget.dataset);
        var e = a.currentTarget.dataset.itemIndex, s = a.currentTarget.dataset.parentindex, o = a.currentTarget.dataset.gwcindex, d = a.currentTarget.dataset.ggindex;
        if (null != d) {
            this.data.dishes[s].goods[e].one++, this.data.dishes[s].goods[e].gg[d].num++;
            u = "a" + e + "b" + s + "c" + this.data.dishes[s].goods[e].gg[d].id;
            if (2 == this.data.types) p = this.data.dishes[s].goods[e].gg[d].cost; else p = this.data.dishes[s].goods[e].gg[d].cost;
            m = this.data.dishes[s].goods[e].box_fee;
            console.log("餐盒费是：" + m);
            var i = Number(t.data.dishes[s].goods[e].num), n = this.data.dishes[s].goods[e].gg[d].num, r = this.data.dishes[s].goods[e].name + this.data.dishes[s].goods[e].gg[d].name, l = this.data.dishes[s].goods[e].id, c = this.data.dishes[s].goods[e].img, g = this.data.store, h = {
                ggindex: d,
                money: p,
                num: n,
                kc: i,
                id: l,
                mark: u,
                name: r,
                index: e,
                parentIndex: s,
                icon: c,
                store: g,
                box_fee: m,
                allmoney: (p * n).toFixed(2)
            };
            (f = this.data.carArray.filter(function(a) {
                return a.mark != u;
            })).splice(o, 0, h), console.log(f), this.setData({
                shop_cart: f,
                carArray: f,
                dishes: this.data.dishes
            }), console.log(this.data.carArray), this.calTotalPrice(), this.setData({
                payDesc: this.payDesc()
            });
        } else {
            console.log(d), t.data.dishes[s].goods[e].one++;
            var u = "a" + e + "b" + s;
            if (2 == t.data.types) p = t.data.dishes[s].goods[e].wm_money; else var p = t.data.dishes[s].goods[e].money;
            var m = t.data.dishes[s].goods[e].box_fee;
            console.log("餐盒费是：" + m);
            var i = Number(t.data.dishes[s].goods[e].num), n = t.data.dishes[s].goods[e].one, r = t.data.dishes[s].goods[e].name, l = t.data.dishes[s].goods[e].id, c = t.data.dishes[s].goods[e].img, g = t.data.store, h = {
                money: p,
                num: n,
                kc: i,
                id: l,
                mark: u,
                name: r,
                index: e,
                parentIndex: s,
                icon: c,
                store: g,
                box_fee: m,
                allmoney: (p * n).toFixed(2)
            }, f = t.data.carArray.filter(function(a) {
                return a.mark != u;
            });
            f.splice(o, 0, h), console.log(f), t.setData({
                shop_cart: f,
                carArray: f,
                dishes: t.data.dishes
            }), console.log(t.data.dishes), t.calTotalPrice(), t.setData({
                payDesc: t.payDesc()
            });
        }
    },
    decreaseShopCart: function(a) {
        var t = this;
        console.log(this.data.dishes), console.log(this.data.carArray), console.log(a.currentTarget.dataset);
        var e = a.currentTarget.dataset.itemIndex, s = a.currentTarget.dataset.parentindex, o = a.currentTarget.dataset.gwcindex, d = a.currentTarget.dataset.ggindex;
        if (null != d) {
            this.data.dishes[s].goods[e].one--, this.data.dishes[s].goods[e].gg[d].num--;
            u = "a" + e + "b" + s + "c" + this.data.dishes[s].goods[e].gg[d].id;
            if (2 == this.data.types) p = this.data.dishes[s].goods[e].gg[d].cost; else p = this.data.dishes[s].goods[e].gg[d].cost;
            m = this.data.dishes[s].goods[e].box_fee;
            console.log("餐盒费是：" + m);
            var i = Number(t.data.dishes[s].goods[e].num), n = this.data.dishes[s].goods[e].gg[d].num, r = this.data.dishes[s].goods[e].name + this.data.dishes[s].goods[e].gg[d].name, l = this.data.dishes[s].goods[e].id, c = this.data.dishes[s].goods[e].img, g = this.data.store, h = {
                ggindex: d,
                money: p,
                num: n,
                kc: i,
                id: l,
                mark: u,
                name: r,
                index: e,
                parentIndex: s,
                icon: c,
                store: g,
                box_fee: m,
                allmoney: (p * n).toFixed(2)
            };
            (f = this.data.carArray.filter(function(a) {
                return a.mark != u;
            })).splice(o, 0, h), console.log(f), this.setData({
                shop_cart: f,
                carArray: f,
                dishes: this.data.dishes
            }), console.log(this.data.carArray), this.calTotalPrice(), this.setData({
                payDesc: this.payDesc()
            });
        } else {
            console.log(d), t.data.dishes[s].goods[e].one--;
            var u = "a" + e + "b" + s;
            if (2 == t.data.types) p = t.data.dishes[s].goods[e].wm_money; else var p = t.data.dishes[s].goods[e].money;
            var m = t.data.dishes[s].goods[e].box_fee;
            console.log("餐盒费是：" + m);
            var i = Number(t.data.dishes[s].goods[e].num), n = t.data.dishes[s].goods[e].one, r = t.data.dishes[s].goods[e].name, l = t.data.dishes[s].goods[e].id, c = t.data.dishes[s].goods[e].img, g = t.data.store, h = {
                money: p,
                num: n,
                kc: i,
                id: l,
                mark: u,
                name: r,
                index: e,
                parentIndex: s,
                icon: c,
                store: g,
                box_fee: m,
                allmoney: (p * n).toFixed(2)
            }, f = t.data.carArray.filter(function(a) {
                return a.mark != u;
            });
            f.splice(o, 0, h), t.setData({
                shop_cart: f,
                carArray: f,
                dishes: t.data.dishes
            }), t.calTotalPrice(), t.setData({
                payDesc: t.payDesc()
            }), console.log(t.data.dishes);
        }
    },
    decreaseCart: function(a) {
        console.log("你点击了减号");
        var t = this;
        console.log(this.data);
        var e = a.currentTarget.dataset.itemIndex, s = a.currentTarget.dataset.parentindex;
        console.log(e, s), console.log(s, t.data.dishes[s].goods[e].id), app.util.request({
            url: "entry/wxapp/DishesGg",
            cachetime: "0",
            data: {
                dishes_id: t.data.dishes[s].goods[e].id
            },
            success: function(a) {
                if (console.log(a), 0 != a.data.length) wx.showModal({
                    title: "提示",
                    showCancel: !1,
                    content: "多规格商品只能在购物车删除哦"
                }); else {
                    t.data.dishes[s].goods[e].one--;
                    var o = "a" + e + "b" + s;
                    if (2 == t.data.types) d = t.data.dishes[s].goods[e].wm_money; else var d = t.data.dishes[s].goods[e].money;
                    var i = t.data.dishes[s].goods[e].box_fee;
                    console.log("餐盒费是：" + i);
                    var n = Number(t.data.dishes[s].goods[e].num), r = t.data.dishes[s].goods[e].one, l = t.data.dishes[s].goods[e].name, c = t.data.dishes[s].goods[e].id, g = t.data.dishes[s].goods[e].img, h = t.data.store, u = {
                        money: d,
                        num: r,
                        kc: n,
                        id: c,
                        mark: o,
                        name: l,
                        index: e,
                        parentIndex: s,
                        icon: g,
                        store: h,
                        box_fee: i,
                        allmoney: (d * r).toFixed(2)
                    }, p = t.data.carArray.filter(function(a) {
                        return a.mark != o;
                    });
                    p.splice(e, 0, u), t.setData({
                        shop_cart: p,
                        carArray: p,
                        dishes: t.data.dishes
                    }), t.calTotalPrice(), t.setData({
                        payDesc: t.payDesc()
                    }), console.log(t.data.dishes);
                }
            }
        });
    },
    xzggClick: function(a) {
        this.setData({
            xzggindex: a.currentTarget.id
        });
    },
    xhl: function() {
        var a = this.data.zindex, t = this.data.findex;
        console.log(this.data.zindex, this.data.findex), console.log(this.data.dishes), 
        this.data.dishes[t].goods[a].one++, this.data.dishes[t].goods[a].gg[this.data.xzggindex].num++;
        var e = "a" + a + "b" + t + "c" + this.data.gg[this.data.xzggindex].id, s = this.data.xzggindex;
        if (2 == this.data.types) o = this.data.gg[this.data.xzggindex].cost; else var o = this.data.gg[this.data.xzggindex].cost;
        var d = this.data.dishes[t].goods[a].box_fee;
        console.log("餐盒费是：" + d);
        var i = Number(this.data.dishes[t].goods[a].num), n = this.data.dishes[t].goods[a].gg[this.data.xzggindex].num, r = this.data.ggbt + this.data.gg[this.data.xzggindex].name, l = this.data.dishes[t].goods[a].id, c = this.data.dishes[t].goods[a].img, g = this.data.store, h = {
            ggindex: s,
            money: o,
            num: n,
            kc: i,
            id: l,
            mark: e,
            name: r,
            index: a,
            parentIndex: t,
            icon: c,
            store: g,
            box_fee: d,
            allmoney: (o * n).toFixed(2)
        }, u = this.data.carArray.filter(function(a) {
            return a.mark != e;
        });
        u.splice(a, 0, h), console.log(u), this.setData({
            shop_cart: u,
            carArray: u,
            dishes: this.data.dishes
        }), this.calTotalPrice(), this.setData({
            payDesc: this.payDesc()
        }), this.setData({
            showModal: !1,
            xzggindex: 0
        });
    },
    addCart: function(a) {
        console.log(this.data);
        var t = this, e = a.currentTarget.dataset.itemIndex, s = a.currentTarget.dataset.parentindex;
        this.setData({
            zindex: e,
            findex: s
        }), console.log(s, t.data.dishes[s].goods[e].id), app.util.request({
            url: "entry/wxapp/DishesGg",
            cachetime: "0",
            data: {
                dishes_id: t.data.dishes[s].goods[e].id
            },
            success: function(a) {
                if (console.log(a), 0 != a.data.length) null == t.data.dishes[s].goods[e].gg ? (t.setData({
                    showModal: !0,
                    gg: a.data,
                    ggbt: t.data.dishes[s].goods[e].name
                }), t.data.dishes[s].goods[e].gg = a.data, t.setData({
                    dishes: t.data.dishes
                }), console.log(t.data.dishes)) : (t.setData({
                    showModal: !0,
                    gg: a.data,
                    ggbt: t.data.dishes[s].goods[e].name
                }), console.log(t.data.dishes)); else {
                    t.data.dishes[s].goods[e].one++;
                    var o = "a" + e + "b" + s;
                    if (2 == t.data.types) d = t.data.dishes[s].goods[e].wm_money; else var d = t.data.dishes[s].goods[e].money;
                    var i = t.data.dishes[s].goods[e].box_fee;
                    console.log("餐盒费是：" + i);
                    var n = Number(t.data.dishes[s].goods[e].num), r = t.data.dishes[s].goods[e].one, l = t.data.dishes[s].goods[e].name, c = t.data.dishes[s].goods[e].id, g = t.data.dishes[s].goods[e].img, h = t.data.store, u = {
                        money: d,
                        num: r,
                        kc: n,
                        id: c,
                        mark: o,
                        name: l,
                        index: e,
                        parentIndex: s,
                        icon: g,
                        store: h,
                        box_fee: i,
                        allmoney: (d * r).toFixed(2)
                    }, p = t.data.carArray.filter(function(a) {
                        return a.mark != o;
                    });
                    p.splice(e, 0, u), console.log(p), t.setData({
                        shop_cart: p,
                        carArray: p,
                        dishes: t.data.dishes
                    }), console.log(t.data.dishes), t.calTotalPrice(), t.setData({
                        payDesc: t.payDesc()
                    });
                }
            }
        });
    },
    calTotalPrice: function() {
        for (var a = this.data.carArray, t = 0, e = 0, s = 0, o = 0; o < a.length; o++) 2 == this.data.types ? (t += a[o].money * a[o].num + a[o].box_fee * a[o].num, 
        s += a[o].num, e += a[o].box_fee * a[o].num) : (t += a[o].money * a[o].num, s += a[o].num), 
        console.log(t);
        this.setData({
            shop_cart: a,
            totalPrice: t.toFixed(2),
            totalCount: s,
            totalbox: e
        });
    },
    payDesc: function() {
        console.log(this.data);
        var a = parseFloat(this.data.totalPrice), t = parseFloat(this.data.start_at);
        return 2 == this.data.types ? 0 == this.data.totalPrice ? "￥" + this.data.start_at + "元起送" : this.data.totalPrice <= 0 ? "￥" + this.data.start_at + "元起送" : a < t ? (console.log(this.data.totalPrice), 
        "还差" + (t - a).toFixed(2) + "元起送") : (console.log(a), "去结算") : this.data.totalPrice >= 0 ? "去下单" : void 0;
    },
    clear: function(a) {
        var t = this;
        t.setData({
            shop_cart: [],
            carArray: [],
            carArray1: [],
            changeHidden: !0
        }), t.calTotalPrice(), t.reload();
    },
    clickImage: function(a) {
        var t = this;
        console.log(a), console.log(t.data);
        t.data.url;
        var e = a.target.dataset.id;
        console.log(e);
        for (var s = [], o = 0; o < t.data.dishes.length; o++) for (var d = 0; d < t.data.dishes[o].goods.length; d++) if (console.log(t.data.dishes[o].goods[d].id), 
        t.data.dishes[o].goods[d].id == e) {
            s.splice(e, 0, t.data.dishes[o].goods[d].img);
            var i = t.data.dishes[o].goods[d];
            app.util.request({
                url: "entry/wxapp/DishesInfo",
                cachetime: "0",
                data: {
                    id: i.id
                },
                success: function(a) {
                    console.log(a.data), wx.navigateTo({
                        url: "../dishinfo/dishinfo?id=" + i.id + "&types=" + t.data.types
                    });
                }
            });
        }
    },
    bomb: function(a) {
        for (var t = a.currentTarget.id, e = this.data.dishes, s = 0, o = e.length; s < o; ++s) for (var d = e[s].goods, i = 0; i < d.length; i++) d[i].id == t ? d[i].open = !d[i].open : d[i].open = !1;
        this.setData({
            dishes: e,
            id: a.currentTarget.id
        });
    },
    jcgwc: function(a) {
        var t = 0;
        for (var e in a) 0 != a[e].num && t++;
        return t;
    },
    pay: function(a) {
        if (console.log(this.data.types), console.log(this.data.shop_cart), 2 == this.data.types) {
            e = this.data.shop_cart;
            if (console.log(this.data.shop_cart), console.log(this.jcgwc(e)), console.log(this.data), 
            wx.setStorageSync("store", this.data.store), wx.setStorageSync("order", this.data.shop_cart), 
            null == e || 0 == e.length) return void wx.showModal({
                title: "提示",
                showCancel: !1,
                content: "请选择菜品"
            });
            if (0 == this.jcgwc(e)) return void wx.showModal({
                title: "提示",
                showCancel: !1,
                content: "请选择菜品"
            });
            if (parseFloat(this.data.totalPrice) < parseFloat(this.data.start_at)) return;
            wx.navigateTo({
                url: "../pay/pay?types=" + this.data.types
            });
        } else {
            var t = this.data.tableid, e = this.data.shop_cart;
            console.log(this.data.shop_cart), console.log(this.data), wx.setStorageSync("store", this.data.store), 
            wx.setStorageSync("order", this.data.shop_cart);
            wx.navigateTo({
                url: "../order/order?types=" + this.data.types + "&tableid=" + t
            });
        }
    },
    navInfo: function(a) {
        wx.switchTab({
            url: "../info/info",
            success: function(a) {},
            fail: function(a) {},
            complete: function(a) {}
        });
    },
    change: function(a) {
        console.log("1111"), this.setData({
            changeHidden: !0
        });
    },
    toastChange: function(a) {
        this.setData({
            toastHidden: !0
        });
    },
    change1: function(a) {
        console.log("1111"), this.setData({
            changeHidden: !1
        });
    },
    ktpay: function() {
        wx.showModal({
            title: "提示",
            content: "此桌已开台不能点菜"
        });
    }
});