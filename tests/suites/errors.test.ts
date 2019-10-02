const {it} = require("mocha");
const {expect} = require("chai");
const chai = require("chai");
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
//import {ExpressServer} from "../lib/express-server";
import {Encryptor} from "node-laravel-encryptor";
const key = Encryptor.generateRandomKey();
//const cookie = require('cookie');
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
    it("should throw Error '\x1b[36moverrideCookie express argument not an express instance\x1b[90m' when trying to override Cookie method on non express instance", async () => {
        const error = 'overrideCookie express argument not an express instance';
        const cryptoCookie = new CryptoCookie(options());
        try {
            cryptoCookie.overrideCookie(express);
        }catch (e) {
            expect(e.message).equal(error);
        }
    });
}
