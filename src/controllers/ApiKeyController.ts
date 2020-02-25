import { Request, Response, NextFunction } from 'express';
import { interfaces, controller, httpGet, request, response, next } from 'inversify-express-utils';
import BaseController from './BaseController';
import { authenticated } from '../middlewares/authenticated';

@controller('/api-keys')
class ApiKeyController extends BaseController implements interfaces.Controller
{
    @httpGet('/', authenticated)
    public home(@request() req: Request, @response() res: Response, @next() next: NextFunction)
    {
        return this.render(res, 'api-keys/index');
    }
}

export default ApiKeyController;