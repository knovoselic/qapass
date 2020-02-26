export default (subject: any) => {

    if([undefined, null, false, ''].includes(subject)) {

        return false;
    }

    return true;
}
