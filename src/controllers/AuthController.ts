import { interfaces, controller, httpPost, request, response, next, httpGet} from "inversify-express-utils";
import BaseController from './BaseController';
import passport from "passport";
import { inject } from 'inversify';
import Auth from '../services/Auth';
import { Request, Response, NextFunction } from 'express';

@controller('')
class AuthController extends BaseController implements interfaces.Controller
{
    protected auth: Auth;

    constructor(@inject('Auth') auth: Auth)
    {
        super();

        this.auth = auth;

        passport.use('login', auth.login());
        passport.use('register', auth.register());
    }

    @httpGet('/register')
    public async showRegisterForm(@request() req: Request, @response() res: Response, @next() next: NextFunction)
    {
        return this.render(res, 'register');
    }

    @httpPost('/register')
    public async register(@request() req: Request, @response() res: Response, @next() next: NextFunction)
    {
        return 'test';
    }

}

export default AuthController;