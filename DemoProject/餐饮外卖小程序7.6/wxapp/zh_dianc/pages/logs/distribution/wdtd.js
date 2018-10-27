var app = getApp(), util = require("../../../utils/util.js");

Page({
    data: {
        tabs: [ "一级", "二级" ],
        activeIndex: 0,
        djd: []
    },
    tabClick: function(t) {
        this.setData({
            activeIndex: t.currentTarget.id
        });
    },
    onLoad: function(t) {
        var e = this, n = wx.getStorageSync("users").id;
        app.util.request({
            url: "entry/wxapp/MyTeam",
            cachetime: "0",
            data: {
                user_id: n
            },
            success: function(t) {
                console.log(t);
                var n = [], a = [];
                n = t.data.one, a = t.data.two;
                for (o = 0; o < n.length; o++) n[o].time = util.ormatDate(n[o].time);
                for (var o = 0; o < a.length; o++) a[o].time = util.ormatDate(a[o].time);
                e.setData({
                    yj: n,
                    ej: a
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});