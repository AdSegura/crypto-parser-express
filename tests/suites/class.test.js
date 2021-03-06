const {it} = require("mocha");
const {expect} = require("chai");
const express = require('express');
const {CryptoCookie} = require('../../dist');
const {Helper} = require("./lib/helper");
const helper = new Helper();

module.exports = function suite() {
    it('should return express instance with res.cookie method overridden', async () => {
        const cryptoCookie = new CryptoCookie(helper.options());
        const app = cryptoCookie.overrideCookie(express());
        const cookie_override = app.response.cookie.toString();
        expect(cookie_override.includes('that.cipher.encryptSync(value);')).to.be.true;
    });

    it('should return express instance with res.cookie_async new method', async () => {
        const cryptoCookie = new CryptoCookie(helper.options());
        const app = cryptoCookie.overrideCookie(express());
        const cookie_async = app.response.cookie_async.toString();
        expect(cookie_async.includes('value = yield that.cipher.encrypt(value);')).to.be.true;
    });
}
