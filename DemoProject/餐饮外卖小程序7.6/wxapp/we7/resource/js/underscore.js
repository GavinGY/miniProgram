var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(n) {
    return typeof n;
} : function(n) {
    return n && "function" == typeof Symbol && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
};

(function() {
    function n(n) {
        function t(t, r, e, u, i, o) {
            for (;i >= 0 && i < o; i += n) {
                var a = u ? u[i] : i;
                e = r(e, t[a], a, t);
            }
            return e;
        }
        return function(r, e, u, i) {
            e = d(e, i, 4);
            var o = !j(r) && y.keys(r), a = (o || r).length, c = n > 0 ? 0 : a - 1;
            return arguments.length < 3 && (u = r[o ? o[c] : c], c += n), t(r, e, u, o, c, a);
        };
    }
    function t(n) {
        return function(t, r, e) {
            r = g(r, e);
            for (var u = null != t && t.length, i = n > 0 ? 0 : u - 1; i >= 0 && i < u; i += n) if (r(t[i], i, t)) return i;
            return -1;
        };
    }
    function r(n, t) {
        var r = k.length, e = n.constructor, i = y.isFunction(e) && e.prototype || u, o = "constructor";
        for (y.has(n, o) && !y.contains(t, o) && t.push(o); r--; ) (o = k[r]) in n && n[o] !== i[o] && !y.contains(t, o) && t.push(o);
    }
    var e = Array.prototype, u = Object.prototype, i = Function.prototype, o = e.push, a = e.slice, c = u.toString, f = u.hasOwnProperty, l = Array.isArray, s = Object.keys, p = i.bind, h = Object.create, v = function() {}, y = function n(t) {
        return t instanceof n ? t : this instanceof n ? void (this._wrapped = t) : new n(t);
    };
    module.exports = y, y.VERSION = "1.8.2";
    var d = function(n, t, r) {
        if (void 0 === t) return n;
        switch (null == r ? 3 : r) {
          case 1:
            return function(r) {
                return n.call(t, r);
            };

          case 2:
            return function(r, e) {
                return n.call(t, r, e);
            };

          case 3:
            return function(r, e, u) {
                return n.call(t, r, e, u);
            };

          case 4:
            return function(r, e, u, i) {
                return n.call(t, r, e, u, i);
            };
        }
        return function() {
            return n.apply(t, arguments);
        };
    }, g = function(n, t, r) {
        return null == n ? y.identity : y.isFunction(n) ? d(n, t, r) : y.isObject(n) ? y.matcher(n) : y.property(n);
    };
    y.iteratee = function(n, t) {
        return g(n, t, 1 / 0);
    };
    var m = function(n, t) {
        return function(r) {
            var e = arguments.length;
            if (e < 2 || null == r) return r;
            for (var u = 1; u < e; u++) for (var i = arguments[u], o = n(i), a = o.length, c = 0; c < a; c++) {
                var f = o[c];
                t && void 0 !== r[f] || (r[f] = i[f]);
            }
            return r;
        };
    }, b = function(n) {
        if (!y.isObject(n)) return {};
        if (h) return h(n);
        v.prototype = n;
        var t = new v();
        return v.prototype = null, t;
    }, _ = Math.pow(2, 53) - 1, j = function(n) {
        var t = null != n && n.length;
        return "number" == typeof t && t >= 0 && t <= _;
    };
    y.each = y.forEach = function(n, t, r) {
        t = d(t, r);
        var e, u;
        if (j(n)) for (e = 0, u = n.length; e < u; e++) t(n[e], e, n); else {
            var i = y.keys(n);
            for (e = 0, u = i.length; e < u; e++) t(n[i[e]], i[e], n);
        }
        return n;
    }, y.map = y.collect = function(n, t, r) {
        t = g(t, r);
        for (var e = !j(n) && y.keys(n), u = (e || n).length, i = Array(u), o = 0; o < u; o++) {
            var a = e ? e[o] : o;
            i[o] = t(n[a], a, n);
        }
        return i;
    }, y.reduce = y.foldl = y.inject = n(1), y.reduceRight = y.foldr = n(-1), y.find = y.detect = function(n, t, r) {
        var e;
        if (void 0 !== (e = j(n) ? y.findIndex(n, t, r) : y.findKey(n, t, r)) && -1 !== e) return n[e];
    }, y.filter = y.select = function(n, t, r) {
        var e = [];
        return t = g(t, r), y.each(n, function(n, r, u) {
            t(n, r, u) && e.push(n);
        }), e;
    }, y.reject = function(n, t, r) {
        return y.filter(n, y.negate(g(t)), r);
    }, y.every = y.all = function(n, t, r) {
        t = g(t, r);
        for (var e = !j(n) && y.keys(n), u = (e || n).length, i = 0; i < u; i++) {
            var o = e ? e[i] : i;
            if (!t(n[o], o, n)) return !1;
        }
        return !0;
    }, y.some = y.any = function(n, t, r) {
        t = g(t, r);
        for (var e = !j(n) && y.keys(n), u = (e || n).length, i = 0; i < u; i++) {
            var o = e ? e[i] : i;
            if (t(n[o], o, n)) return !0;
        }
        return !1;
    }, y.contains = y.includes = y.include = function(n, t, r) {
        return j(n) || (n = y.values(n)), y.indexOf(n, t, "number" == typeof r && r) >= 0;
    }, y.invoke = function(n, t) {
        var r = a.call(arguments, 2), e = y.isFunction(t);
        return y.map(n, function(n) {
            var u = e ? t : n[t];
            return null == u ? u : u.apply(n, r);
        });
    }, y.pluck = function(n, t) {
        return y.map(n, y.property(t));
    }, y.where = function(n, t) {
        return y.filter(n, y.matcher(t));
    }, y.findWhere = function(n, t) {
        return y.find(n, y.matcher(t));
    }, y.max = function(n, t, r) {
        var e, u, i = -1 / 0, o = -1 / 0;
        if (null == t && null != n) for (var a = 0, c = (n = j(n) ? n : y.values(n)).length; a < c; a++) (e = n[a]) > i && (i = e); else t = g(t, r), 
        y.each(n, function(n, r, e) {
            ((u = t(n, r, e)) > o || u === -1 / 0 && i === -1 / 0) && (i = n, o = u);
        });
        return i;
    }, y.min = function(n, t, r) {
        var e, u, i = 1 / 0, o = 1 / 0;
        if (null == t && null != n) for (var a = 0, c = (n = j(n) ? n : y.values(n)).length; a < c; a++) (e = n[a]) < i && (i = e); else t = g(t, r), 
        y.each(n, function(n, r, e) {
            ((u = t(n, r, e)) < o || u === 1 / 0 && i === 1 / 0) && (i = n, o = u);
        });
        return i;
    }, y.shuffle = function(n) {
        for (var t, r = j(n) ? n : y.values(n), e = r.length, u = Array(e), i = 0; i < e; i++) (t = y.random(0, i)) !== i && (u[i] = u[t]), 
        u[t] = r[i];
        return u;
    }, y.sample = function(n, t, r) {
        return null == t || r ? (j(n) || (n = y.values(n)), n[y.random(n.length - 1)]) : y.shuffle(n).slice(0, Math.max(0, t));
    }, y.sortBy = function(n, t, r) {
        return t = g(t, r), y.pluck(y.map(n, function(n, r, e) {
            return {
                value: n,
                index: r,
                criteria: t(n, r, e)
            };
        }).sort(function(n, t) {
            var r = n.criteria, e = t.criteria;
            if (r !== e) {
                if (r > e || void 0 === r) return 1;
                if (r < e || void 0 === e) return -1;
            }
            return n.index - t.index;
        }), "value");
    };
    var x = function(n) {
        return function(t, r, e) {
            var u = {};
            return r = g(r, e), y.each(t, function(e, i) {
                var o = r(e, i, t);
                n(u, e, o);
            }), u;
        };
    };
    y.groupBy = x(function(n, t, r) {
        y.has(n, r) ? n[r].push(t) : n[r] = [ t ];
    }), y.indexBy = x(function(n, t, r) {
        n[r] = t;
    }), y.countBy = x(function(n, t, r) {
        y.has(n, r) ? n[r]++ : n[r] = 1;
    }), y.toArray = function(n) {
        return n ? y.isArray(n) ? a.call(n) : j(n) ? y.map(n, y.identity) : y.values(n) : [];
    }, y.size = function(n) {
        return null == n ? 0 : j(n) ? n.length : y.keys(n).length;
    }, y.partition = function(n, t, r) {
        t = g(t, r);
        var e = [], u = [];
        return y.each(n, function(n, r, i) {
            (t(n, r, i) ? e : u).push(n);
        }), [ e, u ];
    }, y.first = y.head = y.take = function(n, t, r) {
        if (null != n) return null == t || r ? n[0] : y.initial(n, n.length - t);
    }, y.initial = function(n, t, r) {
        return a.call(n, 0, Math.max(0, n.length - (null == t || r ? 1 : t)));
    }, y.last = function(n, t, r) {
        if (null != n) return null == t || r ? n[n.length - 1] : y.rest(n, Math.max(0, n.length - t));
    }, y.rest = y.tail = y.drop = function(n, t, r) {
        return a.call(n, null == t || r ? 1 : t);
    }, y.compact = function(n) {
        return y.filter(n, y.identity);
    };
    var w = function n(t, r, e, u) {
        for (var i = [], o = 0, a = u || 0, c = t && t.length; a < c; a++) {
            var f = t[a];
            if (j(f) && (y.isArray(f) || y.isArguments(f))) {
                r || (f = n(f, r, e));
                var l = 0, s = f.length;
                for (i.length += s; l < s; ) i[o++] = f[l++];
            } else e || (i[o++] = f);
        }
        return i;
    };
    y.flatten = function(n, t) {
        return w(n, t, !1);
    }, y.without = function(n) {
        return y.difference(n, a.call(arguments, 1));
    }, y.uniq = y.unique = function(n, t, r, e) {
        if (null == n) return [];
        y.isBoolean(t) || (e = r, r = t, t = !1), null != r && (r = g(r, e));
        for (var u = [], i = [], o = 0, a = n.length; o < a; o++) {
            var c = n[o], f = r ? r(c, o, n) : c;
            t ? (o && i === f || u.push(c), i = f) : r ? y.contains(i, f) || (i.push(f), u.push(c)) : y.contains(u, c) || u.push(c);
        }
        return u;
    }, y.union = function() {
        return y.uniq(w(arguments, !0, !0));
    }, y.intersection = function(n) {
        if (null == n) return [];
        for (var t = [], r = arguments.length, e = 0, u = n.length; e < u; e++) {
            var i = n[e];
            if (!y.contains(t, i)) {
                for (var o = 1; o < r && y.contains(arguments[o], i); o++) ;
                o === r && t.push(i);
            }
        }
        return t;
    }, y.difference = function(n) {
        var t = w(arguments, !0, !0, 1);
        return y.filter(n, function(n) {
            return !y.contains(t, n);
        });
    }, y.zip = function() {
        return y.unzip(arguments);
    }, y.unzip = function(n) {
        for (var t = n && y.max(n, "length").length || 0, r = Array(t), e = 0; e < t; e++) r[e] = y.pluck(n, e);
        return r;
    }, y.object = function(n, t) {
        for (var r = {}, e = 0, u = n && n.length; e < u; e++) t ? r[n[e]] = t[e] : r[n[e][0]] = n[e][1];
        return r;
    }, y.indexOf = function(n, t, r) {
        var e = 0, u = n && n.length;
        if ("number" == typeof r) e = r < 0 ? Math.max(0, u + r) : r; else if (r && u) return e = y.sortedIndex(n, t), 
        n[e] === t ? e : -1;
        if (t != t) return y.findIndex(a.call(n, e), y.isNaN);
        for (;e < u; e++) if (n[e] === t) return e;
        return -1;
    }, y.lastIndexOf = function(n, t, r) {
        var e = n ? n.length : 0;
        if ("number" == typeof r && (e = r < 0 ? e + r + 1 : Math.min(e, r + 1)), t != t) return y.findLastIndex(a.call(n, 0, e), y.isNaN);
        for (;--e >= 0; ) if (n[e] === t) return e;
        return -1;
    }, y.findIndex = t(1), y.findLastIndex = t(-1), y.sortedIndex = function(n, t, r, e) {
        for (var u = (r = g(r, e, 1))(t), i = 0, o = n.length; i < o; ) {
            var a = Math.floor((i + o) / 2);
            r(n[a]) < u ? i = a + 1 : o = a;
        }
        return i;
    }, y.range = function(n, t, r) {
        arguments.length <= 1 && (t = n || 0, n = 0), r = r || 1;
        for (var e = Math.max(Math.ceil((t - n) / r), 0), u = Array(e), i = 0; i < e; i++, 
        n += r) u[i] = n;
        return u;
    };
    var A = function(n, t, r, e, u) {
        if (!(e instanceof t)) return n.apply(r, u);
        var i = b(n.prototype), o = n.apply(i, u);
        return y.isObject(o) ? o : i;
    };
    y.bind = function(n, t) {
        if (p && n.bind === p) return p.apply(n, a.call(arguments, 1));
        if (!y.isFunction(n)) throw new TypeError("Bind must be called on a function");
        var r = a.call(arguments, 2);
        return function e() {
            return A(n, e, t, this, r.concat(a.call(arguments)));
        };
    }, y.partial = function(n) {
        var t = a.call(arguments, 1);
        return function r() {
            for (var e = 0, u = t.length, i = Array(u), o = 0; o < u; o++) i[o] = t[o] === y ? arguments[e++] : t[o];
            for (;e < arguments.length; ) i.push(arguments[e++]);
            return A(n, r, this, this, i);
        };
    }, y.bindAll = function(n) {
        var t, r, e = arguments.length;
        if (e <= 1) throw new Error("bindAll must be passed function names");
        for (t = 1; t < e; t++) n[r = arguments[t]] = y.bind(n[r], n);
        return n;
    }, y.memoize = function(n, t) {
        var r = function r(e) {
            var u = r.cache, i = "" + (t ? t.apply(this, arguments) : e);
            return y.has(u, i) || (u[i] = n.apply(this, arguments)), u[i];
        };
        return r.cache = {}, r;
    }, y.delay = function(n, t) {
        var r = a.call(arguments, 2);
        return setTimeout(function() {
            return n.apply(null, r);
        }, t);
    }, y.defer = y.partial(y.delay, y, 1), y.throttle = function(n, t, r) {
        var e, u, i, o = null, a = 0;
        r || (r = {});
        var c = function() {
            a = !1 === r.leading ? 0 : y.now(), o = null, i = n.apply(e, u), o || (e = u = null);
        };
        return function() {
            var f = y.now();
            a || !1 !== r.leading || (a = f);
            var l = t - (f - a);
            return e = this, u = arguments, l <= 0 || l > t ? (o && (clearTimeout(o), o = null), 
            a = f, i = n.apply(e, u), o || (e = u = null)) : o || !1 === r.trailing || (o = setTimeout(c, l)), 
            i;
        };
    }, y.debounce = function(n, t, r) {
        var e, u, i, o, a, c = function c() {
            var f = y.now() - o;
            f < t && f >= 0 ? e = setTimeout(c, t - f) : (e = null, r || (a = n.apply(i, u), 
            e || (i = u = null)));
        };
        return function() {
            i = this, u = arguments, o = y.now();
            var f = r && !e;
            return e || (e = setTimeout(c, t)), f && (a = n.apply(i, u), i = u = null), a;
        };
    }, y.wrap = function(n, t) {
        return y.partial(t, n);
    }, y.negate = function(n) {
        return function() {
            return !n.apply(this, arguments);
        };
    }, y.compose = function() {
        var n = arguments, t = n.length - 1;
        return function() {
            for (var r = t, e = n[t].apply(this, arguments); r--; ) e = n[r].call(this, e);
            return e;
        };
    }, y.after = function(n, t) {
        return function() {
            if (--n < 1) return t.apply(this, arguments);
        };
    }, y.before = function(n, t) {
        var r;
        return function() {
            return --n > 0 && (r = t.apply(this, arguments)), n <= 1 && (t = null), r;
        };
    }, y.once = y.partial(y.before, 2);
    var O = !{
        toString: null
    }.propertyIsEnumerable("toString"), k = [ "valueOf", "isPrototypeOf", "toString", "propertyIsEnumerable", "hasOwnProperty", "toLocaleString" ];
    y.keys = function(n) {
        if (!y.isObject(n)) return [];
        if (s) return s(n);
        var t = [];
        for (var e in n) y.has(n, e) && t.push(e);
        return O && r(n, t), t;
    }, y.allKeys = function(n) {
        if (!y.isObject(n)) return [];
        var t = [];
        for (var e in n) t.push(e);
        return O && r(n, t), t;
    }, y.values = function(n) {
        for (var t = y.keys(n), r = t.length, e = Array(r), u = 0; u < r; u++) e[u] = n[t[u]];
        return e;
    }, y.mapObject = function(n, t, r) {
        t = g(t, r);
        for (var e, u = y.keys(n), i = u.length, o = {}, a = 0; a < i; a++) o[e = u[a]] = t(n[e], e, n);
        return o;
    }, y.pairs = function(n) {
        for (var t = y.keys(n), r = t.length, e = Array(r), u = 0; u < r; u++) e[u] = [ t[u], n[t[u]] ];
        return e;
    }, y.invert = function(n) {
        for (var t = {}, r = y.keys(n), e = 0, u = r.length; e < u; e++) t[n[r[e]]] = r[e];
        return t;
    }, y.functions = y.methods = function(n) {
        var t = [];
        for (var r in n) y.isFunction(n[r]) && t.push(r);
        return t.sort();
    }, y.extend = m(y.allKeys), y.extendOwn = y.assign = m(y.keys), y.findKey = function(n, t, r) {
        t = g(t, r);
        for (var e, u = y.keys(n), i = 0, o = u.length; i < o; i++) if (e = u[i], t(n[e], e, n)) return e;
    }, y.pick = function(n, t, r) {
        var e, u, i = {}, o = n;
        if (null == o) return i;
        y.isFunction(t) ? (u = y.allKeys(o), e = d(t, r)) : (u = w(arguments, !1, !1, 1), 
        e = function(n, t, r) {
            return t in r;
        }, o = Object(o));
        for (var a = 0, c = u.length; a < c; a++) {
            var f = u[a], l = o[f];
            e(l, f, o) && (i[f] = l);
        }
        return i;
    }, y.omit = function(n, t, r) {
        if (y.isFunction(t)) t = y.negate(t); else {
            var e = y.map(w(arguments, !1, !1, 1), String);
            t = function(n, t) {
                return !y.contains(e, t);
            };
        }
        return y.pick(n, t, r);
    }, y.defaults = m(y.allKeys, !0), y.create = function(n, t) {
        var r = b(n);
        return t && y.extendOwn(r, t), r;
    }, y.clone = function(n) {
        return y.isObject(n) ? y.isArray(n) ? n.slice() : y.extend({}, n) : n;
    }, y.tap = function(n, t) {
        return t(n), n;
    }, y.isMatch = function(n, t) {
        var r = y.keys(t), e = r.length;
        if (null == n) return !e;
        for (var u = Object(n), i = 0; i < e; i++) {
            var o = r[i];
            if (t[o] !== u[o] || !(o in u)) return !1;
        }
        return !0;
    };
    var S = function n(t, r, e, u) {
        if (t === r) return 0 !== t || 1 / t == 1 / r;
        if (null == t || null == r) return t === r;
        t instanceof y && (t = t._wrapped), r instanceof y && (r = r._wrapped);
        var i = c.call(t);
        if (i !== c.call(r)) return !1;
        switch (i) {
          case "[object RegExp]":
          case "[object String]":
            return "" + t == "" + r;

          case "[object Number]":
            return +t != +t ? +r != +r : 0 == +t ? 1 / +t == 1 / r : +t == +r;

          case "[object Date]":
          case "[object Boolean]":
            return +t == +r;
        }
        var o = "[object Array]" === i;
        if (!o) {
            if ("object" != (void 0 === t ? "undefined" : _typeof(t)) || "object" != (void 0 === r ? "undefined" : _typeof(r))) return !1;
            var a = t.constructor, f = r.constructor;
            if (a !== f && !(y.isFunction(a) && a instanceof a && y.isFunction(f) && f instanceof f) && "constructor" in t && "constructor" in r) return !1;
        }
        e = e || [], u = u || [];
        for (var l = e.length; l--; ) if (e[l] === t) return u[l] === r;
        if (e.push(t), u.push(r), o) {
            if ((l = t.length) !== r.length) return !1;
            for (;l--; ) if (!n(t[l], r[l], e, u)) return !1;
        } else {
            var s, p = y.keys(t);
            if (l = p.length, y.keys(r).length !== l) return !1;
            for (;l--; ) if (s = p[l], !y.has(r, s) || !n(t[s], r[s], e, u)) return !1;
        }
        return e.pop(), u.pop(), !0;
    };
    y.isEqual = function(n, t) {
        return S(n, t);
    }, y.isEmpty = function(n) {
        return null == n || (j(n) && (y.isArray(n) || y.isString(n) || y.isArguments(n)) ? 0 === n.length : 0 === y.keys(n).length);
    }, y.isElement = function(n) {
        return !(!n || 1 !== n.nodeType);
    }, y.isArray = l || function(n) {
        return "[object Array]" === c.call(n);
    }, y.isObject = function(n) {
        var t = void 0 === n ? "undefined" : _typeof(n);
        return "function" === t || "object" === t && !!n;
    }, y.each([ "Arguments", "Function", "String", "Number", "Date", "RegExp", "Error" ], function(n) {
        y["is" + n] = function(t) {
            return c.call(t) === "[object " + n + "]";
        };
    }), y.isArguments(arguments) || (y.isArguments = function(n) {
        return y.has(n, "callee");
    }), "function" != typeof /./ && "object" != ("undefined" == typeof Int8Array ? "undefined" : _typeof(Int8Array)) && (y.isFunction = function(n) {
        return "function" == typeof n || !1;
    }), y.isFinite = function(n) {
        return isFinite(n) && !isNaN(parseFloat(n));
    }, y.isNaN = function(n) {
        return y.isNumber(n) && n !== +n;
    }, y.isBoolean = function(n) {
        return !0 === n || !1 === n || "[object Boolean]" === c.call(n);
    }, y.isNull = function(n) {
        return null === n;
    }, y.isUndefined = function(n) {
        return void 0 === n;
    }, y.has = function(n, t) {
        return null != n && f.call(n, t);
    }, y.noConflict = function() {
        return root._ = previousUnderscore, this;
    }, y.identity = function(n) {
        return n;
    }, y.constant = function(n) {
        return function() {
            return n;
        };
    }, y.noop = function() {}, y.property = function(n) {
        return function(t) {
            return null == t ? void 0 : t[n];
        };
    }, y.propertyOf = function(n) {
        return null == n ? function() {} : function(t) {
            return n[t];
        };
    }, y.matcher = y.matches = function(n) {
        return n = y.extendOwn({}, n), function(t) {
            return y.isMatch(t, n);
        };
    }, y.times = function(n, t, r) {
        var e = Array(Math.max(0, n));
        t = d(t, r, 1);
        for (var u = 0; u < n; u++) e[u] = t(u);
        return e;
    }, y.random = function(n, t) {
        return null == t && (t = n, n = 0), n + Math.floor(Math.random() * (t - n + 1));
    }, y.now = Date.now || function() {
        return new Date().getTime();
    };
    var F = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "`": "&#x60;"
    }, E = y.invert(F), I = function(n) {
        var t = function(t) {
            return n[t];
        }, r = "(?:" + y.keys(n).join("|") + ")", e = RegExp(r), u = RegExp(r, "g");
        return function(n) {
            return n = null == n ? "" : "" + n, e.test(n) ? n.replace(u, t) : n;
        };
    };
    y.escape = I(F), y.unescape = I(E), y.result = function(n, t, r) {
        var e = null == n ? void 0 : n[t];
        return void 0 === e && (e = r), y.isFunction(e) ? e.call(n) : e;
    };
    var M = 0;
    y.uniqueId = function(n) {
        var t = ++M + "";
        return n ? n + t : t;
    }, y.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
    };
    var N = /(.)^/, B = {
        "'": "'",
        "\\": "\\",
        "\r": "r",
        "\n": "n",
        "\u2028": "u2028",
        "\u2029": "u2029"
    }, T = /\\|'|\r|\n|\u2028|\u2029/g, R = function(n) {
        return "\\" + B[n];
    };
    y.template = function(n, t, r) {
        !t && r && (t = r), t = y.defaults({}, t, y.templateSettings);
        var e = RegExp([ (t.escape || N).source, (t.interpolate || N).source, (t.evaluate || N).source ].join("|") + "|$", "g"), u = 0, i = "__p+='";
        n.replace(e, function(t, r, e, o, a) {
            return i += n.slice(u, a).replace(T, R), u = a + t.length, r ? i += "'+\n((__t=(" + r + "))==null?'':_.escape(__t))+\n'" : e ? i += "'+\n((__t=(" + e + "))==null?'':__t)+\n'" : o && (i += "';\n" + o + "\n__p+='"), 
            t;
        }), i += "';\n", t.variable || (i = "with(obj||{}){\n" + i + "}\n"), i = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + i + "return __p;\n";
        try {
            var o = new Function(t.variable || "obj", "_", i);
        } catch (n) {
            throw n.source = i, n;
        }
        var a = function(n) {
            return o.call(this, n, y);
        }, c = t.variable || "obj";
        return a.source = "function(" + c + "){\n" + i + "}", a;
    }, y.chain = function(n) {
        var t = y(n);
        return t._chain = !0, t;
    };
    var q = function(n, t) {
        return n._chain ? y(t).chain() : t;
    };
    y.mixin = function(n) {
        y.each(y.functions(n), function(t) {
            var r = y[t] = n[t];
            y.prototype[t] = function() {
                var n = [ this._wrapped ];
                return o.apply(n, arguments), q(this, r.apply(y, n));
            };
        });
    }, y.mixin(y), y.each([ "pop", "push", "reverse", "shift", "sort", "splice", "unshift" ], function(n) {
        var t = e[n];
        y.prototype[n] = function() {
            var r = this._wrapped;
            return t.apply(r, arguments), "shift" !== n && "splice" !== n || 0 !== r.length || delete r[0], 
            q(this, r);
        };
    }), y.each([ "concat", "join", "slice" ], function(n) {
        var t = e[n];
        y.prototype[n] = function() {
            return q(this, t.apply(this._wrapped, arguments));
        };
    }), y.prototype.value = function() {
        return this._wrapped;
    }, y.prototype.valueOf = y.prototype.toJSON = y.prototype.value, y.prototype.toString = function() {
        return "" + this._wrapped;
    };
}).call(void 0);