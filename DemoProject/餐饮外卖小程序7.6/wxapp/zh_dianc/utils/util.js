function DateDiff(t, e) {
    var a, r, n;
    return a = t.split("-"), r = new Date(a[1] + "-" + a[2] + "-" + a[0]), a = e.split("-"), 
    n = new Date(a[1] + "-" + a[2] + "-" + a[0]), parseInt(Math.abs(r - n) / 1e3 / 60 / 60 / 24);
}

function getDistance(t, e, a, r) {
    t = t || 0, e = e || 0, a = a || 0, r = r || 0;
    var n = t * Math.PI / 180, o = a * Math.PI / 180, i = n - o, u = e * Math.PI / 180 - r * Math.PI / 180;
    return 12756274 * Math.asin(Math.sqrt(Math.pow(Math.sin(i / 2), 2) + Math.cos(n) * Math.cos(o) * Math.pow(Math.sin(u / 2), 2)));
}

function ormatDate(t) {
    function e(t, e) {
        for (var a = "" + t, r = a.length, n = "", o = e; o-- > r; ) n += "0";
        return n + a;
    }
    var a = new Date(1e3 * t);
    return a.getFullYear() + "-" + e(a.getMonth() + 1, 2) + "-" + e(a.getDate(), 2) + " " + e(a.getHours(), 2) + ":" + e(a.getMinutes(), 2) + ":" + e(a.getSeconds(), 2);
}

var formatTime = function(t) {
    var e = t.getFullYear(), a = t.getMonth() + 1, r = t.getDate(), n = t.getHours(), o = t.getMinutes(), i = t.getSeconds();
    return [ e, a, r ].map(formatNumber).join("/") + " " + [ n, o, i ].map(formatNumber).join(":");
}, formatNumber = function(t) {
    return (t = t.toString())[1] ? t : "0" + t;
};

module.exports = {
    formatTime: formatTime,
    DateDiff: DateDiff,
    getDistance: getDistance,
    ormatDate: ormatDate
};