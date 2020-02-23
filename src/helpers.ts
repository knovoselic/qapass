import { Request } from "express";
import { Container } from "inversify";
import knexConnection  from "knex";

export const accepts_json = (req: Request): Boolean => {
    if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {

        return true;
    }

    return false;
}

export const knex = () => {
    let container: Container = global.container;

    return container.get<knexConnection>('knex');
}
