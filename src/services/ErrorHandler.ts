import { NextFunction, Response, Request } from "express";
import Logger from "./Logger";
import { accepts_json } from "../helpers";
import { injectable, inject } from "inversify";

@injectable()
class ErrorHandler
{
    protected log_codes = [
        400, 408
    ];

    protected logger: Logger;

    public constructor(@inject('Logger') logger: Logger) {
        this.logger = logger;
    }

    public handle = (err: any,req: Request, res: Response, next: NextFunction) => {
        const date = new Date();

        const content = `${date}\r\n${req.method} on ${req.path}\r\nError:\r\n${err}\r\n`;

        if(err.status >= 500 || this.log_codes.includes(err.status)) {
            this.logger.write(content, 'errors.log');
        }

        if(process.env.APP_ENV == 'local') console.log(err);

        if(accepts_json(req)) {

            return res.status(err.status)
                .json({
                    message: err.message
                });
        }

        return res
            .status(err.status)
            .render('error', {message: err.message, errors: err.errors, layout: false})
    };
}

export default ErrorHandler;