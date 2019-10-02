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
    it("should throw Error 'overrideCookie express argument not an express instance' when trying to override Cookie method on non express instance", () => __awaiter(this, void 0, void 0, function* () {
        const error = 'overrideCookie express argument not an express instance';
        const cryptoCookie = new CryptoCookie(helper.options());
        try {
            cryptoCookie.overrideCookie(express);
        }
        catch (e) {
            expect(e.message).equal(error);
        }
    }));
}
exports.default = suite;
