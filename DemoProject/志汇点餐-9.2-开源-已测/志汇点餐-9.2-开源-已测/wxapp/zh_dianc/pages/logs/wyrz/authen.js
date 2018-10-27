var app = getApp();

Page({
    data: {},
    onLoad: function(t) {
        var a = this;
        app.util.request({
            url: "entry/wxapp/system",
            cachetime: "0",
            success: function(t) {
                console.log(t), a.setData({
                    cjwt: t.data.cjwt
                });
            }
        }), a.reload();
    },
    reload: function(t) {
        var a = this, e = wx.getStorageSync("users").id;
        console.log("用户的user_id" + e), app.util.request({
            url: "entry/wxapp/MyRuZhu",
            cachetime: "0",
            data: {
                user_id: e
            },
            success: function(t) {
                console.log(t), t.data ? "1" == t.data.state ? a.setData({
                    is_rz: 1
                }) : "2" == t.data.state ? a.setData({
                    is_rz: 2
                }) : "3" == t.data.state && a.setData({
                    is_rz: 3
                }) : a.setData({
                    is_rz: 4
                });
            }
        });
    },
    select: function(t) {
        wx.navigateTo({
            url: "prise"
        });
    },
    onReady: function() {},
    onShow: function() {
        this.reload();
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        this.reload(), wx.stopPullDownRefresh();
    },
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});