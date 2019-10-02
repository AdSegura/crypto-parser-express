const {it} = require("mocha");
const {expect} = require("chai");
const chai = require("chai");
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
import {Encryptor} from "node-laravel-encryptor";
const key = Encryptor.generateRandomKey();
const uuid = require('uuid/v1');
const server_id = uuid();
const express = require('express');
import {CryptoCookie} from "../../src";

const cookie_name = 'fooBarCookie';
const cookie_name1 = 'kokoa';
const allowed = [cookie_name, cookie_name1];

const options = () => {
    return {
        server_id,
        encryptor: {
            key
        },
        cookie: {
            allow_all: false,
            allowed,
            options: {
                secure: false,
                httpOnly: false
            }
        }
    }
};


export default function suite() {
    it('should return express instance with res.cookie method overridden', async () => {
        const cryptoCookie = new CryptoCookie(options());
        const app = cryptoCookie.overrideCookie(express());
        const cookie_override = app.response.cookie.toString();
        expect(cookie_override.includes('that.cipher.encryptSync(value);')).to.be.true;
    });

    it('should return express instance with res.cookie_async new method', async () => {
        const cryptoCookie = new CryptoCookie(options());
        const app = cryptoCookie.overrideCookie(express());
        const cookie_async = app.response.cookie_async.toString();
        expect(cookie_async.includes('value = yield that.cipher.encrypt(value);')).to.be.true;
    });
}
