import { Request, Response, NextFunction } from "express";

export default (req: Request, res: Response, next: NextFunction) => {
    const proxyUrl = req.header('x-original-url');
    if (proxyUrl) {
        req.url = req.originalUrl = proxyUrl;
    }

    const forwardedFor = req.header('x_forwarded_for');
    if (forwardedFor) {
      req.headers['x-forwarded-for'] = req.header('x_forwarded_for');
    }

    return next();
}
