"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_laravel_encryptor_1 = require("node-laravel-encryptor");
class AdsegCookieParser {
    constructor(options) {
        this.options = options;
        AdsegCookieParser.allow_all = options.cookie.allow_all;
        AdsegCookieParser.cipher = new node_laravel_encryptor_1.Encryptor(this.options.encryptor);
        AdsegCookieParser.allowed = this.options.cookie.allowed || [];
    }
    static decode(data) {
        return AdsegCookieParser.cipher.decrypt(decodeURIComponent(data));
    }
    static encode(data) {
        return encodeURIComponent(AdsegCookieParser.cipher.encryptSync(data));
    }
    cookieParser() {
        return (req, res, next) => {
            if (req.cookies) {
                return next();
            }
            const cookies = req.headers.cookie;
            req.cookies = Object.create(null);
            if (!cookies) {
                return next();
            }
            req.cookies = AdsegCookieParser.parse(cookies);
            next();
        };
    }
    static parse(str) {
        if (typeof str !== 'string') {
            throw new TypeError('argument str must be a string');
        }
        var obj = {};
        var pairs = str.split(AdsegCookieParser.pairSplitRegExp);
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i];
            var eq_idx = pair.indexOf('=');
            if (eq_idx < 0) {
                continue;
            }
            const key = pair.substr(0, eq_idx).trim();
            let val = pair.substr(++eq_idx, pair.length).trim();
            if ('"' == val[0]) {
                val = val.slice(1, -1);
            }
            if (undefined == obj[key]) {
                if (AdsegCookieParser.allowed.includes(key)) {
                    obj[key] = AdsegCookieParser.decode(val);
                }
                else if (AdsegCookieParser.allow_all) {
                    obj[key] = decodeURIComponent(val);
                }
            }
        }
        return obj;
    }
}
AdsegCookieParser.pairSplitRegExp = /; */;
AdsegCookieParser.fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
AdsegCookieParser.allowed = [];
AdsegCookieParser.allow_all = false;
exports.AdsegCookieParser = AdsegCookieParser;
