var form_id, app = getApp();

Page({
    data: {
        money: 0,
        qzf: !0,
        showModal: !1,
        zffs: 1,
        zfz: !1,
        zfwz: "微信支付",
        btntype: "btn_ok1"
    },
    radioChange: function(t) {
        console.log("radio发生change事件，携带value值为：", t.detail.value), "wxzf" == t.detail.value && this.setData({
            zffs: 1,
            zfwz: "微信支付",
            btntype: "btn_ok1"
        }), "yezf" == t.detail.value && this.setData({
            zffs: 2,
            zfwz: "余额支付",
            btntype: "btn_ok2"
        }), "jfzf" == t.detail.value && this.setData({
            zffs: 3,
            zfwz: "积分支付",
            btntype: "btn_ok3"
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
    money: function(t) {
        var e;
        console.log(t.detail.value), e = "" != t.detail.value ? t.detail.value : 0, this.setData({
            money: parseFloat(e).toFixed(2)
        });
    },
    formSubmit: function(t) {
        var e = this;
        form_id = t.detail.formId, e.setData({
            form_id: form_id
        });
        var a = wx.getStorageSync("openid"), o = wx.getStorageSync("users").id, s = this.data.money, i = this.data.store.name, n = this.data.store.id;
        if (console.log(a, s, i, n), 0 == s) return wx.showModal({
            title: "提示",
            content: "付款金额不能等于0"
        }), !1;
        if (console.log("form发生了submit事件，携带数据为：", t.detail.value.radiogroup), "yezf" == t.detail.value.radiogroup) {
            var r = Number(this.data.wallet), s = Number(this.data.money);
            if (console.log(r, s), r < s) return void wx.showToast({
                title: "余额不足支付",
                icon: "loading"
            });
        }
        var l = 0;
        if ("jfzf" == t.detail.value.radiogroup) {
            var c = Number(this.data.total_score) / Number(this.data.jf_proportion), s = Number(this.data.money);
            if (l = s * Number(this.data.jf_proportion), console.log(c, s, l), c < s) return void wx.showToast({
                title: "积分不足支付",
                icon: "loading"
            });
        }
        if ("yezf" == t.detail.value.radiogroup) u = 1;
        if ("wxzf" == t.detail.value.radiogroup) u = 2;
        if ("jfzf" == t.detail.value.radiogroup) var u = 3;
        console.log("是否余额", u), "" == form_id ? wx.showToast({
            title: "网络不好",
            icon: "loading",
            duration: 500,
            mask: !0,
            success: function(t) {},
            fail: function(t) {},
            complete: function(t) {}
        }) : (this.setData({
            zfz: !0
        }), "yezf" == t.detail.value.radiogroup ? (console.log("余额支付流程"), app.util.request({
            url: "entry/wxapp/DmOrder",
            cachetime: "0",
            data: {
                money: s,
                store_id: n,
                user_id: o,
                is_yue: u,
                form_id: form_id
            },
            success: function(t) {
                e.setData({
                    zfz: !1,
                    showModal: !1
                }), console.log(t);
                var o = t.data;
                "下单失败" != t.data && app.util.request({
                    url: "entry/wxapp/dmpay",
                    cachetime: "0",
                    data: {
                        order_id: o
                    },
                    success: function(t) {
                        console.log(t), e.onShow(), app.util.request({
                            url: "entry/wxapp/dmPrint",
                            cachetime: "0",
                            data: {
                                order_id: o
                            },
                            success: function(t) {
                                console.log(t);
                            }
                        }), app.util.request({
                            url: "entry/wxapp/dmPrint2",
                            cachetime: "0",
                            data: {
                                order_id: o
                            },
                            success: function(t) {
                                console.log(t);
                            }
                        }), app.util.request({
                            url: "entry/wxapp/Message2",
                            cachetime: "0",
                            data: {
                                openid: a,
                                form_id: form_id,
                                name: i,
                                money: s + "元"
                            },
                            success: function(t) {
                                console.log(t), wx.showModal({
                                    title: "提示",
                                    content: "支付成功"
                                });
                            }
                        });
                    }
                });
            }
        })) : "jfzf" == t.detail.value.radiogroup ? (console.log("积分支付流程"), app.util.request({
            url: "entry/wxapp/DmOrder",
            cachetime: "0",
            data: {
                money: s,
                store_id: n,
                user_id: o,
                is_yue: u,
                form_id: form_id
            },
            success: function(t) {
                e.setData({
                    zfz: !1,
                    showModal: !1
                }), console.log(t);
                var o = t.data;
                "下单失败" != t.data && app.util.request({
                    url: "entry/wxapp/dmpay",
                    cachetime: "0",
                    data: {
                        order_id: o,
                        jf: l
                    },
                    success: function(t) {
                        console.log(t), e.onShow(), app.util.request({
                            url: "entry/wxapp/dmPrint",
                            cachetime: "0",
                            data: {
                                order_id: o
                            },
                            success: function(t) {
                                console.log(t);
                            }
                        }), app.util.request({
                            url: "entry/wxapp/dmPrint2",
                            cachetime: "0",
                            data: {
                                order_id: o
                            },
                            success: function(t) {
                                console.log(t);
                            }
                        }), app.util.request({
                            url: "entry/wxapp/Message2",
                            cachetime: "0",
                            data: {
                                openid: a,
                                form_id: form_id,
                                name: i,
                                money: s + "元"
                            },
                            success: function(t) {
                                console.log(t), wx.showModal({
                                    title: "提示",
                                    content: "支付成功"
                                });
                            }
                        });
                    }
                });
            }
        })) : (console.log("微信支付流程"), app.util.request({
            url: "entry/wxapp/DmOrder",
            cachetime: "0",
            data: {
                money: s,
                store_id: n,
                user_id: o,
                is_yue: u,
                form_id: form_id
            },
            success: function(t) {
                e.setData({
                    zfz: !1,
                    showModal: !1
                }), console.log(t), "下单失败" != t.data && (e.onShow(), app.util.request({
                    url: "entry/wxapp/pay3",
                    cachetime: "0",
                    data: {
                        openid: a,
                        money: s,
                        order_id: t.data
                    },
                    success: function(t) {
                        console.log(t), wx.requestPayment({
                            timeStamp: t.data.timeStamp,
                            nonceStr: t.data.nonceStr,
                            package: t.data.package,
                            signType: t.data.signType,
                            paySign: t.data.paySign,
                            success: function(t) {
                                console.log(t.data), console.log(t), console.log(form_id);
                            },
                            complete: function(t) {
                                console.log(t), "requestPayment:fail cancel" == t.errMsg && wx.showToast({
                                    title: "取消支付",
                                    icon: "loading",
                                    duration: 1e3
                                }), "requestPayment:ok" == t.errMsg && wx.showModal({
                                    title: "提示",
                                    content: "支付成功"
                                });
                            }
                        });
                    }
                }));
            }
        })));
    },
    onLoad: function(t) {
        var e = wx.getStorageSync("nbcolor");
        wx.setNavigationBarColor({
            frontColor: "#ffffff",
            backgroundColor: e
        }), this.setData({
            money: parseFloat(0).toFixed(2)
        });
        var a = this;
        app.util.request({
            url: "entry/wxapp/Store",
            cachetime: "0",
            data: {
                id: getApp().sjid
            },
            success: function(t) {
                console.log(t), a.setData({
                    store: t.data,
                    color: t.data.color
                }), "1" == t.data.is_yue ? a.setData({
                    sjkqyue: !0
                }) : a.setData({
                    sjkqyue: !1
                }), "1" == t.data.is_jfpay ? a.setData({
                    sjkqjf: !0
                }) : a.setData({
                    sjkqjf: !1
                });
            }
        }), app.util.request({
            url: "entry/wxapp/Url",
            cachetime: "0",
            success: function(t) {
                a.setData({
                    url: t.data
                });
            }
        }), app.util.request({
            url: "entry/wxapp/system",
            cachetime: "0",
            success: function(t) {
                console.log(t), a.setData({
                    ptxx: t.data,
                    jf_proportion: t.data.jf_proportion
                }), "1" == t.data.is_yue ? a.setData({
                    ptkqyue: !0
                }) : a.setData({
                    ptkqyue: !1
                }), "1" == t.data.is_jfpay ? a.setData({
                    ptkqjf: !0
                }) : a.setData({
                    ptkqjf: !1
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {
        var t = this, e = wx.getStorageSync("users").id;
        app.util.request({
            url: "entry/wxapp/UserInfo",
            cachetime: "0",
            data: {
                user_id: e
            },
            success: function(e) {
                console.log(e), t.setData({
                    wallet: e.data.wallet,
                    total_score: e.data.total_score
                });
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        this.onLoad(), wx.stopPullDownRefresh();
    },
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});