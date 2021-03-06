const {Encryptor} = require("node-laravel-encryptor");
const cookie = require('cookie');
const cookie_name = 'fooBarCookie';
const cookie_name1 = 'kokoa';
const supercookie_name = 'supercookie';
const uuid = require('uuid/v1');

exports.Helper = class Helper {

   constructor(allowed){
       this.server_id = uuid();
       this.cookies_allowed = allowed || Helper.allowed_cookies();
       this.key = Encryptor.generateRandomKey();
   }

    static allowed_cookies () {
       return [cookie_name, cookie_name1, supercookie_name];
    }

   options(){
        return {
            server_id: this.server_id,
            encryptor: {
                key: this.key
            },
            cookie: {
                allow_all: false,
                allowed: this.cookies_allowed,
                options: {
                    secure: false,
                    httpOnly: false
                }
            }
        }
    }

    decipher(val){
        const cipher = new Encryptor({key: this.key});
        return cipher.decrypt(val)
    }

    static parseCookies(str){
        if(typeof str === 'object' && str.length >= 0){
            let out = '';
            str.forEach((ele,i) => { if(i === 0){out +=ele}else{ out +=';' + ele}});
            return cookie.parse(out);
        } else {
            return cookie.parse(str);
        }
    };

    static decomposeCookie(str) {
        if (typeof str !== 'string')
            throw Error('decomposeCookie str needs to be a string');

        return Buffer.from(str, 'base64').toString();
    }

    static recomposeCookie(str) {
        if (typeof str !== 'object')
            throw Error('recomposeCookie str needs to be an object');

        return Buffer.from(JSON.stringify(str), 'utf8').toString('base64');
    }

    static alterMac(obj){
        const o = Object.assign({}, JSON.parse(obj));
        o.mac = 'lskjdlsdllsjdl';
        return o;
    }
}
