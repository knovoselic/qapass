import { injectable } from 'inversify';
import { Request } from 'express';
import Filter from '../contracts/abstractions/Filter';

@injectable()
export default class AccountFilter extends Filter
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

    public host(host: any = false)
    {
        if(!host) return;

        this.sqb.where('host = :host', {host: host});
    }
}