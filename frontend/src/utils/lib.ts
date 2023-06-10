import moment, { Moment } from 'moment-timezone';

export const fromStringToJson = (string: string) => {
    try {
        return JSON.parse(string);
    } catch (error) {
        console.error(error);
        return false;
    }
}

export const prepareReadableDate = (date: string) => {
    const timezone = moment.tz.guess();
    return moment(date).tz(timezone).format('YYYY, MMM DD HH:MM');
}

export const prepareDate = (date: string|Moment) => {
    return moment(date).milliseconds(0).toISOString();
}

export const convertReadableStatusesToServerEnum = (statuses: { [k: string]: string }) => {
    return Object.keys(statuses)
        .reduce((acc: { [k: string]: string }, value) => {
            acc[value] = value;
            return acc;
        }, {});
}