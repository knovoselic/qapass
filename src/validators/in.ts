export default (subject: any, valid_values: any) => {
    valid_values = valid_values.split(',');

    return valid_values.includes(subject);
}
