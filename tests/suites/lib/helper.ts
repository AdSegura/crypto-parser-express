import {Encryptor} from "node-laravel-encryptor";
const cookie = require('cookie');
const cookie_name = 'fooBarCookie';
const cookie_name1 = 'kokoa';
const supercookie_name = 'supercookie';
const uuid = require('uuid/v1');

export class Helper {

   private static allowed_cookies = [cookie_name, cookie_name1, supercookie_name];
   public cookies_allowed = [];
   public server_id;
   public key: any;

   constructor(allowed?){
       this.server_id = uuid();
       this.cookies_allowed = allowed || Helper.allowed_cookies;
       this.key = Encryptor.generateRandomKey();
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

    static parseCookies = (str) => {
        if(typeof str === 'object' && str.length >= 0){
            let out = '';
            str.forEach((ele,i) => { if(i === 0){out +=ele}else{ out +=';' + ele}});
            return cookie.parse(out);
        } else {
            return cookie.parse(str);
        }
    };
}
