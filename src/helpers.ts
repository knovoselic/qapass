import { Request } from "express";
import { Container } from "inversify";
import knexConnection  from "knex";
import User from './entity/User';
import { Connection } from 'typeorm';
import Exception from "./errors/Exception";

export const accepts_json = (req: Request): Boolean => {
    if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {

        return true;
    }

    return false;
}

export const knex = () => {
    const container: Container = global.container;

    return container.get<knexConnection>('knex');
}

export const validation_errors = (req: Request) => {

    return getFlash(req, 'validation-errors');
}

export const getFlash = (req: Request, identifier: string) => {

    let flash = req.flash(identifier);

    if(flash.length < 1) {

        return;
    }

    return flash[0];
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

export const date_to_string = (date: Date) => {
    var day = date.getDate() + "";
    var month = (date.getMonth() + 1) + "";
    var year = date.getFullYear() + "";
    var hour = date.getHours() + "";
    var minutes = date.getMinutes() + "";
    var seconds = date.getSeconds() + "";

    const checkZero = (e: any) => {
        if(e.length == 1){
            e = "0" + e;
        }

        return e;
    }

    day = checkZero(day);
    month = checkZero(month);
    year = checkZero(year);
    hour = checkZero(hour);
    minutes = checkZero(minutes);
    seconds = checkZero(seconds);

    return year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds;
}