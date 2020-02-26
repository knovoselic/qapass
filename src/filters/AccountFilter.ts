import { injectable } from 'inversify';
import { Request } from 'express';

@injectable()
export default class AccountFilter
{
    protected allowed = [
        'host'
    ];

    public whereOptions(req: Request)
    {
        let where_options: any = {};

        for (const param in req.query) {
            if(this.allowed.includes(param)) {
                where_options[param] = req.query[param];
            }
        }

        return where_options;
    }
}