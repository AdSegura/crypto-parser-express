import {AdsegCookieParser} from './adseg-cookie-parser';
import {OverrideCookie} from './override-cookie';

export class CryptoCookie {

    /** Cookie Parser */
    private parser: AdsegCookieParser;
    /** Cookie Override */
    private cookieOverride: OverrideCookie;

    constructor(private options){
        this.parser = new AdsegCookieParser(this.options);
        this.cookieOverride = new OverrideCookie(this.options)
    }

    /**
     * override express response cookie method
     *
     * @param express_instance
     */
    overrideCookie(express_instance){
        if(! CryptoCookie.validExpressInstance(express_instance))
            throw new Error('overrideCookie express argument not an express instance');

        return this.cookieOverride.cookieMethod(express_instance)
    }

    /**
     * Cookie Parser Middleware for Express Js
     */
    cookieParser(){
       return this.parser.cookieParser()
    }

   static validExpressInstance(express_instance){
        return express_instance.constructor.name === 'EventEmitter' &&
            express_instance.hasOwnProperty('mountpath') &&
            express_instance.hasOwnProperty('settings')
    }
}
