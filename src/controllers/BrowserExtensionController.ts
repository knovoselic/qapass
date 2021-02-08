import { Request, Response, NextFunction } from 'express';
import { interfaces, controller, httpGet, request, response, next, httpDelete, httpPost, requestParam } from 'inversify-express-utils';
import BaseController from './BaseController';
import { auth_user } from '../helpers';

@controller('/browser-extension')
class BrowserExtensionController extends BaseController implements interfaces.Controller
{
    @httpGet('/')
    public async index(@request() req: Request, @response() res: Response, @next() next: NextFunction)
    {
        const user = await auth_user(req);

        return this.render(res, 'browser-extension/index');
    }
}

export default BrowserExtensionController;