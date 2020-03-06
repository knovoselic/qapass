import { Request } from 'express';

export default (req: Request, field: string, subject: any) => {

    return !([undefined, null, false, ''].includes(subject));
}
