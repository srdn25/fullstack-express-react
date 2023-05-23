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

function fromStringToDate (date) {
    // YYYY-MM-DD HH:MM
    const regex = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}$/;

    if (date.match(regex) === null) {
        return false;
    }

    const dateObj = new Date(date);

    const timestamp = dateObj.getTime();

    if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
        return false;
    }

    return dateObj;
}

function addZeroToAloneDigit (num) {
    if (Number(num) < 10) {
        return `0${Number(num)}`;
    }

    return Number(num);
}

function fromDateToString (date) {
    if (!(date instanceof Date)) {
        return false;
    }

    const year = date.getFullYear();
    const month = addZeroToAloneDigit(date.getMonth() + 1);
    const day = addZeroToAloneDigit(date.getDate());
    const hours = addZeroToAloneDigit(date.getHours());
    const minutes = addZeroToAloneDigit(date.getMinutes());

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

module.exports = {
    TransportError,
    checkPromiseResult,
    convertToString,
    fromDateToString,
    fromStringToDate,
}