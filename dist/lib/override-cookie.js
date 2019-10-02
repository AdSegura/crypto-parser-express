"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_laravel_encryptor_1 = require("node-laravel-encryptor");
class OverrideCookie {
    constructor(options) {
        this.options = options;
        OverrideCookie.cookies_allowed = [...this.options.cookie.allowed];
        this.cipher = new node_laravel_encryptor_1.Encryptor(this.options.encryptor);
    }
    cookieMethod(express_instance) {
        const that = this;
        const express_cookie = express_instance.response.cookie;
        express_instance.response.cookie_async = function (name, value, opt) {
            return __awaiter(this, void 0, void 0, function* () {
                opt = OverrideCookie.prepareOpt(opt);
                value = yield that.cipher.encrypt(value);
                if (that.options.cookie.allow_all)
                    return express_cookie.apply(this, [name, value, opt]);
                if (OverrideCookie.cookies_allowed.includes(name)) {
                    return express_cookie.apply(this, [name, value, opt]);
                }
                return this;
            });
        };
        express_instance.response.cookie = function (name, value, opt) {
            opt = OverrideCookie.prepareOpt(opt);
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
    static prepareOpt(opt) {
        opt = opt || {};
        delete opt.decode;
        delete opt.encode;
        return opt;
    }
}
OverrideCookie.cookies_allowed = [];
exports.OverrideCookie = OverrideCookie;
