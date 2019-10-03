const {it} = require("mocha");
const {expect} = require("chai");
const chai = require("chai");
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const {ExpressServer} = require('../lib/express-server');
const {Helper} = require("./lib/helper");
const helper = new Helper();

module.exports = function suite() {
     it('should client send cipher cookie and cookieParser should decipher it', async () => {
        const server = new ExpressServer(helper.options());
        const agent = chai.request.agent(server);
        const request = await agent.get('/');
        const cookies = request.header['set-cookie'];
        const second_request = await agent.get('/cookies').set('Cookie', cookies);
        expect(second_request.res.text).equal(helper.server_id)
     });

    it('should server res.cookie not populate response Headers Set-Cookie when cookie name is not allowed ', async () => {
        const server = new ExpressServer(helper.options());
        const agent = chai.request.agent(server);
        const request = await agent.get('/notallowedcookie');
        expect((Helper.parseCookies(request.res.headers['set-cookie']))['notAllowedCookie'])
            .equal(undefined);
        expect(request.status).equal(200)
    });

    it('should server res.cookie populate response Headers Set-Cookie when cookie name is not allowed and allow_all = true', async () => {
        const opt = JSON.parse(JSON.stringify(helper.options()));
        opt.cookie.allow_all = true;
        const server = new ExpressServer(opt);
        const agent = chai.request.agent(server);
        const request = await agent.get('/notallowedcookie');
        expect(Helper.parseCookies(request.res.headers['set-cookie'])).hasOwnProperty('notAllowedCookie');
        expect(request.status).equal(200)
    });

    it('should client send not allowed cookie and cookieParser should discard', async () => {
        const server = new ExpressServer(helper.options());
        const agent = chai.request.agent(server);
        const request = await agent.get('/unwanted_cookie').set('Cookie', 'bad_cookie=2');
        expect(request.res.text).equal('no cookies');
    });

    it('should client send not allowed cookie when allow_all option true and should not decipher but should be parsed in req.cookies', async () => {
        const opt = JSON.parse(JSON.stringify(helper.options()));
        opt.cookie.allow_all = true;
        const server = new ExpressServer(opt);
        const agent = chai.request.agent(server);
        const request = await agent.get('/unwanted_cookie').set('Cookie', 'bad_cookie=2');
        expect(request.res.text).equal('2');
    });

}
