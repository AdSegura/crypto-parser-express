import {ExpressServer} from "../lib/express-server";
const {it} = require("mocha");
const {expect} = require("chai");
const chai = require("chai");
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const cookie = require('cookie');
import {Helper} from "./lib/helper";
const helper = new Helper();

export default function suite() {
    it(`should client get cipher cookie using res.cookie_async`, async () => {
        const server = new ExpressServer(helper.options());
        const agent = chai.request.agent(server);
        const request = await agent.get('/');
        const cookies = cookie.parse(request.res.headers['set-cookie'][0]);
        const deciphered = helper.decipher(cookies[helper.cookies_allowed[0]]);
        expect(deciphered).equal(helper.server_id);
    });

    it(`should client get cipher cookie using res.cookie method overridden`, async () => {
        const server = new ExpressServer(helper.options());
        const agent = chai.request.agent(server);
        const request = await agent.get('/make_cookie?name=supercookie&mode=object');
        const response = JSON.parse(request.res.text);
        const cookies = cookie.parse(request.res.headers['set-cookie'][1]);
        const deciphered = helper.decipher(cookies[helper.cookies_allowed[2]]);
        expect(deciphered).to.eql(response); //finally I know I can compare objects :)
    });
}
