import { Request, Response, NextFunction } from 'express';
import { interfaces, controller, httpGet, request, response, next } from 'inversify-express-utils';
import BaseController from './BaseController';

@controller('/')
class HomeController extends BaseController implements interfaces.Controller
{
    @httpGet('/')
    public async home(@request() req: Request, @response() res: Response, @next() next: NextFunction)
    {
        return this.render(res, 'home');
    }
}

export default HomeController;