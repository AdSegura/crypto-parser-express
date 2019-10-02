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
const express = require('express');
const { CryptoCookie } = require(process.env.Root + '/dist');
const helper_1 = require("./lib/helper");
const helper = new helper_1.Helper();
function suite() {
    it('should return express instance with res.cookie method overridden', () => __awaiter(this, void 0, void 0, function* () {
        const cryptoCookie = new CryptoCookie(helper.options());
        const app = cryptoCookie.overrideCookie(express());
        const cookie_override = app.response.cookie.toString();
        expect(cookie_override.includes('that.cipher.encryptSync(value);')).to.be.true;
    }));
    it('should return express instance with res.cookie_async new method', () => __awaiter(this, void 0, void 0, function* () {
        const cryptoCookie = new CryptoCookie(helper.options());
        const app = cryptoCookie.overrideCookie(express());
        const cookie_async = app.response.cookie_async.toString();
        expect(cookie_async.includes('value = yield that.cipher.encrypt(value);')).to.be.true;
    }));
}
exports.default = suite;
