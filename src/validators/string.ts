import { Request } from 'express';

export default (req: Request, field: string, subject: any) => {

    return typeof subject === 'string';
}
