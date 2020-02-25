import { Request, Response, NextFunction, RequestHandler } from "express";

export const authenticated = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.user) {
        return res.redirect('/login');
    }

    return next();
}