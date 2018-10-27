var app = getApp(), util = require("../../../utils/util.js");

Page({
    data: {
        tabs: [ "待审核", "已通过", "已拒绝" ],
        activeIndex: 0,
        djd: [],
        score: [ {
            note: "支付宝提现",
            time: "2017-10-18 12：11：25",
            money: "2.00",
            type: "1"
        }, {
            note: "银行卡提现",
            time: "2017-10-18 12：11：25",
            money: "5.00",
            type: "1"
        } ]
    },
    tabClick: function(t) {
        this.setData({
            activeIndex: t.currentTarget.id
        });
    },
    reLoad: function() {
        var t = this, a = wx.getStorageSync("users").id;
        app.util.request({
            url: "entry/wxapp/YjtxList",
            cachetime: "0",
            data: {
                user_id: a
            },
            success: function(a) {
                console.log(a.data);
                for (i = 0; i < a.data.length; i++) a.data[i].time = util.ormatDate(a.data[i].time), 
                a.data[i].sh_time = util.ormatDate(a.data[i].sh_time);
                for (var e = [], n = [], o = [], i = 0; i < a.data.length; i++) "1" == a.data[i].state && e.push(a.data[i]), 
                "2" == a.data[i].state && n.push(a.data[i]), "3" == a.data[i].state && o.push(a.data[i]);
                console.log(e, n, o), t.setData({
                    dsh: e,
                    ytg: n,
                    yjj: o
                });
            }
        });
    },
    onLoad: function(t) {
        this.reLoad();
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        this.reLoad();
    },
    onReachBottom: function() {}
});