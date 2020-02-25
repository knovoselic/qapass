import { Request, Response, NextFunction, RequestHandler } from "express";

export default async (req: Request, res: Response, next: NextFunction) => {
    if(req.user) {
        return res.redirect('/');
    }

    return next();
}