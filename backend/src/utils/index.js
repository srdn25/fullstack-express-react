const moment = require('moment/moment');
const TransportError = require('./TransportError');

async function checkPromiseResult (promise) {
    try {
        await promise();
        return true;
    } catch (error) {
        return false;
    }
}

function convertToString (data) {
    if (data instanceof TransportError) {
        return JSON.stringify(data.serialize());
    }

    delete data.stack;
    return typeof data === 'string' ? data : JSON.stringify(data);
}

function prepareDate (date) {
    return moment(date).milliseconds(0).toISOString();
}

module.exports = {
    TransportError,
    checkPromiseResult,
    convertToString,
    prepareDate,
}