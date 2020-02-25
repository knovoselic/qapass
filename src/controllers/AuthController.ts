import { interfaces, controller, httpPost, request, response, next, httpGet} from "inversify-express-utils";
import BaseController from './BaseController';
import passport from "passport";
import { inject } from 'inversify';
import Auth from '../services/Auth';
import { Request, Response, NextFunction } from 'express';
import guest from '../middlewares/guest';
import registerRequest from '../requests/RegisterRequest'
import csurf from 'csurf';
import bodyParser from 'body-parser';

const csrf = csurf({ cookie: true });
const parseForm = bodyParser.urlencoded({ extended: false })

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

    @httpGet('/register', guest, csrf)
    public async showRegisterForm(@request() req: Request, @response() res: Response, @next() next: NextFunction)
    {
        return this.render(res, 'register', {
            csrf: req.csrfToken()
        });
    }

    @httpPost('/register', guest, parseForm, csrf, registerRequest)
    public async register(@request() req: Request, @response() res: Response, @next() next: NextFunction)
    {
        return 'test';
    }

    @httpGet('/login', guest, csrf)
    public async showLoginForm(@request() req: Request, @response() res: Response, @next() next: NextFunction)
    {
        return this.render(res, 'login', {
            csrf: req.csrfToken()
        });
    }

    @httpPost('/login', guest, parseForm, csrf)
    public async login(@request() req: Request, @response() res: Response, @next() next: NextFunction)
    {
        return 'test';
    }
}

export default AuthController;