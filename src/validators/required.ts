export default (subject: any) => {

    return !([undefined, null, false, ''].includes(subject));
}
