var app = getApp();

Page({
    data: {},
    onLoad: function(o) {
        var t = wx.getStorageSync("nbcolor");
        wx.setNavigationBarColor({
            frontColor: "#ffffff",
            backgroundColor: t
        }), this.reLoad();
    },
    reLoad: function() {
        var o = this, t = wx.getStorageSync("imglink");
        console.log(t), app.util.request({
            url: "entry/wxapp/Store",
            cachetime: "0",
            data: {
                id: getApp().sjid
            },
            success: function(e) {
                for (var n = e.data.environment, a = e.data.yyzz, r = 0; r < n.length; r++) n[r] = t + n[r];
                for (r = 0; r < a.length; r++) a[r] = t + a[r];
                console.log(e), o.setData({
                    store: e.data,
                    storeimg: n,
                    storeyyzz: a
                });
            }
        });
    },
    previewImage: function(o) {
        wx.previewImage({
            current: o.currentTarget.id,
            urls: o.currentTarget.dataset.urls
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        this.reLoad(), setTimeout(function() {
            wx.stopPullDownRefresh();
        }, 1500);
    },
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});