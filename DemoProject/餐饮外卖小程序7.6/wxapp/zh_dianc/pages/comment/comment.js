var app = getApp(), count = 0;

Page({
    data: {
        stars: [ 0, 1, 2, 3, 4 ],
        normalSrc: "../images/no-star.png",
        selectedSrc: "../images/full-star.png",
        key: 0,
        count: 0,
        url: ""
    },
    onLoad: function(t) {
        app.util.request({
            url: "entry/wxapp/system",
            cachetime: "0",
            success: function(a) {
                console.log(a), app.util.request({
                    url: "entry/wxapp/OrderInfo",
                    cachetime: "0",
                    data: {
                        id: t.wmddid
                    },
                    success: function(t) {
                        console.log(t.data), e.setData({
                            order: t.data,
                            seller: t.data.store
                        }), "2" == a.data.is_jf ? e.setData({
                            integral: 0
                        }) : "2" != t.data.store.is_jf ? "0" != t.data.store.integral ? e.setData({
                            integral: t.data.store.integral
                        }) : e.setData({
                            integral: a.data.integral
                        }) : e.setData({
                            integral: 0
                        });
                    }
                });
                var o = a.data;
                if (console.log(o), "1" == o.more) r = wx.getStorageSync("bqxx").color;
                if ("2" == o.more) var r = wx.getStorageSync("nbcolor");
                wx.setNavigationBarColor({
                    frontColor: "#ffffff",
                    backgroundColor: r
                });
            }
        }), count = 0;
        var e = this;
        wx.getStorageSync("users").id;
        console.log(t.wmddid), e.setData({
            wmddid: t.wmddid
        }), app.util.request({
            url: "entry/wxapp/Url",
            cachetime: "0",
            success: function(t) {
                e.setData({
                    url: t.data
                });
            }
        });
    },
    selectLeft: function(t) {
        console.log("111111");
        var e = t.currentTarget.dataset.key;
        1 == this.data.key && 1 == t.currentTarget.dataset.key && (e = 0), count = e, this.setData({
            key: e,
            count: count
        });
    },
    formSubmit: function(t) {
        var e = this;
        console.log(e.data), console.log("form发生了submit事件，携带数据为：", t.detail.value);
        var a = t.detail.value.content, o = wx.getStorageSync("users").id, r = e.data.seller.id, n = e.data.order.order.order_num, s = e.data.order.order.id, c = e.data.integral;
        console.log(n), console.log(count + "分--内容是：" + a + "---用户user_id是：" + o + "order_id是：" + s + "积分" + c);
        var l = "", i = !0;
        0 == count ? l = "请选择评分！" : "" == a ? l = "请填写您的评论内容" : (i = !1, app.util.request({
            url: "entry/wxapp/pl",
            header: {
                "Content-Type": "application/xml"
            },
            method: "GET",
            cachetime: "0",
            data: {
                score: count,
                content: a,
                user_id: o,
                seller_id: r,
                order_id: s,
                order_num: n,
                total_score: c
            },
            success: function(t) {
                console.log(t), e.setData({
                    url: t.data
                });
            }
        }), wx.navigateTo({
            url: "../comsuc/comsuc"
        })), 1 == i && wx.showModal({
            title: "提示",
            content: l
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        this.onLoad(), wx.stopPullDownRefresh();
    },
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});