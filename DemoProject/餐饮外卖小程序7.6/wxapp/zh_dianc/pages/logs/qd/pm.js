var app = getApp();

Page({
    data: {},
    onLoad: function(a) {
        var n = this, t = wx.getStorageSync("users").id;
        app.util.request({
            url: "entry/wxapp/userinfo",
            cachetime: "0",
            data: {
                user_id: t
            },
            success: function(a) {
                console.log("user", a), n.setData({
                    userinfo: a.data
                }), app.util.request({
                    url: "entry/wxapp/Rank",
                    cachetime: "0",
                    success: function(t) {
                        console.log("rank", t), n.setData({
                            rank: t.data
                        });
                        for (var e = 0; e < t.data.length; e++) a.data.id == t.data[e].id && n.setData({
                            pm: e + 1
                        });
                    }
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