import Exception from "../errors/Exception"

function getNumberFromString(value: string) {
    if(parseInt(value).toString() == value) return parseInt(value);
    else if(parseFloat(value).toString() == value) return parseFloat(value);

    return undefined;
}

export default (subject: any, limit: string) => {
    let valid = true;

    if([null, undefined].includes(subject)) return valid;

    const l_int = parseInt(limit);

    if(limit != l_int.toString()) {
        throw new Exception('Non integer value for limit encountered.');
    }

    if(typeof subject === 'string') {

        const n = getNumberFromString(subject);

        if(typeof n === 'number') valid = n <= l_int;
        else valid = subject.length <= l_int;

    } else if(Array.isArray(subject)) {

        valid = subject.length <= l_int;

    } else if(typeof subject === 'number') {

        valid = subject <= l_int;

    } else {

        throw new Exception('Not implemented.');
    }

    return valid;
}
