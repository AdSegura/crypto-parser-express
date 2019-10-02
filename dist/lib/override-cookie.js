"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_laravel_encryptor_1 = require("node-laravel-encryptor");
class OverrideCookie {
    constructor(options) {
        this.options = options;
        OverrideCookie.cookies_allowed = [...this.options.cookie.allowed];
        this.cipher = new node_laravel_encryptor_1.Encryptor(this.options.encryptor);
    }
    cookieMethod(express_instance) {
        const express_cookie = express_instance.response.cookie;
        const that = this;
        express_instance.response.cookie = function (name, value, opt) {
            opt = opt || {};
            delete opt.decode;
            delete opt.encode;
            value = that.cipher.encryptSync(value);
            if (that.options.cookie.allow_all)
                return express_cookie.apply(this, [name, value, opt]);
            if (OverrideCookie.cookies_allowed.includes(name)) {
                return express_cookie.apply(this, [name, value, opt]);
            }
            return this;
        };
        return express_instance;
    }
}
OverrideCookie.cookies_allowed = [];
exports.OverrideCookie = OverrideCookie;
