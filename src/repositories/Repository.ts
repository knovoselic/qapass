import { Repository as BaseRepository, SelectQueryBuilder } from "typeorm";
import Filter from "../contracts/abstractions/Filter";
import { Request } from 'express';

class Repository<T> extends BaseRepository<T>
{
    protected sqb:  SelectQueryBuilder<any>;

    public getSelectQueryBuilder()
    {
        return this.sqb;
    }

    public filter(req: Request,filter: Filter)
    {
        let sqb = this.createQueryBuilder();

        this.sqb = filter.apply(req, sqb);

        return this;
    }
}

export default Repository;