import {Encryptor} from 'node-laravel-encryptor';

export class AdsegCookieParser {

    /** regexp */
    static readonly pairSplitRegExp = /; */;
    /** regexp */
    static readonly fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
    /** allowed cookies */
    static allowed: any = [];
    /** allow all not allowed cookies to be populate to req.cookies, but not deciphered */
    static allow_all: boolean = false;

    /** encryptor */
    static cipher: Encryptor;

    constructor(private options) {
        AdsegCookieParser.allow_all =  options.cookie.allow_all;
        AdsegCookieParser.cipher = new Encryptor(this.options.encryptor);
        AdsegCookieParser.allowed = this.options.cookie.allowed || [];
    }

    /**
     * decode
     *
     * @param data
     */
    static decode(data){
        return AdsegCookieParser.cipher.decrypt(decodeURIComponent(data));
    }

    /**
     * Encode
     *
     * @param data
     */
    static encode(data){
        return encodeURIComponent(AdsegCookieParser.cipher.encryptSync(data));
    }

    /**
     * Cookie Parser
     */
    cookieParser() {
        return (req, res, next) => {
            if (req.cookies) {
                return next()
            }

            const cookies = req.headers.cookie;

            req.cookies = Object.create(null);

            // no cookies
            if (!cookies) {
                return next()
            }

            req.cookies = AdsegCookieParser.parse(cookies);

            next()
        }
    }

    /**
     * Parser
     *
     * @param str
     */
    static parse(str) {
        if (typeof str !== 'string') {
            throw new TypeError('argument str must be a string');
        }

        var obj = {};

        var pairs = str.split(AdsegCookieParser.pairSplitRegExp);

        //console.log(pairs)
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i];
            var eq_idx = pair.indexOf('=');

            // skip things that don't look like key=value
            if (eq_idx < 0) {
                continue;
            }

            const key = pair.substr(0, eq_idx).trim();
            let val = pair.substr(++eq_idx, pair.length).trim();

            // quoted values
            if ('"' == val[0]) {
                val = val.slice(1, -1);
            }

            // only assign once
            if (undefined == obj[key]) {
                if(AdsegCookieParser.allowed.includes(key)) {
                    obj[key] = AdsegCookieParser.decode(val);
                }else if(AdsegCookieParser.allow_all){
                    obj[key] = decodeURIComponent(val);
                }
            }
        }

        return obj;
    }
}


