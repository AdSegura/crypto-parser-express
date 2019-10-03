const {describe} = require('mocha');
const errors = require("./suites/errors.test");
const class_test = require("./suites/class.test");
const suite = require("./suites/expressServer.test");
const suite1 = require("./suites/express.cookie.simple.test");

describe('Class CryptoCookie', class_test.bind(this));
describe('Test Errors...', errors.bind(this));
describe('Express cookie override', suite.bind(this));
describe('Express response res.cookie method and res.cookie_async method', suite1.bind(this));

