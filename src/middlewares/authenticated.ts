import { Request, Response, NextFunction, RequestHandler } from "express";

export const authenticated = async (req: Request, res: Response, next: NextFunction) => {
    /**
     * @todo Implement middleware logic
     */
    // if() {
    //     return res.redirect('path');
    // }

    return next();
}