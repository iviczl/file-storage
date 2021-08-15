function parseOptions(format) {
    const options = {}
 
    format.split(';').forEach((part) => {
        const [key, val] = part.split(':');
        options[key.trim()] = val.trim();
    })
    return options;
}
 
export function formatDate(value, format, locale) {
    try {
        return new Intl.DateTimeFormat(locale, parseOptions(format)).format(value)
    } catch (err) {
        console.error(err);
    }
    return value;
}

export function dateFromDateString(dateString) {
    let year = dateString.substring(0, 4);
    let month = dateString.substring(5, 2);
    let day = dateString.substring(8, 2);
    return new Date(year, month, day);
}

export function dateTimeStringFromDate(date) {
    return date.toLocaleDateString('hu-HU').replace(/ /g, '') + ' ' + date.toLocaleTimeString('hu-HU');
}

export function backByMinutes(minutes, date) {
    const dummy = date ? date.getTime() : Date.now();
    return new Date(dummy - (minutes * 24 * 60));
}

export function backByDays(days, date) {
    const dummy = date ? date.getTime() : Date.now();
    return new Date(dummy - (days * 24 * 60 * 60 * 1000));
}

export function yesterday(date) {
    if(date) {
        let dummyDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        return new Date(dummyDate.setDate(dummyDate.getDate() - 1));
    }
    let newDate = new Date();
    return new Date(newDate.setDate(newDate.getDate() - 1));
}

export function tomorrow(date) {
    if(date) {
        let dummyDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        return new Date(dummyDate.setDate(dummyDate.getDate() + 1));
    }
    let newDate = new Date();
    return new Date(newDate.setDate(newDate.getDate() + 1));
}
export function lastSecond(date) {
    if(date) {
        let dummyDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        dummyDate.setHours(23, 59, 59, 999);
        return dummyDate;
    }
    let newDate = new Date();
    newDate.setHours(23, 59, 59, 999);
    return newDate;
}

export function  monthsBefore(date, months) {
    let dummyDate = date ? date : new Date();
    return new Date(dummyDate.setMonth(dummyDate.getMonth() - months));
}

export function today() {
    let date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function pad(number, length){
    var str = '' + number;
    while (str.length < length) {
        str = '0'+str;
    }
    return str;
}

export function offsetString() {
    var offset = new Date().getTimezoneOffset();
    return ((offset<0? '+':'-') + pad(parseInt(Math.abs(offset/60)), 2) + pad(Math.abs(offset%60), 2));
}

export function timeZone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function dateFromEpoch(epochString) {
    return epochString ? new Date(parseInt(epochString, 10)) : null;
}

export function timeZoneAbbreviation() {
    let short = '';
    switch(timeZone()) {
        case 'Europe/Budapest':
            short = 'CET';
            break;
        default:
            break;
    }
    return short;
}
