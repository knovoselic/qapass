import { Request } from "express";
import { Container } from "inversify";
import User from './entity/User';
import { Connection } from 'typeorm';
import Exception from "./errors/Exception";

export const accepts_json = (req: Request): Boolean => {
    if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {

        return true;
    }

    return false;
}

export const typeorm = () => {
    const container: Container = global.container;

    return container.get<Connection>('typeorm');
}

export const validation_errors = (req: Request) => {

    return getFlash(req, 'validation-errors');
}

export const getFlash = (req: Request, identifier: string) => {

    let flash = req.flash(identifier);

    if(flash === undefined) return;

    if(Array.isArray(flash)) {
        flash  = flash[0];
    }

    return flash;
}

export const user = async (req: Request) => {

    if(!req.user) return undefined;

    const container: Container = global.container;

    return await container.get<Connection>('typeorm')
        .getRepository(User)
        .findOne(req.user);
}

export const auth_user = async (req: Request): Promise<User> => {

    const user_instance = await user(req);

    if(!user_instance) throw new Exception('Internal server error.', 500);

    return user_instance;
}