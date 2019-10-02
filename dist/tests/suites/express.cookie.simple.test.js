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
const express_server_1 = require("../lib/express-server");
const { it } = require("mocha");
const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const cookie = require('cookie');
const helper_1 = require("./lib/helper");
const helper = new helper_1.Helper();
function suite() {
    it(`should client get cipher cookie using res.cookie_async`, () => __awaiter(this, void 0, void 0, function* () {
        const server = new express_server_1.ExpressServer(helper.options());
        const agent = chai.request.agent(server);
        const request = yield agent.get('/');
        const cookies = cookie.parse(request.res.headers['set-cookie'][0]);
        const deciphered = helper.decipher(cookies[helper.cookies_allowed[0]]);
        expect(deciphered).equal(helper.server_id);
    }));
    it(`should client get cipher cookie using res.cookie method overridden`, () => __awaiter(this, void 0, void 0, function* () {
        const server = new express_server_1.ExpressServer(helper.options());
        const agent = chai.request.agent(server);
        const request = yield agent.get('/make_cookie?name=supercookie&mode=object');
        const response = JSON.parse(request.res.text);
        const cookies = cookie.parse(request.res.headers['set-cookie'][1]);
        const deciphered = helper.decipher(cookies[helper.cookies_allowed[2]]);
        expect(deciphered).to.eql(response);
    }));
}
exports.default = suite;
