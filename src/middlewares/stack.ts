import { Request, Response, NextFunction } from "express";
import web from './web';
import api from './api';

const runStack = function (stack: Function[], req: Request, res: Response, next: NextFunction) {
    const stackIterator = function (i: number, err?: any) {

        if(err) return next(err);

        if(i >= stack.length) return next();

        stack[i](req, res, stackIterator.bind(null, i + 1));
    };

    stackIterator(0);
};

export default (req: Request, res: Response, next: NextFunction) => {
    let use;

    if(req.url.match('^\/api(?:\/(?:.*)?)?$')) use = api;
    else use = web;

    runStack(use, req, res, next);
}
