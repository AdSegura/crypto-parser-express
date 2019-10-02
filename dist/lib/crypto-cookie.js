"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const adseg_cookie_parser_1 = require("./adseg-cookie-parser");
const override_cookie_1 = require("./override-cookie");
class CryptoCookie {
    constructor(options) {
        this.options = options;
        this.parser = new adseg_cookie_parser_1.AdsegCookieParser(this.options);
        this.cookieOverride = new override_cookie_1.OverrideCookie(this.options);
    }
    overrideCookie(express_instance) {
        if (!CryptoCookie.validExpressInstance(express_instance))
            throw new Error('overrideCookie express argument not an express instance');
        return this.cookieOverride.cookieMethod(express_instance);
    }
    cookieParser() {
        return this.parser.cookieParser();
    }
    static validExpressInstance(express_instance) {
        return express_instance.constructor.name === 'EventEmitter' &&
            express_instance.hasOwnProperty('mountpath') &&
            express_instance.hasOwnProperty('settings');
    }
}
exports.CryptoCookie = CryptoCookie;
