const express = require("express");
const bodyParser   = require("body-parser");
const path = require("path");
const {CryptoCookie} = require('../../dist');
const http = require('http');
const uuid = require('uuid/v1');

exports.ExpressServer =  class ExpressServer {

    constructor(options) {
        this.options = Object.assign({}, options);

        this.options.cookie.options = ExpressServer.cookie_params(this.options.cookie.options);

        const cryptoCookie = new CryptoCookie(this.options);

        this.app = cryptoCookie.overrideCookie(express());

        this.server_id = ExpressServer.setServerId(this.options.server_id);

        this.app.use((req, res, next) => {
            res.cookie_async('fooBarCookie', this.getServerId(), this.options.cookie.options)
                .then(() => {
                    next()
                }).catch(e => {throw e;})
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

        this.app.get(
            '/make_cookie',
            (req, res, next) => this.getMakeCookie(req, res, next)
        );
    }

    getMakeCookie(req, res, next) {
        let value;

        if(req.query.mode === 'object')
            value = {hello: "world"};
        else
            value = 'no brain';

        res.cookie(req.query.name, value, this.options.cookie.options);

        typeof value === 'object' ? res.json(value) : res.send(value);
    }

    getRoot(req, res, next) {
        res.cookie('kokoa', '22', this.options.cookie.options);
        res.json({id: this.getServerId()});
    }

    getCookies(req, res, next) {
        //console.log(req.cookies)
        res.send(req.cookies['fooBarCookie']);
    }

    getUnwantedCookies(req, res, next) {
        if((Object.keys(req.cookies)).length === 0)
            return res.send('no cookies');

        res.send(req.cookies[(Object.keys(req.cookies))[0]]);
    }

    getSetNotAlloweCookie(req, res, next) {
        res.cookie('notAllowedCookie', 'foo', this.options.cookie.options);
        res.send('NotAlloweCookie');
    }


    /**
     * Log Error and Next
     * @param next
     */
     static errorAndNext(next) {
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
     responseCookie(name, res, next) {
        return (enc) => {
            this.setCookie(name, res)(enc);
            next();
        }
    }


     middleware() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(express.static(path.join(__dirname, 'public')));
    }

    listen() {
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

    close(cb) {
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

    static setServerId(id) {
        if(! id) return uuid();
        return id;
    }

    /**
     * default cookie params
     *
     * @param opt
     */

    static cookie_params(opt) {

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
     setCookie(name, res) {
        return (payload) => {
            res.cookie(name, payload, this.options.cookie);
        }
    }
}
