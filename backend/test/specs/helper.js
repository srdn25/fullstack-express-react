const chai = require('chai');
const supertest = require('supertest');

const App = require('../../src/initializers/App');

const helper = {
    // 1
    initServer: async () => {
        helper.app = new App(process.env);
        await helper.app.init();
    },
    // 2
    initRequests: () => {
       const methods = [ 'get', 'post', 'put', 'delete' ];
       const request = supertest(helper.app.httpServer);
       helper.request = methods.reduce((acc, method) => {
           acc[method] = (url) => request[method](url);
           return acc;
       }, {});
    },
    chai,
    expect: chai.expect,
}
module.exports = helper;