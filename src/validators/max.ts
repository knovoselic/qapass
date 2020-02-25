import Exception from "../errors/Exception"

export default (subject: any, limit: any) => {
    let valid = true;

    if(!subject) return valid;

    if(
        typeof subject === 'string' ||
        Array.isArray(subject)
    ) {
        valid = subject.length < limit;
    } else if(typeof subject === 'number') {
        valid = subject < limit;
    } else {
        throw new Exception('Not implemented.');
    }

    return valid;
}
