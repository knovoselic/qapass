import { interfaces, controller, httpPost, request, response, next, httpGet} from "inversify-express-utils";
import BaseController from './BaseController';
import passport from "passport";
import { inject } from 'inversify';
import Auth from '../services/Auth';
import { Request, Response, NextFunction } from 'express';
import guest from '../middlewares/guest';
import registerRequest from '../requests/RegisterRequest';
import loginRequest from '../requests/LoginRequest';
import { validation_errors } from '../helpers';
import authenticated from "../middlewares/authenticated";

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

    @httpGet('/register', guest)
    public async showRegisterForm(@request() req: Request, @response() res: Response, @next() next: NextFunction)
    {
        return this.render(res, 'register', {
            layout: false,
            csrf: req.csrfToken(),
            errors: validation_errors(req),
            error: req.flash('error')
        });
    }

    @httpPost(
        '/register', guest, registerRequest,
        passport.authenticate('register', {
            session: true,
            failureRedirect: '/register',
            failureFlash: true,
        })
    )
    public async register(@request() req: Request, @response() res: Response, @next() next: NextFunction)
    {
        return res.redirect('/');
    }

    @httpGet('/login', guest)
    public async showLoginForm(@request() req: Request, @response() res: Response, @next() next: NextFunction)
    {
        return this.render(res, 'login', {
            layout: false,
            csrf: req.csrfToken(),
            errors: validation_errors(req),
            error: req.flash('error')
        });
    }

    @httpPost(
        '/login', guest,
        loginRequest,passport.authenticate('login', {
            session: true,
            failureRedirect: '/login',
            failureFlash: true,
        })
    )
    public async login(@request() req: Request, @response() res: Response, @next() next: NextFunction)
    {
        return res.redirect('/');
    }

    @httpGet('/logout', authenticated)
    public async logout(@request() req: Request, @response() res: Response, @next() next: NextFunction)
    {
        req.logout();

        return res.redirect('/login');
    }
}

export default AuthController;