var LZString = function() {
    function o(o, r) {
        if (!t[o]) {
            t[o] = {};
            for (var n = 0; n < o.length; n++) t[o][o.charAt(n)] = n
        }
        return t[o][r]
    }
    var r = String.fromCharCode,
        n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",
        t = {},
        i = {
            compressToBase64: function(o) {
                if (null == o) return "";
                var r = i._compress(o, 6, function(o) {
                    return n.charAt(o)
                });
                switch (r.length % 4) {
                    default:
                    case 0:
                        return r;
                    case 1:
                        return r + "===";
                    case 2:
                        return r + "==";
                    case 3:
                        return r + "="
                }
            },
            decompressFromBase64: function(r) {
                return null == r ? "" : "" == r ? null : i._decompress(r.length, 32, function(e) {
                    return o(n, r.charAt(e))
                })
            },
            compressToUTF16: function(o) {
                return null == o ? "" : i._compress(o, 15, function(o) {
                    return r(o + 32)
                }) + " "
            },
            decompressFromUTF16: function(o) {
                return null == o ? "" : "" == o ? null : i._decompress(o.length, 16384, function(r) {
                    return o.charCodeAt(r) - 32
                })
            },
            compressToUint8Array: function(o) {
                for (var r = i.compress(o), n = new Uint8Array(2 * r.length), e = 0, t = r.length; t > e; e++) {
                    var s = r.charCodeAt(e);
                    n[2 * e] = s >>> 8, n[2 * e + 1] = s % 256
                }
                return n
            },
            decompressFromUint8Array: function(o) {
                if (null === o || void 0 === o) return i.decompress(o);
                for (var n = new Array(o.length / 2), e = 0, t = n.length; t > e; e++) n[e] = 256 * o[2 * e] + o[2 * e + 1];
                var s = [];
                return n.forEach(function(o) {
                    s.push(r(o))
                }), i.decompress(s.join(""))
            },
            compressToEncodedURIComponent: function(o) {
                return null == o ? "" : i._compress(o, 6, function(o) {
                    return e.charAt(o)
                })
            },
            decompressFromEncodedURIComponent: function(r) {
                return null == r ? "" : "" == r ? null : (r = r.replace(/ /g, "+"), i._decompress(r.length, 32, function(n) {
                    return o(e, r.charAt(n))
                }))
            },
            compress: function(o) {
                return i._compress(o, 16, function(o) {
                    return r(o)
                })
            },
            _compress: function(o, r, n) {
                if (null == o) return "";
                var e, t, i, s = {},
                    p = {},
                    u = "",
                    c = "",
                    a = "",
                    l = 2,
                    f = 3,
                    h = 2,
                    d = [],
                    m = 0,
                    v = 0;
                for (i = 0; i < o.length; i += 1)
                    if (u = o.charAt(i), Object.prototype.hasOwnProperty.call(s, u) || (s[u] = f++, p[u] = !0), c = a + u, Object.prototype.hasOwnProperty.call(s, c)) a = c;
                    else {
                        if (Object.prototype.hasOwnProperty.call(p, a)) {
                            if (a.charCodeAt(0) < 256) {
                                for (e = 0; h > e; e++) m <<= 1, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++;
                                for (t = a.charCodeAt(0), e = 0; 8 > e; e++) m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1
                            } else {
                                for (t = 1, e = 0; h > e; e++) m = m << 1 | t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t = 0;
                                for (t = a.charCodeAt(0), e = 0; 16 > e; e++) m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1
                            }
                            l--, 0 == l && (l = Math.pow(2, h), h++), delete p[a]
                        } else
                            for (t = s[a], e = 0; h > e; e++) m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1;
                        l--, 0 == l && (l = Math.pow(2, h), h++), s[c] = f++, a = String(u)
                    }
                if ("" !== a) {
                    if (Object.prototype.hasOwnProperty.call(p, a)) {
                        if (a.charCodeAt(0) < 256) {
                            for (e = 0; h > e; e++) m <<= 1, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++;
                            for (t = a.charCodeAt(0), e = 0; 8 > e; e++) m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1
                        } else {
                            for (t = 1, e = 0; h > e; e++) m = m << 1 | t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t = 0;
                            for (t = a.charCodeAt(0), e = 0; 16 > e; e++) m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1
                        }
                        l--, 0 == l && (l = Math.pow(2, h), h++), delete p[a]
                    } else
                        for (t = s[a], e = 0; h > e; e++) m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1;
                    l--, 0 == l && (l = Math.pow(2, h), h++)
                }
                for (t = 2, e = 0; h > e; e++) m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1;
                for (;;) {
                    if (m <<= 1, v == r - 1) {
                        d.push(n(m));
                        break
                    }
                    v++
                }
                return d.join("")
            },
            decompress: function(o) {
                return null == o ? "" : "" == o ? null : i._decompress(o.length, 32768, function(r) {
                    return o.charCodeAt(r)
                })
            },
            _decompress: function(o, n, e) {
                var t, i, s, p, u, c, a, l, f = [],
                    h = 4,
                    d = 4,
                    m = 3,
                    v = "",
                    w = [],
                    A = {
                        val: e(0),
                        position: n,
                        index: 1
                    };
                for (i = 0; 3 > i; i += 1) f[i] = i;
                for (p = 0, c = Math.pow(2, 2), a = 1; a != c;) u = A.val & A.position, A.position >>= 1, 0 == A.position && (A.position = n, A.val = e(A.index++)), p |= (u > 0 ? 1 : 0) * a, a <<= 1;
                switch (t = p) {
                    case 0:
                        for (p = 0, c = Math.pow(2, 8), a = 1; a != c;) u = A.val & A.position, A.position >>= 1, 0 == A.position && (A.position = n, A.val = e(A.index++)), p |= (u > 0 ? 1 : 0) * a, a <<= 1;
                        l = r(p);
                        break;
                    case 1:
                        for (p = 0, c = Math.pow(2, 16), a = 1; a != c;) u = A.val & A.position, A.position >>= 1, 0 == A.position && (A.position = n, A.val = e(A.index++)), p |= (u > 0 ? 1 : 0) * a, a <<= 1;
                        l = r(p);
                        break;
                    case 2:
                        return ""
                }
                for (f[3] = l, s = l, w.push(l);;) {
                    if (A.index > o) return "";
                    for (p = 0, c = Math.pow(2, m), a = 1; a != c;) u = A.val & A.position, A.position >>= 1, 0 == A.position && (A.position = n, A.val = e(A.index++)), p |= (u > 0 ? 1 : 0) * a, a <<= 1;
                    switch (l = p) {
                        case 0:
                            for (p = 0, c = Math.pow(2, 8), a = 1; a != c;) u = A.val & A.position, A.position >>= 1, 0 == A.position && (A.position = n, A.val = e(A.index++)), p |= (u > 0 ? 1 : 0) * a, a <<= 1;
                            f[d++] = r(p), l = d - 1, h--;
                            break;
                        case 1:
                            for (p = 0, c = Math.pow(2, 16), a = 1; a != c;) u = A.val & A.position, A.position >>= 1, 0 == A.position && (A.position = n, A.val = e(A.index++)), p |= (u > 0 ? 1 : 0) * a, a <<= 1;
                            f[d++] = r(p), l = d - 1, h--;
                            break;
                        case 2:
                            return w.join("")
                    }
                    if (0 == h && (h = Math.pow(2, m), m++), f[l]) v = f[l];
                    else {
                        if (l !== d) return null;
                        v = s + s.charAt(0)
                    }
                    w.push(v), f[d++] = s + v.charAt(0), h--, s = v, 0 == h && (h = Math.pow(2, m), m++)
                }
            }
        };
    return i
}();
"function" == typeof define && define.amd ? define(function() {
    return LZString
}) : "undefined" != typeof module && null != module && (module.exports = LZString);


