function makeMap(e) {
    for (var t = {}, a = e.split(","), r = 0; r < a.length; r++) t[a[r]] = !0;
    return t;
}

function q(e) {
    return '"' + e + '"';
}

function removeDOCTYPE(e) {
    return e.replace(/<\?xml.*\?>\n/, "").replace(/<!doctype.*\>\n/, "").replace(/<!DOCTYPE.*\>\n/, "");
}

var startTag = /^<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/, endTag = /^<\/([-A-Za-z0-9_]+)[^>]*>/, attr = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g, empty = makeMap("area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr"), block = makeMap("a,address,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video"), inline = makeMap("abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var"), closeSelf = makeMap("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr"), fillAttrs = makeMap("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected"), special = makeMap("script,style"), HTMLParser = function(e, t) {
    function a(e, a) {
        if (a) for (r = s.length - 1; r >= 0 && s[r] != a; r--) ; else var r = 0;
        if (r >= 0) {
            for (var n = s.length - 1; n >= r; n--) t.end && t.end(s[n]);
            s.length = r;
        }
    }
    var r, n, i, s = [], l = e;
    for (s.last = function() {
        return this[this.length - 1];
    }; e; ) {
        if (n = !0, s.last() && special[s.last()]) e = e.replace(new RegExp("([\\s\\S]*?)</" + s.last() + "[^>]*>"), function(e, a) {
            return a = a.replace(/<!--([\s\S]*?)-->|<!\[CDATA\[([\s\S]*?)]]>/g, "$1$2"), t.chars && t.chars(a), 
            "";
        }), a(0, s.last()); else if (0 == e.indexOf("\x3c!--") ? (r = e.indexOf("--\x3e")) >= 0 && (t.comment && t.comment(e.substring(4, r)), 
        e = e.substring(r + 3), n = !1) : 0 == e.indexOf("</") ? (i = e.match(endTag)) && (e = e.substring(i[0].length), 
        i[0].replace(endTag, a), n = !1) : 0 == e.indexOf("<") && (i = e.match(startTag)) && (e = e.substring(i[0].length), 
        i[0].replace(startTag, function(e, r, n, i) {
            if (r = r.toLowerCase(), block[r]) for (;s.last() && inline[s.last()]; ) a(0, s.last());
            if (closeSelf[r] && s.last() == r && a(0, r), (i = empty[r] || !!i) || s.push(r), 
            t.start) {
                var l = [];
                n.replace(attr, function(e, t) {
                    var a = arguments[2] ? arguments[2] : arguments[3] ? arguments[3] : arguments[4] ? arguments[4] : fillAttrs[t] ? t : "";
                    l.push({
                        name: t,
                        value: a,
                        escaped: a.replace(/(^|[^\\])"/g, '$1\\"')
                    });
                }), t.start && t.start(r, l, i);
            }
        }), n = !1), n) {
            var o = (r = e.indexOf("<")) < 0 ? e : e.substring(0, r);
            e = r < 0 ? "" : e.substring(r), t.chars && t.chars(o);
        }
        if (e == l) throw "Parse Error: " + e;
        l = e;
    }
    a();
}, global = {}, debug = function() {};

global.html2json = function(e) {
    e = removeDOCTYPE(e);
    var t = [], a = {
        node: "root",
        child: []
    };
    return HTMLParser(e, {
        start: function(e, r, n) {
            debug(e, r, n);
            var i = {
                node: "element",
                tag: e
            };
            if (0 !== r.length && (i.attr = r.reduce(function(e, t) {
                var a = t.name, r = t.value;
                return r.match(/ /) && (r = r.split(" ")), e[a] ? Array.isArray(e[a]) ? e[a].push(r) : e[a] = [ e[a], r ] : e[a] = r, 
                e;
            }, {})), n) {
                var s = t[0] || a;
                void 0 === s.child && (s.child = []), s.child.push(i);
            } else t.unshift(i);
        },
        end: function(e) {
            debug(e);
            var r = t.shift();
            if (r.tag !== e && console.error("invalid state: mismatch end tag"), 0 === t.length) a.child.push(r); else {
                var n = t[0];
                void 0 === n.child && (n.child = []), n.child.push(r);
            }
        },
        chars: function(e) {
            debug(e);
            var r = {
                node: "text",
                text: e
            };
            if (0 === t.length) a.child.push(r); else {
                var n = t[0];
                void 0 === n.child && (n.child = []), n.child.push(r);
            }
        },
        comment: function(e) {
            debug(e);
            var a = {
                node: "comment",
                text: e
            }, r = t[0];
            void 0 === r.child && (r.child = []), r.child.push(a);
        }
    }), a;
}, global.json2html = function e(t) {
    var a = [ "area", "base", "basefont", "br", "col", "frame", "hr", "img", "input", "isindex", "link", "meta", "param", "embed" ], r = "";
    t.child && (r = t.child.map(function(t) {
        return e(t);
    }).join(""));
    var n = "";
    if (t.attr && "" !== (n = Object.keys(t.attr).map(function(e) {
        var a = t.attr[e];
        return Array.isArray(a) && (a = a.join(" ")), e + "=" + q(a);
    }).join(" ")) && (n = " " + n), "element" === t.node) {
        var i = t.tag;
        return a.indexOf(i) > -1 ? "<" + t.tag + n + "/>" : "<" + t.tag + n + ">" + r + ("</" + t.tag + ">");
    }
    return "text" === t.node ? t.text : "comment" === t.node ? "\x3c!--" + t.text + "--\x3e" : "root" === t.node ? r : void 0;
};

var html2wxwebview = function(e) {
    var t = global.html2json(e);
    return t = parseHtmlNode(t), t = arrangeNode(t);
}, arrangeNode = function(e) {
    for (var t = [], a = [], r = 0, n = e.length; r < n; r++) if (0 == r) {
        if ("view" == e[r].type) continue;
        t.push(e[r]);
    } else if ("view" == e[r].type) {
        if (t.length > 0) {
            i = {
                type: "view",
                child: t
            };
            a.push(i);
        }
        t = [];
    } else if ("img" == e[r].type) {
        if (t.length > 0) {
            i = {
                type: "view",
                child: t
            };
            a.push(i);
        }
        i = {
            type: "img",
            attr: e[r].attr
        };
        a.push(i), t = [];
    } else if (t.push(e[r]), r == n - 1) {
        var i = {
            type: "view",
            child: t
        };
        a.push(i);
    }
    return a;
}, parseHtmlNode = function(e) {
    var t = [];
    return function e(a) {
        var r = {};
        if ("root" == a.node) ; else if ("element" == a.node) switch (a.tag) {
          case "a":
            r = {
                type: "a",
                text: a.child[0].text
            };
            break;

          case "img":
            r = {
                type: "img",
                text: a.text
            };
            break;

          case "p":
          case "div":
            r = {
                type: "view",
                text: a.text
            };
        } else "text" == a.node && (r = {
            type: "text",
            text: a.text
        });
        if (a.attr && (r.attr = a.attr), 0 != Object.keys(r).length && t.push(r), "a" != a.tag) {
            var n = a.child;
            if (n) for (var i in n) e(n[i]);
        }
    }(e), t;
};

module.exports = {
    html2json: html2wxwebview
};