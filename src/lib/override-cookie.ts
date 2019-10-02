import {Encryptor} from 'node-laravel-encryptor';

export class OverrideCookie {
    private cipher: Encryptor;
    private static cookies_allowed: any = [];

    constructor(private options) {
        OverrideCookie.cookies_allowed = [...this.options.cookie.allowed];

        this.cipher = new Encryptor(this.options.encryptor);
    }

    /**
     * Override express response cookie method
     *
     * @param express_instance
     */
    cookieMethod(express_instance) {
        const express_cookie = express_instance.response.cookie;
        const that = this;

        express_instance.response.cookie = function (name, value, opt) {
            opt = opt ||  {};

            delete opt.decode;
            delete opt.encode;

            value = that.cipher.encryptSync(value);

            if(that.options.cookie.allow_all)
                return express_cookie.apply(this, [name, value, opt]);

            if (OverrideCookie.cookies_allowed.includes(name)){
                return express_cookie.apply(this, [name, value, opt]);
            }

            return this;
        };

        return express_instance;
    }

}
