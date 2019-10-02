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
        const that = this;

        const express_cookie = express_instance.response.cookie;

        express_instance.response.cookie_async = async function(name, value, opt) {
            opt = OverrideCookie.prepareOpt(opt);

            value = await that.cipher.encrypt(value);

            if(that.options.cookie.allow_all)
                return express_cookie.apply(this, [name, value, opt]);

            if (OverrideCookie.cookies_allowed.includes(name)){
                return express_cookie.apply(this, [name, value, opt]);
            }

            return this;
        };

        express_instance.response.cookie = function (name, value, opt) {
            opt = OverrideCookie.prepareOpt(opt);

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

    private static prepareOpt(opt?: any){
        opt = opt ||  {};

        delete opt.decode;
        delete opt.encode;

        return opt;
    }
}
