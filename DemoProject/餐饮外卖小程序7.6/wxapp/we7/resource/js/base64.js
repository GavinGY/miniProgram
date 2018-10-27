function base64_encode(e) {
    for (var r, a, t, o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", c = 0, h = e.length, d = ""; c < h; ) {
        if (r = 255 & e.charCodeAt(c++), c == h) {
            d += o.charAt(r >> 2), d += o.charAt((3 & r) << 4), d += "==";
            break;
        }
        if (a = e.charCodeAt(c++), c == h) {
            d += o.charAt(r >> 2), d += o.charAt((3 & r) << 4 | (240 & a) >> 4), d += o.charAt((15 & a) << 2), 
            d += "=";
            break;
        }
        t = e.charCodeAt(c++), d += o.charAt(r >> 2), d += o.charAt((3 & r) << 4 | (240 & a) >> 4), 
        d += o.charAt((15 & a) << 2 | (192 & t) >> 6), d += o.charAt(63 & t);
    }
    return d;
}

function base64_decode(e) {
    for (var r, a, t, o, c = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1), h = 0, d = e.length, i = ""; h < d; ) {
        do {
            r = c[255 & e.charCodeAt(h++)];
        } while (h < d && -1 == r);
        if (-1 == r) break;
        do {
            a = c[255 & e.charCodeAt(h++)];
        } while (h < d && -1 == a);
        if (-1 == a) break;
        i += String.fromCharCode(r << 2 | (48 & a) >> 4);
        do {
            if (61 == (t = 255 & e.charCodeAt(h++))) return i;
            t = c[t];
        } while (h < d && -1 == t);
        if (-1 == t) break;
        i += String.fromCharCode((15 & a) << 4 | (60 & t) >> 2);
        do {
            if (61 == (o = 255 & e.charCodeAt(h++))) return i;
            o = c[o];
        } while (h < d && -1 == o);
        if (-1 == o) break;
        i += String.fromCharCode((3 & t) << 6 | o);
    }
    return i;
}

module.exports = {
    base64_encode: base64_encode,
    base64_decode: base64_decode
};