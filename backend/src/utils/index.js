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

    return typeof data === 'string' ? data : JSON.stringify(data);
}

module.exports = {
    TransportError,
    checkPromiseResult,
    convertToString,
}