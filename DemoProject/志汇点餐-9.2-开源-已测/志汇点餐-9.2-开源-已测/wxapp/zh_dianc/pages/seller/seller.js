Page({
    data: {},
    onLoad: function(o) {
        var n = wx.getStorageSync("bqxx");
        if ("1" == n.more) var t = wx.getStorageSync("bqxx").color;
        if ("2" == n.more) t = wx.getStorageSync("nbcolor");
        wx.setNavigationBarColor({
            frontColor: "#ffffff",
            backgroundColor: t
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