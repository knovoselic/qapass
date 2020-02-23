import { Response } from "express";
import { injectable } from "inversify";

@injectable()
class BaseController
{
    protected render(res: Response , template: string, options = {}, code: number = 200): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            res.status(code).render(template, options, (err, compiled) => {

                if (err) {

                    reject('Error rendering template');
                }

                resolve(compiled);
            });
        });
    }
}

export default BaseController;