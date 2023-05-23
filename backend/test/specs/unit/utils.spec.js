const { expect } = require('../helper');
const { checkPromiseResult } = require('../../../src/utils');
describe('[UNIT] utils', () => {
    it ('checkPromiseResult should return true if promise resolve', async () => {
        const promise = () => new Promise((res) => {
            res();
        });
        const result = await checkPromiseResult(promise);
        expect(result).to.be.true;
    });

    it ('checkPromiseResult should return true if promise resolve', async () => {
        const promise = () => new Promise((res, rej) => {
            rej();
        });
        const result = await checkPromiseResult(promise);
        expect(result).to.be.false;
    });
});