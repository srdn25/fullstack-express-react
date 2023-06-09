import moment from 'moment-timezone';

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