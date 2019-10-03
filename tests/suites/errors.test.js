const {it} = require("mocha");
const {expect} = require("chai");
const chai = require("chai");
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const express = require('express');
const {ExpressServer} = require('../lib/express-server');
const {CryptoCookie} = require('../../dist');
const {Helper} = require("./lib/helper");
const helper = new Helper();


module.exports = function suite() {
    it("should throw Error 'overrideCookie express argument not an express instance' when trying to override Cookie method on non express instance", async () => {
        const error = 'overrideCookie express argument not an express instance';
        const cryptoCookie = new CryptoCookie(helper.options());
        try {
            cryptoCookie.overrideCookie(express);
        }catch (e) {
            expect(e.message).equal(error);
        }
    });

    it('should Throw Error MAC signature failed', async () => {
        const server = new ExpressServer(helper.options());
        const agent = chai.request.agent(server);
        const request = await agent.get('/unwanted_cookie').set('Cookie', 'bad_cookie=2');
        const cookie = Helper.parseCookies(request.res.headers['set-cookie']);
        const decompose = Helper.decomposeCookie(cookie.fooBarCookie);
        const fakedCookie = Helper.alterMac(decompose);
        const fakedRecomposeCookie = Helper.recomposeCookie(fakedCookie);
        const second_request = await agent.get('/unwanted_cookie').set('Cookie', 'fooBarCookie=' + fakedRecomposeCookie);
        expect(second_request.res.text.includes('"EncryptorError: The MAC is invalid.')).to.be.true;
    });
}
