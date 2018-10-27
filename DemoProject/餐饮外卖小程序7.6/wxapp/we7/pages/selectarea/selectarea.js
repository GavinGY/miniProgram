var _util = require("../utils/util"), API = "http://japi.zto.cn/zto/api_utf8/baseArea?msg_type=GET_AREA&data=", selectArea = {
    addDot: function(e) {
        e instanceof Array && e.map(function(e) {
            return e.fullName.length > 4 ? (e.fullNameDot = e.fullName.slice(0, 4) + "...", 
            e) : (e.fullNameDot = e.fullName, e);
        });
    },
    load: function(e) {
        e.setData({
            isShow: !1
        }), (0, _util.Promise)(wx.request, {
            url: API + "0",
            method: "GET"
        }).then(function(t) {
            var a = t.data.result[0];
            return selectArea.addDot(t.data.result), e.setData({
                proviceData: t.data.result,
                "selectedProvince.index": 0,
                "selectedProvince.code": a.code,
                "selectedProvince.fullName": a.fullName
            }), (0, _util.Promise)(wx.request, {
                url: API + a.code,
                method: "GET"
            });
        }).then(function(t) {
            var a = t.data.result[0];
            return selectArea.addDot(t.data.result), e.setData({
                cityData: t.data.result,
                "selectedCity.index": 0,
                "selectedCity.code": a.code,
                "selectedCity.fullName": a.fullName
            }), (0, _util.Promise)(wx.request, {
                url: API + a.code,
                method: "GET"
            });
        }).then(function(t) {
            var a = t.data.result[0];
            selectArea.addDot(t.data.result), e.setData({
                districtData: t.data.result,
                "selectedDistrict.index": 0,
                "selectedDistrict.code": a.code,
                "selectedDistrict.fullName": a.fullName
            });
        }).catch(function(e) {
            console.log(e);
        });
    },
    tapProvince: function(e, t) {
        var a = e.currentTarget.dataset;
        (0, _util.Promise)(wx.request, {
            url: API + a.code,
            method: "GET"
        }).then(function(e) {
            return selectArea.addDot(e.data.result), t.setData({
                cityData: e.data.result,
                "selectedProvince.code": a.code,
                "selectedProvince.fullName": a.fullName,
                "selectedCity.code": e.data.result[0].code,
                "selectedCity.fullName": e.data.result[0].fullName
            }), (0, _util.Promise)(wx.request, {
                url: API + e.data.result[0].code,
                method: "GET"
            });
        }).then(function(a) {
            selectArea.addDot(a.data.result), t.setData({
                districtData: a.data.result,
                "selectedProvince.index": e.currentTarget.dataset.index,
                "selectedCity.index": 0,
                "selectedDistrict.index": 0,
                "selectedDistrict.code": a.data.result[0].code,
                "selectedDistrict.fullName": a.data.result[0].fullName
            });
        }).catch(function(e) {
            console.log(e);
        });
    },
    tapCity: function(e, t) {
        var a = e.currentTarget.dataset;
        (0, _util.Promise)(wx.request, {
            url: API + a.code,
            method: "GET"
        }).then(function(l) {
            selectArea.addDot(l.data.result), t.setData({
                districtData: l.data.result,
                "selectedCity.index": e.currentTarget.dataset.index,
                "selectedCity.code": a.code,
                "selectedCity.fullName": a.fullName,
                "selectedDistrict.index": 0,
                "selectedDistrict.code": l.data.result[0].code,
                "selectedDistrict.fullName": l.data.result[0].fullName
            });
        }).catch(function(e) {
            console.log(e);
        });
    },
    tapDistrict: function(e, t) {
        var a = e.currentTarget.dataset;
        t.setData({
            "selectedDistrict.index": e.currentTarget.dataset.index,
            "selectedDistrict.code": a.code,
            "selectedDistrict.fullName": a.fullName
        });
    },
    confirm: function(e, t) {
        t.setData({
            address: t.data.selectedProvince.fullName + " " + t.data.selectedCity.fullName + " " + t.data.selectedDistrict.fullName,
            isShow: !1
        });
    },
    cancel: function(e) {
        e.setData({
            isShow: !1
        });
    },
    choosearea: function(e) {
        e.setData({
            isShow: !0
        });
    }
};

module.exports = {
    SA: selectArea
};