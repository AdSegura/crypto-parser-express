import {describe} from 'mocha';
process.env.Root = require('../../settings.js').Root;
import errors from "./suites/errors.test";
import class_test from "./suites/class.test";
import suite from "./suites/expressServer.test";
import suite1 from "./suites/express.cookie.simple.test";

describe('Class CryptoCookie', class_test.bind(this));
describe('Test Errors...', errors.bind(this));
describe('Express cookie override', suite.bind(this));
describe('Express response res.cookie method and res.cookie_async method', suite1.bind(this));

