import { injectable } from 'inversify';
import { Request } from 'express';
import Filter from '../contracts/abstractions/Filter';

@injectable()
export default class AccountFilter extends Filter
{
    public host(host: any = false)
    {
        if(!host) return;

        return this.sqb.where('host = :host', {host: host});
    }
}