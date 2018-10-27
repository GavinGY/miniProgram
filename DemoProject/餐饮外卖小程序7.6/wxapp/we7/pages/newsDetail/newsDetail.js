var appInstance = getApp(), R_htmlToWxml = require("../../resource/js/htmlToWxml.js");

Page({
    data: {
        scrollHeight: 0,
        newsData: {}
    },
    getNewsDetail: function() {
        var e = this;
        wx.request({
            url: "https://wedengta.com/wxnews/getNews?action=DiscNewsContent&type=4&id=1478677877_1406730_1_9",
            headers: {
                "Content-Type": "application/json"
            },
            success: function(o) {
                var n = o.data;
                if (0 == n.ret) {
                    var t = JSON.parse(n.content);
                    t.content = R_htmlToWxml.html2json(t.sContent), t.time = appInstance.util.formatTime(1e3 * t.iTime), 
                    e.setData({
                        newsData: t
                    });
                } else console.log("数据拉取失败");
            },
            fail: function(e) {
                console.log("数据拉取失败");
            }
        });
    },
    stockClick: function(e) {
        var o = e.currentTarget.dataset.seccode, n = e.currentTarget.dataset.secname;
        console.log("stockClick:" + o + ";secName:" + n);
    },
    onLoad: function(e) {
        this.getNewsDetail(), console.log("onLoad");
    },
    onShow: function() {
        console.log("onShow");
    },
    onReady: function() {
        console.log("onReady");
    },
    onHide: function() {
        console.log("onHide");
    },
    onUnload: function() {
        console.log("onUnload");
    }
});