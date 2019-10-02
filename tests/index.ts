import {describe} from 'mocha';

import errors from "./suites/errors.test";
import class_test from "./suites/class.test";
import suite from "./suites/expressServer.test";

describe('Class CryptoCookie', class_test.bind(this));
describe('Test Errors...', errors.bind(this));
describe('Express cookie override', suite.bind(this));

