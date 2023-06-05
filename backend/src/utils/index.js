const moment = require('moment/moment');
const TransportError = require('./TransportError');
const consts = require('./consts');

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

function convertToJSON (buffer, throwError = false) {
    try {
        const baseToString = buffer.toString();
        return JSON.parse(baseToString);
    } catch (error) {
        if (!throwError) {
            return buffer.toString();
        }

        // expected string should be valid JSON
        throw new TransportError({
            code: 400,
            message: 'Error on convert string to JSON',
            error,
        })
    }
}

module.exports = {
    consts,
    TransportError,
    checkPromiseResult,
    convertToString,
    prepareDate,
    convertToJSON,
}