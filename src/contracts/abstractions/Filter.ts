import { injectable } from 'inversify';
import { Request } from 'express';
import { SelectQueryBuilder } from 'typeorm';

@injectable()
export default abstract class Filter
{
    protected sqb: SelectQueryBuilder<any>;

    public apply(req: Request, sqb: SelectQueryBuilder<any>): SelectQueryBuilder<any>
    {
        let instance = <any> this;

        instance.sqb = sqb;

        for (const param in req.query) {
            if(typeof instance[param] === 'function') {
                instance[param](req.query[param]);
            }
        }

        return instance.sqb;
    }
}