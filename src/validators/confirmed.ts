import { Request } from 'express';

export default (req: Request, field: string, subject: any) => {
    const match_subject = req.body[field + '_confirmation'];

    if(typeof subject != typeof match_subject) return false;

    let valid = false;

    if(typeof subject == 'object') {
        valid = JSON.stringify(subject) == JSON.stringify(match_subject);
    } else {
        valid = subject == match_subject;
    }

    return valid;
}
