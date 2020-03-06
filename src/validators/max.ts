import Exception from "../errors/Exception"
import { Request } from 'express';

function getNumberFromString(value: string) {
    if(parseInt(value).toString() == value) return parseInt(value);
    else if(parseFloat(value).toString() == value) return parseFloat(value);

    return undefined;
}

export default (req: Request, field: string, subject: any, limit: string) => {
    if(limit === '') throw new Exception('Invalid max rule definition.');

    const evaluable = [
        'string', 'number', 'array'
    ];

    let evaluate = 'string';

    const frags = limit.split(',', 2);

    limit = frags[0];

    if(frags.length == 2) {
        if(evaluable.includes(frags[0])) {
            limit = frags[1];
            evaluate = frags[0];
        } else {
            throw new Exception('Invalid max rule definition.');
        }
    }

    let valid = true;

    if([null, undefined].includes(subject)) return valid;

    const l_int = parseInt(limit);

    if(limit != l_int.toString()) {
        throw new Exception('Non integer value for limit encountered.');
    }

    if(evaluate === 'string') {

        valid = subject.length <= l_int;

    } else if(evaluate === 'array') {
        if(!Array.isArray(subject)) return false;

        valid = subject.length <= l_int;

    } else {

        const n = getNumberFromString(subject);

        if(n === undefined) return false;

        valid = n <= l_int;
    }

    return valid;
}
