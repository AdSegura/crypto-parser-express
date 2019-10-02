import * as path from "path";
import * as express from "express";
import * as bodyParser   from "body-parser";
import {CryptoCookie} from "../../src";
const http = require('http');
const uuid = require('uuid/v1');

interface Cookie_options{
    name: string,
    options: {
        cipher: boolean,
        decipher: boolean,
        secure: boolean,
        httpOnly: boolean,
        domain: string,
        path: string,
        signed: boolean,
        sameSite: string,
        expires: Date,
    }
}

interface Options{
    server_id?: string,
    cookie?: Cookie_options,
}

export class ExpressServer {
    app: any;
    public server: any;
    protected server_id: any;
    private options: any;


    constructor(options: any) {
        this.options = Object.assign({}, options);

        this.options.cookie.options = ExpressServer.cookie_params(this.options.cookie.options);

        const cryptoCookie = new CryptoCookie(this.options);

        this.app = cryptoCookie.overrideCookie(express());

        this.server_id = ExpressServer.setServerId(this.options.server_id);

        this.app.use((req, res, next) => {
            res.cookie('fooBarCookie', this.getServerId(), this.options.cookie.options);
            next()
        });

        this.app.use(cryptoCookie.cookieParser())
    }

    /**
     * API
     */
    api() {
        this.app.get(
            '/',
            (req, res, next) => this.getRoot(req, res, next)
        );

        this.app.get(
            '/cookies',
            (req, res, next) => this.getCookies(req, res, next)
        );

        this.app.get(
            '/unwanted_cookie',
            (req, res, next) => this.getUnwantedCookies(req, res, next)
        );

        this.app.get(
            '/notallowedcookie',
            (req, res, next) => this.getSetNotAlloweCookie(req, res, next)
        );
    }

    getRoot(req: any, res: any, next: any) {
        res.cookie('kokoa', '22', this.options.cookie.options);
        res.json({id: this.getServerId()});
    }

    getCookies(req: any, res: any, next: any) {
        //console.log(req.cookies)
        res.send(req.cookies['fooBarCookie']);
    }

    getUnwantedCookies(req: any, res: any, next: any) {
        if((Object.keys(req.cookies)).length === 0)
            return res.send('no cookies');

        res.send(req.cookies[(Object.keys(req.cookies))[0]]);
    }

    getSetNotAlloweCookie(req: any, res: any, next: any) {
        res.cookie('notAllowedCookie', 'foo', this.options.cookie.options);
        res.send('NotAlloweCookie');
    }


    /**
     * Log Error and Next
     * @param next
     */
    private static errorAndNext(next) {
        return (error) => {
            console.error(error);
            next(error);
        }
    }

    /**
     *
     * @param name
     * @param res
     * @param next
     */
    private responseCookie(name, res, next) {
        return (enc) => {
            this.setCookie(name, res)(enc);
            next();
        }
    }


    private middleware(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(express.static(path.join(__dirname, 'public')));
    }

    listen(): any {
        this.middleware();

        this.app.use(ExpressServer.logErrors);
        this.app.use(ExpressServer.clientErrorHandler);
        this.app.use(ExpressServer.errorHandler);

        this.api();

        this.server = http.createServer(this.app);
        this.server.listen.apply(this.server, arguments);

        const last = arguments[arguments.length-1];
        if(typeof last === 'function') return;

        return this.server;
    }

    address() {
        if(! this.server) return false;
        return this.server.address();
    }

    close(cb?: any) {
        this.server.close(cb);
    }


    static logErrors(err, req, res, next) {
        console.error(err.stack);
        next(err)
    }

    static clientErrorHandler(err, req, res, next) {
        if (req.xhr) {
            res.status(500).send({error: 'Something failed!'})
        } else {
            next(err)
        }
    }

    static errorHandler(err, req, res, next) {
        if (process.env.NODE_ENV !== 'development')
            return res.status(500).send({error: 'Something failed!'});

        res.status(500).send({error: err.stack})
    }

    getServerId() {
        return this.server_id;
    }

    static setServerId(id?: string) {
        if(! id) return uuid();
        return id;
    }

    /**
     * default cookie params
     *
     * @param opt
     */

    static cookie_params(opt?: any): Cookie_options {

        let options = opt || {};

        const base = {
            domain: 'localhost',
            httpOnly: true,
            path: '/',
            secure: true,
            signed: false,
            sameSite: 'Lax',
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        };

        return Object.assign({}, base, options);
    };



    /**
     * Set Cookie res
     *
     * @param name
     * @param res
     */
    private setCookie(name, res) {
        return (payload) => {
            res.cookie(name, payload, this.options.cookie);
        }
    }
}
