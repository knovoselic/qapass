export default (subject: any, valid_values: string) => {
    if(typeof subject !== 'string') return false;

    const allowed = valid_values.split(',');

    return allowed.includes(subject);
}