function is_array(input) {
  return typeof(input) === "object" && (input instanceof Array);
}
function convert_string_to_hex(s) {
  var byte_arr = [];
  for (var i = 0 ; i<s.length ; i++) {
    var value = s.charCodeAt(i);
    byte_arr.push(value & 255);
    byte_arr.push((value>>8) & 255);
  }
  return convert_to_formated_hex(byte_arr);
}

function convert_to_formated_hex(byte_arr) {
  var hex_str = "",
      i,
      len,
      tmp_hex;
  
  if (!is_array(byte_arr)) {
    return false;
  }
  
  len = byte_arr.length;
  
  for (i = 0; i < len; ++i) {
    if (byte_arr[i] < 0) {
      byte_arr[i] = byte_arr[i] + 256;
    }
    if (byte_arr[i] === undefined) {
      alert("Boom " + i);
      byte_arr[i] = 0;
    }
    tmp_hex = byte_arr[i].toString(16);
    
    // Add leading zero.
    if (tmp_hex.length == 1) tmp_hex = "0" + tmp_hex;
    
    if ((i + 1) % 16 === 0) {
      tmp_hex += "\n";
    } else {
      tmp_hex += " ";
    }
    
    hex_str += tmp_hex;
  }
  
  return hex_str.trim();
}
function convert_formated_hex_to_bytes(hex_str) {
  var count = 0,
      hex_arr,
      hex_data = [],
      hex_len,
      i;
  
  if (hex_str.trim() == "") return [];
  
  /// Check for invalid hex characters.
  if (/[^0-9a-fA-F\s]/.test(hex_str)) {
    return false;
  }
  
  hex_arr = hex_str.split(/([0-9a-fA-F]+)/g);
  hex_len = hex_arr.length;
  
  for (i = 0; i < hex_len; ++i) {
    if (hex_arr[i].trim() == "") {
      continue;
    }
    hex_data[count++] = parseInt(hex_arr[i], 16);
  }
  
  return hex_data;
}
function convert_formated_hex_to_string(s) {
  var byte_arr = convert_formated_hex_to_bytes(s);
  var res = "";
  for (var i = 0 ; i<byte_arr.length ; i+=2) {
    res += String.fromCharCode(byte_arr[i] | (byte_arr[i+1]<<8));
  }
  return res;
}
function convert_string_to_hex(s) {
  var byte_arr = [];
  for (var i = 0 ; i<s.length ; i++) {
    var value = s.charCodeAt(i);
    byte_arr.push(value & 255);
    byte_arr.push((value>>8) & 255);
  }
  return convert_to_formated_hex(byte_arr);
}

function strCompress(s){
    return convert_string_to_hex(LZString.compress(s));
}
function strDecompress(s){
    return LZString.decompress(convert_formated_hex_to_string(s));
}



