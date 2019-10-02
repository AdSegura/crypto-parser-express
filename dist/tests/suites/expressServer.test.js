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
const { it } = require("mocha");
const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const express_server_1 = require("../lib/express-server");
const helper_1 = require("./lib/helper");
const helper = new helper_1.Helper();
function suite() {
    it('should client send cipher cookie and cookieParser should decipher it', () => __awaiter(this, void 0, void 0, function* () {
        const server = new express_server_1.ExpressServer(helper.options());
        const agent = chai.request.agent(server);
        const request = yield agent.get('/');
        const cookies = request.header['set-cookie'];
        const second_request = yield agent.get('/cookies').set('Cookie', cookies);
        expect(second_request.res.text).equal(helper.server_id);
    }));
    it('should server res.cookie not populate response Headers Set-Cookie when cookie name is not allowed ', () => __awaiter(this, void 0, void 0, function* () {
        const server = new express_server_1.ExpressServer(helper.options());
        const agent = chai.request.agent(server);
        const request = yield agent.get('/notallowedcookie');
        expect((helper_1.Helper.parseCookies(request.res.headers['set-cookie']))['notAllowedCookie'])
            .equal(undefined);
        expect(request.status).equal(200);
    }));
    it('should server res.cookie populate response Headers Set-Cookie when cookie name is not allowed and allow_all = true', () => __awaiter(this, void 0, void 0, function* () {
        const opt = JSON.parse(JSON.stringify(helper.options()));
        opt.cookie.allow_all = true;
        const server = new express_server_1.ExpressServer(opt);
        const agent = chai.request.agent(server);
        const request = yield agent.get('/notallowedcookie');
        expect(helper_1.Helper.parseCookies(request.res.headers['set-cookie'])).hasOwnProperty('notAllowedCookie');
        expect(request.status).equal(200);
    }));
    it('should client send not allowed cookie and cookieParser should discard', () => __awaiter(this, void 0, void 0, function* () {
        const server = new express_server_1.ExpressServer(helper.options());
        const agent = chai.request.agent(server);
        const request = yield agent.get('/unwanted_cookie').set('Cookie', 'bad_cookie=2');
        expect(request.res.text).equal('no cookies');
    }));
    it('should client send not allowed cookie when allow_all option true and should not decipher but should be parsed in req.cookies', () => __awaiter(this, void 0, void 0, function* () {
        const opt = JSON.parse(JSON.stringify(helper.options()));
        opt.cookie.allow_all = true;
        const server = new express_server_1.ExpressServer(opt);
        const agent = chai.request.agent(server);
        const request = yield agent.get('/unwanted_cookie').set('Cookie', 'bad_cookie=2');
        expect(request.res.text).equal('2');
    }));
}
exports.default = suite;
