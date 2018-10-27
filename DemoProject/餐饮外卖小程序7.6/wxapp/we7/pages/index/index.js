var app = getApp();

Page({
    data: {
        navs: [],
        slide: [],
        commend: [],
        userInfo: {}
    },
    onLoad: function() {
        var e = this;
        app.util.footer(e), app.util.request({
            url: "wxapp/home/nav",
            cachetime: "30",
            success: function(a) {
                a.data.message.errno || (console.log(a.data.message.message), e.setData({
                    navs: a.data.message.message
                }));
            }
        }), app.util.request({
            url: "wxapp/home/slide",
            cachetime: "30",
            success: function(a) {
                a.data.message.errno || e.setData({
                    slide: a.data.message.message
                });
            }
        }), app.util.request({
            url: "wxapp/home/commend",
            cachetime: "30",
            success: function(a) {
                a.data.message.errno || e.setData({
                    commend: a.data.message.message
                });
            }
        });
    }
});