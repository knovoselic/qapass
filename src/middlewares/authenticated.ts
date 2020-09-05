import { Request, Response, NextFunction } from "express";

export default (req: Request, res: Response, next: NextFunction) => {
    if(!req.user) {
        return res.redirect('/login');
    }

    return next();
}
