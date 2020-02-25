import { Request, Response, NextFunction } from 'express';
import { interfaces, controller, httpGet, request, response, next } from 'inversify-express-utils';
import BaseController from './BaseController';
import { authenticated } from '../middlewares/authenticated';
import { auth_user } from '../helpers';

@controller('/')
class HomeController extends BaseController implements interfaces.Controller
{
    @httpGet('/', authenticated)
    public home(@request() req: Request, @response() res: Response, @next() next: NextFunction)
    {
        return this.render(res, 'home');
    }
}

export default HomeController;