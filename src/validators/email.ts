import { Request } from 'express';

export default (req: Request, field: string, subject: any) => {

    if(typeof subject !== 'string') return false;

    subject = subject.toLowerCase();

    if (!subject.endsWith("@codecons.com") && !subject.endsWith("@glooko.com")) {
        return false;
    }

    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return regex.test(subject);
}
