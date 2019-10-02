const {it} = require("mocha");
const {expect} = require("chai");
const express = require('express');
const {CryptoCookie} = require(process.env.Root + '/dist');
//import {CryptoCookie} from "../../../dist/";
import {Helper} from "./lib/helper";
const helper = new Helper();

export default function suite() {
    it("should throw Error 'overrideCookie express argument not an express instance' when trying to override Cookie method on non express instance", async () => {
        const error = 'overrideCookie express argument not an express instance';
        const cryptoCookie = new CryptoCookie(helper.options());
        try {
            cryptoCookie.overrideCookie(express);
        }catch (e) {
            expect(e.message).equal(error);
        }
    });
}
